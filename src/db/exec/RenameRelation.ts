/*** Copyright 2016 Johannes Kessler 2016 Johannes Kessler
*
* This Source Code Form is subject to the terms of the Mozilla Public
* License, v. 2.0. If a copy of the MPL was not distributed with this
* file, You can obtain one at http://mozilla.org/MPL/2.0/. */

import { RANode, RANodeUnary, Session } from './RANode';
import { Schema } from './Schema';
import { Table } from './Table';

/**
 * relational algebra anti-join operator
 *
 * @extends RANode
 * @constructor
 * @param   {RANode}         child           the left child expression
 * @param {String} new alias for the relation as String
 * @returns {RenameRelation}
 */
export class RenameRelation extends RANodeUnary {
	private _res: Table | null = null;
	_newRelAlias: string;
	_schema: Schema | null = null;

	constructor(child: RANode, newRelAlias: string) {
		super('&rho;', child);

		this._newRelAlias = newRelAlias;
	}

	getSchema() {
		if (this._schema === null) {
			throw new Error(`check not called`);
		}
		return this._schema;
	}

	check(): void {
		this._child.check();

		try {
			this._schema = this._child.getSchema().copy();
			this._schema.setRelAlias(this._newRelAlias);
		}
		catch (e) {
			this.throwExecutionError(e.message);
		}
	}

	getResult(doEliminateDuplicateRows: boolean = true, session?: Session) {
		if (this._res) {
			return this._res;
		}
		if (this._schema === null) {
			throw new Error(`check not called`);
		}
		this._timer.start('_resTime');
		const res = this._child.getResult(doEliminateDuplicateRows, session).copy();
		this._timer.start('_execTime');
		res.setSchema(this.getSchema());

		this.setResultNumRows(res.getNumRows());
		this._execTime = this._timer.end('_execTime');
		this._resTime = this._timer.end('_resTime');
		this._res = res;
		return res;
	}

	getArgumentHtml() {
		return this._newRelAlias;
	}
}
