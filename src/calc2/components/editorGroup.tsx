/*** Copyright 2018 Johannes Kessler
*
* This Source Code Form is subject to the terms of the Mozilla Public
* License, v. 2.0. If a copy of the MPL was not distributed with this
* file, You can obtain one at http://mozilla.org/MPL/2.0/. */

import { EditorBase, getHintsFromGroup } from 'calc2/components/editorBase';
import { KEYWORDS_RELALG } from 'calc2/components/editorRelalg';
import { T } from 'calc2/i18n';
import { Group, GroupInfo, SourceInfo } from 'calc2/store/groups';
import { getGroupsFromGroupAst } from 'calc2/utils/groupUtils';
import * as CodeMirror from 'codemirror';
import { Relation } from 'db/exec/Relation';
import { parseRelalgGroup } from 'db/relalg';
import * as React from 'react';
import Button from 'reactstrap/lib/Button';
import { faTable } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IconProp } from '@fortawesome/fontawesome-svg-core';

type Props = {
	group: Group,
	setDraft(draft: Group): void,
};

export class EditorGroup extends React.Component<Props> {
	private editorBase: EditorBase | null = null;
	autoParsingTimeout: any;

	constructor(props: Props) {
		super(props);
		this.autoParsingTimeout = null;
		this.replaceSelection = this.replaceSelection.bind(this);
	}

	static generateInfo(ast: relalgAst.GroupRoot): {
		groupInfo: GroupInfo,
		sourceInfo: SourceInfo,
	} {
		const groupInfo: GroupInfo = {
			source: 'local',
			id: 'draft',
			filename: 'draft',
			index: 0,
			maintainer: '',
			maintainerGroup: '',
		};
		const sourceInfo: SourceInfo = {};

		return { groupInfo, sourceInfo };
	}

	render() {
		const { group } = this.props;

		// TODO: move to state
		const relations: { [name: string]: Relation } = {};
		group.tables.forEach(table => {
			relations[table.tableName] = table.relation;
		});

		return (
			<EditorBase
				textChange={(cm: CodeMirror.Editor) => { } }
				ref={ref => {
					if (ref) {
						this.editorBase = ref;
					}
				}}
				mode="relalg"
				disableHistory={true}
				execButtonLabel="calc.editors.group.button-exec"
				execFunction={(self: EditorBase, text: string, offset) => {
					const groupAst = parseRelalgGroup(text);
					const { groupInfo, sourceInfo } = EditorGroup.generateInfo(groupAst);

					const groups = getGroupsFromGroupAst(groupAst, groupInfo, sourceInfo);
	

					// display result
					const result = (
						<>
							{groups.map((group, i) => {
								return (
									<div key={i}>
										<h4>{group.groupName.fallback} <Button color="link" onClick={() => { this.props.setDraft(group); }}><T id="calc.editors.group.button-use" /></Button></h4>
										<ul className="table-list">
											{group.tables.map((table, j) => {
												const __html = groups[i].tables[j].relation.getResult(false).getHtml(); // FIXME: render here!
												return (
													<li key={j}>
														<h5>{table.tableName}</h5>
														<div dangerouslySetInnerHTML={{ __html }} />
													</li>
												);
											})}
										</ul>
									</div>
								);

								// TODO: // result_container.find('table').addClass('table table-condensed');
							})}
						</>
					);

					groupAst.groups.forEach((group: any) => {
						self.addInlineRelationMarkers(group);
					});

					return {
						result,
					};
				}}
				tab="group"
				linterFunction={(self: EditorBase, editor: CodeMirror.Editor, text: string) => {
					const groupAst = parseRelalgGroup(text);
					
					groupAst.groups.forEach((group: any) => {
						self.addInlineRelationMarkers(group);
					});

					const { groupInfo, sourceInfo } = EditorGroup.generateInfo(groupAst);
					getGroupsFromGroupAst(groupAst, groupInfo, sourceInfo);
					return [];
				}}
				getHintsFunction={() => {
					const hints: string[] = [
						...KEYWORDS_RELALG,

						'group',
						'group@de',
						'group@en',
						'group@es',
						'description',
						'description@de',
						'description@en',
						'description@es',
						'category',
						'category@de',
						'category@en',
						'category@es',

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
							/*{
								label: <T id="calc.editors.group.toolbar.import-sql" />,
								onClick: () => {
									// TODO: implement
								},
								tooltipTitle: 'calc.editors.group.toolbar.import-sql',
								tooltip: 'calc.editors.group.toolbar.import-sql-content',
							},*/
							{
								label: <span><FontAwesomeIcon icon={faTable as IconProp}></FontAwesomeIcon> <T id="calc.editors.group.toolbar.add-new-relation" /></span>,
								onClick: () => {
									if (this.editorBase) {
										this.editorBase.inlineRelationEditorOpen(null);
									}
								},
								tooltipTitle: 'calc.editors.group.toolbar.add-new-relation',
								tooltip: 'calc.editors.group.toolbar.add-new-relation-content',
							},
						],
					},
				]}
			/>
		);
	}

	public replaceSelection(text: string, overwrite?: string) {
		if (this.editorBase) {
			this.editorBase.replaceSelection(text, overwrite);
		}
	}
}
