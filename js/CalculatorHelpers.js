import * as relalgjs from '../../db/relalg';

// just a collection of static functions
export class CalculatorHelpers {
	static StringHashCode(str) {
		// http://stackoverflow.com/a/7616484
		var hash = 0, i, chr, len;
		if (str.length === 0)
			return hash;
		for (i = 0, len = str.length; i < len; i++) {
			chr = str.charCodeAt(i);
			hash = ((hash << 5) - hash) + chr;
			hash |= 0; // Convert to 32bit integer
		}
		return hash;
	}

	static parseGroupsFromDefinition(text, groupInfo, sourceInfo) {
		var groupAst = relalgjs.parseRelalgGroup(text);
		return CalculatorHelpers.getGroupsFromGroupAst(groupAst, groupInfo, sourceInfo);
	}

	static getGroupsFromGroupAst(groupAst, groupInfo, sourceInfo) {
		var groups = [];
		for (var i = 0; i < groupAst.groups.length; i++) {
			var ast_group = groupAst.groups[i];
			relalgjs.replaceVariables(ast_group, []);

			var group = {
				groupName: ast_group.headers.group,
				groupDesc: ast_group.headers.description || '',
				tables: [],
				groupInfo: groupInfo || null,
				sourceInfo: sourceInfo || null,
				definition: ast_group.codeInfo.text
			};

			// tables
			for (var j = 0; j < ast_group.assignments.length; j++) {
				var result = relalgjs.relalgFromRelalgAstNode(ast_group.assignments[j].child, []);
				result.check();

				var relation = result.getResult().createRelation(ast_group.assignments[j].name);

				var schema = relation.getSchema();
				var columnNames = new Array(schema.getSize());
				var columnTypes = new Array(schema.getSize());
				for (var k = 0; k < schema.getSize(); k++) {
					var c = schema.getColumn(k);
					columnNames[k] = c.getName();
					columnTypes[k] = c.getType();
				}

				group.tables[j] = {
					tableId: 1,
					tableName: ast_group.assignments[j].name,
					columnNames: columnNames,
					columnTypes: columnTypes,
					relation: relation
				};
			}

			groups.push(group);
		}
		return groups;
	}

	/**
	 * load group defnition(s) from a remote location;
	 * finishedCallback(err, newGroups)
	 */
	static loadGroupsFromSource(source, id, sourceInfo, finishedCallback) {
		if (!sourceInfo)
			sourceInfo = {};

		function fuzzy_time(date) {
			var diff = ((new Date()) - date) / 1000; // seconds
			var days = Math.ceil(diff / 86400);
			return diff < 60 && 'just now' ||
				diff < 120 && 'one minute ago' ||
				diff < 3600 && Math.ceil(diff / 60) + ' minutes ago' ||
				diff < 7200 && 'one hour ago' ||
				diff < 86400 && Math.floor(diff / 3600) + ' hours ago' ||
				diff < 86400 && 'yesterday' ||
				days < 7 && days + ' days ago' ||
				days < 14 && 'one week ago' ||
				days < 365 && Math.floor(days / 7) + ' weeks ago' ||
				days < 730 && 'one year ago' ||
				Math.floor(days / 365) + ' years ago'
				;
		}

		function gist_success(data) {
			var newGroups = [];
			for (var i in data.files) {
				var info = $('<p>Source: </p>')
					.append($('<a target="_blank">gist.github.com</a>')
						.attr('href', data.html_url)
				);
				var additional = $('<br><small class="text-muted">');

				// owner
				additional.append('by ');
				if (data.owner)
					additional.append($('<a target="_blank">')
							.attr('href', data.owner.html_url)
							.text(data.owner.login)
					);
				else
					additional.append('anonymous');

				if (data.comments > 0)
					additional.append(' (' + data.comments + ' comment' + (data.comments > 1 ? 's)' : ')'));

				additional.append('<br>last modified ' + fuzzy_time(new Date(data.updated_at)));


				info.append(additional);

				try {
					newGroups = newGroups.concat(CalculatorHelpers.parseGroupsFromDefinition(data.files[i].content, info, sourceInfo));

					finishedCallback && finishedCallback(null, newGroups);
				}
				catch (e) {
					var msg = 'could not parse given group from gist with id "' + id + '": ' + e;
					console.error(msg, id, e);
					finishedCallback && finishedCallback(msg, null);
				}
			}
		}

		switch (source) {
			case 'gist':
				jQuery.ajax({
					url: 'https://api.github.com/gists/' + id,
					success: gist_success,
					crossDomain: true,
					statusCode: {
						404: function () {
							finishedCallback && finishedCallback('gist ' + id + ' not found', null);
						}
					},
					async: true
				});
				break;
			case 'http':
				// load all local groups stored in seperate file
				$.get(id, function (data) {
					try {
						var newGroups = CalculatorHelpers.parseGroupsFromDefinition(data, '', sourceInfo);

						finishedCallback && finishedCallback(null, newGroups);
					}
					catch (e) {

						var msg = 'cannot parse groups file: ' + e.message;
						if (e.line)
							msg += ' in line    ' + e.line;
						msg += '<br>see log for more information';

						console.error(msg, e);
						finishedCallback && finishedCallback(msg, null);
					}
				});

				break;
			default:
				throw new Error('unknown source ' + source);
				#Errors could be more elaborative.
		}
	}

