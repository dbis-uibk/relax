/*** Copyright 2018 Johannes Kessler
*
* This Source Code Form is subject to the terms of the Mozilla Public
* License, v. 2.0. If a copy of the MPL was not distributed with this
* file, You can obtain one at http://mozilla.org/MPL/2.0/. */

import { Popover } from 'calc2/components/popover';
import classNames from 'classnames';
import { RANode, RANodeNullary, RANodeUnary, RANodeBinary } from 'db/exec/RANode';
import * as React from 'react';
import { t } from 'calc2/i18n';
import Button from 'reactstrap/es/Button';
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import { faSearchMinus, faSearchPlus, faRefresh, faDownLeftAndUpRightToCenter } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { TransformWrapper, TransformComponent, useControls, ReactZoomPanPinchRef } from "react-zoom-pan-pinch";

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
				// Split relation aliases into array
				const variableNames = n.hasMetaData('fromVariable') ? n.getMetaData('fromVariable')!.split(" ") : [];

				if (variableNames.length === 1 && (
					// If the relation alias is not the same as the function name, add the relation alias to the tree
					(n instanceof RANodeNullary && n._functionName !== variableNames[0]) ||
					// If the relation alias is not the same as the child's relation alias, add the relation alias to the tree
					(n instanceof RANodeUnary && n.getChild().getMetaData('fromVariable') !== variableNames[0]) ||
					// If the relation alias is not the same as the child's relation alias or the child2's relation alias,
					// add the relation alias to the tree
					(n instanceof RANodeBinary && n.getChild().getMetaData('fromVariable') !== variableNames[0]
						&& n.getChild2().getMetaData('fromVariable') !== variableNames[0])
				)) {
					const variableName = variableNames[0];
					if (usedVariableNames.has(variableName) === false) {
						usedVariableNames.set(variableName, usedVariables++);
					}

					const num = usedVariableNames.get(variableName)! % numColors;
					fromVariableMarker = <span> <span className={`label label-info label-info-${num}`}>{variableName} =</span> </span>;
				}
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
							n._execTime ? <p>{t('calc.result.exec.time')} {(n._resTime || n._execTime)?.toFixed(2)}ms {n._resTime ?`(${n._execTime.toFixed(2)}ms)` : ''}</p> : <p>{t('calc.result.exec.time')} - ms</p>
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
								{fromVariableMarker}<span dangerouslySetInnerHTML={{ __html: n.getFormulaHtml(false, false) }} /><br />
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

		const Controls = () => {
			const { zoomIn, zoomOut, resetTransform, centerView } = useControls();

			return (
				<div className="pan-zoom-controls">
					<style>{`
						.pan-zoom-controls button {
							background: transparent;
							border: none;
							border-radius: 4px;
							height: 28px;
							padding: 3px 7px;
						}

						.pan-zoom-controls button:focus {
							box-shadow: none;
						}

						.pan-zoom-controls button:disabled {
							background: transparent;
							opacity: 0.5;
							cursor: not-allowed;
						}
					`}</style>
					<Button className="zoom-in" title={t('calc.editors.ra.button-zoom-in')} color="" onClick={() => zoomIn(0.1)}>
						<span><FontAwesomeIcon icon={faSearchPlus as IconProp} /></span>
					</Button>
					<Button className="zoom-out" title={t('calc.editors.ra.button-zoom-out')} color="" onClick={() => zoomOut(0.1)}>
						<span><FontAwesomeIcon icon={faSearchMinus as IconProp} /></span>
					</Button>
					<Button className="zoom-reset" title={t('calc.editors.ra.button-zoom-reset')} color="" onClick={() => {
						resetTransform();
						centerView(1);
					}}>
						<span><FontAwesomeIcon icon={faRefresh as IconProp} /></span>
					</Button>
					<Button className="center-view" title={t('calc.editors.ra.button-zoom-center')} color="" onClick={() => {
						const containers = document.getElementsByClassName('ra-result') as HTMLCollectionOf<HTMLElement>;
						let containerElement;
						// Find the first visible tree
						for (let i = 0; i < containers.length; i++) {
							// Check if the element is visible
							if (containers[i].offsetParent !== null) {
								containerElement = containers[i] as HTMLElement;
								break;
							}
						}

						if (!containerElement) {
							return;
						}

						const newScale =
							(containerElement.querySelector('.react-transform-wrapper') as HTMLElement).offsetWidth /
							(containerElement.querySelector('.ra-tree') as HTMLElement).offsetWidth;

						// if the new scale is less than or equal to 1, zoom out to fit
						if (newScale <= 1) {
							centerView(newScale);
						}
						else {
							centerView(1);
						}
					}}>
						<span><FontAwesomeIcon icon={faDownLeftAndUpRightToCenter as IconProp} /></span>
					</Button>
				</div>
			);
		};

		return (
			<TransformWrapper
				centerOnInit={true}
				centerZoomedOut={true}
				minScale={0.1}
				maxScale={1}
				wheel={{ disabled: true }}
				pinch={{ disabled: true }}
				doubleClick={{ disabled: true }}
				zoomAnimation={{ disabled: true }}
				alignmentAnimation={{ disabled: true }}
				velocityAnimation={{ disabled: true }}
				onTransformed={(ref: ReactZoomPanPinchRef, state: {
					scale: number;
					positionX: number;
					positionY: number
				}) => {
					const containers = document.getElementsByClassName('ra-result') as HTMLCollectionOf<HTMLElement>;
					let containerElement;
					// Find the first visible tree
					for (let i = 0; i < containers.length; i++) {
						// Check if the element is visible
						if (containers[i].offsetParent !== null) {
							containerElement = containers[i] as HTMLElement;
							break;
						}
					}

					if (containerElement) {
						const controlElement = containerElement.querySelector('.pan-zoom-controls');
						const zoom = parseFloat(state.scale.toString()) * 100;
						const minScale =
							(containerElement.querySelector('.react-transform-wrapper') as HTMLElement).offsetWidth /
							(containerElement.querySelector('.ra-tree') as HTMLElement).offsetWidth;

						if (controlElement) {
							const zoomIn = controlElement.querySelector('.zoom-in');
							if (zoomIn) {
								if (zoom === 100) {
									(zoomIn as HTMLButtonElement).disabled = true;
								}
								else (zoomIn as HTMLButtonElement).disabled = false;
							}

							const zoomOut = controlElement.querySelector('.zoom-out');
							if (zoomOut) {
								if (zoom <= minScale * 100) {
									(zoomOut as HTMLButtonElement).disabled = true;
								}
								else (zoomOut as HTMLButtonElement).disabled = false;
							}

							const zoomReset = controlElement.querySelector('.zoom-reset');
							const zoomCenter = controlElement.querySelector('.center-view');
							if (zoomReset && zoomCenter) {
								if (minScale >= 1) {
									(zoomReset as HTMLButtonElement).disabled = true;
									(zoomCenter as HTMLButtonElement).disabled = true;
								}
								else {
									(zoomReset as HTMLButtonElement).disabled = false;
									(zoomCenter as HTMLButtonElement).disabled = false;
								}
							}
						}
					}
				}}
			>
				{({ zoomIn, zoomOut, resetTransform, ...rest }) => (
					<>
						<Controls />
						<TransformComponent
							wrapperStyle={{
								width: "100%",
								zoom: '100%',
							}}
						>
							<div className="ra-tree" style={{ width: 'fit-content' }}>
								<div className="tree" style={{ width: 'max-content' }}>
									<ul>
										{rec(root)}
									</ul>
								</div>
							</div>
						</TransformComponent>
					</>
				)}
			</TransformWrapper>
		);
	}
}
