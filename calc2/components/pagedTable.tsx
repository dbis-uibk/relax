/*** Copyright 2018 Johannes Kessler
*
* This Source Code Form is subject to the terms of the Mozilla Public
* License, v. 2.0. If a copy of the MPL was not distributed with this
* file, You can obtain one at http://mozilla.org/MPL/2.0/. */

import { TablePagination } from 'calc2/components/pagination';
import { Table } from 'db/exec/Table';
import { printValue } from 'db/exec/ValueExpr';
import * as React from 'react';

require('./pagedTable.scss');

interface Props {
	table: Table,
	maxLinesPerPage: number,
	/** defaults to true */
	showPagination?: boolean,
	className?: string,
}

interface State {
	page: number,
}

export class PagedTable extends React.Component<Props, State> {
	constructor(props: Props) {
		super(props);
		this.state = {
			page: 0,
		};
	}

	render() {
		const { table, maxLinesPerPage, showPagination = true, className = '' } = this.props;
		const { page } = this.state;
		const schema = table.getSchema();
		return (
			<div className="result-table pagedTable">
				<table className={className}>
					<thead>
						<tr>
							{schema.getColumns().map((c, i) => (
								<th key={i}>{c.toString()}</th>
							))}
						</tr>
					</thead>
					<tbody>
						{table.getRows((page) * maxLinesPerPage, maxLinesPerPage).map((row, i) => (
							<tr key={`row ${i}`}>
								{row.map((value, j) => {
									const type = schema.getType(j);
									return (
										<td key={`value ${j}`} className={`${type} ${value === null ? 'null' : ''}`}>{printValue(value, type)}</td>
									);
								})}
							</tr>
						))}
					</tbody>
				</table>
				{showPagination
					? (
						<div className="pagination">
							<TablePagination
								total={table.getNumRows()}
								maxLinesPerPage={maxLinesPerPage}
								pageChanged={(page) => this.setState({ page })}
								currentPage={page}
							/>
						</div>
					)
					: null
				}
			</div>
		);
	}
}