	static getRaResultHtml(raNode) {
		var maxLinesPerPage = 50;
		var container = $('<div>');

		// formula
		container.html(
			$('<h4 class="result-formula">').append(raNode.getFormulaHtml(true, false))
		);

		var resultContainer = $('<div class="result-table">');
		container.append(resultContainer);


		var start_time = new Date().getTime();

		var result = raNode.getResult();

		console.log(result.getNumRows() + ' rows in ' + ((new Date().getTime()) - start_time) + 'ms');

		var table = $(result.getHtml(false, maxLinesPerPage, 0));
		table.addClass('table').addClass('table-condensed');

		resultContainer.html(table);

		var numPages = Math.ceil(result.getNumRows() / maxLinesPerPage);
		if (numPages > 1) {
			var pag = $('<div class="result-pag">');
			resultContainer.append(pag);

			pag.bootpag({
				total: numPages,
				page: 1,
				maxVisible: 10,
				leaps: false
			}).on('page',
				(function (oldTable, result, maxLinesPerPage) {
					return function (event, num) {
						var table = $(result.getHtml(false, maxLinesPerPage, (num - 1) * maxLinesPerPage));

						oldTable.find('> tbody').replaceWith(table.find('> tbody'));
					};
				})(table, result, maxLinesPerPage)
			);
			pag.find(' > ul').addClass('pagination');
		}

		//return result.getNumRows();
		return container;
	}


	/** generate a syntaxtree from an RA-tree */
	static getRaTreeHtml(root, numColorsArg) {
		var ul = $('<ul>');

		var numColors = (!numColorsArg) ? 0 : numColorsArg;
		var usedVariables = 0;
		var usedVariableNames = {};


		var rec = function (n) {
			var li = $('<li>');
			var fromVariableMarker = null;

			// formula
			var formula = $('<a>');
			formula.addClass('formula');

			if (n.hasMetaData('fromVariable')) {
				var variableName = n.getMetaData('fromVariable');
				if (typeof usedVariableNames[variableName] === 'undefined')
					usedVariableNames[variableName] = usedVariables++;

				var num = usedVariableNames[variableName] % numColors;
				fromVariableMarker = '<span class="label label-info label-info-' + num + '">' + variableName + ' =</span> ';
				formula.append(fromVariableMarker);
			}

			formula.popover({
				trigger: 'hover',
				container: 'body',
				placement: 'right',
				title: (function () {
					var title = $('<div>');
					if (n.hasMetaData('fromVariable'))
						title.append(fromVariableMarker);
					title.append(n.getFormulaHtml(true, false));

					return title;
				})(),
				content: (function (n) {
					var schema_ul = $('<ul>');
					var schema = n.getSchema();
					var i;

					for (i = 0; i < schema.getSize(); i++) {
						schema_ul.append(
							$('<li>')
								.append(schema.getColumn(i).toString())
								.append(' ')
								.append('<small class="muted text-muted">' + schema.getType(i) + '</small>')
						);
					}

					var numRows = n.getResultNumRows();

					var container = $('<div>')
							.append('columns:')
							.append(schema_ul)
						;


					if (n.hasMetaData('naturalJoinConditions')) {
						var ul = $('<ul>');
						var conditions = n.getMetaData('naturalJoinConditions');
						for (i = 0; i < conditions.length; i++) {
							ul.append($('<li>').append(conditions[i].getFormulaHtml(true, false)));
						}
						container.append($('<div>natural join conditions:</div>').append(ul));
					}

					container.append('<p>' + numRows + ' row' + (numRows == 1 ? '' : 's') + '</p>');

					// add inline table definition
					if (n.hasMetaData('isInlineRelation') && n.getMetaData('isInlineRelation') === true && n.hasMetaData('inlineRelationDefinition')) {
						container.append($('<pre>').text(n.getMetaData('inlineRelationDefinition')));
					}

					return container;
				})(n),
				html: true
			});

			formula.append(n.getFormulaHtml(false, false));
			formula.data('raNode', n);

			li.append(formula);

			// first child
			if (n.hasChild() || n.hasChild2()) {
				var ul = $('<ul>');
				if (n.hasChild())
					ul.append(rec(n.getChild()));
				if (n.hasChild2())
					ul.append(rec(n.getChild2()));
				li.append(ul);
			}

			return li;
		};

		return ul.append(rec(root));
	}
}
