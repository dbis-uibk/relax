/*** Copyright 2018 Johannes Kessler
*
* This Source Code Form is subject to the terms of the Mozilla Public
* License, v. 2.0. If a copy of the MPL was not distributed with this
* file, You can obtain one at http://mozilla.org/MPL/2.0/. */

import { Popover } from 'calc2/components/popover';
import classNames from 'classnames';
import { RANode, RANodeBinary, RANodeUnary } from 'db/exec/RANode';
import * as React from 'react';
import { t } from 'calc2/i18n';

require('./raTree.scss');
// require('./raTreeFamilyTree.scss');

interface Props {
	root: RANode,
	activeNode: RANode,
	/** defaults to 0 */
	numTreeLabelColors?: number,
	setActiveNode?(activeNode: RANode): void,
	doEliminateDuplicates?: boolean,
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
			doEliminateDuplicates,
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
				n.getResult(doEliminateDuplicates);

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

						<p>{`${numRows} row${numRows === 1 ? '' : 's'}`}</p>

						{n.getMetaData('isInlineRelation') === true && n.hasMetaData('inlineRelationDefinition')
							? <pre>{n.getMetaData('inlineRelationDefinition')}</pre>
							: null
						}
						{
							n._execTime ? <p>{t('calc.result.exec.time')} {n._execTime}ms</p> : <p>{t('calc.result.exec.time')} - ms</p>
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
								{fromVariableMarker}<span dangerouslySetInnerHTML={{ __html: n.getFormulaHtml(false, false) }} /><br/>
								<span className="resultCountLabel">{`${n.getResultNumRows()} row${n.getResultNumRows() === 1 ? '' : 's'}`}</span>
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
