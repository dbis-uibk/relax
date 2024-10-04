/*** Copyright 2018 Johannes Kessler
*
* This Source Code Form is subject to the terms of the Mozilla Public
* License, v. 2.0. If a copy of the MPL was not distributed with this
* file, You can obtain one at http://mozilla.org/MPL/2.0/. */

import { PagedTable } from 'calc2/components/pagedTable';
import { RaTree } from 'calc2/components/raTree';
import { RANode } from 'db/exec/RANode';
import { Table } from 'db/exec/Table';
import memoize from 'memoize-one';
import * as React from 'react';
import {t} from "calc2/i18n";

require('./result.scss');

const maxLinesPerPage = 10;

type Props = {
	root: RANode,
	numTreeLabelColors: number,
	execTime?: any,
	doEliminateDuplicates: boolean
};

type State = {
	result: null | Table,
	activeNode: RANode,
	execTime: any,
	doEliminateDuplicates: boolean
};

export class Result extends React.Component<Props, State> {
	private result = memoize(
		(node: RANode, doEliminateDuplicates?: boolean) => {
			try {
				node.check();
				return node.getResult(doEliminateDuplicates);
			}
			catch (e) {
				console.error(e);
				return null;
			}
		},
	);

	constructor(props: Props) {
		super(props);

		this.state = {
			activeNode: props.root,
			result: null,
			execTime: null,
			doEliminateDuplicates: props.doEliminateDuplicates
		};

		this.setActiveNode = this.setActiveNode.bind(this);
	}

	setActiveNode(activeNode: RANode): void {
		this.setState({
			activeNode,
		});
	}

	render() {
		const { root, numTreeLabelColors, execTime, doEliminateDuplicates } = this.props;
		const { activeNode } = this.state;

		const result = this.result(activeNode, doEliminateDuplicates);


		return (
			<div className="ra-result clearfix">
				<div>
					<RaTree
						root={root}
						activeNode={activeNode}
						numTreeLabelColors={numTreeLabelColors}
						setActiveNode={this.setActiveNode}
					/>
				</div>

				<div className="result">
					<div>
						<h4
							className="result-formula"
							dangerouslySetInnerHTML={{
								__html: activeNode.getFormulaHtml(true, false),
							}}
						/>
						<div>
							{t('calc.result.exec.time')} {execTime} ms
						</div>
						<div className="result-table">
							{result
								? (
									<PagedTable
										className="table table-condensed"
										maxLinesPerPage={maxLinesPerPage}
										table={result}
										showPagination={true}
									/>
								)
								: null
							}
						</div>
					</div>
				</div>

			</div>
		);
	}
}
