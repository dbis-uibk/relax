/*** Copyright 2016 Johannes Kessler 2016 Johannes Kessler
*
* This Source Code Form is subject to the terms of the Mozilla Public
* License, v. 2.0. If a copy of the MPL was not distributed with this
* file, You can obtain one at http://mozilla.org/MPL/2.0/. */

import { Difference } from './Difference';
import { CrossJoin } from './joins/CrossJoin';
import { Projection } from './Projection';
import { RANode, RANodeBinary, Session } from './RANode';

declare var i18n: any;

/**
 * relational algebra division operator
 */
export class Division extends RANodeBinary {
	// is set by check
	private _delegate: RANode | null = null;

	constructor(child: RANode, child2: RANode) {
		super('÷', child, child2);
	}

	getSchema() {
		if (this._delegate === null) {
			throw new Error(`check not called`);
		}
		return this._delegate.getSchema();
	}

	getResult(doEliminateDuplicateRows: boolean = true, session?: Session) {
		session = this._returnOrCreateSession(session);
		if (this._delegate === null) {
			throw new Error(`check not called`);
		}

		this._timer.start('_resTime');
		const res = this._delegate.getResult(doEliminateDuplicateRows, session);
		this._timer.start('_execTime');

		if (doEliminateDuplicateRows === true) {
			res.eliminateDuplicateRows();
		}
		this.setResultNumRows(res.getNumRows());
		this._execTime = this._timer.end('_execTime');
		this._resTime = this._timer.end('_resTime');
		return res;
	}

	check() {
		this._child.check();
		this._child2.check();

		// schema r' is (sch(left) \ sch(right))
		const schemaA = this._child.getSchema();
		const schemaB = this._child2.getSchema();
		const numColsA = schemaA.getSize();
		const numColsB = schemaB.getSize();

		const schema = schemaA.copy();
		for (let i = 0; i < numColsB; i++) {
			const index = schema.getColumnIndex(schemaB.getColumn(i).getName(), null, false);
			if (index > -1) {
				schema.removeColumn(index);
			}
		}

		if (schema.getSize() === numColsA) { // size has not changed => schemaB not part of schemaA
			this.throwExecutionError(i18n.t('db.messages.exec.error-schema-a-not-part-of-schema-b', {
				schemaA: schemaB,
				schemaB: schemaA,
			}));
		}


		// (R % S) := (pi r'(R)) -  pi r'( ( (pi r'(R)) x (S) ) - (R) )
		this._delegate = new Difference(
			new Projection(this._child, schema.getColumns()).setCodeInfoObject(this._codeInfo),
			new Projection(
				new Difference(
					new CrossJoin(
						new Projection(this._child, schema.getColumns()).setCodeInfoObject(this._codeInfo),
						this._child2,
					).setCodeInfoObject(this._codeInfo),
					this._child,
				).setCodeInfoObject(this._codeInfo),
				schema.getColumns(),
			).setCodeInfoObject(this._codeInfo),
		);
		this._delegate.check();
	}
}
