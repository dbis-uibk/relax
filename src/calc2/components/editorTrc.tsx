import React from "react";
import { t, T } from "calc2/i18n";
import { EditorBase, getHintsFromGroup, getInitialQueryExecTimeout } from "./editorBase";
import { Item } from "./toolbar";
import { Group } from "calc2/store/groups";
import { Relation } from "db/exec/Relation";
import { Result } from "./result";
import {
	relalgFromTRCAstRoot,
	parseTRCSelect,
	AutoreplaceOperatorsMode,
	queryWithReplacedTRCOperatorsFromAst,
} from "db/relalg";
import { faCalendarAlt, faMagic } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { IconProp } from "@fortawesome/fontawesome-svg-core";
// worker import
// @ts-ignore
import editorTrcWorker from "./editorTrc.worker";
import { RANode } from "db/exec/RANode";
import { EditorBaseWorker } from "./editorBaseWorker";

const NUM_TREE_LABEL_COLORS = 6;
const KEYWORDS_TRC = [
	"in",
	"and",
	"or",
	"xor",
	"not",
	"implies",
	"iff",
	"exists",
	"for all",
];

interface Props {
	group: Group;
	replaceSelection?(text: string): void;
	// relInsertModalToggle: Function,
}

type State = {
	autoreplaceOperatorsMode: AutoreplaceOperatorsMode;
	groupName: string;
	relations: { [name: string]: Relation };
};

export class EditorTrc extends React.Component<Props, State> {
	private editorBase: EditorBase | null = null;
	static editorWorker = new EditorBaseWorker<ReturnType<typeof parseTRCSelect>>(
		editorTrcWorker
	);
	constructor(props: Props) {
		super(props);

		this.state = {
			autoreplaceOperatorsMode: "none",
			groupName: props.group.groupName.fallback,
			relations: props.group.tables.reduce((acc, table) => {
				acc[table.tableName] = table.relation;
				return acc;
			}, {} as { [name: string]: Relation }),
		};

		this.replaceText = this.replaceText.bind(this);
		EditorTrc.editorWorker.cacheRelations(
			this.state.groupName,
			this.state.relations
		);
	}

	componentWillUnmount(): void {
		EditorTrc.editorWorker.terminateWorker();
	}

	componentDidMount(): void {
		if (!EditorTrc.editorWorker.worker) {
			EditorTrc.editorWorker.reinitializeWorker();
		}
	}

	static getDerivedStateFromProps(
		nextProps: Props,
		prevState: State
	): State | null {
		if (prevState.groupName === nextProps.group.groupName.fallback) {
			return null;
		} else {
			const updatedState = {
				...prevState,
				relations: nextProps.group.tables.reduce((acc, table) => {
					acc[table.tableName] = table.relation;
					return acc;
				}, {} as { [name: string]: Relation }),
				groupName: nextProps.group.groupName.fallback,
			};
			EditorTrc.editorWorker.cacheRelations(
				updatedState.groupName,
				updatedState.relations
			);
			return updatedState;
		}
	}

