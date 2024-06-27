/*** Copyright 2018 Johannes Kessler
*
* This Source Code Form is subject to the terms of the Mozilla Public
* License, v. 2.0. If a copy of the MPL was not distributed with this
* file, You can obtain one at http://mozilla.org/MPL/2.0/. */

import { EditorBase, getColumnNamesFromRaRoot, getHintsFromGroup } from 'calc2/components/editorBase';
import { Result } from 'calc2/components/result';
import { Item } from 'calc2/components/toolbar';
import { t, T } from 'calc2/i18n';
import { Group } from 'calc2/store/groups';
import * as CodeMirror from 'codemirror';
import { Relation } from 'db/exec/Relation';
import { AutoreplaceOperatorsMode, parseRelalg, queryWithReplacedOperatorsFromAst, relalgFromRelalgAstRoot, replaceVariables } from 'db/relalg';
import * as React from 'react';
import { faCalendarAlt, faTable, faMagic, faExternalLinkAlt, faPaste } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IconProp } from '@fortawesome/fontawesome-svg-core';

const NUM_TREE_LABEL_COLORS = 6;
export const KEYWORDS_RELALG = [
	'delta', 'pi', 'sigma', 'rho', 'tau', '<-', 'intersect', 'union', '/', '-', '\\', 'x', 'cross join', 'join',
	'inner join', 'natural join', 'left join', 'right join', 'left outer join',
	'right outer join', 'full outer join', 'left semi join', 'right semi join', 'anti join',
	'and', 'or', 'xor', '||',
];

type Props = {
	group: Group,
	relInsertModalToggle: Function,
};
type State = {
	autoreplaceOperatorsMode: AutoreplaceOperatorsMode,
};


export class EditorBagalg extends React.Component<Props, State> {
	private editorBase: EditorBase | null = null;

	constructor(props: Props) {
		super(props);

		this.state = {
			autoreplaceOperatorsMode: 'none',
		};

		this.replaceText = this.replaceText.bind(this);
	}

	
	
	

