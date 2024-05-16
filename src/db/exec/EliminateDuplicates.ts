/*** Copyright 2016 Johannes Kessler 2016 Johannes Kessler
*
* This Source Code Form is subject to the terms of the Mozilla Public
* License, v. 2.0. If a copy of the MPL was not distributed with this
* file, You can obtain one at http://mozilla.org/MPL/2.0/. */

import * as i18n from 'i18next';
import { RANode, RANodeBinary, RANodeUnary, Session } from './RANode';
import { Schema } from './Schema';
import { Table } from './Table';

/**
 * This is the Union operation
 * The two child expression must have a union compatible schema.
 * The schema of the left child is used as the output schema.
 *
 * Union is done by concatenating the two results (left||right)
 */
export class EliminateDuplicates extends RANodeUnary {
	private _schema: Schema | null = null;

	constructor(child: RANode) {
		super('&delta;', child);
	}

	getSchema() {
		if (this._schema === null) {
			throw new Error(`check not called`);
		}
		return this._schema;
	}

	getResult(doEliminateDuplicateRows: boolean = true, session?: Session) {
		session = this._returnOrCreateSession(session);

		if (this._schema === null) {
			throw new Error(`check not called`);
		}

		const res = this._child.getResult(doEliminateDuplicateRows, session).copy();
		res.setSchema(this.getSchema());

		res.eliminateDuplicateRows();
		this.setResultNumRows(res.getNumRows());
		return res;
	}

	check() {
		this._child.check();

		// schema of eliminate duplicates is the child schema
		this._schema = this._child.getSchema().copy();
	}
}
