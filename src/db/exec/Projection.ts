/*** Copyright 2016 Johannes Kessler 2016 Johannes Kessler
*
* This Source Code Form is subject to the terms of the Mozilla Public
* License, v. 2.0. If a copy of the MPL was not distributed with this
* file, You can obtain one at http://mozilla.org/MPL/2.0/. */

import * as i18n from 'i18next';
import { Column } from './Column';
import { ExecutionError } from './ExecutionError';
import { RANode, RANodeUnary, Session } from './RANode';
import { Schema } from './Schema';
import { Table } from './Table';
import { ValueExpr } from './ValueExpr';


export type ProjectionColumnExpr = {
	name: string | number,
	relAlias: string,
	child: ValueExpr,
};
export type ProjectionColumn = Column | ProjectionColumnExpr;


/**
 * relational algebra projection operator
 */
export class Projection extends RANodeUnary {
	private _columns: ProjectionColumn[];
	private _checked: {
		_indices: number[],
		_projectedSchema: Schema,
	} | null = null;

	constructor(child: RANode, proj: ProjectionColumn[]) {
		super('&pi;', child);
		this._columns = proj;
	}

	getSchema() {
		if (this._columns === null) {
			// inherit schema on `select *`
			return this._child.getSchema();
		}

		if (this._checked === null) {
			throw new Error(`check has not been called`);
		}

		return this._checked._projectedSchema;
	}

	getResult(doEliminateDuplicateRows: boolean = true, session?: Session) {
		session = this._returnOrCreateSession(session);
		if (this._checked === null) {
			throw new Error(`check has not been called`);
		}

		const { _indices } = this._checked;

		if (this._columns === null) {
			return this._child.getResult(doEliminateDuplicateRows, session);
		}

		const org = this._child.getResult(doEliminateDuplicateRows, session);
		const res = new Table();
		res.setSchema(this.getSchema());

		const numCols = res.getNumCols();
		const numRows = org.getNumRows();

		let i, j, orgRow, resRow;
		for (i = 0; i < numRows; i++) {
			orgRow = org.getRow(i);
			resRow = new Array(numCols);
			for (j = 0; j < numCols; j++) {
				if (_indices[j] === -1) {
					resRow[j] = (this._columns[j] as ProjectionColumnExpr).child.evaluate(orgRow, [], i, session);
				}
				else {
					resRow[j] = orgRow[_indices[j]];
				}
			}
			res.addRow(resRow);
		}

		if (doEliminateDuplicateRows === true) {
			res.eliminateDuplicateRows();
		}
		this.setResultNumRows(res.getNumRows());
		return res;
	}

	check() {
		this._child.check();

		// check if all parts are part of the schema
		const unProjectedSchema = this._child.getSchema();
		const childSchema = this._child.getSchema();

		const _indices = [];

		try {
			// handle if column name == X.* => replace entry in proj with real names
			for (let i = 0; i < this._columns.length; i++) {
				if (this._columns[i] instanceof Column === false) {
					continue;
				}

				const element = this._columns[i] as Column;
				const name = element.getName();
				const relAlias = element.getRelAlias();
				if (name !== '*') {
					continue;
				}

				this._columns.splice(i, 1);

				let found = 0;
				for (let j = 0; j < childSchema.getSize(); j++) {
					const col = childSchema.getColumn(j);
					if (relAlias !== null && col.getRelAlias() !== relAlias) {
						continue;
					}

					this._columns.splice(i + found, 0, col); // TODO: add {name, child, relalias}
					found++;
				}

				if (found === 0) {
					this.throwExecutionError(i18n.t('db.messages.exec.error-no-columns-match-alias-star'));
				}
			}


			// call check for all expressions
			for (let i = 0; i < this._columns.length; i++) {
				const element = this._columns[i];
				if (element instanceof Column) {
					continue;
				}

				element.child.check(unProjectedSchema);
				if (element.child.getDataType() === 'null') {
					this.throwExecutionError(i18n.t('db.messages.exec.error-datatype-not-specified-for-col', {
						index: (i + 1),
						column: (
							element.child._codeInfo
								? element.child._codeInfo.text
								: ''
						),
					}));
				}
			}

			// search for indices with the names
			for (let i = 0; i < this._columns.length; i++) {
				let index;
				if (this._columns[i] instanceof Column === false) {
					index = -1;
				}
				else {
					const element = this._columns[i] as Column;
					const name = element.getName();
					const relAlias = element.getRelAlias();
					index = childSchema.getColumnIndex(name, relAlias);
				}

				_indices[i] = index;
			}
		}
		catch (e) {
			if (e instanceof ExecutionError) {
				throw e;
			}
			else {
				this.throwExecutionError(i18n.t('db.messages.exec.error-invalid-projection-error', {
					argument: this.getArgumentHtml(),
					error: e.message,
				}));
			}
		}

		// create projected schema
		const projectedSchema = new Schema();
		for (let i = 0; i < _indices.length; i++) {
			const index = _indices[i];

			if (index === -1) {
				const col = this._columns[i] as ProjectionColumnExpr;

				// dataType 'null' (unknown) has been checked before
				const dataType = col.child.getDataType() as 'string' | 'number' | 'boolean' | 'date';
				projectedSchema.addColumn(col.name, col.relAlias, dataType);
			}
			else {
				const col = unProjectedSchema.getColumn(index);
				const type = unProjectedSchema.getType(index);
				projectedSchema.addColumn(col.getName(), col.getRelAlias(), type);
			}

		}

		this._checked = {
			_indices,
			_projectedSchema: projectedSchema,
		};
	}

	getArgumentHtml(): string {
		const args: string[] = [];

		for (let i = 0; i < this._columns.length; i++) {
			const p = this._columns[i];

			if (p instanceof Column) {
				args.push(p.toString());
			}
			else {
				let tmp = p.child.getFormulaHtml();
				tmp += '→';
				tmp += p.relAlias === null ? '' : p.relAlias + '.';
				tmp += p.name;

				args.push(tmp);
			}
		}

		return args.join(', ');
	}
}