	render() {
		const { group } = this.props;
		const { autoreplaceOperatorsMode } = this.state;
		// TODO: move to state
		const relations: { [name: string]: Relation } = {};
		group.tables.forEach(table => {
			relations[table.tableName] = table.relation;
		});

		return (
			<EditorBase
				exampleBags={group.exampleBags}
				exampleRA={group.exampleRA}
				exampleSql={group.exampleSQL}
				textChange={(cm: CodeMirror.Editor) => { } }
				ref={ref => {
					if (ref) {
						this.editorBase = ref;
					}
				}}
				mode="bagalg"
				execFunction={(self: EditorBase, text: string, offset) => {
					const ast = parseRelalg(text, Object.keys(relations), false);
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


					self.historyAddEntry(text);

					if (self.props.enableInlineRelationEditor) {
						self.addInlineRelationMarkers(ast);
					}

					// calc.displayRaResult(root);
					return {
						result: (
							<Result
								root={root}
								numTreeLabelColors={NUM_TREE_LABEL_COLORS}
								execTime={self.state.execTime == null ? 0 : self.state.execTime}
								doEliminateDuplicates={false}
							/>
						),
					};
				}}
				tab="bagalg"
				linterFunction={(self: EditorBase, editor: CodeMirror.Editor, text: string) => {
					const hints = [];

					const ast = parseRelalg(text, Object.keys(relations), false);
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


					const root = relalgFromRelalgAstRoot(ast, relations);
					root.check();

					// replace text (text-magic)
					if (editor.getDoc().somethingSelected() === false) {
						const cursorOld: { line: number, ch: number } = editor.getDoc().getCursor();
						const { query, cursor } = queryWithReplacedOperatorsFromAst(text, ast.operatorPositions, { line: cursorOld.line + 1, column: cursorOld.ch + 1 }, autoreplaceOperatorsMode);
						if (query !== text) {
							editor.setValue(query);
							editor.getDoc().setCursor({ line: cursor.line - 1, ch: cursor.column - 1 });
						}
					}


					if (self.props.enableInlineRelationEditor) {
						self.addInlineRelationMarkers(ast);
					}

					// use columns from all calculated schemas for hints
					return hints.concat(getColumnNamesFromRaRoot(root));
				}}
				getHintsFunction={() => {
					const hints: string[] = [
						...KEYWORDS_RELALG,

						// add table and column names
						...getHintsFromGroup(group),
					];
					return hints;
				}}
				enableInlineRelationEditor={true}
				toolbar={[
					{
						math: true,
						items: [
							{
								label: 'π',
								onClick: this.replaceText,
								tooltipTitle: 'calc.editors.ra.toolbar.projection',
								tooltip: 'calc.editors.ra.toolbar.projection-content',
							},
							{
								label: 'σ',
								onClick: this.replaceText,
								tooltipTitle: 'calc.editors.ra.toolbar.selection',
								tooltip: 'calc.editors.ra.toolbar.selection-content',
							},
							{
								label: 'ρ',
								onClick: this.replaceText,
								tooltipTitle: 'calc.editors.ra.toolbar.rename',
								tooltip: 'calc.editors.ra.toolbar.rename-content',
							},
							{
								label: '←',
								onClick: this.replaceText,
								tooltipTitle: 'calc.editors.ra.toolbar.rename-columns-operator',
								tooltip: 'calc.editors.ra.toolbar.rename-columns-operator-content',
							},
							{
								label: '→',
								onClick: this.replaceText,
								tooltipTitle: 'calc.editors.ra.toolbar.right-arrow',
								tooltip: 'calc.editors.ra.toolbar.right-arrow-content',
							},
							{
								label: 'τ',
								onClick: this.replaceText,
								tooltipTitle: 'calc.editors.ra.toolbar.orderBy',
								tooltip: 'calc.editors.ra.toolbar.orderBy-content',
							},
							{
								label: 'γ',
								onClick: this.replaceText,
								tooltipTitle: 'calc.editors.ra.toolbar.groupBy',
								tooltip: 'calc.editors.ra.toolbar.groupBy-content',
							},
						],
					},
					{
						math: true,
						items: [
							{
								label: '∧',
								onClick: this.replaceText,
								tooltipTitle: 'calc.editors.ra.toolbar.and',
								tooltip: 'calc.editors.ra.toolbar.and-content',
							},
							{
								label: '∨',
								onClick: this.replaceText,
								tooltipTitle: 'calc.editors.ra.toolbar.or',
								tooltip: 'calc.editors.ra.toolbar.or-content',
							},
							{
								label: '¬',
								onClick: this.replaceText,
								tooltipTitle: 'calc.editors.ra.toolbar.not',
								tooltip: 'calc.editors.ra.toolbar.not-content',
							},

							{
								label: '=',
								onClick: this.replaceText,
								tooltipTitle: 'calc.editors.ra.toolbar.equals',
								tooltip: 'calc.editors.ra.toolbar.equals-content',
							},
							{
								label: '≠',
								onClick: this.replaceText,
								tooltipTitle: 'calc.editors.ra.toolbar.not-equals',
								tooltip: 'calc.editors.ra.toolbar.not-equals-content',
							},
							{
								label: '≥',
								onClick: this.replaceText,
								tooltipTitle: 'calc.editors.ra.toolbar.greater-or-equals',
								tooltip: 'calc.editors.ra.toolbar.greater-or-equals-content',
							},
							{
								label: '≤',
								onClick: this.replaceText,
								tooltipTitle: 'calc.editors.ra.toolbar.lesser-or-equals',
								tooltip: 'calc.editors.ra.toolbar.lesser-or-equals-content',
							},
						],
					},
					{
						math: true,
						items: [
							{
								label: '∩',
								onClick: this.replaceText,
								tooltipTitle: 'calc.editors.ra.toolbar.intersect',
								tooltip: 'calc.editors.ra.toolbar.intersect-content',
							},
							{
								label: '∪',
								onClick: this.replaceText,
								tooltipTitle: 'calc.editors.ra.toolbar.union',
								tooltip: 'calc.editors.ra.toolbar.union-content',
							},
							{
								label: '÷',
								onClick: this.replaceText,
								tooltipTitle: 'calc.editors.ra.toolbar.division',
								tooltip: 'calc.editors.ra.toolbar.division-content',
							},
							{
								label: '-',
								onClick: this.replaceText,
								tooltipTitle: 'calc.editors.ra.toolbar.subtraction',
								tooltip: 'calc.editors.ra.toolbar.subtraction-content',
							},
						],
					},
					{
						math: true,
						items: [
							{
								label: '⨯',
								onClick: this.replaceText,
								tooltipTitle: 'calc.editors.ra.toolbar.cross-join',
								tooltip: 'calc.editors.ra.toolbar.cross-join-content',
							},
							{
								label: '⨝',
								onClick: this.replaceText,
								tooltipTitle: 'calc.editors.ra.toolbar.natural-join',
								tooltip: 'calc.editors.ra.toolbar.natural-join-content',
							},
							{
								label: '⟕',
								onClick: this.replaceText,
								tooltipTitle: 'calc.editors.ra.toolbar.left-outer-join',
								tooltip: 'calc.editors.ra.toolbar.left-outer-join-content',
							},
							{
								label: '⟖',
								onClick: this.replaceText,
								tooltipTitle: 'calc.editors.ra.toolbar.right-outer-join',
								tooltip: 'calc.editors.ra.toolbar.right-outer-join-content',
							},
							{
								label: '⟗',
								onClick: this.replaceText,
								tooltipTitle: 'calc.editors.ra.toolbar.full-outer-join',
								tooltip: 'calc.editors.ra.toolbar.full-outer-join-content',
							},
							{
								label: '⋉',
								onClick: this.replaceText,
								tooltipTitle: 'calc.editors.ra.toolbar.left-semi-join',
								tooltip: 'calc.editors.ra.toolbar.left-semi-join-content',
							},
							{
								label: '⋊',
								onClick: this.replaceText,
								tooltipTitle: 'calc.editors.ra.toolbar.right-semi-join',
								tooltip: 'calc.editors.ra.toolbar.right-semi-join-content',
							},
							{
								label: '▷',
								onClick: this.replaceText,
								tooltipTitle: 'calc.editors.ra.toolbar.anti-join',
								tooltip: 'calc.editors.ra.toolbar.anti-join-content',
							},
							{
								label: '∂',
								onClick: this.replaceText,
								tooltipTitle: 'calc.editors.ra.toolbar.duplicate-elimination',
								tooltip: 'calc.editors.ra.toolbar.duplicate-elimination-content',
							},
						],
					},
					{
						math: true,
						items: [
							{
								label: '=',
								onClick: item => this.replaceText(item, '= '),
								tooltipTitle: 'calc.editors.ra.toolbar.assignment',
								tooltip: 'calc.editors.ra.toolbar.assignment-content',
							},
							{
								label: '--',
								onClick: item => this.replaceText(item, '-- '),
								tooltipTitle: 'calc.editors.ra.toolbar.single-line-comment',
								tooltip: 'calc.editors.ra.toolbar.single-line-comment-content',
							},
							{
								label: '/*',
								onClick: item => this.replaceText(item, '/*  */'),
								tooltipTitle: 'calc.editors.ra.toolbar.multi-line-comment',
								tooltip: 'calc.editors.ra.toolbar.multi-line-comment-content',
							},
							{
								label: '{}',
								onClick: item => this.replaceText(item, '{a:string, b:number, X.c:date\n\ta, 1, 1970-01-01\n}'),
								tooltipTitle: 'calc.editors.ra.toolbar.inline-relation',
								tooltip: 'calc.editors.ra.toolbar.inline-relation-content',
							},
						],
					},
					{
						items: [
							{
								label: <FontAwesomeIcon icon={faTable as IconProp} />,
								onClick: () => {
									if (this.editorBase) {
										this.editorBase.inlineRelationEditorOpen(null);
									}
								},
								tooltipTitle: 'calc.editors.ra.toolbar.inline-relation-editor',
								tooltip: 'calc.editors.ra.toolbar.inline-relation-editor-content',
							},
							{
								label: <FontAwesomeIcon icon={faCalendarAlt  as IconProp} />,
								onClick: item => this.replaceText(item, `date('1970-01-01')`),
								tooltipTitle: 'calc.editors.ra.toolbar.insert-date',
								tooltip: 'calc.editors.ra.toolbar.insert-date-content',
							},
							{
								className: 'showOnSM',
								label: <FontAwesomeIcon className="editorButtonOnSM" icon={faPaste as IconProp} />,
								onClick:  () => { this.props.relInsertModalToggle(); },
								tooltipTitle: 'calc.editors.insert-relation-title',
								tooltip: 'calc.editors.insert-relation-tooltip',
							},
						],
					},
					{
						items: [
							{
								className: 'dropdownToolbarButton',
								type: 'dropdown',
								label: <FontAwesomeIcon className="editorButtonOnSM" icon={faMagic  as IconProp} />,
								tooltipTitle: 'calc.editors.ra.toolbar.autoreplace-operators.title',
								tooltip: 'calc.editors.ra.toolbar.autoreplace-operators.header',
								elements: [
									{
										type: 'header',
										label: <T id="calc.editors.ra.toolbar.autoreplace-operators.header" />,
									},
									{
										type: 'separator',
									},
									{
										label: <T id="calc.editors.ra.toolbar.autoreplace-operators.none" />,
										value: 'none',
									},
									{
										label: <T id="calc.editors.ra.toolbar.autoreplace-operators.plain2math" />,
										value: 'plain2math',
									},
									{
										label: <T id="calc.editors.ra.toolbar.autoreplace-operators.math2plain" />,
										value: 'math2plain',
									},
								],
								value: autoreplaceOperatorsMode,
								onChange: (value: string) => {
									this.setState({
										autoreplaceOperatorsMode: value as AutoreplaceOperatorsMode,
									}, () => {
										if(this.editorBase){
											this.editorBase.forceLinterRun();
										}
									});
								},
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