	render() {
		const { group } = this.props;
		const { autoreplaceOperatorsMode } = this.state;
		// TODO: move to state
		const relations: { [name: string]: Relation } = {};
		group.tables.forEach((table) => {
			relations[table.tableName] = table.relation;
		});

		return (
			<EditorBase
				editQueryTimeout
				queryTimeout={getInitialQueryExecTimeout()}
				textChange={(cm: CodeMirror.Editor) => {}}
				exampleSql={group.exampleSQL}
				exampleRA={group.exampleRA}
				ref={(ref) => {
					if (ref) {
						this.editorBase = ref;
					}
				}}
				mode="trc"
				// @ts-ignore
				execFunction={async (self: EditorBase, text: string, offset) => {
					self.historyAddEntry(text);
					let ast: ReturnType<typeof parseTRCSelect>;
					let root: RANode;
					if (EditorTrc.editorWorker.worker) {
						const resp = await EditorTrc.editorWorker.exec(
							text,
							this.state.groupName,
							true,
							this.editorBase?.getQueryTimeout()
						);
						ast = resp.ast;
						root = resp.root;
					} else {
						ast = parseTRCSelect(text);
						root = relalgFromTRCAstRoot(ast, relations);

						root.check();
					}

					return {
						result: (
							<Result
								editorRef={this.editorBase!}
								root={root}
								numTreeLabelColors={NUM_TREE_LABEL_COLORS}
								execTime={self.state.execTime == null ? 0 : self.state.execTime}
								doEliminateDuplicates={true}
							/>
						),
					};
				}}
				tab="trc"
				linterFunction={async (
					self: EditorBase,
					editor: CodeMirror.Editor,
					text: string
				) => {
					let ast: ReturnType<typeof parseTRCSelect>;
					let root: RANode;
					if (EditorTrc.editorWorker.worker) {
						const resp = await EditorTrc.editorWorker.exec(
							text,
							this.state.groupName,
							false,
							this.editorBase?.getQueryTimeout()
						);
						ast = resp.ast;
						root = resp.root;
					} else {
						ast = parseTRCSelect(text);
						root = relalgFromTRCAstRoot(ast, relations);
						root.check();
					}

					// replace text (text-magic)
					if (editor.getDoc().somethingSelected() === false) {
						const cursorOld: { line: number; ch: number } = editor
							.getDoc()
							.getCursor();
						const { query, cursor } = queryWithReplacedTRCOperatorsFromAst(
							text,
							{ line: cursorOld.line + 1, column: cursorOld.ch + 1 },
							autoreplaceOperatorsMode
						);
						if (query !== text) {
							editor.setValue(query);
							editor
								.getDoc()
								.setCursor({ line: cursor.line - 1, ch: cursor.column - 1 });
						}
					}

					return [];
				}}
				getHintsFunction={() => {
					const hints: string[] = [
						...KEYWORDS_TRC,

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
								label: "{}",
								onClick: (item) => this.replaceText(item, "{ }"),
								tooltipTitle: "calc.editors.trc.toolbar.expression",
								tooltip: "calc.editors.trc.toolbar.expression-content",
							},
						],
					},
					{
						math: true,
						items: [
							{
								label: "∈",
								tooltipTitle: "calc.editors.trc.toolbar.membership",
								tooltip: "calc.editors.trc.toolbar.membership-content",
								onClick: (item) => this.replaceText(item, "∈"),
							},
						],
					},
					{
						math: true,
						items: [
							{
								label: "←",
								tooltipTitle: "calc.editors.trc.toolbar.left-arrow",
								tooltip: "calc.editors.trc.toolbar.left-arrow-content",
								onClick: (item) => this.replaceText(item, "←"),
							},
							{
								label: "→",
								tooltipTitle: "calc.editors.trc.toolbar.right-arrow",
								tooltip: "calc.editors.trc.toolbar.right-arrow-content",
								onClick: (item) => this.replaceText(item, "→"),
							},
						],
					},
					{
						math: true,
						items: [
							{
								label: "∧",
								tooltipTitle: "calc.editors.trc.toolbar.and",
								tooltip: "calc.editors.trc.toolbar.and-content",
								onClick: (item) => this.replaceText(item, "∧"),
							},
							{
								label: "∨",
								tooltipTitle: "calc.editors.trc.toolbar.or",
								tooltip: "calc.editors.trc.toolbar.or-content",
								onClick: (item) => this.replaceText(item, "∨"),
							},
							{
								label: "⊻",
								tooltipTitle: "calc.editors.trc.toolbar.xor",
								tooltip: "calc.editors.trc.toolbar.xor-content",
								onClick: (item) => this.replaceText(item, "⊻"),
							},
							{
								label: "¬",
								tooltipTitle: "calc.editors.trc.toolbar.not",
								tooltip: "calc.editors.trc.toolbar.not-content",
								onClick: (item) => this.replaceText(item, "¬"),
							},
							{
								label: "⇒",
								tooltipTitle: "calc.editors.trc.toolbar.implies",
								tooltip: "calc.editors.trc.toolbar.implies-content",
								onClick: (item) => this.replaceText(item, "⇒"),
							},
							{
								label: "⇔",
								tooltipTitle: "calc.editors.trc.toolbar.equivalence",
								tooltip: "calc.editors.trc.toolbar.equivalence-content",
								onClick: (item) => this.replaceText(item, "⇔"),
							},
						],
					},
					{
						math: true,
						items: [
							{
								label: "=",
								onClick: this.replaceText,
								tooltipTitle: "calc.editors.trc.toolbar.equals",
								tooltip: "calc.editors.trc.toolbar.equals-content",
							},
							{
								label: "≠",
								onClick: this.replaceText,
								tooltipTitle: "calc.editors.trc.toolbar.not-equals",
								tooltip: "calc.editors.trc.toolbar.not-equals-content",
							},
							{
								label: "<",
								onClick: this.replaceText,
								tooltipTitle: "calc.editors.trc.toolbar.lesser",
								tooltip: "calc.editors.trc.toolbar.lesser-content",
							},
							{
								label: ">",
								onClick: this.replaceText,
								tooltipTitle: "calc.editors.trc.toolbar.greater",
								tooltip: "calc.editors.trc.toolbar.greater-content",
							},
							{
								label: "≤",
								onClick: this.replaceText,
								tooltipTitle: "calc.editors.trc.toolbar.lesser-or-equals",
								tooltip: "calc.editors.trc.toolbar.lesser-or-equals-content",
							},
							{
								label: "≥",
								onClick: this.replaceText,
								tooltipTitle: "calc.editors.trc.toolbar.greater-or-equals",
								tooltip: "calc.editors.trc.toolbar.greater-or-equals-content",
							},
						],
					},
					{
						math: true,
						items: [
							{
								label: "∃",
								tooltipTitle: "calc.editors.trc.toolbar.exists",
								tooltip: "calc.editors.trc.toolbar.exists-content",
								onClick: (item) => this.replaceText(item, "∃"),
							},
							{
								label: "∀",
								tooltipTitle: "calc.editors.trc.toolbar.for-all",
								tooltip: "calc.editors.trc.toolbar.for-all-content",
								onClick: (item) => this.replaceText(item, "∀"),
							},
						],
					},
					{
						math: false,
						items: [
							{
								label: "--",
								onClick: (item) => this.replaceText(item, "-- "),
								tooltipTitle: "calc.editors.trc.toolbar.single-line-comment",
								tooltip: "calc.editors.trc.toolbar.single-line-comment-content",
							},
							{
								label: "/*",
								onClick: (item) => this.replaceText(item, "/*  */"),
								tooltipTitle: "calc.editors.trc.toolbar.multi-line-comment",
								tooltip: "calc.editors.trc.toolbar.multi-line-comment-content",
							},
							{
								label: <FontAwesomeIcon icon={faCalendarAlt as IconProp} />,
								onClick: (item) => this.replaceText(item, `date('1970-01-01')`),
								tooltipTitle: "calc.editors.trc.toolbar.insert-date",
								tooltip: "calc.editors.trc.toolbar.insert-date-content",
							},
						],
					},
					{
						items: [
							{
								className: "dropdownToolbarButton",
								type: "dropdown",
								label: (
									<FontAwesomeIcon
										className="editorButtonOnSM"
										icon={faMagic as IconProp}
									/>
								),
								tooltipTitle:
									"calc.editors.ra.toolbar.autoreplace-operators.title",
								tooltip: "calc.editors.ra.toolbar.autoreplace-operators.header",
								elements: [
									{
										type: "header",
										label: (
											<T id="calc.editors.ra.toolbar.autoreplace-operators.header" />
										),
									},
									{
										type: "separator",
									},
									{
										label: (
											<T id="calc.editors.trc.toolbar.autoreplace-operators.none" />
										),
										value: "none",
									},
									{
										label: (
											<T id="calc.editors.trc.toolbar.autoreplace-operators.plain2math" />
										),
										value: "plain2math",
									},
									{
										label: (
											<T id="calc.editors.trc.toolbar.autoreplace-operators.math2plain" />
										),
										value: "math2plain",
									},
								],
								value: autoreplaceOperatorsMode,
								onChange: (value: string) => {
									this.setState(
										{
											autoreplaceOperatorsMode:
												value as AutoreplaceOperatorsMode,
										},
										() => {
											if (this.editorBase) {
												this.editorBase.forceLinterRun();
											}
										}
									);
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
