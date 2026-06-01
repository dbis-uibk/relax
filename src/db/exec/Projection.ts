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
		super('&pi;', child, 'projection');
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
					if (this._columns[j] instanceof Column)
						resRow[j] = orgRow[j];
					else
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
					// Second try: check whether projections use relation alias(es)

					// Collect column metadata and mark ambiguous columns (blacklist)
					const allCols: string[] = [];
					const allRelAliases: string[] = [];
					const allAltRelAliases: string[] = [];
					const blacklist: Set<string> = new Set();
					const numCols = unProjectedSchema.getSize();
					let lastAlias = unProjectedSchema.getColumn(0).getRelAlias();
					let altIdx = 0;
					for (let colIdx = 0; colIdx < numCols; colIdx++) {
						const col = unProjectedSchema.getColumn(colIdx);
						if (col.getRelAlias() !== lastAlias) {
							lastAlias = col.getRelAlias();
							if (altIdx < vars.length - 1) altIdx++;
						}

						const name = col.getName() + '';
						allCols.push(name);
						allRelAliases.push(col.getRelAlias() as string);
						allAltRelAliases.push(vars[altIdx] || '');

						// mark ambiguous names
						for (let j = colIdx + 1; j < numCols; j++) {
							if (unProjectedSchema.getColumn(j).getName() === name) {
								blacklist.add(name);
								break;
							}
						}
					}

					// Candidate indices to try changing alias: not blacklisted and alt alias differs
					const candidateIndices: number[] = [];
					for (let idx = 0; idx < allCols.length; idx++) {
						if (!blacklist.has(allCols[idx]) && allRelAliases[idx] !== allAltRelAliases[idx]) {
							candidateIndices.push(idx);
						}
					}

					const MAX_COMBINATIONS = 1_000_000;
					const m = candidateIndices.length;
					if (m === 0) {
						// Nothing to try
						this.throwExecutionError(e.message);
					}

					const totalCombinations = Math.pow(2, m) - 1; // non-empty subsets
					if (totalCombinations > MAX_COMBINATIONS) {
						console.warn(`Check aborted: too many alias combinations in projection (${totalCombinations})`);
						// Build projected schema from the projection columns themselves
						const tempIndices: number[] = [];
						const projectedSchema = new Schema();
						for (let pi = 0; pi < this._columns.length; pi++) {
							const p = this._columns[pi];
							if (p instanceof Column) {
								const col = p as Column;
								const name = col.getName();
								const relAlias = col.getRelAlias();
								let index = -1;
								try {
									index = unProjectedSchema.getColumnIndex(name, relAlias as any);
								}
								catch (ex) {
									index = -1;
								}

								if (index !== -1) {
									const type = unProjectedSchema.getType(index);
									projectedSchema.addColumn(name, relAlias as any, type);
								}
								else {
									projectedSchema.addColumn(name, relAlias as any, 'string');
								}

								tempIndices.push(index);
							}
							else {
								const expr = p as ProjectionColumnExpr;
								const dtype = expr.child.getDataType();
								const dataType = (dtype === 'null' || dtype === null) ? 'string' : dtype as any;
								projectedSchema.addColumn(expr.name, expr.relAlias, dataType);
								tempIndices.push(-1);
							}
						}

						this._checked = {
							_indices: tempIndices,
							_projectedSchema: projectedSchema,
						};
						return;
					}

					// Try subsets of candidate indices (non-empty)
					let schemaWorked = false;
					const startTime = Date.now();
					let tried = 0;
					const limitLogEvery = 1000;

					const subsets = (1 << m);
					for (let mask = 1; mask < subsets; mask++) {
						tried++;
						// periodic logging
						if ((tried % limitLogEvery) === 0) {
							const elapsed = Date.now() - startTime;
							console.log(`[Projection alias retry] tried ${tried}/${totalCombinations} combinations in ${elapsed}ms`);
						}

						const newSchema = unProjectedSchema.copy();
						let failedSetting = false;
						for (let bit = 0; bit < m; bit++) {
							if ((mask & (1 << bit)) === 0) continue;
							const colPos = candidateIndices[bit];
							try {
								newSchema.setRelAlias(String(allAltRelAliases[colPos]), colPos);
							}
							catch (ex) {
								failedSetting = true;
								break;
							}
						}
						if (failedSetting) continue;

						try {
							element.child.check(newSchema);
							schemaWorked = true;
							break;
						}
						catch (ex) {
							continue;
						}
					}

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
								index = childSchema.getColumnIndex(name, relAlias);
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
				if (this._columns[i] instanceof Column) {
					const col = this._columns[i] as Column;
					projectedSchema.addColumn(col.getName(), col.getRelAlias(), col.getType());
				}
				else {
					const col = this._columns[i] as ProjectionColumnExpr;

					// dataType 'null' (unknown) has been checked before
					const dataType = col.child.getDataType() as 'string' | 'number' | 'boolean' | 'date';
					projectedSchema.addColumn(col.name, col.relAlias, dataType);
				}
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
