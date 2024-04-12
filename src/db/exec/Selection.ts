/*** Copyright 2016 Johannes Kessler 2016 Johannes Kessler
*
* This Source Code Form is subject to the terms of the Mozilla Public
* License, v. 2.0. If a copy of the MPL was not distributed with this
* file, You can obtain one at http://mozilla.org/MPL/2.0/. */

import * as i18n from 'i18next';
import { RANode, RANodeUnary, Session } from './RANode';
import { Schema } from './Schema';
import { Table } from './Table';
import * as ValueExpr from './ValueExpr';
import { RenameRelation } from './RenameRelation';


export class Selection extends RANodeUnary {
	private _condition: ValueExpr.ValueExpr;
	private _schema: Schema | null = null;

	constructor(child: RANode, condition: ValueExpr.ValueExpr) {
		super('&sigma;', child);
		this._condition = condition;

		if (condition instanceof ValueExpr.ValueExpr === false) {
			throw new Error('no condition given');
		}
	}

	getSchema() {
		if (this._schema === null) {
			throw new Error(`check not called`);
		}
		return this._schema;
	}

	getResult(session?: Session) {
		session = this._returnOrCreateSession(session);
		const res = new Table();
		const org = this.getChild().getResult(session);
		res.setSchema(org.getSchema());

		// copy
		const condition = this._condition;
		const numRows = org.getNumRows();
		for (let i = 0; i < numRows; i++) {
			const row = org.getRow(i);

			if (condition.evaluate(row, [], i, session) === true) {
				res.addRow(row);
			}
		}

		this.setResultNumRows(res.getNumRows());
		return res;
	}

	check() {
		this._child.check();

		// schema of union is the left schema
		this._schema = this._child.getSchema();

		try {
			this._condition.check(this._schema);
		} catch (e) {
			const relAlias = this._child.getMetaData('fromVariable');
			if (relAlias) {
				const altChild = 
					new RenameRelation(this._child, relAlias + "");
				altChild.check();
				this._schema = altChild.getSchema();
			}
			this._condition.check(this._schema);
		}
		
		if (this._condition.getDataType() !== 'boolean') {
			this.throwExecutionError(i18n.t('db.messages.exec.error-condition-must-be-boolean'));
		}
	}

	getArgumentHtml() {
		return this._condition.getFormulaHtml();
	}
}
