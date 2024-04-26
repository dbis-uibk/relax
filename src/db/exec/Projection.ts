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

	getResult(session?: Session) {
		session = this._returnOrCreateSession(session);
		if (this._checked === null) {
			throw new Error(`check has not been called`);
		}

		const { _indices } = this._checked;

		if (this._columns === null) {
			return this._child.getResult(session);
		}

		const org = this._child.getResult(session);
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

		res.eliminateDuplicateRows();
		this.setResultNumRows(res.getNumRows());
		return res;
	}

	check() {
		this._child.check();

		// check if all parts are part of the schema
		const unProjectedSchema = this._child.getSchema();
		const childSchema = this._child.getSchema();

		const _indices = [];

		// Get relation aliases
		const relAliases = this._child.getMetaData('fromVariable');
		// Split relation aliases into array
		const vars = relAliases ? relAliases.split(" ") : [];

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

				try {
					element.child.check(unProjectedSchema);
				}
				catch (e) {
					// Second try: check wether projections use relation alias(es)

					// All columns names and aliases
					let allCols: (string | number)[] = [];
					let allRelAliases: (string | number)[] = [];
					let allAltRelAliases: (string | number)[] = [];
					// Ambiguous columns names
					let blacklist: (string | number)[] = [];
					const numCols = unProjectedSchema.getSize();
					// Set first relation alias
					let lastAlias = unProjectedSchema.getColumn(0).getRelAlias();
					let k = 0;
					for (let i = 0; i < numCols; i++) {
						if (unProjectedSchema.getColumn(i).getRelAlias() !== lastAlias) {
							lastAlias = unProjectedSchema.getColumn(i).getRelAlias();
							if (k < vars.length - 1) k++;
						}

						allCols.push(unProjectedSchema.getColumn(i).getName());
						allRelAliases.push(unProjectedSchema.getColumn(i).getRelAlias() as string);
						allAltRelAliases.push(vars[k]);

						// If column already in blacklist, skip it
						// Cannot set relation alias for this column
						if (blacklist.includes(unProjectedSchema.getColumn(i).getName())) {
							continue;
						}

						for (let j = i+1; j < numCols; j++) {
							// If found a sibling column, cannot set relation alias
							if (unProjectedSchema.getColumn(i).getName() === unProjectedSchema.getColumn(j).getName()) {
								blacklist.push(unProjectedSchema.getColumn(i).getName());
								break;
							}
						}
					}

					// Unique columns names
					// let whitelist = allCols.filter(x => !blacklist.includes(x));
					
					// Generate all column combinations
					// https://stackoverflow.com/questions/43241174/javascript-generating-all-combinations-of-elements-in-a-single-array-in-pairs
					let combCols = [];
					let combRelAliases = [];
					let combTempRelAliases = [];
					let temp = [];
					let tempAliases = [];
					let tempAltAliases = [];
					let slent = Math.pow(2, allCols.length);

					for (let i = 0; i < slent; i++) {
						temp = [];
						tempAliases = [];
						tempAltAliases = [];
						for (var j = 0; j < allCols.length; j++) {
							if ((i & Math.pow(2, j))) {
								temp.push(allCols[j]);
								tempAliases.push(allRelAliases[j]);
								tempAltAliases.push(allAltRelAliases[j]);
							}
						}
						if (temp.length > 0) {
							combCols.push(temp);
							combRelAliases.push(tempAliases);
							combTempRelAliases.push(tempAltAliases);
						}
					}

					// Test if relation alias(es) works for any combination of columns
					let schemaWorked = false;
					
					for (let i = 0; i < combCols.length; i++) {
						let newSchema = unProjectedSchema.copy();

						for (let j = 0; j < combCols[i].length; j++) {

							for (let k = 0; k < numCols; k++) {
								if (combCols[i][j] === newSchema.getColumn(k).getName() &&
									combRelAliases[i][j] === newSchema.getColumn(k).getRelAlias() &&
									!blacklist.includes(combCols[i][j])) {
									// Set relation alias
									try {
										newSchema.setRelAlias(String(combTempRelAliases[i][j]), k);
									}
									catch (e) {
										// Test failed, try next combination
										break;
									}
								}
							}
						}

						// Check if combination of relation alias works
						try {
							element.child.check(newSchema);
							schemaWorked = true;
							break;
						}
						catch (e) {
							// Test failed, try next combination
							continue;
						}
					}

					// If no combination of relation alias works
					if (!schemaWorked) {
						this.throwExecutionError(e.message);
					}
				}

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
				let index = - 1;;
				if (this._columns[i] instanceof Column === true) {
					const element = this._columns[i] as Column;
					const name = element.getName();
					const relAlias = element.getRelAlias();
					const iSchema = vars.indexOf(relAlias + '');

					if (iSchema >= 0) {
						let j = 0, k = 0;
						// Set first relation alias
						let lastAlias = childSchema.getColumn(j).getRelAlias();
						// Check if relation alias already found
						let found = false;
						for (; j < childSchema.getSize(); j++) {
							// Check if relation alias changed
							if (childSchema.getColumn(j).getRelAlias() !== lastAlias) {
								lastAlias = childSchema.getColumn(j).getRelAlias();
								if (k < vars.length - 1) k++;
							}

							// Check if column name and relation alias match
							if (childSchema.getColumn(j).getName() === name &&
								k === iSchema) {

								// Column name and alias found previously
								if (found) {
									throw new Error(i18n.t('db.messages.exec.error-column-ambiguous', {
										column: Column.printColumn(name, relAlias),
										schema: childSchema,
									}));
								}

								// Set index
								index = j;
								found = true;
							}
						}
		
						// Throw error if column not found
						if (index === -1) {
							// Column not found
							try {
								childSchema.getColumnIndex(name, relAlias);
							}
							catch (e) {
								this.throwExecutionError(e.message);
							}
						}
					}
					else {
						// default case
						try {
							index = childSchema.getColumnIndex(name, relAlias);
						}
						catch (e) {
							this.throwExecutionError(e.message);
						}
					}
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
