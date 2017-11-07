/*jshint -W116, -W030 */
/*global window, $, jQuery, Handlebars, marked, Editor */

import * as relalgjs from '../../db/relalg';
import {Editor} from './Editor'
import {CalculatorHelpers} from './CalculatorHelpers'

export class Calculator {
	constructor(options) {
		var calc = this;

		let defaults = {
			alertContainer: $('body > .alertContainer'),
			groupsSelector: $('#groups-selector'),
			groupsSelectorList: $('#groups-selector').find('#groups-selector-list'),
			groupRelationList: $('#groups'),
			groupDesc: $('#groups-desc'),
			groupInfo: $('#groups-info'),
			resultContainers: {
				'ra': $('#tab-editor-ra').find('> .exec-result'),
				'sql': $('#tab-editor-sql').find('> .exec-result')
			},
			editorContainers: {
				ra: $('#tab-editor-ra'),
				sql: $('#tab-editor-sql'),
				group: $('#tab-editor-group'),
				sqldump: $('#modal-sqldump')
			},
			modalSqlDump: $('#modal-sqldump'),

			staticGroups: [],
			numTreeLabelColors: 6,

			keywords: {
				'ra': [
					'pi', 'sigma', 'rho', 'tau', '<-', 'intersect', 'union', '/', '-', '\\', 'x', 'cross join', 'join',
					'inner join', 'natural join', 'left join', 'right join', 'left outer join',
					'right outer join', 'full outer join', 'left semi join', 'right semi join', 'anti join',
					'and', 'or', 'xor', '||'
				],
				'sql': [
					'distinct', 'select distinct', 'from', 'where', 'order by', 'asc', 'desc',
					'inner join', 'inner', 'join', 'natural', 'union', 'intersect', 'outer join', 'natural join', 'left join', 'right join', 'left outer join',
					'right outer join', 'full outer join', 'group by', 'having', 'limit', 'offset',
					'and', 'or', 'xor', '||'
				]
			}
		};

		this.options = $.extend({}, defaults, options);

		this.state = {
			currentGroup: null,
			groups: {
				'static': {},
				gist: {},
				own: {}
			},
			relations: {},

			editors: {
				ra: null,
				sql: null,

				// group editor
				sqldump: null,
				group: null
			},
			currentEditorName: null
		};

		marked.setOptions({
			renderer: new marked.Renderer(),
			gfm: true,
			tables: true,
			breaks: false,
			pedantic: false,
			sanitize: true,
			smartLists: true,
			smartypants: false
		});


		function getColumnNamesFromRaRoot(root) {
			// use columns from all calculated schemas for hints
			var columns = [];
			var i;
			var rec = function (n) {
				var schema = n.getSchema();
				for (i = 0; i < schema.getSize(); i++) {
					if (!schema.needsFullName(i))
						columns.push(schema.getName(i));

					columns.push(schema.getFullName(i));
				}

				if (n.hasChild())
					rec(n.getChild());
				if (n.hasChild2())
					rec(n.getChild2());
			};
			rec(root, columns);

			// use column names as hints
			return columns;
		}

		function getHintsFromGroup(group) {
			if (!group)
				return [];

			var i, j, tables, schema, columnName, tableName;
			var hints = [];

			// add table and column names
			tables = calc.state.currentGroup.tables;
			for (i in tables) {
				schema = tables[i].relation.getSchema();
				tableName = tables[i].tableName;

				hints.push(tableName);

				for (j = 0; j < schema.getSize(); j++) {
					columnName = schema.getColumn(j).getName();

					hints.push(columnName);
					hints.push(tableName + '.' + columnName);
				}
			}

			return hints;
		}


		this.state.editors.ra = new Editor({
			textarea: this.options.editorContainers.ra.find('> textarea'),
			historyContainer: this.options.editorContainers.ra.find('.history-container'),
			downloadButton: this.options.editorContainers.ra.find('.download-button'),
			execErrors: this.options.editorContainers.ra.find('> .exec-errors'),
			execButton: this.options.editorContainers.ra.find('.exec-button'),
			execFunction: function (text) {
				var relations = calc.state.relations;

				var ast = relalgjs.parseRelalg(text, Object.keys(relations));
				relalgjs.replaceVariables(ast, relations);

				if (ast.child === null) {
					if (ast.assignments.length > 0)
						throw new Error(i18n.t('calc.messages.error-query-missing-assignments-found'));
					else
						throw new Error(i18n.t('calc.messages.error-query-missing'));
				}


				var root = relalgjs.relalgFromRelalgAstRoot(ast, relations);
				root.check();

				calc.displayRaResult(root);

				this.historyAddEntry(text);
				this.updateHistoryList();

				if (this.options.enableInlineRelationEditor)
					this.addInlineRelationMarkers(ast);
			},
			linterFunction: function (text) {
				var relations = calc.state.relations;
				var hints = [];

				var ast = relalgjs.parseRelalg(text, Object.keys(relations));
				relalgjs.replaceVariables(ast, relations);

				for (var i = 0; i < ast.assignments.length; i++) {
					hints.push(ast.assignments[i].name);
				}

				if (ast.child === null) {
					if (ast.assignments.length > 0)
						throw new Error(i18n.t('calc.messages.error-query-missing-assignments-found'));
					else
						throw new Error(i18n.t('calc.messages.error-query-missing'));
				}


				var root = relalgjs.relalgFromRelalgAstRoot(ast, relations);
				root.check();


				if (this.options.enableInlineRelationEditor)
					this.addInlineRelationMarkers(ast);

				// use columns from all calculated schemas for hints
				return hints.concat(getColumnNamesFromRaRoot(root));
			},
			getHintsFunction: function () {
				var arr = calc.options.keywords.ra;

				// add table and column names
				arr = arr.concat(getHintsFromGroup(calc.state.currentGroup));

				return arr;
			},
			codeMirrorOptions: {
				mode: 'ra'
			},
			enableInlineRelationEditor: true
		});

		var modalInlineEditorIsOpen = false;
		$('#tab-editor-ra .editor-ra-new-relation').click(function () {
			if(modalInlineEditorIsOpen === true){
				return;
			}

			modalInlineEditorIsOpen = true;
			calc.state.editors.ra.openModalInlineEditor_inlineRelationNew(function(){
				modalInlineEditorIsOpen = false;
			});
		});


		this.state.editors.sql = new Editor({
			textarea: this.options.editorContainers.sql.find('> textarea'),
			historyContainer: this.options.editorContainers.sql.find('.history-container'),
			downloadButton: this.options.editorContainers.sql.find('.download-button'),
			execErrors: this.options.editorContainers.sql.find('> .exec-errors'),
			execButton: this.options.editorContainers.sql.find('.exec-button'),
			execFunction: function (text, addWarning) {
				var warnings, i;

				var relations = calc.state.relations;

				var ast = relalgjs.parseSQLSelect(text);
				relalgjs.replaceVariables(ast, relations);
				var root = relalgjs.relalgFromSQLAstRoot(ast, relations);
				root.check();

				warnings = root.getWarnings(true);
				for (i = 0; i < warnings.length; i++) {
					addWarning(warnings[i].message);
				}

				calc.displayRaResult(root);

				this.historyAddEntry(text);
				this.updateHistoryList();
			},
			linterFunction: function (text) {
				var relations = calc.state.relations;
				var hints = [];

				var ast = relalgjs.parseSQLSelect(text);
				relalgjs.replaceVariables(ast, relations);

				for (var i = 0; i < ast.assignments.length; i++) {
					hints.push(ast.assignments[i].name);
				}

				var root = relalgjs.relalgFromSQLAstRoot(ast, relations);
				root.check();

				// use columns from all calculated schemas for hints
				return hints.concat(getColumnNamesFromRaRoot(root));
			},
			getHintsFunction: function () {
				var arr = calc.options.keywords.sql;

				// add table and column names
				arr = arr.concat(getHintsFromGroup(calc.state.currentGroup));

				return arr;
			},
			codeMirrorOptions: {
				mode: 'text/x-mysql'
			}
		});


		this.state.editors.group = new Editor({
			textarea: this.options.editorContainers.group.find('> textarea'),
			downloadButton: this.options.editorContainers.group.find('.download-button'),
			execErrors: this.options.editorContainers.group.find('> .exec-errors'),
			execButton: this.options.editorContainers.group.find('.exec-button'),
			execFunction: function (text) {
				var result_container = $('#tab-editor-group').find('> .exec-result');
				result_container.empty();

				var groupAst = relalgjs.parseRelalgGroup(text);
				var groups = CalculatorHelpers.getGroupsFromGroupAst(groupAst);

				if (this.options.enableInlineRelationEditor)
					this.addInlineRelationMarkers(groupAst);

				// display result
				var i, j, list;
				for (i = 0; i < groups.length; i++) {
					result_container.append($('<h4>').text(groups[i].groupName));

					list = $('<ul class="table-list">');
					for (j = 0; j < groups[i].tables.length; j++) {
						list.append(
							$('<li>')
								.append($('<h5>').text(groups[i].tables[j].tableName))
								.append(groups[i].tables[j].relation.getResult().getHtml())
						);
					}
					result_container.append(list);
				}
				result_container.append(getUseGroupsButton(groups));
				result_container.find('table').addClass('table table-condensed');


				function getUseGroupsButton(newGroups) {
					var button = $('<button type="button" class="btn btn-primary"></button>').click(function (e) {
						var i, id;
						var firstId = null;

						for (i = 0; i < newGroups.length; i++) {
							id = CalculatorHelpers.StringHashCode(newGroups[i].definition);

							calc.state.groups.own[id] = newGroups[i];

							if (i === 0) {
								firstId = id;
							}
						}

						if (firstId !== null) {
							calc.changeToGroup('own', firstId);
						}
						else {
							calc.updategroupsSelector();
						}
					});
					button.text(i18n.t('calc.editors.group.button-use', {count: newGroups.length}));

					return button;
				}
			},
			linterFunction: function (text) {
				var groupAst = relalgjs.parseRelalgGroup(text);

				if (this.options.enableInlineRelationEditor)
					this.addInlineRelationMarkers(groupAst);

				CalculatorHelpers.getGroupsFromGroupAst(groupAst);
				return [];
			},
			getHintsFunction: function () {
				var arr = calc.options.keywords.ra;

				arr.push('group');

				// add table and column names
				arr = arr.concat(getHintsFromGroup(calc.state.currentGroup));

				return arr;
			},
			enableInlineRelationEditor: true
		});

		this.state.editors.group.state.editor.on('change', function () {
			var result_container = $('#tab-editor-group').find('> .exec-result');
			result_container.empty();
		});

		this.options.editorContainers.group.find('.editor-group-new-relation').click(function () {
			calc.state.editors.group.openModalInlineEditor_inlineRelationNew();
		});
		this.options.editorContainers.group.find('.editor-group-import-sql').click(function () {
			calc.modalSqlDumpOpen();
		});


		// modal dialog for sqldump editor
		this.state.editors.sqldump = new Editor({
			textarea: this.options.editorContainers.sqldump.find('textarea'),
			execErrors: this.options.editorContainers.sqldump.find('.exec-errors'),
			execButton: this.options.editorContainers.sqldump.find('.exec-button'),
			execFunction: function (text) {
				var ast = relalgjs.parseSQLDump(text);
				ast.groups[0].headers.group = i18n.t('calc.editors.group.sql-import-group-name-placeholder');

				var result = relalgjs.textFromGroupAstRoot(ast);
				calc.state.editors.group.setText(result, true);

				calc.modalSqlDumpClose();
			},
			linterFunction: function (text) {
				var ast = relalgjs.parseSQLDump(text);
				ast.groups[0].headers.group = ''; // start with empty name

				return [];
			}
		});

		this.options.modalSqlDump.on('shown.bs.modal', function (e) {
			calc.state.editors.sqldump.refresh();
		});


		// save the current editor and track changes
		this.state.currentEditorName = 'ra';
		$('#main-editors').find('a[data-toggle="tab"]').on('shown.bs.tab', function (e) {
			var activatedTab = e.target;
			var previousTab = e.relatedTarget;

			calc.state.currentEditorName = $(activatedTab).attr('href').replace(/#tab-editor-/, '');


			calc.state.editors[calc.state.currentEditorName].refresh();
		});


		// add custom extensions to RA editor
		this.state.editors.ra.state.editor.on('beforeChange', function (instance, changeObj) {
			// replace wrong charaters with right one
			if (changeObj !== 'paste')
				return;

			var text = [];
			for (var i = 0; i < changeObj.text.length; i++) {
				text[i] = changeObj.text[i].replace(/×/g, '⨯');
			}
			changeObj.update(changeObj.from, changeObj.to, text);
		});

		// replace text from toolbar
		$('body').on('click', '.replace, .replace-all', function () {
			var text = $(this).data('text') || this.innerHTML;
			//var lang = $(this).data('lang');

			var replaceSelection = $(this).hasClass('replace-all') === false;
			var editor = calc.state.editors[calc.state.currentEditorName];

			editor.setText(text, replaceSelection);
			editor.focus();
		});

		// datepicker for toolbar
		$('.insert-date-datepicker').datepicker({
			format: "yyyy-mm-dd",
			multidate: false,
			autoclose: true,
		}).on('changeDate', function(e){
			let date = e.format();
			let editor = calc.state.editors[calc.state.currentEditorName];
			editor.setText(`date('${date}')`, true);
			editor.focus();
		});


		// controller stuff
		$('*.has-tooltip[title]').tooltip({
			container: 'body',
			html: true
		});

		this.options.groupsSelector.on('click', 'a[data-group-gid][data-group-type]', function () {
			var e = $(this);
			var type = e.data('group-type');
			var gid = e.data('group-gid');

			calc.changeToGroup(type, gid);
		});
		this.options.groupsSelector.on('click', 'table', function (e) {
			e.stopPropagation();
			e.preventDefault();
		});

		function groupSelectLoadGist() {
			// gist load is the only button
			var input = calc.options.groupsSelector.find('input.gist-load-input');
			var id = input.val();
			if (id.trim().length === 0)
				return;

			calc.loadGroupFromGist(id, true, function (err) {
				if (!err) {
					input.val('');
					calc.options.groupsSelector.find('.dropdown-toggle').dropdown('toggle');

					calc.displayAlertMsg(i18n.t('calc.messages.gist-load-success'), 'success', 20);
				}
				else {
					console.error(err);
				}
			});
		}

		this.options.groupsSelector.on('click', '.open-group-new-btn', function () {
			calc.openGroupEditor('new');
		});
		this.options.groupsSelector.on('click', '.open-group-current-btn', function () {
			calc.openGroupEditor('current');
		});

		this.options.groupsSelector.on('click', '.gist-load-btn', groupSelectLoadGist);
		this.options.groupsSelector.on('keyup', '.gist-load-input', function (e) {
			if (e.keyCode !== 13)
				return;

			groupSelectLoadGist();
		});


		$('.codemirror-toolbar span[data-name]').popover({
			trigger: 'hover',
			container: '#toolbar-popovers',
			placement: 'bottom',
			title: function () {
				let name = $(this).data('name');
				let title = i18n.t(name);
				return title;
			},
			content: function () {
				let name = $(this).data('name');
				let content = i18n.t(name + '-content');
				return content;
			},
			html: true
		});

		this.tour = this._initTour();
		let tour = this.tour;
		$('#start-tour').click(function () {
			tour.restart();
		});
	}

	modalSqlDumpOpen() {
		/*if(setCurrentGroupDefinition === true && this.state.currentGroup){
		 var definition = this.state.currentGroup.definition;
		 this.state.editors.group.setText(definition);
		 }*/

		this.options.modalSqlDump.modal('show');
	}

	modalSqlDumpClose() {
		this.options.modalSqlDump.modal('hide');
	}

	openGroupEditor(cmd) {
		var text = null;

		if (cmd === 'current' && this.state.currentGroup) {
			text = this.state.currentGroup.definition;
		}
		else if (cmd === 'new') {
			text = i18n.t('calc.editors.group.new-group-example-group');
		}

		if (text !== null) {
			this.state.editors.group.setText(text);
		}

		// sitch to tab
		$('#main-editors').find('> ul a:last').tab('show');
	}

	displayRaResult(root) {
		var container = $('<div class="ra-result clearfix"><div class="tree"></div><div class="result"></div></div>');

		// add result table
		var resultContainer = container.find('> .result');
		resultContainer.html(CalculatorHelpers.getRaResultHtml(root));

		// add result tree
		var treeContainer = container.find('> .tree');
		treeContainer.html(CalculatorHelpers.getRaTreeHtml(root, this.options.numTreeLabelColors));

		// mark root of tree as active
		treeContainer.find('a').first().addClass('active');

		// register handlers for partial results
		treeContainer.find('a.formula').click(function (event) {
			treeContainer.find('a.formula.active').removeClass('active');
			$(this).addClass('active');

			var raNode = $(this).data('raNode');
			resultContainer.html(CalculatorHelpers.getRaResultHtml(raNode));
		});

		this.options.resultContainers[this.state.currentEditorName].html(container);
	}

	updategroupsSelector() {
		var list = this.options.groupsSelectorList;
		// tags: <span class="label label-default">book</span>

		var types = ['static', 'gist', 'own'];
		var i, j, type, group, gid, headline, ul;


		var entries = {};
		list.empty();

		// collect all groups and group them by their maintainer's group-name
		for (i = 0; i < types.length; i++) {
			type = types[i];

			for (gid in this.state.groups[type]) {
				if (!this.state.groups[type].hasOwnProperty(gid))
					continue;

				group = this.state.groups[type][gid];


				if (group.sourceInfo && group.sourceInfo.maintainerGroup) {
					headline = group.sourceInfo.maintainerGroup;
				}
				else {
					// e.g loaded from gist or unsaved own
					headline = i18n.t('calc.maintainer-groups.temp');
				}

				if (!entries[headline])
					entries[headline] = [];

				entries[headline].push({
					gid: gid,
					type: type,
					group: group,

					name: group.groupName,
					active: group === this.state.currentGroup
				});
			}
		}

		for (headline in entries) {
			if (!entries.hasOwnProperty(headline))
				continue;

			entries[headline].sort(function (a, b) {
				return a.name.localeCompare(b.name);
			});

			ul = $('<ul>');

			for (i = 0; i < entries[headline].length; i++) {
				ul.append(
					`<li class="${entries[headline][i].active ? 'active' : ''}">
						<a href="#" data-group-type="${entries[headline][i].type}" data-group-gid="${entries[headline][i].gid}">
							${entries[headline][i].name}
						</a>
					</li>`
				);
			}

			list.append('<li>' + headline + '</li>');
			list.children('li:last-child').append(ul);
		}

		//name of current group
		var buttonText = this.options.groupsSelector.find('> button > span:first-child');
		if (this.state.currentGroup) {
			buttonText.text(this.state.currentGroup.groupName);
		}
	}

	changeToGroup(type, gid) {
		this.state.currentGroup = this.state.groups[type][gid];

		var group = this.state.currentGroup;
		var tid, table;

		// create relation references
		this.state.relations = {};
		for (tid in group.tables) {
			table = group.tables[tid];
			this.state.relations[table.tableName] = table.relation;
		}


		this.updategroupsSelector();
		this.updateGroupRelationList();
		this.updateGroupInfoDesc();

		// force the linter to reevaluate the query with the new relations for all editors
		this.state.editors.ra.forceLinterRun();
		this.state.editors.sql.forceLinterRun();
	}

	updateGroupInfoDesc() {
		var group = this.state.currentGroup;
		var groupInfo = this.options.groupInfo;
		var groupDesc = this.options.groupDesc;

		// set description
		groupDesc.html(group.groupDesc ? marked(group.groupDesc) : '');
		groupDesc.find('a').attr('target', '_blank');
		groupInfo.html(group.groupInfo || '');
	}

	/** builds the ul with the relations and columns */
	updateGroupRelationList(argGroup) {
		var groupUL = this.options.groupRelationList;
		var group = argGroup || this.state.currentGroup;
		var i, tid, table, schema;


		groupUL.empty();

		for (tid in group.tables) {
			if (!group.tables.hasOwnProperty(tid))
				continue;

			table = group.tables[tid];
			schema = table.relation.getSchema();

			var tableLI = $('<li>');
			var tableEntry = $('<span>').addClass('replace').text(table.tableName);

			// create popover
			var title, content;

			var maxRows = 4;
			var result = table.relation.getResult();

			content = $(result.getHtml(true, maxRows));
			content.addClass('table').addClass('table-condensed');

			if (result.getNumRows() > maxRows) {
				var ellipsis = $('<tr>');
				for (i = 0; i < result.getNumCols(); i++) {
					ellipsis.append($('<td>').html('&hellip;'));
				}

				content.find('tbody').append(ellipsis);
			}


			title = table.tableName + ' (' + result.getNumRows() + ' row' + (result.getNumRows() > 1 ? 's)' : ')');

			tableEntry.popover({
				html: true,
				trigger: 'hover',
				container: 'body',
				placement: 'right',
				delay: {
					show: 2000,
					hide: 100
				},
				title: title,
				content: content
			});


			tableLI.append(tableEntry);

			var ul = $('<ul>');
			for (i = 0; i < schema.getSize(); i++) {
				var c = schema.getColumn(i);
				ul.append(
					$('<li>')
						.append($('<span>').addClass('replace').text(c.getName()))
						.append(' <small class="muted text-muted">' + c.getType() + '</small>')
				);
			}

			tableLI.append(ul);
			groupUL.append(tableLI);
		}
	}

	displayAlertMsg(text, type, timeout) {
		type = type || 'danger';
		timeout = typeof timeout === 'undefined' ? false : timeout;
		var header = {
			'success': i18n.t('editor.alert-message-headers.success'),
			'info': i18n.t('editor.alert-message-headers.info'),
			'warning': i18n.t('editor.alert-message-headers.warning'),
			'danger': i18n.t('editor.alert-message-headers.error')
		}[type];

		if (typeof header === 'undefined')
			throw 'this should not happen; type not found';

		var el = $('<div>').addClass('alert alert-' + type + ' alert-dismissable');
		el.append('<button type="button" class="close" data-dismiss="alert" aria-hidden="true">&times;</button>');
		el.append('<strong>' + header + ': </strong>');
		el.append(text);
		el.alert();
		if (timeout !== false) {
			window.setTimeout(function () {
				el.alert('close');
			}, timeout * 1000);
		}

		this.options.alertContainer.prepend(el);
	}

	mergeNewGroups(newGroups, type, doChangeToFirstGroup) {
		var i, id;
		var firstId = null;

		for (i = 0; i < newGroups.length; i++) {
			id = CalculatorHelpers.StringHashCode(newGroups[i].definition);

			this.state.groups[type][id] = newGroups[i];

			if (i === 0) {
				firstId = id;
			}
		}

		if (firstId !== null && doChangeToFirstGroup === true) {
			this.changeToGroup(type, firstId);
		}
		else {
			this.updategroupsSelector();
		}
	}

	loadStaticGroups(doChangeToFirstGroup) {
		var self = this;
		var source, id;
		var g;

		for (var i = this.options.staticGroups.length - 1; i >= 0; i--) {
			g = this.options.staticGroups[i];

			CalculatorHelpers.loadGroupsFromSource(g.source, g.url, {maintainerGroup: g.maintainerGroup}, (function (isFirst) {
				return function (err, newGroups) {
					if (err) {
						self.displayAlertMsg(err);
						console.error(err);
						return;
					}

					self.mergeNewGroups(newGroups, 'static', doChangeToFirstGroup && isFirst);
				};
			})(i == 0));
		}
	}

	loadGroupFromGist(gistId, doChangeToFirstGroup, finishedCallback) {
		// clear gistId
		gistId = gistId.toString().trim();
		var match = /([a-zA-Z0-9]+)$/.exec(gistId);
		if (match.length === 2) {
			gistId = match[1];
		}


		var self = this;
		CalculatorHelpers.loadGroupsFromSource('gist', gistId, {}, function (err, newGroups) {
			if (err) {
				self.displayAlertMsg(err);
				console.error(err);

				finishedCallback && finishedCallback(err);

				return;
			}

			self.mergeNewGroups(newGroups, 'gist', doChangeToFirstGroup);

			finishedCallback && finishedCallback(null);
		});
	}

	_initTour() {
		let calc = this;
		let tour = new Tour({
			//storage: false,
			debug: false,
			backdropPadding: 10,
			steps: [
				{
					orphan: true,
					content: i18n.t('calc.tour.welcome'),
					backdrop: true,
				},
				{
					element: '#groups-selector',
					placement: 'bottom',
					backdrop: true,
					title: '',
					content: i18n.t('calc.tour.choose-dataset-here')
				},
				{
					element: '#groups-selector-list',
					placement: 'right',
					content: i18n.t('calc.tour.currently-loaded-datasets'),
					onShow: function (tour) {
						$('#groups-selector').find('> .dropdown-menu').css('display', 'block');
					},
					onHide: function (tour) {
						$('#groups-selector').find('> .dropdown-menu').css('display', '');
					}
				},
				{
					element: '#groups-selector > div .row > div:nth-child(2) > div:first-child',
					placement: 'left',
					content: i18n.t('calc.tour.load-dataset-via-gist'),
					onShow: function (tour) {
						$('#groups-selector').find('> .dropdown-menu').css('display', 'block');
					},
					onHide: function (tour) {
						$('#groups-selector').find('> .dropdown-menu').css('display', '');
					}
				},
				{
					element: '#groups',
					placement: 'right',
					backdrop: true,
					content: i18n.t('calc.tour.relation-attributes'),
				},
				{
					element: '#tab-editor-ra > .toolbar',
					placement: 'bottom',
					backdrop: true,
					content: i18n.t('calc.tour.ra-toolbar'),
					onShow: function (tour) {
						// switch to RA tab
						$('#main-editors').find('> ul > li:nth-child(1) > a').tab('show');
					}
				},
				{
					element: '#tab-editor-ra .CodeMirror',
					placement: 'top',
					backdrop: true,
					content: i18n.t('calc.tour.ra-statement-goes-here'),
				},
				{
					element: '#tab-editor-ra .CodeMirror',
					placement: 'top',
					content: i18n.t('calc.tour.ra-example-query'),
					onShow: function (tour) {
						calc.changeToGroup('static', 358242007); // load the R,S,T set

						var editor = calc.state.editors[calc.state.currentEditorName];
						editor.setText("π a, c (\n	σ a < 3 (\n		R ⨝ S\n	)\n)", false);
					},
				},
				{
					element: '#tab-editor-ra .CodeMirror',
					placement: 'top',
					content: i18n.t('calc.tour.ra-example-query-plaintext'),
					onShow: function (tour) {
						calc.changeToGroup('static', 358242007); // load the R,S,T set

						var editor = calc.state.editors.ra;
						editor.setText("pi a, c (\n	sigma a < 3 (\n		R join S\n	)\n)", false);
					},
				},
				{
					element: '#tab-editor-ra .exec-button',
					placement: 'top',
					reflex: false,
					content: i18n.t('calc.tour.ra-example-execute-it'),
					onNext: function (tour) {

						tour.end();

						var handler = function (e) {
							if (e.detail.editor === calc.state.editors.ra) {
								document.removeEventListener('editor.execSuccessful', handler);

								tour.goTo(tour.getCurrentStep() + 1);
								tour.start(true);
							}
						};
						document.addEventListener('editor.execSuccessful', handler, false);
						$('#tab-editor-ra').find('.exec-button').trigger('click');
					},
				},
				{
					element: '#tab-editor-ra .exec-result .result',
					placement: 'top',
					backdrop: true,
					content: i18n.t('calc.tour.ra-example-result')
				},
				{
					element: '#tab-editor-ra .exec-result .tree > ul',
					placement: 'top',
					backdrop: true,
					content: i18n.t('calc.tour.ra-example-operator-tree')
				},

				// SQL
				{
					element: '#main-editors > ul > li:nth-child(2)',
					placement: 'bottom',
					content: i18n.t('calc.tour.switch-to-sql'),
					onHide: function (tour) {
						// switch to SQL tab
						$('#main-editors').find('> ul > li:nth-child(2) > a').tab('show');
					}
				},
				{
					element: '#tab-editor-sql .CodeMirror',
					placement: 'top',
					content: i18n.t('calc.tour.sql-example-query'),
					onShow: function (tour) {
						calc.changeToGroup('static', 358242007); // load the R,S,T set

						var editor = calc.state.editors.sql;
						editor.setText("select distinct a, c\nfrom R\n	natural join S\nwhere a < 3", false);
					},
				},
				{
					element: '#tab-editor-sql .exec-button',
					placement: 'top',
					reflex: false,
					content: i18n.t('calc.tour.sql-example-execute-it'),
					onNext: function (tour) {

						tour.end();

						var handler = function (e) {
							if (e.detail.editor === calc.state.editors.sql) {
								document.removeEventListener('editor.execSuccessful', handler);

								tour.goTo(tour.getCurrentStep() + 1);
								tour.start(true);
							}
						};
						document.addEventListener('editor.execSuccessful', handler, false);
						$('#tab-editor-sql').find('.exec-button').trigger('click');
					},
				},
				{
					element: '#tab-editor-sql .exec-result',
					placement: 'top',
					backdrop: true,
					content: i18n.t('calc.tour.sql-example-result'),
				},

				// END
				{
					orphan: true,
					title: 'the end',
					content: i18n.t('calc.tour.end'),
					onShow: function (tour) {
						// switch to relalg tab
						$('#main-editors').find('> ul > li:nth-child(1) > a').tab('show');
					}
				}

			]
		});
		tour.init();
		return tour;
	}

	startTourWhenNew(delayMs) {
		let tour = this.tour;
		setTimeout(function () {
			tour.start();
		}, delayMs);
	}
}

// global export
global.Calculator = Calculator;