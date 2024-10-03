/*** Copyright 2018 Johannes Kessler
*
* This Source Code Form is subject to the terms of the Mozilla Public
* License, v. 2.0. If a copy of the MPL was not distributed with this
* file, You can obtain one at http://mozilla.org/MPL/2.0/. */

import * as React from 'react';
import * as store from 'calc2/store';
import { parseRelalg, relalgFromRelalgAstRoot, parseSQLSelect, relalgFromSQLAstRoot, replaceVariables } from 'db/relalg';
import { t } from 'calc2/i18n';
import { Group } from 'calc2/store/groups';
import { Relation } from 'db/exec/Relation';

type Props = {
	group: Group,
	locale: store.State['session']['locale'],
	params: any
};

type State = {};

export class Api extends React.Component<Props, State> {
	public mode: string = ""
	public query: string = ""
	public success: string = ""
	public result: string = ""

	constructor(props: Props) {
		super(props);
		this.state = {};
    this.mode = props.params.mode;
		// Fix issue of parsing + as a space
		// https://www.npmjs.com/package/query-string
		// https://github.com/sindresorhus/query-string/issues/305
		// https://stackoverflow.com/questions/2678551/when-to-encode-space-to-plus-or-20
		// https://stackoverflow.com/questions/3794919/replace-all-spaces-in-a-string-with
		this.query = atob(props.params.query.split(' ').join('+'))
	}

	componentDidMount() {
		this.runQuery(this.mode, this.query);
	}

	private runQuery(mode: string, query: string) {
		try {
			const { group } = this.props;
			const relations: { [name: string]: Relation } = {};
			group.tables.forEach(table => {
				relations[table.tableName] = table.relation;
			});

			let doEliminateDuplicates = true;

			switch (mode) {
				case 'sql': {
					const ast = parseSQLSelect(query);
					replaceVariables(ast, relations);

					if (ast.child === null) {
						if (ast.assignments.length > 0) {
							throw new Error(t('calc.messages.error-query-missing-assignments-found'));
						}
						else {
							throw new Error(t('calc.messages.error-query-missing'));
						}
					}

					const root = relalgFromSQLAstRoot(ast, relations);
					root.check();
					this.result = JSON.stringify(root.getResult(doEliminateDuplicates));
					this.success = "true";
					break;
				}
				case 'bagalg':
					doEliminateDuplicates = false;
				case 'relalg':
				default: {
					this.mode = 'relalg';
					const ast = parseRelalg(query, Object.keys(relations), doEliminateDuplicates);
					replaceVariables(ast, relations);
					if (ast.child === null) {
						if (ast.assignments.length > 0) {
							throw new Error(t('calc.messages.error-query-missing-assignments-found'));
						}
						else {
							throw new Error(t('calc.messages.error-query-missing'));
						}
					}
					const root = relalgFromRelalgAstRoot(ast, relations);
					root.check();
					this.result = JSON.stringify(root.getResult(doEliminateDuplicates))
					this.success = "true"
				}
			}
		} catch (e) {
			this.success = "false"
			this.result = e.toString()
		}
	}

	render() {
		return (
			<div id="apiContainer">
				<div id="success">{this.success}</div>
				<div id="mode">{this.mode}</div>
				<div id="query">{this.query}</div>
				<div id="result">{this.result}</div>
			</div>
		);
	}
}
