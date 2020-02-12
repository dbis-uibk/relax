/*** Copyright 2018 Johannes Kessler
*
* This Source Code Form is subject to the terms of the Mozilla Public
* License, v. 2.0. If a copy of the MPL was not distributed with this
* file, You can obtain one at http://mozilla.org/MPL/2.0/. */

import { DropdownList } from 'calc2/components/dropdownList';
import { HistoryEntry } from 'calc2/components/history';
import { Group as ToolbarGroup, Item, Toolbar } from 'calc2/components/toolbar';
import { LanguageKeys, t, T } from 'calc2/i18n';
import { Group } from 'calc2/store/groups';
import * as classNames from 'classnames';
import * as CodeMirror from 'codemirror';
import 'codemirror/addon/hint/show-hint';
import { RANode, RANodeBinary, RANodeUnary } from 'db/exec/RANode';
import { parseRelalg, textFromRelalgAstRoot } from 'db/relalg';
import { forEachPreOrder } from 'db/translate/utils';
import * as Handsontable from 'handsontable';
import * as React from 'react';
import { findDOMNode } from 'react-dom';
import { useState } from 'react';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlayCircle, faArrowAltCircleDown, faHistory } from '@fortawesome/free-solid-svg-icons'

require('codemirror/lib/codemirror.css');
require('codemirror/theme/eclipse.css');
require('codemirror/addon/hint/show-hint.css');
require('codemirror/addon/lint/lint.js');
require('codemirror/addon/lint/lint.css');
require('codemirror/addon/display/placeholder.js');
require('codemirror/addon/display/autorefresh.js');

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
		token: (stream, state) => {
			if (state.inBlockComment) {
				if (stream.match(/.*?\*\//, true)) {
					state.inBlockComment = false;
				}
				else {
					stream.match(/.*/, true);
				}
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


const ExecutionAlert: React.SFC<{ alert: Alert, editor: CodeMirror.Editor | null }> = (props) => {
	const { editor } = props;
	const { type, message, position } = props.alert;
	const name = {
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
	line: number,
	column: number,
	length: number,
	content: {
		columns: relalgAst.table['columns'],
		rows: relalgAst.table['rows'],
	},
};


type Props = {
	mode: 'relalg' | 'text/x-mysql',

	/** sync, should throw exception on error */
	execFunction(self: EditorBase, query: string, offset: CodeMirror.Position): { result: JSX.Element },
	/** sync, should throw exception on error or return an array of strings used as hints in the future */
	linterFunction(self: EditorBase, editor: CodeMirror.Editor, text: string): string[],
	/** */
	getHintsFunction(): string[],

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
};

type State = {
	editor: CodeMirror.Editor | null,
	history: HistoryEntry[],
	codeMirrorOptions: CodeMirror.EditorConfiguration,
	modal: boolean,
	execErrors: Alert[],
	isSelectionSelected: boolean,
	execSuccessful: boolean,
	isExecutionDisabled: boolean,
	execResult: JSX.Element | null,
};

const gutterClass = 'CodeMirror-table-edit-markers';
const eventExecSuccessfulName = 'editor.execSuccessful';


export class EditorBase extends React.Component<Props, State> {
	private hinterCache: {
		hints: CodeMirror.Hint[],
		hintsFromLinter: string[],
		changed: boolean,
	};
	private handsontable: Handsontable | null = null;

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
			gutters: ['CodeMirror-lint-markers'],
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

			...props.codeMirrorOptions,
		};

		if (props.enableInlineRelationEditor) {
			codeMirrorOptions.gutters.push(gutterClass);
		}

		this.state = {
			editor: null,
			codeMirrorOptions,
			history: [],
			isSelectionSelected: false,
			execSuccessful: false,
			execErrors: [],
			isExecutionDisabled: false,
			execResult: null,
			modal: false
		};
		this.toggle = this.toggle.bind(this);
		this.hinterCache = {
			hints: [],
			hintsFromLinter: [],
			changed: true,
		};

		this.linter = this.linter.bind(this);
		this.exec = this.exec.bind(this);
		this.applyHistory = this.applyHistory.bind(this);
		this.downloadEditorText = this.downloadEditorText.bind(this);
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
		});

		if (this.props.linterFunction != null) {
			editor.setOption('lint', true)
		}

		editor.on('cursorActivity', (cm) => {
			this.setState({
				isSelectionSelected: cm.getDoc().somethingSelected(),
			});
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
		} = this.state;
		const {
			toolbar,
			disableHistory = false,
			execButtonLabel,
		} = this.props;

		return (
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
							? <T id={execButtonLabel} />
							: (
								<>
									<span className="glyphicon glyphicon-play"></span> <span className="query"><FontAwesomeIcon icon={faPlayCircle} /> <T id="calc.editors.ra.button-execute-query" /></span><span className="selection"><T id="calc.editors.ra.button-execute-selection" /></span>
								</>
							)
						}
					</button>

					<div style={{ float: 'right' }}>
						<button type="button" className="btn btn-default download-button" onClick={this.downloadEditorText}><FontAwesomeIcon icon={faArrowAltCircleDown} /> <span className="hideOnSM"><T id="calc.editors.ra.button-download" /></span></button>

						{disableHistory
							? null
							: (
								<div className="btn-group history-container">
									<DropdownList
										label={<span><FontAwesomeIcon icon={faHistory} /> <span className="hideOnSM"><T id="calc.editors.button-history" /></span></span>}
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
				<ModalHeader toggle={this.toggle}>Result</ModalHeader>
				<ModalBody>
					<div>
						{execResult}
					</div>
				</ModalBody>
				<ModalFooter>
					<Button color="secondary" onClick={this.toggle}>Cancel</Button>
				</ModalFooter>
				</Modal>

			</div>
		);
	}

	toggle() {
		if (window.innerWidth < 992){
			return;
		}
		this.setState({
			modal: !this.state.modal
		});
	}

	private applyHistory(h: HistoryEntry): void {
		this.replaceAll(h.code);
	}

	forceLinterRun() {
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
		this.setState({
			execErrors: [],
		});
	}

	addExecutionWarning(msg: string, position?: { line: number, ch: number }) {
		this._addExecutionAlert(msg, position, 'warning');
	}

	addExecutionError(msg: string, position?: { line: number, ch: number }) {
		this._addExecutionAlert(msg, position, 'error');
	}

	_addExecutionAlert(
		message: string,
		position: { line: number, ch: number } | undefined = undefined,
		type: 'error' | 'warning',
	) {
		const { editor } = this.state;
		const alert: Alert = {
			type,
			message,
			position,
		};

		this.setState({
			execErrors: [
				...this.state.execErrors,
				alert,
			],
		});
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

			console.log(e);

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


	exec(selectionOnly: boolean): boolean {
		const { editor } = this.state;
		if (!editor) {
			throw new Error(`editor not initialized yet`);
		}
		let query = '';
		let offset = {
			line: 0,
			ch: 0,
		};

		if (selectionOnly !== true) {
			// execute whole text
			query = editor.getValue();
		}
		else {
			// execute selection
			query = editor.getDoc().getSelection();
			offset = editor.getDoc().getCursor('from');
		}
		if (query.length === 0) {
			this.clearExecutionAlerts();
			this.addExecutionError(t('editor.error-no-query-found'));
			return false;
		}

		this.clearExecutionAlerts();
		this.setState({
			execResult: null,
		});

		try {
			const { result } = this.props.execFunction(this, query, offset);

			const event = new CustomEvent(eventExecSuccessfulName, {
				'detail': {
					editor: this,
				},
			});
			document.dispatchEvent(event);

			this.setState({
				execResult: result,
			});
			this.toggle();
			return true;
		}
		catch (e) {
			console.log(e, e.stack);

			const error = EditorBase._generateErrorFromException(e, offset.line, offset.ch);
			this.addExecutionError(error.message, error.codemirrorPositions ? error.codemirrorPositions.from : undefined);

			if (this.props.enableInlineRelationEditor) {
				this.clearInlineRelationMarkers();
			}

			return false;
		}
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
		if (e.name && e.name === 'SyntaxError' && typeof e.expected !== 'undefined' && e.expected !== null && typeof e.found !== 'undefined') {
			message = EditorBase.buildTranslatedPegJsMessage(e.expected, e.found);
		}

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

	private modalInlineEditorIsOpen: boolean = false;
	public createInlineRelationViaEditor() {
		if (this.modalInlineEditorIsOpen === true) {
			return;
		}

		this.modalInlineEditorIsOpen = true;
		this.openModalInlineEditor_inlineRelationNew(() => {
			this.modalInlineEditorIsOpen = false;
		});
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


	openModalInlineEditor_inlineRelationNew(callback?: () => void) {
		const { editor } = this.state;
		if (!editor) {
			throw new Error(`editor not initialized yet`);
		}
		const cursor = editor.getDoc().getCursor();
		let widget: CodeMirror.LineWidget;

		const container = this.getInlineRelationEditor(null, (err, tableStr) => {
			if (!err && tableStr) {
				editor.getDoc().replaceRange(tableStr, cursor, cursor);
			}
			widget.clear();
			this.setReadOnly(false);
			this.setExecutionDisabled(false);
			this.forceLinterRun();

			callback && callback();
		});

		widget = editor.addLineWidget(cursor.line, container, {
			coverGutter: false,
		});
		setTimeout(() => {
			this.handsontable && this.handsontable.selectCell(0, 0);
		}, 50);

		this.setReadOnly(true);
		this.setExecutionDisabled(true);
	}

	openModalInlineEditor_inlineRelationChange(table: Table) {
		const { editor } = this.state;
		let mark: CodeMirror.TextMarker;
		let widget: CodeMirror.LineWidget;
		if (!editor) {
			return;
		}

		const from = { line: table.line, ch: table.column };
		const to = editor.findPosH(from, table.length, 'char', true);

		const container = this.getInlineRelationEditor(table.content, (err, tableStr) => {
			mark.clear();
			widget.clear();
			if (!err && tableStr) {
				editor.getDoc().replaceRange(tableStr, from, to);
			}
			this.setReadOnly(false);
			this.setExecutionDisabled(false);
			this.forceLinterRun();
		});

		mark = editor.getDoc().markText(from, to, {
			collapsed: true,
			readOnly: true,
			replacedWith: $('<i class="fa fa-table"></i>')[0],
		});

		this.setReadOnly(true);
		this.setExecutionDisabled(true);
		widget = editor.addLineWidget(table.line, container);

		// try to set focus on new editor
		setTimeout(() => {
			this.handsontable && this.handsontable.selectCell(0, 0);
		}, 50);
	}

	getInlineRelationEditor(content: Table['content'] | null, callback: (err: null | string, res: string | null) => void) {
		/** Handsontable */
		let handsontable: Handsontable;
		let data: (string | number | Date | boolean)[][];

		const container = $('<div class="grid-editor-container"><div class="editor"></div><div class="errors alert alert-danger" style="display: none;"></div></div>');
		const gridContainer = container.find('> .editor');
		const errorContainer = container.find('> .errors');
		const btnOk = $(`<button class="btn btn-primary disabled">${t('editor.inline-relation-editor.button-ok')}</button>`).click(() => {
			const tableStr = processGrid(handsontable);

			if (tableStr === false) {
				console.error('this should not happen; button should be disabled');
				callback && callback('this should not happen; button should be disabled', null);
				return;
			}

			this.handsontable = null;
			callback && callback(null, tableStr);
		});
		const btnCancel = $(`<button class="btn btn-default">${t('editor.inline-relation-editor.button-cancel')}</button>`).click(() => {
			this.handsontable = null;
			callback && callback('cancel', null);
		});

		container.append(btnOk);
		container.append(btnCancel);


		function dateFormatISO(val: Date) {
			const month = (
				val.getMonth() + 1 < 10
					? '0' + (val.getMonth() + 1)
					: (val.getMonth() + 1)
			);
			const day = (
				val.getDate() < 10
					? '0' + val.getDate()
					: val.getDate()
			);
			return `${val.getFullYear()}-${month}-${day}`;
		}

		function processGrid(handsontable: Handsontable): string | false {
			let text = '{\n';
			const emptyColumns = handsontable.countEmptyCols(true);
			const emptyRows = handsontable.countEmptyRows(true);

			try {
				if (data.length > 0 && data[0].length === emptyColumns && data.length === emptyRows) {
					throw new Error(t('editor.inline-relation-editor.enter-your-data'));
				}

				for (let i = 0; i < data.length - emptyRows; i++) {
					const row = data[i];
					for (let j = 0; j < row.length - emptyColumns; j++) {
						let value = row[j];

						if (j !== 0) {
							text += '\t';
						}

						// remove quotes
						if (typeof value === 'string' && /^'.*'$|^".*"$/.test(value)) {
							value = value.substr(1, value.length - 2);
						}


						if (i === 0 && value === null) {
							throw new Error(t('editor.inline-relation-editor.error-column-name-missing', { index: (j + 1) }));
						}
						else if (value === null || typeof value === 'string' && (value.toLowerCase() === 'null')) {
							text += 'null';
						}
						else if (i === 0 || typeof value === 'string' && /^[\-_a-zA-Z0-9\.]+$/.test(value) || typeof value === 'string' && /^[0-9]{4}-[0-9]{2}-[0-9]{2}$/.test(value) || typeof value === 'number') {
							text += value;
						}
						else if (value instanceof Date) {
							text += dateFormatISO(value);
						}
						else if (value === true || value === false) {
							text += `${value}`;
						}
						else {
							const quotedSingle = value.indexOf("'") !== -1;
							const quotedDouble = value.indexOf('"') !== -1;

							if (quotedSingle && quotedDouble) {
								throw new Error(t('editor.inline-relation-editor.error-wrong-quoted-string'));
							}
							else if (quotedSingle) {
								text += `"${value}"`;
							}
							else {
								text += `'${value}'`;
							}
						}
					}

					text += '\n';
				}
				text += '}';


				const ast = parseRelalg(text, []);
				const result = textFromRelalgAstRoot(ast);
				// resultContainer.html(result);
				console.log(result);

				errorContainer.hide();
				btnOk.removeClass('disabled');

				return result;
			}
			catch (e) {
				console.log(e.message);
				errorContainer.html(e.message).show();

				btnOk.addClass('disabled');

				return false;
			}
		}


		const boldRenderer: Handsontable.renderers.Base = (instance, td, row, col, prop, value, cellProperties) => {
			const node = Handsontable.renderers.TextRenderer.apply(this, arguments as any);
			td.style.fontWeight = 'bold';
			return node;
		};

		const valueRenderer: Handsontable.renderers.Base = (instance, td, row, col, prop, value, cellProperties) => {
			const node = Handsontable.renderers.TextRenderer.apply(this, arguments as any);

			if (value === 'null') {
				td.style.fontStyle = 'italic';
				td.style.background = '#eee';
			}

			return node;
		};

		// build data array
		if (content) {
			data = [];

			// column definitions
			const row = [];
			for (let i = 0; i < content.columns.length; i++) {
				const tmp = content.columns[i].relAlias ? content.columns[i].relAlias + '.' : '';
				row.push(`${tmp}${content.columns[i].name}:${content.columns[i].type}`);
			}
			data.push(row);


			// rows
			for (let i = 0; i < content.rows.length; i++) {
				const row = [];
				for (let j = 0; j < content.rows[i].length; j++) {
					let value = content.rows[i][j];

					if (value instanceof Date) {
						value = dateFormatISO(value);
					}
					else if (value === null) {
						value = 'null';
					}

					row.push(value);
				}
				data.push(row);
			}
		}
		else {
			data = [
				[],
				[],
			];
		}

		const minSpareRows = 1;
		const minSpareCols = 1;
		handsontable = new Handsontable(gridContainer[0], {
			data: data,
			minRows: 2,
			minCols: 2,
			minSpareRows,
			minSpareCols,
			fixedRowsTop: 1,
			rowHeaders: false,
			colHeaders: false,
			pasteMode: 'overwrite',
			tabMoves: function (event: KeyboardEvent) {
				// allows to tab out of the grid

				if (event.shiftKey) {
					return { row: 0, col: -1 };
				}

				/* jump to out of the grid and focus one of the buttons if [TAB] was pressed in
				 * the spare column */
				const selection = handsontable.getSelected();
				const startCol: number = selection ? selection[0][1] : 0;

				if (startCol === handsontable.countCols() - 1 && handsontable.isEmptyCol(startCol)) {
					setTimeout(function () {
						handsontable.deselectCell();
						container.find('button:not(.disabled)').first().focus();
					}, 0);
					return { row: 0, col: 0 };
				}
				else {
					return { row: 0, col: 1 };
				}
			},
			cells: function (row, col, prop) {
				// select render function depending on position
				const cellProperties: { // TODO: typing
					renderer?: any,
					placeholder?: any,
					validator?: any,
				} = {};

				if (row === 0) {
					// cellProperties.renderer = boldRenderer;
					cellProperties.placeholder = t('editor.inline-relation-editor.placeholder-column-name-and-types');
				}
				else {
					// cellProperties.renderer = valueRenderer;


					cellProperties.validator = function (value: string, callback: (x: true | false) => void) {
						if (typeof value === 'string') {
							const quotedSingle = value.indexOf("'") !== -1;
							const quotedDouble = value.indexOf('"') !== -1;

							if (quotedDouble && quotedSingle) {
								callback(false);
								return;
							}
						}

						callback(true);
					};
					// cellProperties.placeholder = 'value';
				}
				return cellProperties;
			},

			allowInvalid: true,
			beforeChange: function (changes: any[], source: string) {
				// set all empty cells to null
				for (let i = 0; i < changes.length; i++) {
					if (changes[i][3] === '') {
						changes[i][3] = null;
					}
				}

			},
			afterChange: function (this: Handsontable, changes: any[], source: string) {
				const emptyRows = this.countEmptyRows(true) - minSpareRows;
				if (emptyRows > 0) {
					this.alter('remove_row', this.countRows() - 1 - emptyRows, emptyRows);
				}

				const emptyCols = this.countEmptyCols(true) - minSpareCols;
				if (emptyCols > 0) {
					this.alter('remove_col', this.countCols() - 1 - emptyCols, emptyCols);
				}

				processGrid(this);
			},
		});

		this.handsontable = handsontable;
		return container.get(0);
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
			forEachPreOrder(root, child => {
				if (child.type === 'table') {
					const table: Table = {
						name: child.name,
						line: child.codeInfo.location.start.line - 1,
						column: child.codeInfo.location.start.column - 1,
						// offset: child.codeInfo.location.start.offset,
						length: child.codeInfo.text.length,

						content: {
							columns: child.columns,
							rows: child.rows,
						},
					};
					tables.push(table);
				}
			});

			return tables;
		};

		const tables: Table[] = getTables(root);


		this.clearInlineRelationMarkers();

		for (let i = 0; i < tables.length; i++) {
			const self = this;
			const table = tables[i];
			const e = $('<i class="fa fa-table" title="edit relation"></i>').click(() => {
				self.openModalInlineEditor_inlineRelationChange(table);
				self.clearInlineRelationMarkers();
			});

			editor.setGutterMarker(tables[i].line, gutterClass, e[0]);
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
