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


export class Selection extends RANodeUnary {
	private _condition: ValueExpr.ValueExpr;
	private _schema: Schema | null = null;

	constructor(child: RANode, condition: ValueExpr.ValueExpr) {
		super('&sigma;', child, 'selection');
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

	getResult(doEliminateDuplicateRows: boolean = true, session?: Session) {
		session = this._returnOrCreateSession(session);
		const res = new Table();
		const org = this.getChild().getResult(doEliminateDuplicateRows, session);
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
			// Second try: check whether predicate uses a relation alias(es)

			// Get relation aliases (space-separated) and split into alt names
			const relAliases = this._child.getMetaData('fromVariable');
			const vars = relAliases ? String(relAliases).split(' ') : [];

			// Collect column metadata and detect ambiguous names
			const allCols: string[] = [];
			const allRelAliases: string[] = [];
			const allAltRelAliases: string[] = [];
			const blacklist = new Set<string>();
			const numCols = this._schema.getSize();

			if (numCols === 0) {
				// Nothing to try
				this.throwExecutionError(e.message);
			}

			// Track which alt var applies to each column (vars list maps by groups)
			let lastAlias = this._schema.getColumn(0).getRelAlias();
			let altIdx = 0;
			for (let i = 0; i < numCols; i++) {
				const col = this._schema.getColumn(i);
				if (col.getRelAlias() !== lastAlias) {
					lastAlias = col.getRelAlias();
					if (altIdx < vars.length - 1) altIdx++;
				}
				const name = String(col.getName());
				allCols.push(name);
				allRelAliases.push(col.getRelAlias() as string);
				allAltRelAliases.push(vars[altIdx] || '');
			}

			// mark ambiguous names (duplicates) so we won't try to re-alias them
			for (let a = 0; a < allCols.length; a++) {
				for (let b = a + 1; b < allCols.length; b++) {
					if (allCols[a] === allCols[b]) {
						blacklist.add(allCols[a]);
						break;
					}
				}
			}

			// Candidate columns: non-ambiguous and where relAlias differs from alt
			const candidates: number[] = [];
			for (let i = 0; i < allCols.length; i++) {
				if (!blacklist.has(allCols[i]) && allRelAliases[i] !== allAltRelAliases[i]) {
					candidates.push(i);
				}
			}

			if (candidates.length === 0) {
				// nothing to try
				this.throwExecutionError(e.message);
			}

			const m = candidates.length;
			const totalCombinations = (1 << m) - 1; // exclude empty set
			const MAX_COMBINATIONS = 1000000; // safe cap
			const MAX_TIME_MS = 3000; // timeout for this search
			if (totalCombinations > MAX_COMBINATIONS) {
				this.throwExecutionError(`Aborted: too many alias combinations (${totalCombinations})`);
			}

			let schemaWorked = false;
			const start = Date.now();
			let tried = 0;
			const logEvery = 1000;

			const subsets = 1 << m;
			for (let mask = 1; mask < subsets; mask++) {
				// Abort on timeout
				if ((++tried % logEvery) === 0) {
					const elapsed = Date.now() - start;
					console.log(`[Selection alias retry] tried ${tried}/${totalCombinations} combos in ${elapsed}ms`);
					if (elapsed > MAX_TIME_MS) {
						this.throwExecutionError('Aborted: alias combination search timed out');
					}
				}

				// Copy schema only once per mask
				let newSchema = this._schema.copy();
				let failed = false;

				for (let bit = 0; bit < m; bit++) {
					if ((mask & (1 << bit)) === 0) continue;
					const colPos = candidates[bit];
					try {
						newSchema.setRelAlias(String(allAltRelAliases[colPos]), colPos);
					}
					catch (err) {
						failed = true;
						break;
					}
				}
				if (failed) continue;

				try {
					this._condition.check(newSchema);
					schemaWorked = true;
					break;
				}
				catch (err) {
					// not working, try next
				}
			}

			if (!schemaWorked) {
				this.throwExecutionError(e.message);
			}
		}

		if (this._condition.getDataType() !== 'boolean') {
			this.throwExecutionError(i18n.t('db.messages.exec.error-condition-must-be-boolean'));
		}
	}

	getArgumentHtml() {
		return this._condition.getFormulaHtml();
	}
}
