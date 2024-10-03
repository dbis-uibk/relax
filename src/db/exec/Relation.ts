/*** Copyright 2016 Johannes Kessler 2016 Johannes Kessler
*
* This Source Code Form is subject to the terms of the Mozilla Public
* License, v. 2.0. If a copy of the MPL was not distributed with this
* file, You can obtain one at http://mozilla.org/MPL/2.0/. */

import { RANode, RANodeNullary, Session } from './RANode';
import { Schema } from './Schema';
import { Table, Tuple } from './Table';

/**
 * the base of all relational algebra statements
 */
export class Relation extends RANodeNullary {
	_table: Table;
	_schema: Schema | null = null;

	constructor(
		/** the name of the relation */
		functionName: string,
		/** relation is filled by evaluating the node */
		content?: RANode,
	) {
		super(functionName);
		if (content === undefined) {
			this._table = new Table();
		}
		else {
			content.check();
			this._schema = content.getSchema();
			this._table = content.getResult(false);
		}
	}

	setSchema(schema: Schema, doNotSetRelAlias: boolean = false) {
		this._schema = schema.copy();
		if (doNotSetRelAlias !== true) {
			this._schema.setRelAlias(this._functionName);
		}
		this._table.setSchema(this._schema);

		return this;
	}

	addRow(arr: Tuple) {
		this._table.addRow(arr);
	}

	addRows(arr: Tuple[]) {
		this._table.addRows(arr);
	}

	getResultNumRows() {
		return this._resultNumRows;
	}

	getResult(doEliminateDuplicateRows: boolean = true, session?: Session) {
		this._returnOrCreateSession(session);

		const res = this._table.copy();

		if (doEliminateDuplicateRows === true) {
			res.eliminateDuplicateRows();
		}
		this.setResultNumRows(res.getNumRows());
		return res;
	}

	getSchema() {
		return this._table.getSchema();
	}

	getName() {
		return this._functionName;
	}

	check() {
		// noop
	}

	hasChild() {
		return false;
	}

	copy() {
		if (this._schema === null) {
			throw new Error(`check not called`);
		}

		const c = new Relation(this._functionName);
		c.setSchema(this._schema);
		c._table = this._table.copy();
		return c;
	}
}
