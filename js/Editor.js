/*jshint -W116, -W030, -W083 */
/*global CodeMirror, $, jQuery, document, window, Blob, setTimeout, Handsontable */

import * as relalgjs from '../../db/relalg';



// Polyfill for creating CustomEvents on IE9/10/11
// code pulled from:
// https://github.com/d4tocchini/customevent-polyfill
// https://developer.mozilla.org/en-US/docs/Web/API/CustomEvent#Polyfill
if (!window.CustomEvent || typeof window.CustomEvent !== 'function') {
	var CustomEvent = function (event, params) {
		var evt;
		params = params || {
				bubbles: false,
				cancelable: false,
				detail: undefined
			};

		evt = document.createEvent("CustomEvent");
		evt.initCustomEvent(event, params.bubbles, params.cancelable, params.detail);
		return evt;
	};

	CustomEvent.prototype = window.Event.prototype;
	window.CustomEvent = CustomEvent; // expose definition to window
}

CodeMirror.defineMode('ra', function () {
	var keywords = [
		'pi', 'sigma', 'rho', 'tau', '<-', '->', 'intersect', 'union', 'except', '/', '-', '\\\\', 'x', 'cross join', 'join',
		'inner join', 'natural join', 'left join', 'right join', 'left outer join', 'right outer join',
		'left semi join', 'right semi join', 'anti join', 'anti semi join', 'and', 'or', 'xor'
	];
	var keywordsMath = ['π', 'σ', 'ρ', 'τ', '←', '→', '∩', '∪', '÷', '-', '⨯', '⨝', '⟕', '⟖', '⟗', '⋉', '⋊', '▷'];
	var operators = ['<-', '->', '>=', '<=', '=', '∧', '∨', '⊻', '⊕', '≠', '=', '¬', '>', '<', '≥', '≤'];
	var matchAny = function (stream, array, consume, successorPattern) {
		for (var i = 0; i < array.length; i++) {
			var needle;
			if (!successorPattern)
				needle = array[i];
			else
				needle = new RegExp('^' + array[i] + successorPattern);

			if (stream.match(needle, consume))
				return true;
		}
		return false;
	};
	var seperators = '([\\(\\)\[\\]\{\\}, \\.\\t]|$)';

	return {
		startState: function () {
			return {
				inBlockComment: false
			};
		},
		token: function (stream, state) {
			if (state.inBlockComment) {
				if (stream.match(/.*?\*\//, true))
					state.inBlockComment = false;
				else
					stream.match(/.*/, true);
				return 'comment';
			}
			else if (!state.inBlockComment && stream.match(/^\/\*.*/, true)) {
				state.inBlockComment = true;
				return 'comment';
			}

			else if (state.inInlineRelation) {
				if (stream.match(/.*?}/, true))
					state.inInlineRelation = false;
				else
					stream.match(/.*/, true);
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
			else if (matchAny(stream, keywords, true, seperators)) {
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

		}
	};
});


export class Editor {
	constructor(options) {
		this.options = {
			textarea: $(options.textarea),
			execErrors: $(options.execErrors),
			execButton: $(options.execButton),
			downloadButton: options.downloadButton ? $(options.downloadButton) : null,
			historyContainer: options.execButton ? $(options.historyContainer) : null,

			execFunction: options.execFunction, // function(query), sync, should throw exception on error
			linterFunction: options.linterFunction, // function(text), sync, should throw exception on error or return an array of strings used as hints in the future
			getHintsFunction: options.getHintsFunction,

			enableInlineRelationEditor: options.enableInlineRelationEditor || false,

			historyMaxEntries: typeof(options.historyMaxEntries) !== 'undefined' ? options.historyMaxEntries : 10,
			historyMaxLabelLength: options.historyMaxLabelLength ? options.historyMaxLabelLength : 20,

			eventExecSuccessfulName: 'editor.execSuccessful',
			gutterClass: 'CodeMirror-table-edit-markers',
		};
		this.state = {
			editor: null,

			history: [],
			hinter: {
				hints: [],
				hintsFromLinter: [],
				changed: true
			}
		};

		var self = this;

		var codeMirrorOptions = {
			smartdent: true,
			tabSize: 2,
			indentWithTabs: true,
			lineNumbers: true,
			lineWrapping: true,
			matchBrackets: true,
			autoCloseBrackets: true,
			smartIndent: true,
			autofocus: false,
			gutters: ['CodeMirror-lint-markers'],
			//lint: true,
			mode: 'custom',
			viewportMargin: Infinity,
			extraKeys: {
				'Shift-Tab': 'indentLess',
				'Ctrl-Enter': function (cm) {
					self.exec(false);
				},
				'Shift-Ctrl-Enter': function (cm) {
					if (self.state.editor.somethingSelected())
						self.exec(true);
				},
				'Ctrl-S': function (cm) {
					self.downloadEditorText();
				},
				'Ctrl-Space': function (cm) {
					CodeMirror.showHint(cm, function (cm) {
						return self.genericHint(cm);
					}, {
						closeOnUnfocus: true
					});
				}

			},
			placeholder: i18n.t('editor.codemirror-placeholder')
		};
		if (options.codeMirrorOptions) {
			jQuery.extend(codeMirrorOptions, options.codeMirrorOptions);
		}
		if (options.enableInlineRelationEditor) {
			codeMirrorOptions.gutters.push(this.options.gutterClass);
		}


		this.state.editor = CodeMirror.fromTextArea(this.options.textarea[0], codeMirrorOptions);

		if (this.options.linterFunction) {
			//var mode = this.state.editor.getOption('mode');

			this.state.editor.setOption('lint', function (text) {
				return self.linter(text);
			});
		}


		this.state.editor.on('cursorActivity', function (cm) {
			if (self.state.editor.somethingSelected()) {
				self.options.execButton.addClass('selection-selected');
			}
			else
				self.options.execButton.removeClass('selection-selected');
		});


		this.options.execButton.click(function () {
			self.exec(self.state.editor.somethingSelected());
		});

		if (this.options.downloadButton) {
			this.options.downloadButton.click(function () {
				self.downloadEditorText();
			});
		}
	}


	forceLinterRun() {
		// remove and insert text to force linter to run
		var editor = this.state.editor;
		var text = editor.getValue();
		editor.setValue('');
		editor.setValue(text);
	}

	historyAddEntry(code) {
		var historyMaxEntries = this.options.historyMaxEntries;
		var historyMaxLabelLength = this.options.historyMaxLabelLength;


		var format_time = function (t) {
			var h = t.getHours() >= 10 ? t.getHours() : '0' + t.getHours();
			var m = t.getMinutes() >= 10 ? t.getMinutes() : '0' + t.getMinutes();
			var s = t.getSeconds() >= 10 ? t.getSeconds() : '0' + t.getSeconds();
			return h + ':' + m + ':' + s;
		};

		var time = format_time(new Date());
		var label = code.length > historyMaxLabelLength ? code.substr(0, historyMaxLabelLength - 4) + ' ...' : code;

		var entry = {
			time: time,
			label: label,
			code: code
		};

		this.state.history.push(entry);
		this.state.history = this.state.history.slice(-historyMaxEntries);
	}

	updateHistoryList() {
		if (this.options.historyContainer === null) {
			return;
		}


		var row, codeNode, i, entry;
		var history = this.state.history;
		var historyButton = this.options.historyContainer.find('.btn');
		var historyUl = this.options.historyContainer.find('ul');

		historyUl.empty();
		for (i = 0; i < history.length; i++) {
			entry = history[i];

			row = $('<li>').append('<small class="muted text-muted">' + entry.time + '</small>');

			codeNode = $('<div>')
				.text(entry.code)
				.addClass('replace-all')
				.data('text', entry.code)
			;

			// colorize the code
			codeNode.addClass('colorize');
			CodeMirror.colorize(codeNode, this.state.editor.getOption('mode'));

			row.append(codeNode);


			historyUl.prepend(row);
		}


		if (history.length > 0) {
			historyButton.removeClass('disabled');
		}
		else {
			historyButton.addClass('disabled');
		}
	}


	clearExecutionAlerts() {
		var execErrors = this.options.execErrors;
		var execButton = this.options.execButton;

		execErrors.empty();
		execButton.removeClass('btn-danger');
	}

	addExecutionWarning(msg, position) {
		this._addExecutionAlert(msg, position, 'warning');
	}

	addExecutionError(msg, position) {
		this._addExecutionAlert(msg, position, 'error');
	}

	_addExecutionAlert(msg, position, type) {
		var execErrors = this.options.execErrors;
		var execButton = this.options.execButton;
		// position = {line, ch}
		var editor = this.state.editor;
		var name = {
			'error': i18n.t('editor.alert-message-headers.error'),
			'warning': i18n.t('editor.alert-message-headers.warning')
		}[type];
		var className = {
			'error': 'alert-danger',
			'warning': 'alert-warning'
		}[type];

		var el = $('<div class="alert ' + className + '"></div>');
		if (position) {
			el.append($('<strong>' + name + ' <a href="#">' + i18n.t('editor.error-at-line-x', {line: (position.line + 1)}) + '</a>: </strong>'));
			el.find('a').click(function (event) {
				editor.focus();
				editor.setCursor(position);
				editor.scrollIntoView(null, 42);

				event.preventDefault();
				return false;
			});
		}
		else {
			el.append('<strong>' + name + ': </strong>');
		}

		el.append(msg);
		execErrors.append(el);
		if (!execButton.hasClass('btn-danger'))
			execButton.addClass('btn-danger');
	}

	setText(text, replaceSelection) {
		if (replaceSelection === true) {
			this.state.editor.replaceSelection(text, 'end');
		}
		else {
			this.state.editor.setValue(text);
		}


		this.clearExecutionAlerts();
		this.options.execButton.removeClass('btn-danger btn-success');
	}

	getText() {
		return this.state.editor.getValue();
	}

	focus() {
		this.state.editor.focus();
	}

	refresh() {
		this.state.editor.refresh();
	}


	downloadEditorText(basename) {
		var filename = basename || 'query';

		switch (this.state.editor.getOption('mode')) {
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

		function download_text(filename, text) {
			var a = document.createElement('a');
			//noinspection JSUnresolvedFunction
			a.href = window.URL.createObjectURL(new Blob([text], {'type': 'text/plain'}));
			a.download = filename;
			a.click();
		}

		download_text(filename, this.state.editor.getValue());
	}

	createGist() {
		var text = this.state.editor.getValue();

		var data = {
			"description": "posting gist test",
			"public": false,
			"files": {
				"content.txt": {
					"content": text
				}
			}
		};

		$.ajax({
			url: 'https://api.github.com/gists',
			type: 'POST',
			dataType: 'json',
			data: JSON.stringify(data)
		}).success(function (e) {
			console.log(e);
		})
			.error(function (e) {
				console.warn("gist save error", e);
			});
	}


// should be called after group change
	resetHinter() {
		this.state.hinter = {
			hintsHash: {},
			hintsFromLinter: [],
			changed: true
		};
	}


	linter(text) {
		let editor = this.state.editor;
		if (text.length === 0 || !this.options.linterFunction) {
			return [];
		}

		try {
			var hintsFromLinter = this.options.linterFunction.call(this, text);

			if (hintsFromLinter.length === 0 && this.state.hinter.hintsFromLinter.length === 0) {
				// no hint recreation needed
			}
			else {
				this.state.hinter.hintsFromLinter = hintsFromLinter;
				this.state.hinter.changed = true;
			}

			return []; // no errors to display
		}
		catch (e) {
			var found = [];

			console.log(e);

			let error = Editor._generateErrorFromException(e, 0, 0);
			let messageWithoutHtml = $('<span>').append(error.message).text();

			if (!error.codemirrorPositions) {
				this.clearExecutionAlerts();
				this.addExecutionError(messageWithoutHtml);
				return [];
			}

			let from = error.codemirrorPositions.from;
			let to = error.codemirrorPositions.to;

			// try to extend error highlighting to at least the whole token
			let token = editor.getTokenAt({
				line: from.line,
				ch: from.ch+1
			}, true);
			let proposed = editor.getRange(from, to);
			if(typeof(token.string) !== 'undefined' && token.string.length > proposed.length){
				to = editor.posFromIndex(editor.indexFromPos(from)+token.length);
			}


			found.push({
				from: from,
				to: to,
				message: messageWithoutHtml,
				severity: 'error'
			});

			if (this.options.enableInlineRelationEditor)
				this.clearInlineRelationMarkers();

			return found;
		}
	}


	genericHint(cm) {
		var cur = cm.getCursor();
		var token = cm.getTokenAt(cur);
		var getObj = function (text, category) {
			return {
				text: text,
				displayText: text,
				className: 'hint-' + (category || 'unknown')
			};
		};

		var hinterCache = this.state.hinter;

		var hints, i, unfilteredObj, hintText;
		var unfiltered;

		if (hinterCache.changed === true) {
			// recreate unfiltered hints
			unfilteredObj = {}; // use object to eliminate duplicates


			if (this.options.getHintsFunction) {
				hints = this.options.getHintsFunction();
			}
			else {
				hints = [];
			}


			// add keywords
			for (i = 0; i < hints.length; i++) {
				unfilteredObj[hints[i]] = getObj(hints[i]);
			}


			// add hints from linter
			for (i = 0; i < hinterCache.hintsFromLinter.length; i++) {
				hintText = hinterCache.hintsFromLinter[i];

				unfilteredObj[hintText] = getObj(hintText);
			}


			// copy to array
			unfiltered = [];
			for (hintText in unfilteredObj) {
				if (!unfilteredObj.hasOwnProperty(hintText))
					continue;

				unfiltered.push(unfilteredObj[hintText]);
			}

			hinterCache.hints = unfiltered;
			hinterCache.changed = false;
		}
		else {
			unfiltered = hinterCache.hints;
		}


		// filter
		var filtered = [], kwText;
		var tokenText = token.string;

		if (tokenText.length > 0) {
			for (i = 0; i < unfiltered.length; i++) {
				kwText = unfiltered[i].text;
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
			to: CodeMirror.Pos(cur.line, token.end)
		};
	}


	exec(selectionOnly) {
		var editor = this.state.editor;
		var offset = {
			line: 0,
			ch: 0
		};
		var query = '';
		var self = this;

		if (selectionOnly !== true) {
			// execute whole text
			query = editor.getValue();
		}
		else {
			// execute selection
			query = editor.getSelection();
			offset = editor.getCursor('from');
		}
		if (query.length === 0) {
			this.clearExecutionAlerts();
			this.addExecutionError(i18n.t('editor.error-no-query-found'));
			return;
		}

		this.clearExecutionAlerts();

		try {
			this.options.execFunction.call(this, query, function (msg) {
				self.addExecutionWarning(msg);
			});
			this.options.execButton.removeClass('btn-danger').addClass('btn-success');

			var event = new (CustomEvent || window.CustomEvent)(this.options.eventExecSuccessfulName, {
				'detail': {
					editor: this
				}
			});
			document.dispatchEvent(event);

			return true;
		}
		catch (e) {
			console.log(e, e.stack);

			let error = Editor._generateErrorFromException(e, offset.line, offset.ch);
			this.addExecutionError(error.message, error.codemirrorPositions ? error.codemirrorPositions.from : null);

			this.options.execButton.removeClass('btn-success').addClass('btn-danger');

			if (this.options.enableInlineRelationEditor)
				this.clearInlineRelationMarkers();

			return false;
		}
	}

	static _generateErrorFromException(e, codeMirrorOffsetLine, codeMirrorOffsetColumn){
		// fallback if it is a string
		let message = (typeof e.message !== 'undefined') ? e.message : e;

		// try to generate translated pegjs error messages
		if (e.name && e.name === 'SyntaxError' && typeof e.expected !== 'undefined' && e.expected !== null && typeof e.found !== 'undefined') {
			message = Editor.buildTranslatedPegJsMessage(e.expected, e.found);
		}

		// replace \xHEX chars generated by pegjs
		message = message.replace(/(\\(u|x)[0-9A-F]+)/g, function (str, group0) {
			return '<span class="math">' + String.fromCharCode(parseInt(group0.substr(2), 16)) + '</span>';
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
		if(location !== null) {
			codemirrorPositions = {
				from: {
					line: location.start.line + (codeMirrorOffsetLine || 0) - 1,
					ch: location.start.column + (codeMirrorOffsetColumn || 0) - 1
				},
				to: {
					line: location.end.line + (codeMirrorOffsetLine || 0) - 1,
					ch: location.end.column + (codeMirrorOffsetColumn || 0) - 1
				}
			};
		}

		return {
			message: message,
			location: location,
			codemirrorPositions: codemirrorPositions
		}
	}

	/* this is a modified version of the original pegjs function
	 * source: https://github.com/pegjs/pegjs/blob/v0.8.0/lib/compiler/passes/generate-javascript.js#L849-L937
	 */
	static buildTranslatedPegJsMessage(expected, found) {
		function cleanupExpected(expected) {
			var i = 1;

			expected.sort(function (a, b) {
				if (a.description < b.description) {
					return -1;
				} else if (a.description > b.description) {
					return 1;
				} else {
					return 0;
				}
			});

			while (i < expected.length) {
				if (expected[i - 1] === expected[i]) {
					expected.splice(i, 1);
				} else {
					i++;
				}
			}
		}

		function buildMessage(expected, found) {
			function stringEscape(s) {
				function hex(ch) {
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

			var expectedDescs = new Array(expected.length),
				expectedDesc, foundDesc, i;

			for (i = 0; i < expected.length; i++) {
				expectedDescs[i] = expected[i].description;
			}

			expectedDesc = expected.length > 1
				? expectedDescs.slice(0, -1).join(", ")
			+ " " + i18n.t('editor.pegjs-error.or') + " "
			+ expectedDescs[expected.length - 1]
				: expectedDescs[0];

			foundDesc = found ? "\"" + stringEscape(found) + "\"" : i18n.t('editor.pegjs-error.end-of-input');

			return i18n.t('editor.pegjs-error.expected-found', {expected: expectedDesc, found: foundDesc});
		}

		if (expected !== null) {
			cleanupExpected(expected);
		}
		return buildMessage(expected, found);
	}

	setExecutionDisabled(enable) {
		if (enable === false) {
			this.options.execButton.removeClass('disabled');
		}
		else {
			this.options.execButton.addClass('disabled');
		}
	}


	setReadOnly(enable) {
		var editor = this.state.editor;
		var wrapper = $(editor.getWrapperElement());

		if (enable === false) {
			editor.setOption('readOnly', false);
			wrapper.removeClass('readonly');
		}
		else {
			editor.setOption('readOnly', 'nocursor');
			wrapper.addClass('readonly');
		}
	}


	openModalInlineEditor_inlineRelationNew(callback) {
		var self = this;
		var editor = this.state.editor;
		var widget;
		var cursor = editor.getCursor();
		var container = this.getInlineRelationEditor(null, function (err, tableStr) {
			if (!err) {
				editor.replaceRange(tableStr, cursor, cursor);
			}
			widget.clear();
			self.setReadOnly(false);
			self.setExecutionDisabled(false);
			self.forceLinterRun();

			if(callback){
				callback();
			}
		});

		widget = editor.addLineWidget(cursor.line, container, {
			coverGutter: false
		});
		setTimeout(function () {
			$(container).find('> .editor').handsontable("selectCell", 0, 0);
		}, 50);

		this.setReadOnly(true);
		this.setExecutionDisabled(true);
	}

	openModalInlineEditor_inlineRelationChange(table) {
		var self = this;
		var editor = this.state.editor;
		var widget;
		var mark;
		var from = {line: table.line, ch: table.column};
		var to = editor.findPosH(from, table.length, 'char');

		var container = this.getInlineRelationEditor(table.content, function (err, tableStr) {
			mark.clear();
			widget.clear();
			if (!err) {
				editor.replaceRange(tableStr, from, to);
			}
			self.setReadOnly(false);
			self.setExecutionDisabled(false);
			self.forceLinterRun();
		});

		mark = editor.markText(from, to, {
			collapsed: true,
			readOnly: true,
			replacedWith: $('<i class="fa fa-table"></i>')[0]
		});

		this.setReadOnly(true);
		this.setExecutionDisabled(true);
		widget = editor.addLineWidget(table.line, container);

		// try to set focus on new editor
		setTimeout(function () {
			$(container).find('> .editor').handsontable("selectCell", 0, 0);
		}, 50);
	}

	getInlineRelationEditor(content, callback) {
		/** Handsontable */
		var handsontable = null;
		var data, i, j, row, value, tmp;

		var container = $('<div class="grid-editor-container"><div class="editor"></div><div class="errors alert alert-danger" style="display: none;"></div></div>');
		var gridContainer = container.find('> .editor');
		var errorContainer = container.find('> .errors');
		var btnOk = $('<button class="btn btn-primary disabled">' + i18n.t('editor.inline-relation-editor.button-ok') + '</button>').click(function () {
			var tableStr = processGrid(handsontable);

			if (tableStr === false) {
				console.error('this should not happen; button should be disabled');
				callback && callback('this should not happen; button should be disabled', null);
				return;
			}

			callback && callback(null, tableStr);
		});
		var btnCancel = $('<button class="btn btn-default">' + i18n.t('editor.inline-relation-editor.button-cancel') + '</button>').click(function () {
			callback && callback('cancel', null);
		});

		container.append(btnOk);
		container.append(btnCancel);


		function dateFormatISO(val) {
			return val.getFullYear() +
				'-' + (val.getMonth() + 1 < 10 ? '0' + (val.getMonth() + 1) : (val.getMonth() + 1)) +
				'-' + (val.getDate() < 10 ? '0' + val.getDate() : val.getDate());
		}

		function processGrid(handsontable) {
			var i, j, row, value;
			var text = '{\n';
			var quotedSingle, quotedDouble;
			var emptyColumns = handsontable.countEmptyCols(true);
			var emptyRows = handsontable.countEmptyRows(true);

			try {
				if (data.length > 0 && data[0].length === emptyColumns && data.length === emptyRows) {
					throw new Error(i18n.t('editor.inline-relation-editor.enter-your-data'));
				}

				for (i = 0; i < data.length - emptyRows; i++) {
					row = data[i];
					for (j = 0; j < row.length - emptyColumns; j++) {
						value = row[j];

						if (j !== 0) {
							text += '\t';
						}

						// remove quotes
						if (/^'.*'$|^".*"$/.test(value)) {
							value = value.substr(1, value.length - 2);
						}


						if (i === 0 && value === null) {
							throw new Error(i18n.t('editor.inline-relation-editor.error-column-name-missing', {index: (j + 1)}));
						}
						else if (value === null || typeof value === 'string' && (value.toLowerCase() === 'null')) {
							text += 'null';
						}
						else if (i === 0 || /^[\-_a-zA-Z0-9\.]+$/.test(value) || /^[0-9]{4}-[0-9]{2}-[0-9]{2}$/.test(value) || typeof value === 'number') {
							text += value;
						}
						else if (value instanceof Date) {
							text += dateFormatISO(value);
						}
						else {
							quotedSingle = value.indexOf("'") !== -1;
							quotedDouble = value.indexOf('"') !== -1;

							if (quotedSingle && quotedDouble) {
								throw new Error(i18n.t('editor.inline-relation-editor.error-wrong-quoted-string'));
							}
							else if (quotedSingle) {
								text += '"' + value + '"';
							}
							else {
								text += "'" + value + "'";
							}
						}
					}

					text += '\n';
				}
				text += '}';


				var ast = relalgjs.parseRelalg(text, []);
				var result = relalgjs.textFromRelalgAstRoot(ast);
				//resultContainer.html(result);
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


		var boldRenderer = function boldRenderer(instance, td, row, col, prop, value, cellProperties) {
			Handsontable.renderers.TextRenderer.apply(this, arguments);
			td.style.fontWeight = 'bold';
		};

		function valueRenderer(instance, td, row, col, prop, value, cellProperties) {
			Handsontable.renderers.TextRenderer.apply(this, arguments);

			if (value === 'null') {
				td.style.fontStyle = 'italic';
				td.style.background = '#eee';
			}
		}

		// build data array
		if (content) {
			data = [];

			// column definitions
			row = [];
			for (i = 0; i < content.columns.length; i++) {
				tmp = content.columns[i].relAlias ? content.columns[i].relAlias + '.' : '';
				row.push(tmp + content.columns[i].name + ':' + content.columns[i].type);
			}
			data.push(row);


			// rows
			for (i = 0; i < content.rows.length; i++) {
				row = [];
				for (j = 0; j < content.rows[i].length; j++) {
					value = content.rows[i][j];

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
				[]
			];
		}

		gridContainer.handsontable({
			data: data,
			minRows: 2,
			minCols: 2,
			minSpareRows: 1,
			minSpareCols: 1,
			fixedRowsTop: 1,
			rowHeaders: false,
			colHeaders: false,
			pasteMode: 'overwrite',
			tabMoves: function (event) {
				// allows to tab out of the grid

				if (event.shiftKey) {
					return {row: 0, col: -1};
				}

				/* jump to out of the grid and focus one of the buttons if [TAB] was pressed in
				 * the spare column */
				var selection = handsontable.getSelected();
				var startCol = selection[1];

				if (startCol === handsontable.countCols() - 1 && handsontable.isEmptyCol(startCol)) {
					setTimeout(function () {
						handsontable.deselectCell();
						container.find("button:not(.disabled)").first().focus();
					}, 0);
					return {row: 0, col: 0};
				}
				else {
					return {row: 0, col: 1};
				}
			},
			cells: function (row, col, prop) {
				// select render function depending on position
				var cellProperties = {};

				if (row === 0) {
					cellProperties.renderer = boldRenderer;
					cellProperties.placeholder = i18n.t('editor.inline-relation-editor.placeholder-column-name-and-types');
				}
				else {
					cellProperties.renderer = valueRenderer;


					cellProperties.validator = function (value, callback) {
						if (typeof value === 'string') {
							var quotedSingle = value.indexOf("'") !== -1;
							var quotedDouble = value.indexOf('"') !== -1;

							if (quotedDouble && quotedSingle) {
								callback(false);
								return;
							}
						}

						callback(true);
					};
					//cellProperties.placeholder = 'value';
				}
				return cellProperties;
			},

			allowInvalid: true,
			beforeChange: function (changes, source) {
				var i;

				// set all empty cells to null
				for (i = 0; i < changes.length; i++) {
					if (changes[i][3] === '') {
						changes[i][3] = null;
					}
				}

			},
			afterChange: function (changes, source) {
				var emptyRows = this.countEmptyRows(true) - this.getSettings().minSpareRows;
				if (emptyRows > 0)
					this.alter('remove_row', this.countRows() - 1 - emptyRows, emptyRows);

				var emptyCols = this.countEmptyCols(true) - this.getSettings().minSpareCols;
				if (emptyCols > 0)
					this.alter('remove_col', this.countCols() - 1 - emptyCols, emptyCols);


				processGrid(this);
			}
		});
		handsontable = gridContainer.handsontable('getInstance');


		return container.get(0);
	}


	addInlineRelationMarkers(root) {
		var editor = this.state.editor;
		var getTables = function (root) {
			var a = [];
			var i, j;
			var rec = function (parent, attrName, a) {
				var child = parent[attrName];

				if (child.type == 'table') {
					// replace
					a.push({
						name: child.name,
						line: child.codeInfo.location.start.line - 1,
						column: child.codeInfo.location.start.column - 1,
						//offset: child.codeInfo.location.start.offset,
						length: child.codeInfo.text.length,

						content: {
							columns: child.columns,
							rows: child.rows
						}
					});
					return;
				}

				if (typeof child.child !== 'undefined' && child.child !== null) {
					rec(child, 'child', a);
				}

				if (typeof child.child2 !== 'undefined' && child.child2 !== null) {
					rec(child, 'child2', a);
				}
			};

			if (root.type == 'groupRoot') {
				for (i = 0; i < root.groups.length; i++) {
					for (j = 0; j < root.groups[i].assignments.length; j++) {
						rec(root.groups[i].assignments[j], 'child', a);
					}
				}

			}
			else {
				// assume RA-root
				rec(root, 'child', a);
				for (i = 0; i < root.assignments.length; i++) {
					rec(root.assignments[i], 'child', a);
				}
			}
			return a;
		};

		var tables = getTables(root);


		this.clearInlineRelationMarkers();

		var i, e;
		for (i = 0; i < tables.length; i++) {
			e = $('<i class="fa fa-table" title="edit relation"></i>').click((function (self, table) {
				return function () {
					self.openModalInlineEditor_inlineRelationChange(table);


					self.clearInlineRelationMarkers();
				};
			})(this, tables[i]));

			editor.setGutterMarker(tables[i].line, this.options.gutterClass, e[0]);
		}
	}

	clearInlineRelationMarkers() {
		this.state.editor.clearGutter(this.options.gutterClass);
	}

}
