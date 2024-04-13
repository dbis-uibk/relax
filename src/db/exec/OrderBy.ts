/*** Copyright 2016 Johannes Kessler 2016 Johannes Kessler
*
* This Source Code Form is subject to the terms of the Mozilla Public
* License, v. 2.0. If a copy of the MPL was not distributed with this
* file, You can obtain one at http://mozilla.org/MPL/2.0/. */

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

		for (let i = 0; i < this._orderCols.length; i++) {
			const col = this._orderCols[i];
			const index = col.getRelAlias() != this._child.getMetaData('fromVariable') ?
				schema.getColumnIndex(col.getName(), col.getRelAlias()) :
				schema.getColumnIndex(col.getName(), null);

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
