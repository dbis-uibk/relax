/*** Copyright 2018 Johannes Kessler
*
* This Source Code Form is subject to the terms of the Mozilla Public
* License, v. 2.0. If a copy of the MPL was not distributed with this
* file, You can obtain one at http://mozilla.org/MPL/2.0/. */

import { faArrowAltCircleDown, faHistory, faPlayCircle, faUpload, faDownload, faCheckCircle, faTimesCircle, faPlay, faTable, faCheck, faCalculator, faCheckSquare, faFileCsv, faTruckPickup, faFileDownload, faImage } from '@fortawesome/free-solid-svg-icons';
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { DropdownList } from 'calc2/components/dropdownList';
import { HistoryEntry } from 'calc2/components/history';
import { Group as ToolbarGroup, Item, Toolbar } from 'calc2/components/toolbar';
import { LanguageKeys, t, T } from 'calc2/i18n';
import { Group } from 'calc2/store/groups';
import classNames from 'classnames';
import * as CodeMirror from 'codemirror';
import 'codemirror/addon/hint/show-hint';
import { RANode, RANodeBinary, RANodeUnary } from 'db/exec/RANode';
import { executeRelalg, parseRelalg, textFromRelalgAstRoot } from 'db/relalg';
import { forEachPreOrder } from 'db/translate/utils';
import * as React from 'react';
import { findDOMNode } from 'react-dom';
import { toast } from 'react-toastify';
import { Button, Modal, ModalBody, ModalFooter, ModalHeader, Input } from 'reactstrap';
import { HotTable } from '@handsontable/react';
import * as ReactDOM from 'react-dom';
import Handsontable from 'handsontable';
import memoize from 'memoize-one';

import html2canvas from 'html2canvas';
import { data } from 'jquery';

require('codemirror/lib/codemirror.css');
require('codemirror/theme/eclipse.css');
require('codemirror/addon/hint/show-hint.css');
require('codemirror/addon/lint/lint.js');
require('codemirror/addon/lint/lint.css');
require('codemirror/addon/display/placeholder.js');
require('codemirror/addon/display/autorefresh.js');
require('codemirror/mode/sql/sql.js');
require('handsontable/dist/handsontable.full.css');

