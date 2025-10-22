/*** Copyright 2016 Johannes Kessler 2016 Johannes Kessler
*
* This Source Code Form is subject to the terms of the Mozilla Public
* License, v. 2.0. If a copy of the MPL was not distributed with this
* file, You can obtain one at http://mozilla.org/MPL/2.0/. */

import * as i18n from 'i18next';
import { RANode, RANodeBinary, Session } from './RANode';
import { Schema } from './Schema';
import { Table } from './Table';

/**
 * This is the Union operation
 * The two child expression must have a union compatible schema.
 * The schema of the left child is used as the output schema.
 *
 * Union is done by concatenating the two results (left||right)
 */
export class Union extends RANodeBinary {
	private _schema: Schema | null = null;
	private _res: Table | null = null;

	constructor(child: RANode, child2: RANode) {
		super('∪', child, child2);

		this._schema = null; // is set by check
	}

	getSchema() {
		if (this._schema === null) {
			throw new Error(`check not called`);
		}
		return this._schema;
	}

	getResult(doEliminateDuplicateRows: boolean = true, session?: Session) {
		if (this._res) {
			return this._res;
		}
		session = this._returnOrCreateSession(session);

		if (this._schema === null) {
			throw new Error(`check not called`);
		}
		this._timer.start('_resTime');
		const res = new Table();
		const orgA = this.getChild().getResult(doEliminateDuplicateRows, session);
		const orgB = this.getChild2().getResult(doEliminateDuplicateRows, session);
		res.setSchema(this._schema);
		this._timer.start('_exeTime');
		// copy
		res.addRows(orgA.getRows());
		res.addRows(orgB.getRows());

		if (doEliminateDuplicateRows === true) {
			res.eliminateDuplicateRows();
		}
		this.setResultNumRows(res.getNumRows());
		this._execTime = this._timer.end('_execTime');
		this._resTime = this._timer.end('_resTime');
		this._res = res;
		return res;
	}

	check() {
		this._child.check();
		this._child2.check();

		if (this._child.getSchema().equalsTypeOnly(this._child2.getSchema()) === false) {
			this.throwExecutionError(i18n.t('db.messages.exec.error-schemas-not-unifiable', {
				schemaA: this._child.getSchema(),
				schemaB: this._child2.getSchema(),
			}));
		}

		// schema of union is the left schema
		this._schema = this._child.getSchema().copy();
	}
}
