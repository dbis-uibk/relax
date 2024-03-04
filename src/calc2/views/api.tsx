/*** Copyright 2018 Johannes Kessler
*
* This Source Code Form is subject to the terms of the Mozilla Public
* License, v. 2.0. If a copy of the MPL was not distributed with this
* file, You can obtain one at http://mozilla.org/MPL/2.0/. */

import * as React from 'react';
import * as store from 'calc2/store';
import { parseRelalg, relalgFromRelalgAstRoot, replaceVariables } from 'db/relalg';
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
	public query: string = ""
	public success: string = ""
	public result: string = ""

	constructor(props: Props) {
		super(props);
		this.state = {};
		// Fix issue of parsing + as a space
		// https://www.npmjs.com/package/query-string
		// https://github.com/sindresorhus/query-string/issues/305
		// https://stackoverflow.com/questions/2678551/when-to-encode-space-to-plus-or-20
		// https://stackoverflow.com/questions/3794919/replace-all-spaces-in-a-string-with
		this.query = atob(props.params.query.split(' ').join('+'))
	}

	componentDidMount() {
		this.runQuery(this.query);
	}

	private runQuery(query: string) {
		try {
			const { group } = this.props;
			const relations: { [name: string]: Relation } = {};
			group.tables.forEach(table => {
				relations[table.tableName] = table.relation;
			});
			const ast = parseRelalg(query, Object.keys(relations));
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
			this.result = JSON.stringify(root.getResult())
			this.success = "true"
		} catch (e) {
			this.success = "false"
			this.result = e.toString()
		}
	}

	render() {
		return (
			<div id="apiContainer">
				<div id="success">{this.success}</div>
				<div id="query">{this.query}</div>
				<div id="result">{this.result}</div>
			</div>
		);
	}
}
