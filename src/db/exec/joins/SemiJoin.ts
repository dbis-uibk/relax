/*** Copyright 2016 Johannes Kessler 2016 Johannes Kessler
*
* This Source Code Form is subject to the terms of the Mozilla Public
* License, v. 2.0. If a copy of the MPL was not distributed with this
* file, You can obtain one at http://mozilla.org/MPL/2.0/. */

import { RANode, Session } from '../RANode';
import { Schema } from '../Schema';
import { Join, JoinCondition } from './Join';

/**
 * relational algebra semi-join operator
 *
 * @extends RANode
 * @constructor
 * @param   {RANode}        child          the left child expression
 * @param   {RANode}        child2         the right child expression
 * @param   {Boolean}       isLeftSemiJoin true if if is a left semi join; false for right semi join
 * @param   {JoinCondition} condition      optional join condition (theta or natural)
 * @returns {SemiJoin}
 */
export class SemiJoin extends Join {
	constructor(child: RANode, child2: RANode, isLeftSemiJoin: boolean, condition?: JoinCondition) {
		// Default to natural join if no condition provided (backward compatibility)
		const joinCondition: JoinCondition = condition || {
			type: 'natural',
			restrictToColumns: null,
		};
		super(child, child2, (isLeftSemiJoin ? '⋉' : '⋊'), joinCondition, !isLeftSemiJoin);
	}

	_checkSchema(schemaA: Schema, schemaB: Schema): void {
		// semi join uses only either the left or the right schema
		if (this._isRightJoin) {
			this._schema = schemaB.copy();
			this._rowCreatorMatched = function (rowA: any[], rowB: any[]): any[] {
				return rowB;
			};
		}
		else {
			this._schema = schemaA.copy();
			this._rowCreatorMatched = function (rowA: any[], rowB: any[]): any[] {
				return rowA;
			};
		}
		this._rowCreatorNotMatched = null;
	}

	getResult(doEliminateDuplicateRows: boolean = true, session?: Session) {
		return super._getResult(doEliminateDuplicateRows, session);
	}
}
