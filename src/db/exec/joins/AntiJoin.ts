/*** Copyright 2016 Johannes Kessler 2016 Johannes Kessler
*
* This Source Code Form is subject to the terms of the Mozilla Public
* License, v. 2.0. If a copy of the MPL was not distributed with this
* file, You can obtain one at http://mozilla.org/MPL/2.0/. */

import { RANode, Session } from '../RANode';
import { Schema } from '../Schema';
import { Join } from './Join';

/**
 * relational algebra anti-join operator
 */
export class AntiJoin extends Join {
	constructor(child: RANode, child2: RANode) {
		super(child, child2, '▷', {
			type: 'natural',
			restrictToColumns: null,
		}, false);
	}

	_checkSchema(schemaA: Schema, schemaB: Schema): void {
		// schema of anti join is always the left operands schema

		this._schema = schemaA.copy();
		this._rowCreatorNotMatched = function (rowA: any[], rowB: any[]): any[] {
			return rowA; // take left side only
		};
		this._rowCreatorMatched = null;
	}

	getResult(session?: Session) {
		return super._getResult(session, true);
	}
}
