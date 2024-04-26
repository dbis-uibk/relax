/*** Copyright 2016 Johannes Kessler 2016 Johannes Kessler
*
* This Source Code Form is subject to the terms of the Mozilla Public
* License, v. 2.0. If a copy of the MPL was not distributed with this
* file, You can obtain one at http://mozilla.org/MPL/2.0/. */

import * as i18n from 'i18next';
import { RANode, RANodeUnary, Session } from './RANode';
import { Schema } from './Schema';
import { Table } from './Table';
import * as ValueExpr from './ValueExpr';


export class Selection extends RANodeUnary {
	private _condition: ValueExpr.ValueExpr;
	private _schema: Schema | null = null;

	constructor(child: RANode, condition: ValueExpr.ValueExpr) {
		super('&sigma;', child);
		this._condition = condition;

		if (condition instanceof ValueExpr.ValueExpr === false) {
			throw new Error('no condition given');
		}
	}

	getSchema() {
		if (this._schema === null) {
			throw new Error(`check not called`);
		}
		return this._schema;
	}

	getResult(session?: Session) {
		session = this._returnOrCreateSession(session);
		const res = new Table();
		const org = this.getChild().getResult(session);
		res.setSchema(org.getSchema());

		// copy
		const condition = this._condition;
		const numRows = org.getNumRows();
		for (let i = 0; i < numRows; i++) {
			const row = org.getRow(i);

			if (condition.evaluate(row, [], i, session) === true) {
				res.addRow(row);
			}
		}

		this.setResultNumRows(res.getNumRows());
		return res;
	}

	check() {
		this._child.check();

		// schema of union is the left schema
		this._schema = this._child.getSchema();

		try {
			this._condition.check(this._schema);
		} catch (e) {
			// Second try: check wether predicate uses a relation alias(es)

			// Get relation aliases
			const relAliases = this._child.getMetaData('fromVariable');
			// Split relation aliases into array
			const vars = relAliases ? relAliases.split(" ") : [];

			// All columns names and aliases
			let allCols: (string | number)[] = [];
			let allRelAliases: (string | number)[] = [];
			let allAltRelAliases: (string | number)[] = [];
			// Ambiguous columns names
			let blacklist: (string | number)[] = [];
			const numCols = this._schema.getSize();
			// Set first relation alias
			let lastAlias = this._schema.getColumn(0).getRelAlias();
			let k = 0;
			for (let i = 0; i < numCols; i++) {
				if (this._schema.getColumn(i).getRelAlias() !== lastAlias) {
					lastAlias = this._schema.getColumn(i).getRelAlias();
					if (k < vars.length - 1) k++;
				}

				allCols.push(this._schema.getColumn(i).getName());
				allRelAliases.push(this._schema.getColumn(i).getRelAlias() as string);
				allAltRelAliases.push(vars[k]);

				// If column already in blacklist, skip it
				// Cannot set relation alias for this column
				if (blacklist.includes(this._schema.getColumn(i).getName())) {
					continue;
				}

				for (let j = i+1; j < numCols; j++) {
					// If found a sibling column, cannot set relation alias
					if (this._schema.getColumn(i).getName() === this._schema.getColumn(j).getName()) {
						blacklist.push(this._schema.getColumn(i).getName());
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

			// Apply and test if relation alias works for any combination of
			// unique columns
			for (let i = 0; i < combCols.length; i++) {
				let newSchema = this._schema.copy();

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
					this._condition.check(newSchema);
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

		if (this._condition.getDataType() !== 'boolean') {
			this.throwExecutionError(i18n.t('db.messages.exec.error-condition-must-be-boolean'));
		}
	}

	getArgumentHtml() {
		return this._condition.getFormulaHtml();
	}
}
