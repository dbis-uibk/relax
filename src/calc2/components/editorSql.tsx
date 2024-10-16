/*** Copyright 2018 Johannes Kessler
*
* This Source Code Form is subject to the terms of the Mozilla Public
* License, v. 2.0. If a copy of the MPL was not distributed with this
* file, You can obtain one at http://mozilla.org/MPL/2.0/. */

import { IconProp } from '@fortawesome/fontawesome-svg-core';
import { faExternalLinkAlt } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { EditorBase, getColumnNamesFromRaRoot, getHintsFromGroup } from 'calc2/components/editorBase';
import { Result } from 'calc2/components/result';
import { Item } from 'calc2/components/toolbar';
import { t } from 'calc2/i18n';
import { Group } from 'calc2/store/groups';
import * as CodeMirror from 'codemirror';
import { Relation } from 'db/exec/Relation';
import { parseSQLSelect, relalgFromSQLAstRoot, replaceVariables } from 'db/relalg';
import * as React from 'react';

const NUM_TREE_LABEL_COLORS = 6;
const KEYWORDS_SQL = [
	'distinct', 'select distinct', 'from', 'where', 'order by', 'asc', 'desc',
	'inner join', 'inner', 'join', 'natural', 'union', 'intersect', 'outer join', 'natural join', 'left join', 'right join', 'left outer join',
	'right outer join', 'full outer join', 'group by', 'having', 'limit', 'offset',
	'and', 'or', 'xor', '||',
];

interface Props {
	group: Group,
	replaceSelection?(text: string): void,
	relInsertModalToggle: Function,
}

export class EditorSql extends React.Component<Props> {
	private editorBase: EditorBase | null = null;

	constructor(props: Props) {
		super(props);

		this.replaceText = this.replaceText.bind(this);
	}

	render() {
		const autoreplaceOperatorsMode: 'none' | 'header' | 'plain2math' | 'math2plain' = 'none';
		const { group } = this.props;
		// TODO: move to state
		const relations: { [name: string]: Relation } = {};
		group.tables.forEach(table => {
			relations[table.tableName] = table.relation;
		});

		
		return (
			<EditorBase
				textChange={(cm: CodeMirror.Editor) => { } }
				exampleSql={group.exampleSQL}
				exampleBags={group.exampleBags}
				exampleRA={group.exampleRA}
				ref={ref => {
					if (ref) {
						this.editorBase = ref;
					}
				}}
				mode="text/x-mysql"
				// @ts-ignore
				execFunction={(self: EditorBase, text: string, offset) => {
					const ast = parseSQLSelect(text);
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
			
					if (root) {
						root.check();
						

						self.historyAddEntry(text);

						// calc.displayRaResult(root);
						return {
							result: (
								<Result
									editorRef={this.editorBase!}
									root={root}
									numTreeLabelColors={NUM_TREE_LABEL_COLORS}
									execTime={self.state.execTime == null ? 0 : self.state.execTime}
									// TODO: SQL does support duplicates
									doEliminateDuplicates={true}
								/>
							),
						};
					}
					
		
				}}
				tab="sql"
				linterFunction={(self: EditorBase, editor: CodeMirror.Editor, text: string) => {
					const hints = [];


					const ast = parseSQLSelect(text);
					replaceVariables(ast, relations);

					for (let i = 0; i < ast.assignments.length; i++) {
						hints.push(ast.assignments[i].name);
					}

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

					// use columns from all calculated schemas for hints
					return hints.concat(getColumnNamesFromRaRoot(root));
				}}
				getHintsFunction={() => {
					const hints: string[] = [
						...KEYWORDS_SQL,

						// add table and column names
						...getHintsFromGroup(group),
					];
					return hints;
				}}
				enableInlineRelationEditor={true}
				toolbar={[
					{
						math: false,
						items: [
							{
								label: 'select',
								tooltipTitle: 'calc.editors.sql.toolbar.select',
								tooltip: 'calc.editors.sql.toolbar.select',
								onClick: item => this.replaceText(item, 'select distinct'),
							},
							{
								label: 'from',
								onClick: this.replaceText,
								tooltipTitle: 'calc.editors.sql.toolbar.from',
								tooltip: 'calc.editors.sql.toolbar.from',
							},
							{
								label: 'where',
								onClick: this.replaceText,
								tooltipTitle: 'calc.editors.sql.toolbar.where',
								tooltip: 'calc.editors.sql.toolbar.where',
							},
							{
								label: 'group',
								tooltipTitle: 'calc.editors.sql.toolbar.group-by',
								tooltip: 'calc.editors.sql.toolbar.group-by',
								onClick: item => this.replaceText(item, 'group by'),
							},
							{
								label: 'having',
								onClick: this.replaceText,
								tooltipTitle: 'calc.editors.sql.toolbar.having',
								tooltip: 'calc.editors.sql.toolbar.having',
							},
							{
								label: 'order',
								tooltipTitle: 'calc.editors.sql.toolbar.order-by',
								tooltip: 'calc.editors.sql.toolbar.order-by',
								onClick: item => this.replaceText(item, 'order by'),
							},
							{
								label: 'limit',
								onClick: this.replaceText,
								tooltipTitle: 'calc.editors.sql.toolbar.limit',
								tooltip: 'calc.editors.sql.toolbar.limit',
							},
							{
								label: <FontAwesomeIcon className="showOnSM" icon={faExternalLinkAlt  as IconProp} />,
								onClick: item => this.props.relInsertModalToggle,
								tooltipTitle: 'calc.editors.insert-relation-title',
								tooltip: 'calc.editors.insert-relation-tooltip',
							},
						],
					},
					{
						math: true,
						items: [
							{
								label: <i className="fa fa-calendar" />,
								onClick: item => this.replaceText(item, `date('1970-01-01')`),
								tooltipTitle: 'calc.editors.sql.toolbar.insert-date',
								tooltip: 'calc.editors.sql.toolbar.insert-date-content',
							},
						],
					},
				]}
			/>
		);
	}

	private replaceText(item: Item, overwrite?: string) {
		if (this.editorBase) {
			this.editorBase.replaceText(item, overwrite);
		}
	}

	public replaceSelection(text: string, overwrite?: string) {
		if (this.editorBase) {
			this.editorBase.replaceSelection(text, overwrite);
		}
	}
}
