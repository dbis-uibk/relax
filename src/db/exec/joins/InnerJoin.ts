/*** Copyright 2016 Johannes Kessler 2016 Johannes Kessler
*
* This Source Code Form is subject to the terms of the Mozilla Public
* License, v. 2.0. If a copy of the MPL was not distributed with this
* file, You can obtain one at http://mozilla.org/MPL/2.0/. */

import * as i18n from 'i18next';
import { RANode, Session } from '../RANode';
import { Schema } from '../Schema';
import { Join, JoinCondition } from './Join';


/**
 * relational algebra inner Join operator
 *
 * this is just a wrapper for {@link Join}
 */
export class InnerJoin extends Join {
	constructor(child: RANode, child2: RANode, condition: JoinCondition) {
		super(child, child2, '⨝', condition, false);
	}

	_checkSchema(schemaA: Schema, schemaB: Schema): void {
		try {

			if (this._joinConditionOptions.type === 'natural') {
				const tmp = Schema.concatNatural(schemaA, schemaB, true, this._joinConditionOptions.restrictToColumns);
				const keepColumns = tmp.keep;

				this._schema = tmp.schema;
				this._rowCreatorMatched = function (rowA: any[], rowB: any[]): any[] {
					return Join.createNaturalRowArray(rowA, rowB, keepColumns.size, keepColumns.keepIndicesA, keepColumns.keepIndicesB);
				};

			}
			else {
				// theta join

				// check columns appearing in both schemas
				const conflicts = schemaA.getConflictingColumnsArray(schemaB);
				if (conflicts.length > 0) {
					this.throwExecutionError(i18n.t('db.messages.exec.error-join-would-produce-non-unique-columns', { conflicts: conflicts.join(', ') }));
				}

				this._schema = Schema.concat(this._child.getSchema(), this._child2.getSchema());
				this._rowCreatorMatched = function (rowA: any[], rowB: any[]): any[] {
					return rowA.concat(rowB);
				};
			}

			this._rowCreatorNotMatched = null;
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
