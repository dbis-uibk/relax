/*** Copyright 2016 Johannes Kessler 2016 Johannes Kessler
*
* This Source Code Form is subject to the terms of the Mozilla Public
* License, v. 2.0. If a copy of the MPL was not distributed with this
* file, You can obtain one at http://mozilla.org/MPL/2.0/. */

import * as i18n from 'i18next';
import { Column } from './Column';
import { RANode, RANodeUnary, Session } from './RANode';
import { DataType, Schema } from './Schema';
import { Table, Tuple } from './Table';


export interface GroupByCol {
	name: string | number,
	relAlias: string | null,
}

export interface AggregateFunction {
	name: string | number,
	aggFunction: string,
	col: {
		name: string | number,
		relAlias: string | null,
	}
}


/**
 * relational algebra group-by operator
 *
 * @extends RANode
 * @constructor
 * @param   {RANode}  child              the child expression
 * @param   {Array}   groupByCols        Array of {name, relAlias} objects
 * @param   {Array}   aggregateFunctions Array of {aggFunction, col{name, relAlias}} objects
 * @returns {GroupBy}
 */
export class GroupBy extends RANodeUnary {
	private groupByCols: GroupByCol[];
	private aggregateFunctions: AggregateFunction[];

	private checked: {
		schema: Schema,
		aggregateFunctionsColIndex: number[],
		groupByColumnIndices: number[],
	} | null = null;

	constructor(child: RANode, groupByCols: GroupByCol[], aggregateFunctions: AggregateFunction[]) {
		super('&gamma;', child);

		this.groupByCols = groupByCols;
		this.aggregateFunctions = aggregateFunctions;
	}

	getSchema() {
		if (this.checked === null) {
			throw new Error(`check not called`);
		}
		return this.checked.schema;
	}

