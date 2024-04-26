/*** Copyright 2016 Johannes Kessler 2016 Johannes Kessler
*
* This Source Code Form is subject to the terms of the Mozilla Public
* License, v. 2.0. If a copy of the MPL was not distributed with this
* file, You can obtain one at http://mozilla.org/MPL/2.0/. */

import * as i18n from 'i18next';
import { Column } from './Column';
import { RANode, RANodeUnary, Session } from './RANode';

/**
 * relational algebra order-by operator
 *
 * @constructor
 * @extends RANode
 * @param   {RANode}  child     child expression
 * @param   {Array}   orderCols Array of Column
 * @param   {Array}   orderAsc  Array of Boolean indicating the sort direction (true == asc)
 * @returns {OrderBy}
 */
export class OrderBy extends RANodeUnary {
	_orderCols: Column[];
	_orderAsc: boolean[];
	_orderIndices: number[] | null;

	constructor(child: RANode, orderCols: Column[], orderAsc: boolean[]) {
		super('&tau;', child);

		this._orderCols = orderCols;
		this._orderAsc = orderAsc;

		if (this._orderAsc.length !== this._orderCols.length) {
			throw new Error('order cols not correct');
		}

		this._orderIndices = null; // set by check
	}

	getSchema() {
		return this._child.getSchema();
	}

	getResult(session?: Session) {
		session = this._returnOrCreateSession(session);
		if (this._orderIndices === null) {
			throw new Error(`check not called`);
		}

		const res = this.getChild().getResult(session).copy();
		res.eliminateDuplicateRows();
		this.setResultNumRows(res.getNumRows());

		res.sort(this._orderIndices, this._orderAsc);
		return res;
	}

	check(): void {
		this._child.check();
		const schema = this._child.getSchema();

		this._orderIndices = [];

		// Get relation aliases
		const relAliases = this._child.getMetaData('fromVariable');
		// Split relation aliases into array
		const vars = relAliases ? relAliases.split(" ") : [];

		for (let i = 0; i < this._orderCols.length; i++) {
			const col = this._orderCols[i];
			let index = -1;
			const iSchema = vars.indexOf(col.getRelAlias() + '');

			if (iSchema >= 0) {
				let j = 0, k = 0;
				// Set first relation alias
				let lastAlias = schema.getColumn(j).getRelAlias();
				// Check if relation alias already found
				let found = false;
				for (; j < schema.getSize(); j++) {
					// Check if relation alias changed
					if (schema.getColumn(j).getRelAlias() !== lastAlias) {
						lastAlias = schema.getColumn(j).getRelAlias();
						if (k < vars.length - 1) k++;
					}

					// Check if column name and relation alias match
					if (schema.getColumn(j).getName() === col.getName() &&
					  k === iSchema) {

						// Column name and alias found previously
						if (found) {
							throw new Error(i18n.t('db.messages.exec.error-column-ambiguous', {
								column: Column.printColumn(
									col.getName(),
									col.getRelAlias()
								),
								schema: schema,
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
						schema.getColumnIndex(col.getName(), col.getRelAlias());
					}
					catch (e) {
						this.throwExecutionError(e.message);
					}
				}
			}
			else {
				// default case
				try {
					index = schema.getColumnIndex(col.getName(), col.getRelAlias());
				}
				catch (e) {
					this.throwExecutionError(e.message);
				}
			}

			this._orderIndices.push(index);
		}
	}

	getArgumentHtml() {
		const list = [];

		for (let i = 0; i < this._orderCols.length; i++) {
			const s = `${this._orderCols[i].toString()} ${this._orderAsc[i] ? 'asc' : 'desc'}`;
			list.push(s);
		}
		return list.join(', ');
	}
}
