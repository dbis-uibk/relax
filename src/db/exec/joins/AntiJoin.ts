/*** Copyright 2016 Johannes Kessler 2016 Johannes Kessler
*
* This Source Code Form is subject to the terms of the Mozilla Public
* License, v. 2.0. If a copy of the MPL was not distributed with this
* file, You can obtain one at http://mozilla.org/MPL/2.0/. */

import { RANode, Session } from '../RANode';
import { Schema } from '../Schema';
import { Join, JoinCondition } from './Join';

/**
 * relational algebra anti-join operator
 * 
 * @extends Join
 * @constructor
 * @param   {RANode}        child          the left child expression
 * @param   {RANode}        child2         the right child expression
 * @param   {Boolean}       isLeftAntiJoin true if if is a left anti join;
 * 										   false for right anti join
 * @returns {AntiJoin}
 */
export class AntiJoin extends Join {
	private readonly _isLeftAntiJoin: boolean;

	constructor(child: RANode, child2: RANode, isLeftAntiJoin: boolean, condition: JoinCondition) {
		super(child, child2, (isLeftAntiJoin ? '▷' : '◁'), condition, !isLeftAntiJoin, true);
		this._isLeftAntiJoin = isLeftAntiJoin;
	}

	_checkSchema(schemaA: Schema, schemaB: Schema): void {
		try {
			if (this._isLeftAntiJoin) {
				this._schema = this._child.getSchema().copy();
				this._rowCreatorMatched = function (rowA: any[], rowB: any[]): any[] {
					return rowA;
				};

				this._rowCreatorNotMatched = function (rowA: any[], rowB: any[]): any[] {
					return rowA;
				};
			} else {
				this._schema = this._child2.getSchema().copy();
				this._rowCreatorMatched = null;
				this._rowCreatorNotMatched = function (rowA: any[], rowB: any[]): any[] {
					return rowB;
				};
			}
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
