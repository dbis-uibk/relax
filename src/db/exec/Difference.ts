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
 * relational algebra difference operator
 */
export class Difference extends RANodeBinary {
	private _schema: Schema | null = null;

	constructor(
		/** the left child expression */
		child: RANode,
		/** the right child expression */
		child2: RANode,
	) {
		super('-', child, child2);
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

		const res = new Table();
		const orgA = this.getChild().getResult(doEliminateDuplicateRows, session);
		const orgB = this.getChild2().getResult(doEliminateDuplicateRows, session);
		res.setSchema(this._schema);
		let paintedIndexes: (number)[] = [];

		// copy
		for (let i = 0; i < orgA.getNumRows(); i++) {
			const rowA = orgA.getRow(i);
			let notFound = true;
			for (let j = 0; j < orgB.getNumRows(); j++) {
				if (paintedIndexes.indexOf(j) !== -1) {
					continue;
				}

				if (Table.rowEqualsRow(rowA, orgB.getRow(j))) {
					notFound = false;
					paintedIndexes.push(j);
					break;
				}
			}

			if (notFound) {
				res.addRow(rowA);
			}
		}

		if (doEliminateDuplicateRows === true) {
			res.eliminateDuplicateRows();
		}
		this.setResultNumRows(res.getNumRows());
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

		// schema of diff is the left schema
		this._schema = this._child.getSchema().copy();
	}
}
