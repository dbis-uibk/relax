/*** Copyright 2016 Johannes Kessler 2016 Johannes Kessler
*
* This Source Code Form is subject to the terms of the Mozilla Public
* License, v. 2.0. If a copy of the MPL was not distributed with this
* file, You can obtain one at http://mozilla.org/MPL/2.0/. */

import { RANode, Session } from '../RANode';
import { Schema } from '../Schema';
import { Join, JoinCondition } from './Join';
import * as i18n from 'i18next';

/**
 * relational algebra anti-join operator
 */
export class AntiJoin extends Join {
	constructor(child: RANode, child2: RANode, condition: JoinCondition) {
		super(child, child2, '▷', condition, false, true);
	}

	_checkSchema(schemaA: Schema, schemaB: Schema): void {
		try {
			this._schema = this._child.getSchema().copy();
			this._rowCreatorMatched = function (rowA: any[], rowB: any[]): any[] {
				return rowA;
			};

			this._rowCreatorNotMatched = function (rowA: any[], rowB: any[]): any[] {
				return rowA;
			};
		}
		catch (e) {
			// throw (new) error in the join-context
			this.throwExecutionError(e.message);
		}
	}

	getResult(doEliminateDuplicateRows: boolean = true, session?: Session) {
		return super._getResult(doEliminateDuplicateRows, session);
	}
}
