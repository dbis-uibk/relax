/*** Copyright 2016 Johannes Kessler 2016 Johannes Kessler
*
* This Source Code Form is subject to the terms of the Mozilla Public
* License, v. 2.0. If a copy of the MPL was not distributed with this
* file, You can obtain one at http://mozilla.org/MPL/2.0/. */

import * as i18n from 'i18next';
import { RANode, Session } from '../RANode';
import { Schema } from '../Schema';
import { Table } from '../Table';
import { Join, JoinCondition } from './Join';


/**
 * relational algebra full outer Join operator
 *
 * A full outer join B = (A left outer join B) union (A right outer join B)
 *
 * @extends RANode
 * @constructor
 * @param   {RANode}               child     the left child expression
 * @param   {RANode}               child2    the right child expression
 * @param   {null|ValueExpr|Array} condition see condition of {@link Join}
 * @returns {FullOuterJoin}
 */
export class FullOuterJoin extends Join {
	constructor(child: RANode, child2: RANode, condition: JoinCondition) {
		super(child, child2, '⟗', condition, false);
	}

	setChild2(child2: RANode) {
		this._child2 = child2;
	}

	_checkSchema(schemaA: Schema, schemaB: Schema): void {
		try {
			// full outer join always has a concatenated schema

			// check columns appearing in both schemas
			const conflicts = schemaA.getConflictingColumnsArray(schemaB);
			if (conflicts.length > 0) {
				this.throwExecutionError(i18n.t('db.messages.exec.error-join-would-produce-non-unique-columns', { conflicts: conflicts.join(', ') }));
			}

			this._schema = Schema.concat(this._child.getSchema(), this._child2.getSchema());
			this._rowCreatorMatched = function (rowA: any[], rowB: any[]): any[] {
				return rowA.concat(rowB);
			};
			this._rowCreatorNotMatched = function (rowA: any[], rowB: any[]): any[] {
				return rowA.concat(rowB);
			};

		}
		catch (e) {
			// throw (new) error in the join-context
			this.throwExecutionError(e.message);
		}
	}

	getResult(doEliminateDuplicateRows: boolean = true, session?: Session) {
		session = this._returnOrCreateSession(session);

		if (this._joinConditionEvaluator === null || this._rowCreatorMatched === null || this._rowCreatorNotMatched === null) {
			throw new Error(`check not called`);
		}

		const resultTable = new Table();
		resultTable.setSchema(this.getSchema());

		// left join
		Join.calcNestedLoopJoin(
			doEliminateDuplicateRows,
			session,
			this.getChild(), this.getChild2(),
			resultTable,
			false,
			false,
			this._joinConditionEvaluator,
			this._rowCreatorMatched,
			this._rowCreatorNotMatched,
		);

		// right join
		Join.calcNestedLoopJoin(
			doEliminateDuplicateRows,
			session,
			this.getChild(), this.getChild2(),
			resultTable,
			true,
			false,
			this._joinConditionEvaluator,
			// Should not create matched rows twice in case of a multiset (left join already did the job)
			// this._rowCreatorMatched,	
			null,
			this._rowCreatorNotMatched,
		);

		if (doEliminateDuplicateRows === true) {
			resultTable.eliminateDuplicateRows();
		}
		this.setResultNumRows(resultTable.getNumRows());

		return resultTable;
	}
}