CodeMirror.defineMode('relalg', function () {
	const keywords = [
		'pi', 'sigma', 'rho', 'tau', '<-', '->', 'intersect', 'union', 'except', '/', '-', '\\\\', 'x', 'cross join', 'join',
		'inner join', 'natural join', 'left join', 'right join', 'left outer join', 'right outer join',
		'left semi join', 'right semi join', 'anti join', 'anti semi join', 'and', 'or', 'xor',
	];
	const keywordsMath = ['π', 'σ', 'ρ', 'τ', '←', '→', '∩', '∪', '÷', '-', '⨯', '⨝', '⟕', '⟖', '⟗', '⋉', '⋊', '▷'];
	const operators = ['<-', '->', '>=', '<=', '=', '∧', '∨', '⊻', '⊕', '≠', '=', '¬', '>', '<', '≥', '≤'];
	const matchAny = (
		stream: CodeMirror.StringStream,
		array: string[],
		consume: boolean,
		successorPattern = '',
	) => {
		for (let i = 0; i < array.length; i++) {
			const match = (
				!successorPattern
					? stream.match(array[i], consume)
					: stream.match(new RegExp(`^${array[i]}${successorPattern}`), consume)
			);

			if (match) {
				return true;
			}
		}
		return false;
	};
	const separators = '([\\(\\)\[\\]\{\\}, \\.\\t]|$)';

	return {
		startState: () => {
			return {
				inBlockComment: false,
			};
		},
		token: (stream: CodeMirror.StringStream, state) => {
			if (state.inBlockComment) {
				if (stream.match(/.*?\*\//, true)) {
					state.inBlockComment = false;
				}
				else {
					stream.match(/.*/, true);
				}
				return 'comment';
			}
			else if (stream.match(/\/\*.*?\*\//, true)) {
				return 'comment';
			}
			else if (!state.inBlockComment && stream.match(/^\/\*.*/, true)) {
				state.inBlockComment = true;
				return 'comment';
			}

			else if (state.inInlineRelation) {
				if (stream.match(/.*?}/, true)) {
					state.inInlineRelation = false;
				}
				else {
					stream.match(/.*/, true);
				}
				return 'inlineRelation';
			}
			else if (stream.match(/^{/, true)) {
				state.inInlineRelation = true;
				return 'inlineRelation';
			}

			else if (stream.match(/^--[\t ]/, true)) {
				stream.skipToEnd();
				return 'comment';
			}
			else if (stream.match(/^\/\*.*?$/, true)) {
				return 'comment';
			}
			else if (matchAny(stream, keywordsMath, true)) {
				return 'keyword math'; // needed for the correct font
			}
			else if (matchAny(stream, keywords, true, separators)) {
				return 'keyword';
			}
			else if (matchAny(stream, operators, true)) {
				return 'operator math';
			}
			else if (stream.match(/^\[[0-9]+]/, true)) {
				return 'attribute';
			}
			else if (stream.match(/^[0-9]+(\.[0-9]+)?/, true)) {
				return 'number';
			}
			else if (stream.match(/\^'[^']*'/i, true)) {
				return 'string';
			}
			else if (stream.match(/\^[a-z]+\.[a-z]*/i, true)) {
				return 'qualified-column';
			}
			else if (stream.match(/^[\(\)\[]\{},]/i, true)) {
				return 'bracket';
			}
			else if (stream.match(/^[a-z][a-z0-9\.]*/i, true)) {
				return 'word';
			}
			else {
				stream.next();
				return 'else';
			}
		},
	};
});

CodeMirror.defineMode('bagalg', function () {
	const keywords = [
		'delta', 'pi', 'sigma', 'rho', 'tau', '<-', '->', 'intersect', 'union', 'except', '/', '-', '\\\\', 'x', 'cross join', 'join',
		'inner join', 'natural join', 'left join', 'right join', 'left outer join', 'right outer join',
		'left semi join', 'right semi join', 'anti join', 'anti semi join', 'and', 'or', 'xor',
	];
	const keywordsMath = ['∂', 'π', 'σ', 'ρ', 'τ', '←', '→', '∩', '∪', '÷', '-', '⨯', '⨝', '⟕', '⟖', '⟗', '⋉', '⋊', '▷'];
	const operators = ['<-', '->', '>=', '<=', '=', '∧', '∨', '⊻', '⊕', '≠', '=', '¬', '>', '<', '≥', '≤'];
	const matchAny = (
		stream: CodeMirror.StringStream,
		array: string[],
		consume: boolean,
		successorPattern = '',
	) => {
		for (let i = 0; i < array.length; i++) {
			const match = (
				!successorPattern
					? stream.match(array[i], consume)
					: stream.match(new RegExp(`^${array[i]}${successorPattern}`), consume)
			);

			if (match) {
				return true;
			}
		}
		return false;
	};
	const separators = '([\\(\\)\[\\]\{\\}, \\.\\t]|$)';

	return {
		startState: () => {
			return {
				inBlockComment: false,
			};
		},
		token: (stream: CodeMirror.StringStream, state) => {
			if (state.inBlockComment) {
				if (stream.match(/.*?\*\//, true)) {
					state.inBlockComment = false;
				}
				else {
					stream.match(/.*/, true);
				}
				return 'comment';
			}
			else if (stream.match(/\/\*.*?\*\//, true)) {
				return 'comment';
			}
			else if (!state.inBlockComment && stream.match(/^\/\*.*/, true)) {
				state.inBlockComment = true;
				return 'comment';
			}

			else if (state.inInlineRelation) {
				if (stream.match(/.*?}/, true)) {
					state.inInlineRelation = false;
				}
				else {
					stream.match(/.*/, true);
				}
				return 'inlineRelation';
			}
			else if (stream.match(/^{/, true)) {
				state.inInlineRelation = true;
				return 'inlineRelation';
			}

			else if (stream.match(/^--[\t ]/, true)) {
				stream.skipToEnd();
				return 'comment';
			}
			else if (stream.match(/^\/\*.*?$/, true)) {
				return 'comment';
			}
			else if (matchAny(stream, keywordsMath, true)) {
				return 'keyword math'; // needed for the correct font
			}
			else if (matchAny(stream, keywords, true, separators)) {
				return 'keyword';
			}
			else if (matchAny(stream, operators, true)) {
				return 'operator math';
			}
			else if (stream.match(/^\[[0-9]+]/, true)) {
				return 'attribute';
			}
			else if (stream.match(/^[0-9]+(\.[0-9]+)?/, true)) {
				return 'number';
			}
			else if (stream.match(/\^'[^']*'/i, true)) {
				return 'string';
			}
			else if (stream.match(/\^[a-z]+\.[a-z]*/i, true)) {
				return 'qualified-column';
			}
			else if (stream.match(/^[\(\)\[]\{},]/i, true)) {
				return 'bracket';
			}
			else if (stream.match(/^[a-z][a-z0-9\.]*/i, true)) {
				return 'word';
			}
			else {
				stream.next();
				return 'else';
			}
		},
	};
});

declare module 'codemirror' {
	function showHint(
		cm: CodeMirror.Editor,
		hint: (cm: CodeMirror.Editor) => {
			list: (string | Hint)[],
			from: CodeMirror.Position,
			to: CodeMirror.Position,
		},
		options?: {
			/** Determines whether, when only a single completion is available, it is completed without showing the dialog. Defaults to true. */
			completeSingle?: boolean,

			/** Whether the pop-up should be horizontally aligned with the start of the word (true, default), or with the cursor (false). */
			alignWithWord?: boolean,
			/** When enabled (which is the default), the pop-up will close when the editor is unfocused. */
			closeOnUnfocus?: boolean,
		},
	): void;

	interface Editor {
		/** Retrieves information about the token the current mode found before the given position (a {line, ch} object). */
		getTokenAt(pos: CodeMirror.Position, precise?: boolean): Token;

		addLineWidget(line: any, node: HTMLElement, options?: Partial<{
			/** Whether the widget should cover the gutter. */
			coverGutter: boolean;
			/** Whether the widget should stay fixed in the face of horizontal scrolling. */
			noHScroll: boolean;
			/** Causes the widget to be placed above instead of below the text of the line. */
			above: boolean;
			/** When true, will cause the widget to be rendered even if the line it is associated with is hidden. */
			showIfHidden: boolean;
		}>): CodeMirror.LineWidget;
	}
}


const ExecutionAlert: React.FunctionComponent<{ alert: Alert, editor: CodeMirror.Editor | null }> = (props) => {
	const { editor } = props;
	const { type, message, position } = props.alert;
	const name: Object = {
		'error': t('editor.alert-message-headers.error'),
		'warning': t('editor.alert-message-headers.warning'),
	}[type];
	return (
		<div
			className={classNames('alert ', {
				'alert-danger': type === 'error',
				'alert-warning': type === 'warning',
			})}
		>
			{position
				? (
					// @ts-ignore
					<strong>{name}: <a onClick={event => {
						if (!editor) {
							console.warn(`editor not initialized yet`);
							return;
						}
						editor.focus();
						editor.getDoc().setCursor(position);
						editor.scrollIntoView(null, 42);

						event.preventDefault();
						return false;
					}} href="#">{t('editor.error-at-line-x', { line: (position.line + 1) })}</a>: {message}</strong>
				)
				// @ts-ignore
				: <strong>{name}: {message}</strong>
			}
		</div>
	);
};


type Alert = {
	type: 'error' | 'warning',
	message: string,
	position?: { line: number, ch: number },
};

type Table = {
	name: string,
	assignmentName: string,
	line: number,
	column: number,
	length: number,
	content: {
		columns: relalgAst.table['columns'],
		rows: relalgAst.table['rows'],
	},
	start: any;
	end: any;
};


type Props = {
	mode: 'relalg' | 'bagalg' | 'text/x-mysql',

	/** sync, should throw exception on error */
	execFunction(self: EditorBase, query: string, offset: CodeMirror.Position): { result: JSX.Element },
	/** sync, should throw exception on error or return an array of strings used as hints in the future */
	linterFunction(self: EditorBase, editor: CodeMirror.Editor, text: string): string[],
	/** */
	getHintsFunction(): string[],
	
	tab: 'relalg' | 'bagalg' | 'sql' | 'group',

	enableInlineRelationEditor: boolean,

	/** defaults to 10 */
	historyMaxEntries?: number,

	/** defaults to 20 */
	historyMaxLabelLength?: number,

	codeMirrorOptions?: CodeMirror.EditorConfiguration,

	toolbar: ToolbarGroup[],

	/** defaults to false */
	disableHistory?: boolean,

	execButtonLabel?: LanguageKeys,

	textChange: Function,
	
	exampleSql?: string,
	
	exampleBags?: string,

	exampleRA?: string
};

type State = {
	editor: CodeMirror.Editor | null,
	history: HistoryEntry[],
	codeMirrorOptions: CodeMirror.EditorConfiguration,
	modal: boolean,
	inlineRelationModal: boolean,
	execErrors: Alert[],
	isSelectionSelected: boolean,
	execSuccessful: boolean,
	isExecutionDisabled: boolean,
	execResult: JSX.Element | null,
	relationEditorName: string,
	replSelStart: any,
	replSelEnd: any,
	queryResult: any,
	execTime: any,
	addedExampleSqlQuery: boolean,
	addedExampleBagsQuery: boolean,
	addedExampleRAQuery: boolean
};



class Attribute {
	name: string;
	type: string;
	data: string[];

	constructor() {
		this.name = '';
		this.type = '';
		this.data = [];
	}

}

class Relation {
	name: string;
	attributes: Attribute[];

	constructor() {
		this.name = '';
		this.attributes = [];
	}

	toString(inline: boolean): string {
		let str = '';
		if (inline === false){
			str = this.name + ' = {\n';
		}
		else {
			str = '{ ';
		}
		const rows = new Array<string>();
		for (let i = 0; i < (1 + this.attributes[0].data.length); i++) {
			rows.push('');
		}
		this.attributes.forEach((attribute: Attribute, ai: number) => {
			if (ai > 0) {
				rows[0] += ', ';
			}
			rows[0] += attribute.name;
			attribute.data.forEach((val: string, index: number) => {
				if (ai > 0) {
					rows[index + 1] += ', ';
				}
				if (attribute.type === 'number') {
					rows[index + 1] += val;
				}
				else {
					rows[index + 1] += '\'' + val + '\'';
				}
			});
		});
		str += rows.join('\n');
		str += '\n}\n';
		return str;
	}

	fromTableData(newData: any) {
		if (newData == null) {
			return;
		}
		const data = new Array<string[]>();
		data.push([]);
		data.push([]);
		newData.columns.forEach((col: any) => {
			data[0].push(col.name);
			data[1].push(col.type);
		});
		newData.rows.forEach((row: any) => {
			data.push(row);
		});
		this.fromData(data);
	}

	toData(): string[][] {
		const data = new Array<string[]>();
		if (this.attributes.length === 0) { return [[]]; }
		for (let rows = 0; rows < (2 + this.attributes[0].data.length); rows++) {
			data.push([]);
		}
		this.attributes.forEach((attribute: Attribute) => {
			data[0].push(attribute.name);
			data[1].push(attribute.type);
			attribute.data.forEach((val: string, index: number) => {
				data[index + 2].push(val);
			});
		});
		return data;
	}

	fromData(data: string[][]): void {
		if(data.length > 0) {
			for (let col = 0; col < data[0].length; col++) {
				if (data[0][col]) {
					const attribute = new Attribute();
					attribute.name = data[0][col];
					attribute.type = data[1][col];
					for (let row = 2; row < data.length; row++) {
						if (data[row][col]) {
							attribute.data.push(data[row][col]);
						}
					}
					this.attributes.push(attribute);
				}
			}
		}

	}

	fromCSV(csv: string, delimiter = ';') {
		const data = new Array<string[]>();
		const lines = csv
			.replace(/ +?/g, '') // remove white spaces except \n
			.replace(/['"]+/g, '') // remove quotes
			.split('\n'); // split in lines
		let colCount = -1;
		lines.forEach((line: string) => {
			const newLine = new Array<string>();
			const values: string[] = line.split(delimiter);
			if (colCount === -1) {
				colCount = values.length;
			}
			if (values.length === colCount) {
				values.forEach((value: string) => {
					newLine.push(value);
				});
				data.push(newLine);
			}
		});
		this.fromData(data);
	}

	toCSV(delimiter = ';'): string {
		let str = '';
		(this.toData()).forEach((line: string[]) => {
			str += line.join(delimiter) + '\n';
		});
		return str;
	}

}

const gutterClass = 'CodeMirror-table-edit-markers';
const eventExecSuccessfulName = 'editor.execSuccessful';


export class EditorBase extends React.Component<Props, State> {
	private hinterCache: {
		hints: CodeMirror.Hint[],
		hintsFromLinter: string[],
		changed: boolean,
	};

	uploadCSVRef: React.RefObject<HTMLInputElement>;
	hotTableSettings: any;

	constructor(props: Props) {
		super(props);
		const codeMirrorOptions = {
			theme: 'eclipse',
			smartdent: true,
			tabSize: 2,
			indentWithTabs: true,
			lineNumbers: true,
			lineWrapping: true,
			matchBrackets: true,
			autoCloseBrackets: true,
			smartIndent: true,
			autofocus: false,
			autoRefresh: true,
			enableInlineRelationEditor: true,
			gutters: ['CodeMirror-lint-markers', gutterClass],
			// lint: true,
			mode: props.mode,
			viewportMargin: Infinity,
			extraKeys: {
				'Shift-Tab': 'indentLess',
				'Ctrl-Enter': (cm: CodeMirror.Editor) => {
					this.exec(false);
				},
				'Shift-Ctrl-Enter': (cm: CodeMirror.Editor) => {
					const { editor } = this.state;
					if (!editor) {
						return;
					}
					if (editor.getDoc().somethingSelected()) {
						this.exec(true);
					}
				},
				'Ctrl-S': (cm: CodeMirror.Editor) => {
					this.downloadEditorText();
				},
				'Ctrl-Space': (cm: CodeMirror.Editor) => {
					CodeMirror.showHint(cm, (cm) => {
						return this.genericHint(cm);
					}, {
						closeOnUnfocus: true,
					});
				},
			},
			placeholder: t('editor.codemirror-placeholder'),
			textChange: null,
			...props.codeMirrorOptions,
		};
		
		this.hotTableSettings = {
			colHeaders: false,
			rowHeaders: function (index: number) {
				if (index === 0) {
					return t('calc.editors.ra.inline-editor.row-name');
				}
				else if (index === 1) {
					return t('calc.editors.ra.inline-editor.row-type');
				}
				return (index - 1);
			},
			height: function() { return document.body.clientHeight * 0.7; },
			fixedRowsTop: 2,
			minRows: 2,
			minCols: 1,
			minSpareRows: 1,
			minSpareCols: 1,
			colWidths: '100px',
			contextMenu: true,
			cells: function (row: number, column: number) {
				if (row === 1) {
					return {
						type: 'dropdown',
						source: ['number', 'string', 'date'],
					};
				}
				return {};
			},
		},

		this.state = {
			editor: null,
			codeMirrorOptions,
			history: [],
			isSelectionSelected: false,
			execSuccessful: false,
			execErrors: [],
			isExecutionDisabled: false,
			execResult: null,
			modal: false,
			inlineRelationModal: false,
			relationEditorName: '',
			replSelStart: null,
			replSelEnd: null,
			queryResult: null,
			execTime: null,
			addedExampleSqlQuery: false,
			addedExampleBagsQuery: false,
			addedExampleRAQuery: false
		};
		this.toggle = this.toggle.bind(this);
		this.inlineRelationEditorOk = this.inlineRelationEditorOk.bind(this);
		this.toggleInlineRelationEditor = this.toggleInlineRelationEditor.bind(this);
		this.inlineRelationEditorClose = this.inlineRelationEditorClose.bind(this);
		this.inlineRelationEditorUpload = this.inlineRelationEditorUpload.bind(this);
		this.inlineRelationEditorDownload = this.inlineRelationEditorDownload.bind(this);
		this.hinterCache = {
			hints: [],
			hintsFromLinter: [],
			changed: true,
		};

		this.linter = this.linter.bind(this);
		this.exec = this.exec.bind(this);
		this.applyHistory = this.applyHistory.bind(this);
		this.downloadEditorText = this.downloadEditorText.bind(this);
		this.downloadQueryResult = this.downloadQueryResult.bind(this);
		
		this.uploadCSVRef = React.createRef();
		
	}


	private getInlineRelationData(): string[][] {
		if(this.hotTableSettings.datta) { return this.hotTableSettings.datta; }
		return this.hotTableSettings.data;
	}

	private setInlineRelationData(data: string[][]) {
		this.hotTableSettings.datta = data;
	}

	inlineRelationEditorOpen(table: Table | null) {
		const relation = new Relation();
		const { editor } = this.state;
		if (editor) {
			let sPos = editor.getDoc().getCursor();
			let ePos = editor.getDoc().getCursor();
			if (table) {
				relation.name = table.assignmentName;
				relation.fromTableData(table.content);
				sPos = CodeMirror.Pos(table.line - 1, 0);
				ePos = CodeMirror.Pos(table.end.line, table.end.column);
			}
			else {
				relation.attributes.push(new Attribute());
				relation.attributes.push(new Attribute());
			}
			this.setState({
				inlineRelationModal: true,
				relationEditorName: relation.name,
				replSelStart: sPos,
				replSelEnd: ePos,
			}, () => {
				this.hotTableSettings.data = relation.toData();
			});
		}
	}



	inlineRelationEditorOk() {
		const relation = new Relation();
		relation.name = this.state.relationEditorName;
		relation.fromData(this.getInlineRelationData());
		const { editor, replSelStart, replSelEnd } = this.state;
		if (editor) {
			editor.getDoc().replaceRange(relation.toString(this.props.tab==='relalg'), replSelStart, replSelEnd);
		}
		this.inlineRelationEditorClose();
	}

	inlineRelationEditorClose() {
		this.setState({
			inlineRelationModal: false,
		});
	}

	inlineRelationEditorUpload(event: any) {
		const files = event.target.files;
		if (files.length > 0) {
			const reader = new FileReader();
			reader.onload = ((e: any) => {
				const fileContent = e.target.result;
				const relation = new Relation();
				relation.fromCSV(fileContent);
				relation.name = files[0].name.replace('.csv', '');
				this.setInlineRelationData(relation.toData());
			});
			reader.readAsText(files[0]);
		}
	}

	inlineRelationEditorDownload() {
		const relation = new Relation();
		relation.fromData(this.getInlineRelationData());
		const csvStr = relation.toCSV();
		const element = document.createElement('a');
		const a = document.createElement('a');
		a.href = window.URL.createObjectURL(new Blob([csvStr], { 'type': 'text/csv' }));
		a.download = this.state.relationEditorName + '.csv';
		a.click();
	}
	
	// setting example queries..
	componentDidUpdate(prevProps: Readonly<Props>, prevState: Readonly<State>, snapshot?: any) {
		if(prevState.editor) {
			if(this.props.exampleSql && this.props.exampleSql !== '' && !this.state.addedExampleSqlQuery && this.props.tab === 'sql') {
				this.replaceAll(this.props.exampleSql)
				this.setState({addedExampleSqlQuery: true});
			}
			if(this.props.exampleBags && this.props.exampleBags !== '' && !this.state.addedExampleBagsQuery && this.props.tab === 'bagalg') {
				this.replaceAll(this.props.exampleBags);
				// TODO: maybe auto format / replace ?
				this.setState({addedExampleBagsQuery: true});
			}
			if(this.props.exampleRA && this.props.exampleRA !== '' && !this.state.addedExampleRAQuery && this.props.tab === 'relalg') {
				this.replaceAll(this.props.exampleRA);
				// TODO: maybe auto format / replace ?
				this.setState({addedExampleRAQuery: true});
			}
		}
	}


	componentDidMount() {
		const node = findDOMNode(this) as Element;
		const textarea = node.querySelector('textarea');
		if (!textarea) {
			throw new Error(`could not fid textarea`);
		}

		const editor = CodeMirror.fromTextArea(textarea, this.state.codeMirrorOptions);
		this.setState({
			editor,
			relationEditorName: '',
		});

		if (this.props.linterFunction != null) {
			editor.setOption('lint', {
				getAnnotations: this.linter,
			});
			/* Not possible to bind to scope - all tabs will get same linterFunction 
			CodeMirror.registerHelper('lint', 'sql', (text: string) => this.linter(text));
			CodeMirror.registerHelper('lint', 'bagalg', (text: string) => this.linter(text));
			CodeMirror.registerHelper('lint', 'relalg', (text: string) => this.linter(text));*/
			
		}

		editor.on('cursorActivity', (cm) => {
			this.setState({
				isSelectionSelected: cm.getDoc().somethingSelected(),
			});
		});

		editor.on('change', (cm: CodeMirror.Editor) => {
			this.props.textChange(cm);
		});
	

	}


	render() {
		const {
			execErrors,
			isSelectionSelected,
			editor,
			history,
			execSuccessful,
			isExecutionDisabled,
			execResult,
			execTime,
			queryResult,
		} = this.state;
		const {
			toolbar,
			disableHistory = false,
			execButtonLabel,
		} = this.props;

		return (
			<div>
				<div className="editor-base">
					<Toolbar groups={toolbar} />

					<textarea />

					<div className="exec-errors">
						{execErrors.map((alert, i) => <ExecutionAlert key={i} alert={alert} editor={editor} />)}
					</div>
					

					<div className="input-buttons">
						<button
							type="button"
							disabled={isExecutionDisabled}
							className={classNames('btn btn-primary exec-button selection', {
								'selection-selected': isSelectionSelected,
								'btn-danger': execErrors.length > 0,
								'btn-success': execSuccessful,
								'disabled': isExecutionDisabled,
							})}
							onClick={() => {
								if (!editor) {
									console.warn(`editor not initialized yet`);
									return;
								}
								this.exec(editor.getDoc().somethingSelected());
							}}
						>
							{!!execButtonLabel
								? <span><FontAwesomeIcon icon={faPlayCircle  as IconProp} /> <T id={execButtonLabel} /></span>
								: (
									<>
										<span className="glyphicon glyphicon-play"></span> <span className="query"><FontAwesomeIcon icon={faPlay as IconProp} /> <T id="calc.editors.ra.button-execute-query" /></span><span className="selection"><T id="calc.editors.ra.button-execute-selection" /></span>
									</>
								)
							}
						</button>

						<div style={{ float: 'right' }}>
							<div className="btn-group history-container">
								<DropdownList
									label={<span><FontAwesomeIcon icon={faDownload as IconProp} /> <span className="hideOnSM"><T id="calc.editors.ra.button-download" /></span></span>}
									elements={[
									{
										label: (
											<>
											<div color="Link" onClick={this.downloadEditorText}><FontAwesomeIcon icon={faFileDownload  as IconProp} /> <span><T id="calc.editors.ra.button-download-query" /></span></div>
											</>
											),
									 	value: '',
									},
									{
										label: (
											<>
											<div color="Link" onClick={this.downloadQueryResult} id="downloadQueryCsv" data-id="csv"><FontAwesomeIcon icon={faFileCsv  as IconProp} /> <span ><T id="calc.editors.ra.button-download-csv" /></span></div>
											</>
											),
									 	value: '',
									},
									{
										label: (
											<>
											<div color="Link" onClick={this.downloadQueryResult} data-id="jpg"><FontAwesomeIcon icon={faImage  as IconProp}/> <span ><T id="calc.editors.ra.button-download-jpg" /></span></div>
											</>
											),
									 	value: '',
									},
									]
										
									}
									/>
							</div>

								{disableHistory
								? null
								: (
									<div className="btn-group history-container">
										<DropdownList
											label={<span><FontAwesomeIcon icon={faHistory  as IconProp} /> <span className="hideOnSM"><T id="calc.editors.button-history" /></span></span>}
											elements={history.map(h => ({
												label: (
													<>
														<small className="muted text-muted">{h.time.toLocaleTimeString()}</small>
														<div>{h.code}</div>
														{/*
														// colorize the code
														codeNode.addClass('colorize');
														CodeMirror.colorize(codeNode, this.state.editor.getOption('mode'));
													*/}
													</>
												),
												value: h,
											}))}
											onChange={this.applyHistory}
										/>
									</div>
								)
							}
						</div>
					</div>
					<div className="exec-result">{execResult}</div>
					<Modal isOpen={this.state.modal} toggle={this.toggle} className="showOnSM">
						<ModalHeader toggle={this.toggle}>{t('calc.result.modal.title')}</ModalHeader>
						<ModalBody>
							<div>
								{execResult}
							</div>
						</ModalBody>
						<ModalFooter>
							<span></span>
							<Button color="secondary" onClick={this.toggle}>{t('calc.result.modal.close')}</Button>
						</ModalFooter>
					</Modal>

					<Modal isOpen={this.state.inlineRelationModal} toggle={this.toggleInlineRelationEditor}>
						<ModalHeader toggle={this.toggleInlineRelationEditor}>{t('calc.editors.ra.inline-editor.title')}</ModalHeader>
						<ModalBody>
							<div>
								{ (this.props.tab === 'group') ?
									<div><Input placeholder={t('calc.editors.ra.inline-editor.input-relation-name')} value={this.state.relationEditorName} onChange={(e) => { this.setState({ relationEditorName: e.target.value }); }} />
									<br /></div>
								 : null
								}
								<HotTable settings={this.hotTableSettings} licenseKey="non-commercial-and-evaluation" />
							</div>
						</ModalBody>
						<ModalFooter>
							<Button color="light" onClick={this.inlineRelationEditorDownload}><FontAwesomeIcon icon={faDownload  as IconProp} /> {t('calc.editors.ra.inline-editor.button-download-csv')}</Button>
							<Button color="light" onClick={() => { this.uploadCSVRef.current?.click(); }}><FontAwesomeIcon icon={faUpload  as IconProp} /> {t('calc.editors.ra.inline-editor.button-upload-csv')}</Button>
							<input className="hidden" ref={this.uploadCSVRef} onChange={this.inlineRelationEditorUpload} type="file"></input>
							<span className="flexSpan"></span>
							<Button color="primary" onClick={this.inlineRelationEditorOk}><FontAwesomeIcon icon={faCheckCircle  as IconProp} /> {t('calc.editors.ra.inline-editor.button-ok')}</Button>
							<Button color="secondary" onClick={this.inlineRelationEditorClose}><FontAwesomeIcon icon={faTimesCircle  as IconProp} /> {t('calc.editors.ra.inline-editor.button-cancel')}</Button>
						</ModalFooter>
					</Modal>
				</div>
			</div>
		);
	}

	isMobile(): boolean {
		return (window.innerWidth <= 992);
	}

	toggleInlineRelationEditor() {
		this.setState({
			inlineRelationModal: !this.state.inlineRelationModal,
		});
	}
	toggle() {
		if (!this.isMobile()) {
			return;
		}
		this.setState({
			modal: !this.state.modal,
		});
	}

	private applyHistory(h: HistoryEntry): void {
		this.replaceAll(h.code);
	}

	public forceLinterRun() {
		// remove and insert text to force linter to run
		const { editor } = this.state;
		if (!editor) {
			console.warn(`editor not initialized yet`);
			return;
		}
		const text = editor.getValue();
		editor.setValue('');
		editor.setValue(text);
	}

	historyAddEntry(code: string) {
		const { historyMaxEntries = 10, historyMaxLabelLength = 20 } = this.props;

		const entry = {
			time: new Date(),
			label: code.length > historyMaxLabelLength ? code.substr(0, historyMaxLabelLength - 4) + ' ...' : code,
			code,
		};

		this.setState({
			history: [
				entry,
				...this.state.history,
			].slice(-historyMaxEntries),
		});
	}

	clearExecutionAlerts() {
		this.state.execErrors.splice(0, this.state.execErrors.length);
		toast.dismiss();
	}

	addExecutionWarning(msg: string, position?: { line: number, ch: number }) {
		this._addExecutionAlert(msg, position, 'warning');
		if (this.isMobile()) {
			toast.warn(msg, { className: 'fancyToastWarning' });
		}
	}

	addExecutionError(msg: string, position?: { line: number, ch: number }) {
		this._addExecutionAlert(msg, position, 'error');
		if (this.isMobile()) {
			toast.error(msg, { className: 'fancyToastError' });
		}
	}

	_addExecutionAlert(
		message: string,
		position: { line: number, ch: number } | undefined = undefined,
		type: 'error' | 'warning',
	) {
		if (this.isMobile()) {

		}
		const { editor } = this.state;
		const alert: Alert = {
			type,
			message,
			position,
		};
		const errors = this.state.execErrors;
		errors.push(alert);
		this.setState({ execErrors: errors });
	}

	setText(text: string, replace: 'selection' | 'all') {
		const { editor } = this.state;
		if (!editor) {
			console.warn(`editor not initialized yet`);
			return;
		}

		if (replace === 'selection') {
			editor.getDoc().replaceSelection(text, 'end');
		}
		else {
			editor.setValue(text);
		}

		this.clearExecutionAlerts();
		this.setState({
			execSuccessful: false,
		});
	}

	getText() {
		const { editor } = this.state;
		if (!editor) {
			console.warn(`editor not initialized yet`);
			return;
		}

		return editor.getValue();
	}

	focus() {
		const { editor } = this.state;
		if (!editor) {
			console.warn(`editor not initialized yet`);
			return;
		}

		editor.focus();
	}

	refresh() {
		const { editor } = this.state;
		if (!editor) {
			console.warn(`editor not initialized yet`);
			return;
		}

		editor.refresh();
	}


	downloadQueryResult($event: any) {

		const mode = $event.currentTarget.getAttribute('data-id');
		if(!mode) { return; }

		const {queryResult} = this.state;
		if(!queryResult) {
			console.warn('no query result...');
			return;
		}


		const generateCsv = (schema: any, rows: any) => {

			// https://stackoverflow.com/questions/14964035/how-to-export-javascript-array-info-to-csv-on-client-side
			const arrayToCsv = (data: any) => {
				return data.map((row: any) =>
					row
					.map(String)  // convert every value to String
					.map((v: any) => this.replaceAllImpl(v, '"', '""'))  // escape double colons
					.map((v: any) => `"${v}"`)  // quote it
					.join(','),  // comma-separated
				  ).join('\r\n');  // rows starting on new lines	
			};
			const headers: string[] = [];
			schema._relAliases.forEach((r: any, i: number) => {
				headers.push(`${r}.${schema._names[i]}`);
			});
			
			let csv: string;
			csv = arrayToCsv([headers]);
			csv += '\r\n' + arrayToCsv(rows);
			return csv;
		
		};

		const filename = 'result.csv';


		switch(mode) {
			case 'jpg':
				const images = document.getElementsByClassName('ra-tree') as HTMLCollectionOf<HTMLElement>;
				let imgDiv;
				// Find the visible tree image
				for (let i = 0; i < images.length; i++) {
					// Check if the element is visible
					if (images[i].offsetParent !== null) {
					imgDiv = images[i] as HTMLElement;
						break;
					}
				}
				if (!imgDiv) {
					return;
				}
				const treeElement = imgDiv.cloneNode(true);
				document.body.appendChild(treeElement);

				// const imgDiv = document.getElementsByClassName('tree')[0] as HTMLElement;
				if(treeElement) {
					// bug fix for html2canvas
					const nodes = (treeElement as HTMLElement).querySelectorAll(".tree li:only-child");
					if (nodes && nodes instanceof NodeList) {
						for (let i = 1; i < nodes.length; i++) {
							const node = nodes[i];
							(node as HTMLElement).style.setProperty("top", "-20px");
						}
					}

					html2canvas(treeElement as HTMLElement, {
						// better quality
						scale: 2,
					}).then(canvas => {
						document.body.removeChild(treeElement);
						const dataUrl = canvas.toDataURL('image/jpeg');
						const d = document.createElement('a');
						d.href = dataUrl;
						d.download = 'result.jpg';
						document.body.appendChild(d);
						d.click();
						document.body.removeChild(d)
					});
				} 
				else {
					return ;
				}
				break;
			case 'csv':
				const csv = generateCsv(queryResult._schema, queryResult._rows);
				const a = document.createElement('a');
				a.href = window.URL.createObjectURL(new Blob([csv], { 'type': 'text/plain' }));
				a.download = filename;
				a.click();
				break;
			default:
				return;	
		}
	}


	downloadEditorText() {
		let filename = 'query';
		const { editor } = this.state;
		if (!editor) {
			console.warn(`editor not initialized yet`);
			return;
		}

		switch (editor.getOption('mode')) {
			case 'sql':
			/* falls through */
			case 'text/x-mysql':
				filename += '.sql';
				break;
			case 'bagalg':
			case 'ra':
			/* falls through */
			default:
				filename += '.txt';
				break;
		}

		const downloadText = (filename: string, text: string) => {
			const a = document.createElement('a');
			a.href = window.URL.createObjectURL(new Blob([text], { 'type': 'text/plain' }));
			a.download = filename;
			a.click();
		};

		downloadText(filename, editor.getValue());
	}

	// should be called after group change
	resetHinter() {
		this.hinterCache = {
			hints: [],
			hintsFromLinter: [],
			changed: true,
		};
	}


	linter(text: string) {
		const { editor } = this.state;
		if (!editor) {
			console.warn(`editor not initialized yet`);
			return [];
		}

		if (text.length === 0 || !this.props.linterFunction) {
			return [];
		}

		try {
			const hintsFromLinter = this.props.linterFunction(this, editor, text);


			if (hintsFromLinter.length === 0 && this.hinterCache.hintsFromLinter.length === 0) {
				// no hint recreation needed
			}
			else {
				this.hinterCache.hintsFromLinter = hintsFromLinter;
				this.hinterCache.changed = true;
			}

			return []; // no errors to display
		}
		catch (e) {
			const found = [];
	
			const error = EditorBase._generateErrorFromException(e, 0, 0);
			const messageWithoutHtml = $('<span>').append(error.message).text();

			if (!error.codemirrorPositions) {
				this.clearExecutionAlerts();
				this.addExecutionError(messageWithoutHtml);
				return [];
			}

			const from = error.codemirrorPositions.from;
			let to = error.codemirrorPositions.to;

			// try to extend error highlighting to at least the whole token
			const token = editor.getTokenAt({
				line: from.line,
				ch: from.ch + 1,
			}, true); // TODO: update typings

			const proposed = editor.getDoc().getRange(from, to);
			if (typeof (token.string) !== 'undefined' && token.string.length > proposed.length) {
				to = editor.getDoc().posFromIndex(editor.getDoc().indexFromPos(from) + token.string.length);
			}


			found.push({
				from: from,
				to: to,
				message: messageWithoutHtml,
				severity: 'error',
			});

			if (this.props.enableInlineRelationEditor) {
				this.clearInlineRelationMarkers();
			}

			return found;
		}
	}


	getResultForCsv(activeNode: RANode) {
		const { editor } = this.state;
		if (!editor) {
			console.warn(`editor not initialized yet`);
			return;
		}

		const result = memoize(
			(node: RANode, doEliminateDuplicates: boolean) => {
				try {
					node.check();
					// Remove duplicates if using RA strict mode
					return node.getResult(doEliminateDuplicates);
				}
				catch (e) {
					console.error(e);
					return null;
				}
			},
		);
		this.setState({
			queryResult: result(activeNode, editor.getOption('mode') !== 'bagalg'),
		});
		
	
	}

	genericHint(cm: CodeMirror.Editor) {
		const { getHintsFunction } = this.props;

		const cur = cm.getDoc().getCursor();
		const token = cm.getTokenAt(cur);
		const getObj = (text: string, category = 'unknown') => ({
			text,
			displayText: text,
			className: `hint-${category}`,
		});

		let unfiltered: CodeMirror.Hint[] = [];

		if (this.hinterCache.changed === true) {
			// recreate unfiltered hints
			const unfilteredObj: { [key: string]: ReturnType<typeof getObj> } = {}; // use object to eliminate duplicates

			const hints = getHintsFunction ? getHintsFunction() : [];


			// add keywords
			for (let i = 0; i < hints.length; i++) {
				unfilteredObj[hints[i]] = getObj(hints[i]);
			}


			// add hints from linter
			for (let i = 0; i < this.hinterCache.hintsFromLinter.length; i++) {
				const hintText = this.hinterCache.hintsFromLinter[i];

				unfilteredObj[hintText] = getObj(hintText);
			}


			// copy to array
			const unfiltered: CodeMirror.Hint[] = [];
			for (const hintText in unfilteredObj) {
				if (!unfilteredObj.hasOwnProperty(hintText)) {
					continue;
				}

				unfiltered.push(unfilteredObj[hintText]);
			}

			this.hinterCache.hints = unfiltered;
			this.hinterCache.changed = false;
		}
		else {
			unfiltered = this.hinterCache.hints;
		}


		// filter
		let filtered: CodeMirror.Hint[] = [];
		const tokenText = token.string;

		if (tokenText.length > 0) {
			for (let i = 0; i < unfiltered.length; i++) {
				const kwText = unfiltered[i].text;
				if (kwText.length > tokenText.length && kwText.indexOf(tokenText) === 0) {
					filtered.push(unfiltered[i]);
				}
			}
		}
		else {
			// no text => full hint list
			filtered = unfiltered;
		}

		return {
			list: filtered,
			from: CodeMirror.Pos(cur.line, token.start),
			to: CodeMirror.Pos(cur.line, token.end),
		};
	}


	exec(selectionOnly: boolean) {
		const { editor } = this.state;
		if (!editor) {
			throw new Error(`editor not initialized yet`);
		}
		this.setState({
			execResult:
				(<div className="spinner">
					<div className="rect1"></div>
					<div className="rect2"></div>
					<div className="rect3"></div>
					<div className="rect4"></div>
					<div className="rect5"></div>
				</div>),
		}, () => {
			this.clearExecutionAlerts();
			let query = '';
			let offset = {
				line: 0,
				ch: 0,
			};
			if (selectionOnly !== true) { // execute whole text
				query = editor.getValue();
		
			}
			else { // execute selection
				query = editor.getDoc().getSelection();
				offset = editor.getDoc().getCursor('from');
			}
			if (query.length === 0) {
				this.clearExecutionAlerts();
				this.addExecutionError(t('editor.error-no-query-found'));
			}
			this.clearExecutionAlerts();
			try {
				const start = Date.now();
				const { result } = this.props.execFunction(this, query, offset);
				const end = Date.now() - start;
				this.getResultForCsv(result.props.root);
				this.setState({
					execResult: result,
					execTime: end,
				});
				const event = new CustomEvent(eventExecSuccessfulName, {
					'detail': {
						editor: this,
					},
				});
				document.dispatchEvent(event);
				this.toggle();
				return true;
			}
			catch (e) {
				console.error(e, e.stack);
				const error = EditorBase._generateErrorFromException(e, offset.line, offset.ch);
				this.addExecutionError(error.message, error.codemirrorPositions ? error.codemirrorPositions.from : undefined);
				if (this.props.enableInlineRelationEditor) {
					this.clearInlineRelationMarkers();
				}
			}
		});
	}

	// TODO: e needs to by typed
	static _generateErrorFromException(
		e: any,
		codeMirrorOffsetLine: number,
		codeMirrorOffsetColumn: number,
	) {
		// fallback if it is a string
		let message: string = (typeof e.message !== 'undefined') ? e.message : e;

		// try to generate translated pegjs error messages
		/*if (e.name && e.name === 'SyntaxError' && typeof e.expected !== 'undefined' && e.expected !== null && typeof e.found !== 'undefined') {
			message = EditorBase.buildTranslatedPegJsMessage(e.expected, e.found);
		}*/

		// replace \xHEX chars generated by pegjs
		message = message.replace(/(\\(u|x)[0-9A-F]+)/g, (str, group0) => {
			return `<span class="math">${String.fromCharCode(parseInt(group0.substr(2), 16))}</span>`;
		});


		// try to get position information from error
		let location = null;

		if (typeof e.codeInfo !== 'undefined' && typeof e.codeInfo.location !== 'undefined') {
			location = e.codeInfo.location;
		}
		else if (typeof e.location !== 'undefined') {
			location = e.location;
		}

		let codemirrorPositions = null;
		if (location !== null) {
			codemirrorPositions = {
				from: {
					line: location.start.line + (codeMirrorOffsetLine || 0) - 1,
					ch: location.start.column + (codeMirrorOffsetColumn || 0) - 1,
				},
				to: {
					line: location.end.line + (codeMirrorOffsetLine || 0) - 1,
					ch: location.end.column + (codeMirrorOffsetColumn || 0) - 1,
				},
			};
		}

		return {
			message: message,
			location: location,
			codemirrorPositions: codemirrorPositions,
		};
	}

	/* this is a modified version of the original pegjs function
	 * source: https://github.com/pegjs/pegjs/blob/v0.8.0/lib/compiler/passes/generate-javascript.js#L849-L937
	 */
	static buildTranslatedPegJsMessage(expected: PEG.ExpectedItem[], found: string) {
		function cleanupExpected(expected: PEG.ExpectedItem[]) {

			let i = 1;

			expected.sort((a, b) => {
				if (a.description < b.description) {
					return -1;
				}
				else if (a.description > b.description) {
					return 1;
				}
				else {
					return 0;
				}
			});

			while (i < expected.length) {
				if (expected[i - 1] === expected[i]) {
					expected.splice(i, 1);
				}
				else {
					i++;
				}
			}
		}

		function buildMessage(expected: PEG.ExpectedItem[], found: string) {
			function stringEscape(s: string) {
				function hex(ch: string) {
					return ch.charCodeAt(0).toString(16).toUpperCase();
				}

				return s
					.replace(/\\/g, '\\\\')
					.replace(/"/g, '\\"')
					.replace(/\x08/g, '\\b')
					.replace(/\t/g, '\\t')
					.replace(/\n/g, '\\n')
					.replace(/\f/g, '\\f')
					.replace(/\r/g, '\\r')
					.replace(/[\x00-\x07\x0B\x0E\x0F]/g, function (ch) {
						return '\\x0' + hex(ch);
					})
					.replace(/[\x10-\x1F\x80-\xFF]/g, function (ch) {
						return '\\x' + hex(ch);
					})
					.replace(/[\u0180-\u0FFF]/g, function (ch) {
						return '\\u0' + hex(ch);
					})
					.replace(/[\u1080-\uFFFF]/g, function (ch) {
						return '\\u' + hex(ch);
					});
			}

			const expectedDescriptions = new Array(expected.length);
	
			// expectedDesc, foundDesc, i;

			for (let i = 0; i < expected.length; i++) {
				expectedDescriptions[i] = expected[i].description;
			}

			const expectedDesc = (
				expected.length > 1
					? `${expectedDescriptions.slice(0, -1).join(', ')} ${t('editor.pegjs-error.or')} ${expectedDescriptions[expected.length - 1]}`
					: expectedDescriptions[0]
			);

			const foundDesc = found ? `"${stringEscape(found)}"` : t('editor.pegjs-error.end-of-input');
			return t('editor.pegjs-error.expected-found', { expected: expectedDesc, found: foundDesc });
		}

		if (expected !== null) {
			cleanupExpected(expected);
		}
		return buildMessage(expected, found);
	}

	setExecutionDisabled(enable: boolean) {
		this.setState({
			isExecutionDisabled: enable,
		});
	}

	public replaceText(item: Item, overwrite?: string) {
		const text = typeof item.label === 'string' ? item.label : '';
		this.replaceSelection(text, overwrite);
	}

	public replaceSelection(text: string, overwrite?: string) {
		this.setText(overwrite || text, 'selection');
		this.focus();
	}

	public replaceAll(text: string, overwrite?: string) {
		this.setText(overwrite || text, 'all');
		this.focus();
	}

	
	// needed as String.protoype.replaceAll() not yet compatible (ECMA 2021)
	// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/replaceAll
	public replaceAllImpl(text: string, toReplace: string, replaceWith: string) {
		while(text.includes(toReplace)) {
			text = text.replace(toReplace, replaceWith);
		}
		return text;
	}

	setReadOnly(enable: boolean) {
		const { editor } = this.state;
		if (!editor) {
			throw new Error(`editor not initialized yet`);
		}
		const wrapper = $(editor.getWrapperElement());

		if (enable === false) {
			editor.setOption('readOnly', false);
			wrapper.removeClass('readonly');
		}
		else {
			editor.setOption('readOnly', 'nocursor');
			wrapper.addClass('readonly');
		}
	}

	addInlineRelationMarkers(root: relalgAst.GroupRoot | relalgAst.rootRelalg) {
		const { editor } = this.state;
		if (!editor) {
			console.warn(`editor not initialized yet`);
			return;
		}

		const getTables = function (root: relalgAst.GroupRoot | relalgAst.rootRelalg) {
			const tables: Table[] = [];


			// find all inline-tables within the ast
			forEachPreOrder(root, c => {
				const child: any = c;
				if (child && child.type === 'table') {
					const table: Table = {
						name: child.name,
						line: child.codeInfo.location.start.line - 1,
						column: child.codeInfo.location.start.column - 1,
						// offset: child.codeInfo.location.start.offset,
						length: child.codeInfo.text.length,
						assignmentName: child.assignmentName ? child.assignmentName : '',
						content: {
							columns: child.columns,
							rows: child.rows,
						},
						start: child.codeInfo.location.start,
						end: child.codeInfo.location.end,
					};
					tables.push(table);
				}
			});
			return tables;
		};

		const tables: Table[] = getTables(root);

		this.clearInlineRelationMarkers();
		for (let i = 0; i < tables.length; i++) {
			const marker = document.createElement('div');
			marker.style.color = '#5e5e5e';
			marker.onclick = () => {
				this.inlineRelationEditorOpen(tables[i]);
			};
			ReactDOM.render(<FontAwesomeIcon icon={faTable as IconProp}></FontAwesomeIcon>, marker, () => {
				marker.style.marginLeft = '-15px';
				editor.setGutterMarker(tables[i].line++, gutterClass, marker);
			});
		}
	}

	clearInlineRelationMarkers() {
		const { editor } = this.state;
		if (!editor) {
			console.warn(`editor not initialized yet`);
			return;
		}

		editor.clearGutter(gutterClass);
	}
}

export function getColumnNamesFromRaRoot(root: RANode) {
	// use columns from all calculated schemas for hints
	const columns: string[] = [];
	const rec = function (n: RANode) {
		const schema = n.getSchema();
		for (let i = 0; i < schema.getSize(); i++) {
			if (!schema.needsFullName(i)) {
				columns.push(`${schema.getName(i)}`);
			}

			columns.push(schema.getFullName(i));
		}

		if (n instanceof RANodeUnary) {
			rec(n.getChild());
		}
		if (n instanceof RANodeBinary) {
			rec(n.getChild());
			rec(n.getChild2());
		}
	};
	rec(root);

	// use column names as hints
	return columns;
}

export function getHintsFromGroup(group: Group): string[] {
	if (!group) {
		return [];
	}
	const hints: string[] = [];

	// add table and column names
	const { tables } = group;
	for (const i in tables) {
		if (!tables.hasOwnProperty(i)) {
			continue;
		}
		const { tableName, relation } = tables[i];
		const schema = relation.getSchema();

		hints.push(tableName);

		for (let j = 0; j < schema.getSize(); j++) {
			const columnName = schema.getColumn(j).getName();

			hints.push(`${columnName}`);
			hints.push(`${tableName}.${columnName}`);
		}
	}

	return hints;
}
