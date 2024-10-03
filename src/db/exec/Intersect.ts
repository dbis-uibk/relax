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
 * Calculates the intersection of two relations
 * The order of the rows is kept.
 * The output schema will be the schema of the left child
 */
export class Intersect extends RANodeBinary {
	private _schema: Schema | null = null; // is set by check

	constructor(child: RANode, child2: RANode) {
		super('∩', child, child2);
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

		// copy
		const numRowsA = orgA.getNumRows();
		const numRowsB = orgB.getNumRows();
		const numCols = orgA.getNumCols();
		let paintedIndexes: (number)[] = [];
		for (let i = 0; i < numRowsA; i++) {
			const rowA = orgA.getRow(i);
			for (let j = 0; j < numRowsB; j++) {
				if (paintedIndexes.indexOf(j) !== -1) {
					continue;
				}

				const rowB = orgB.getRow(j);
				let equals = true;

				for (let k = 0; k < numCols; k++) {
					if (rowA[k] !== rowB[k]) {
						equals = false;
						break;
					}
				}

				if (equals) {
					res.addRow(rowA);
					paintedIndexes.push(j);
					break;
				}
			}
		}

		if (doEliminateDuplicateRows === true) {
			res.eliminateDuplicateRows();
		}
		this.setResultNumRows(res.getNumRows());
		return res;
	}

	check(): void {
		this._child.check();
		this._child2.check();

		if (this._child.getSchema().equalsTypeOnly(this._child2.getSchema()) === false) {
			this.throwExecutionError(i18n.t('db.messages.exec.error-schemas-not-unifiable', {
				schemaA: this._child.getSchema(),
				schemaB: this._child2.getSchema(),
			}));
		}

		// schema is the left schema
		this._schema = this._child.getSchema().copy();
	}
}