	check() {
		this._child.check();
		const childSchema = this._child.getSchema();

		const groupByColumnIndices = new Array<number>(this.groupByCols.length);
		const aggregateFunctionsColIndex = Array<number>(this.aggregateFunctions.length);

		// Get relation aliases
		const relAliases = this._child.getMetaData('fromVariable');
		// Split relation aliases into array
		const vars = relAliases ? relAliases.split(" ") : [];

		for (let i = 0; i < this.groupByCols.length; i++) {
			let index = -1;
			const iSchema = vars.indexOf(this.groupByCols[i].relAlias + '');

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
					if (childSchema.getColumn(j).getName() === this.groupByCols[i].name &&
					  k === iSchema) {

						// Column name and alias found previously
						if (found) {
							throw new Error(i18n.t('db.messages.exec.error-column-ambiguous', {
								column: Column.printColumn(
									this.groupByCols[i].name,
									this.groupByCols[i].relAlias
								),
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
						childSchema.getColumnIndex(
							this.groupByCols[i].name,
							this.groupByCols[i].relAlias);
					}
					catch (e) {
						this.throwExecutionError(e.message);
					}
				}
			}
			else {
				// default case
				try {
					index = childSchema.getColumnIndex(
						this.groupByCols[i].name,
						this.groupByCols[i].relAlias
					);
				}
				catch (e) {
					this.throwExecutionError(e.message);
				}
			}

			groupByColumnIndices[i] = index;
		}

		for (let i = 0; i < this.aggregateFunctions.length; i++) {
			const f = this.aggregateFunctions[i];

			switch (f.aggFunction) {
				case 'COUNT_ALL':
				case 'COUNT':
				case 'SUM':
				case 'AVG':
				case 'MIN':
				case 'MAX':
					break;
				default:
					throw new Error('should not happen; unknown aggregate function');
			}

			if (f.aggFunction !== 'COUNT_ALL') {
				let index = -1;
				const iSchema = vars.indexOf(f.col.relAlias + '');

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
						if (childSchema.getColumn(j).getName() === f.col.name &&
							k === iSchema) {

							// Column name and alias found previously
							if (found) {
								throw new Error(i18n.t('db.messages.exec.error-column-ambiguous', {
									column: Column.printColumn(
										f.col.name,
										f.col.relAlias
									),
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
							childSchema.getColumnIndex(
								f.col.name,
								f.col.relAlias);
						}
						catch (e) {
							this.throwExecutionError(e.message);
						}
					}
				}
				else {
					// default case
					try {
						index = childSchema.getColumnIndex(
							f.col.name,
							f.col.relAlias
						);
					}
					catch (e) {
						this.throwExecutionError(e.message);
					}
				}

				aggregateFunctionsColIndex[i] = index;
			}
		}

		// create new Schema
		const schema = new Schema();
		for (let i = 0; i < groupByColumnIndices.length; i++) {
			schema.addColumn2(childSchema.getColumn(groupByColumnIndices[i]));
		}
		for (let i = 0; i < this.aggregateFunctions.length; i++) {
			const func = this.aggregateFunctions[i];
			const colType = childSchema.getType(aggregateFunctionsColIndex[i]);
			let type: DataType;

			switch (func.aggFunction) {
				case 'MIN':
				case 'MAX':
					type = colType;
					break;
				case 'SUM':
				case 'AVG':
					if (colType !== 'number') {
						this.throwExecutionError(i18n.t('db.messages.exec.error-func-not-defined-for-column-type', {
							func: func.aggFunction,
							colType: colType,
						}));
					}
					type = colType;
					break;
				case 'COUNT_ALL':
				case 'COUNT':
					type = 'number';
					break;
				default:
					throw new Error('unknown aggregate function ' + func.aggFunction);
			}
			schema.addColumn(func.name, null, type);
		}

		this.checked = {
			aggregateFunctionsColIndex,
			schema,
			groupByColumnIndices,
		};
	}

	getArgumentHtml() {
		const group = this.groupByCols.map(col => {
			return Column.printColumn(col.name, col.relAlias);
		});

		const agg = this.aggregateFunctions.map(func => {
			const s = (
				func.aggFunction === 'COUNT_ALL'
					? 'COUNT(*)'
					: `${func.aggFunction}(${Column.printColumn(func.col.name, func.col.relAlias)})`
			);
			return `${s}→${func.name}`;
		});

		return `${group.join(', ')}; ${agg.join(', ')}`;
	}


	getResult(doEliminateDuplicateRows: boolean = true, session?: Session) {
		session = this._returnOrCreateSession(session);

		if (this.checked === null) {
			throw new Error(`check not called`);
		}

		const org = this.getChild().getResult(doEliminateDuplicateRows, session);
		const res = new Table();
		res.setSchema(this.checked.schema);

		const hasGroupCols = this.groupByCols.length > 0;
		let groupsOfRows; // might be sparsely filled
		let numberOfGroups = 0; // === number of rows in result table

		if (hasGroupCols) {
			const hashTable: {
				[key: string]: {
					rows: Tuple[],
					resultTuple: Tuple,
					rownumber: number,
				},
			} = {};

			for (let i = 0; i < org.getNumRows(); i++) {
				const row = org.getRow(i);
				const keyTuple = new Array(this.checked.groupByColumnIndices.length);

				for (let j = 0; j < this.checked.groupByColumnIndices.length; j++) {
					keyTuple[j] = row[this.checked.groupByColumnIndices[j]];
				}

				const key = JSON.stringify(keyTuple);
				if (typeof (hashTable[key]) !== 'undefined') {
					hashTable[key].rows.push(row);
				}
				else {
					hashTable[key] = {
						rows: [row],
						resultTuple: keyTuple,
						rownumber: i,
					};
					numberOfGroups++;
				}
			}

			groupsOfRows = new Array(org.getNumRows()); // sparsely filled

			// write hashtable into sparsely filled array to preserve ordering
			let entry;
			for (const key in hashTable) {
				if (!hashTable.hasOwnProperty(key)) {
					continue;
				}

				entry = hashTable[key];
				groupsOfRows[entry.rownumber] = entry;
			}

		}
		else { // no grouping attributes => entire relation is one group
			numberOfGroups = 1;
			groupsOfRows = new Array(numberOfGroups);

			groupsOfRows[0] = {
				rows: org.getRows(),
				resultTuple: [],
			};

		}


		// min and max for strings, numbers and dates
		const genericMin = function (a: string | number | Date, b: string | number | Date) {
			if (a < b) {
				return a;
			}
			return b;
		};
		const genericMax = function (a: string | number | Date, b: string | number | Date) {
			if (a > b) {
				return a;
			}
			return b;
		};


		// execute aggregate functions
		let aggValue, group, value;
		let entry;
		for (let h = 0; h < groupsOfRows.length; h++) {
			if (!groupsOfRows[h]) {
				continue;
			} // skip unfilled rows

			entry = groupsOfRows[h];
			group = entry.rows;

			for (let i = 0; i < this.aggregateFunctions.length; i++) {
				const func = this.aggregateFunctions[i];
				const funcColIndex = this.checked.aggregateFunctionsColIndex[i];

				if (func.aggFunction === 'COUNT_ALL') {
					aggValue = group.length;
				}
				else {
					// var colType = this._child.getSchema().getType(func.colIndex);
					switch (func.aggFunction) {
						case 'COUNT':
							aggValue = 0;

							for (let j = 0; j < group.length; j++) {
								value = group[j][funcColIndex];
								if (value !== null) {
									aggValue++;
								}
							}

							break;

						case 'MIN':
						case 'MAX':
							aggValue = null;
							const c = func.aggFunction === 'MIN' ? genericMin : genericMax;

							for (let j = 0; j < group.length; j++) {
								value = group[j][funcColIndex];
								if (aggValue === null) {
									aggValue = value;
								}
								else {
									aggValue = c(aggValue, value);
								}
							}

							break;

						case 'AVG':
						case 'SUM':
							let sum = 0;
							let counter = 0;

							for (let j = 0; j < group.length; j++) {
								value = group[j][funcColIndex];
								if (value !== null) {
									sum += value;
									counter++;
								}
							}

							if (counter === 0) {
								aggValue = null;
							}
							else if (func.aggFunction === 'SUM') {
								aggValue = sum;
							}
							else { // AVG
								aggValue = sum / counter;
							}

							break;

						default:
							throw new Error('this should not happen');
					}
				}
				entry.resultTuple.push(aggValue);
			}

		}

		// write into result-table
		for (let i = 0; i < groupsOfRows.length; i++) {
			if (!groupsOfRows[i]) {
				continue;
			}
			res.addRow(groupsOfRows[i].resultTuple);
		}

		if (doEliminateDuplicateRows === true) {
			res.eliminateDuplicateRows();
		}
		this.setResultNumRows(res.getNumRows());
		return res;
	}
}
