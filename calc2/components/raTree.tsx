/*** Copyright 2018 Johannes Kessler
*
* This Source Code Form is subject to the terms of the Mozilla Public
* License, v. 2.0. If a copy of the MPL was not distributed with this
* file, You can obtain one at http://mozilla.org/MPL/2.0/. */

import { Popover } from 'calc2/components/popover';
import * as classNames from 'classnames';
import { RANode, RANodeBinary, RANodeUnary } from 'db/exec/RANode';
import * as React from 'react';

require('./raTree.scss');
// require('./raTreeFamilyTree.scss');

interface Props {
	root: RANode,
	activeNode: RANode,
	/** defaults to 0 */
	numTreeLabelColors?: number,
	setActiveNode?(activeNode: RANode): void,
}

export class RaTree extends React.Component<Props> {
	constructor(props: Props) {
		super(props);
	}

	render() {
		const {
			root,
			numTreeLabelColors: numColors = 0,
			activeNode,
			setActiveNode,
		} = this.props;

		let usedVariables = 0;
		const usedVariableNames = new Map<string, number>();

		const rec: (n: RANode) => JSX.Element = n => {
			// descent
			const child: null | JSX.Element = (
				(n instanceof RANodeUnary || n instanceof RANodeBinary)
					? rec(n.getChild())
					: null
			);
			const child2: null | JSX.Element = (
				(n instanceof RANodeBinary)
					? rec(n.getChild2())
					: null
			);

			let fromVariableMarker: string | JSX.Element = '';
			if (n.hasMetaData('fromVariable')) {
				const variableName = n.getMetaData('fromVariable')!;
				if (usedVariableNames.has(variableName) === false) {
					usedVariableNames.set(variableName, usedVariables++);
				}

				const num = usedVariableNames.get(variableName)! % numColors;
				fromVariableMarker = <span> <span className={`label label-info label-info-${num}`}>{variableName} =</span> </span>;
			}


			// create popover
			const popoverBody = () => {
				n.check();
				n.getResult();

				const schema = n.getSchema();
				const numRows = n.getResultNumRows();

				return (
					<div>
						columns:
						<ul>
							{schema.getColumns().map((col, i) => (
								<li key={i}>{col.toString()} <small className="muted text-muted">{schema.getType(i)}</small></li>
							))}
						</ul>

						{(n.hasMetaData('naturalJoinConditions'))
							? (
								<div>natural join conditions:
									<ul>
										{n.getMetaData('naturalJoinConditions')!.map(condition => (
											<li dangerouslySetInnerHTML={{ __html: condition.getFormulaHtml() }}></li>
										))}
									</ul>
								</div>
							)
							: null
						}

						<p>{`${numRows} row ${numRows === 1 ? '' : 's'}`}</p>

						{n.getMetaData('isInlineRelation') === true && n.hasMetaData('inlineRelationDefinition')
							? <pre>{n.getMetaData('inlineRelationDefinition')}</pre>
							: null
						}
					</div>
				);
			};

			return (
				<li>
					<div
						className={classNames({
							'node': true,
							'active': n === activeNode,
						})}
						onClick={() => setActiveNode && setActiveNode(n)}
					>
						<Popover
							title={<div>{fromVariableMarker}<div dangerouslySetInnerHTML={{ __html: n.getFormulaHtml(true, false) }}></div></div>}
							body={popoverBody}
							placement="right"
							trigger="hover"
						>

							<a className="formula">
								{fromVariableMarker}<span dangerouslySetInnerHTML={{ __html: n.getFormulaHtml(false, false) }} />
							</a>

						</Popover>
					</div>
					{child || child2
						? (
							<ul>
								{child}
								{child2}
							</ul>
						)
						: null
					}
				</li>
			);
		};

		return (
			<div className="ra-tree">
				<div className="tree">
					<ul>
						{rec(root)}
					</ul>
				</div>
			</div>
		);
	}
}

/** 
 * generate a syntax-tree from an RA-tree 
 */
/* export function getRaTreeHtml(root, numColorsArg) {
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

		(formula as any).popover({
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
*/
