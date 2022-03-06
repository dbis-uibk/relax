/*** Copyright 2018 Johannes Kessler
*
* This Source Code Form is subject to the terms of the Mozilla Public
* License, v. 2.0. If a copy of the MPL was not distributed with this
* file, You can obtain one at http://mozilla.org/MPL/2.0/. */

import * as React from 'react';
import { PaginationItem, PaginationLink } from 'reactstrap';

type Props = {
	maxLinesPerPage: number,
	total: number,
	pageChanged(page: number): void,
	currentPage: number,
};

type State = {
};

export class TablePagination extends React.Component<Props, State> {
	constructor(props: Props) {
		super(props);

		this.state = {
			page: 1,
		};
	}

	shouldComponentUpdate(nextProps: Props, nextState: State) {
		return (
			false
			|| this.props.currentPage !== nextProps.currentPage
			|| this.props.maxLinesPerPage !== nextProps.maxLinesPerPage
			|| this.props.total !== nextProps.total
		);
	}

	setPage(page: number) {
		this.props.pageChanged(page);
	}

	render() {
		const { currentPage, total, maxLinesPerPage } = this.props;
		const maxPages = Math.ceil(total / maxLinesPerPage) - 1;
		const pages: JSX.Element[] = [];
		for (let i = Math.max(currentPage - 2, 0); i <= Math.min(currentPage + 2, maxPages); i++) {
			pages.push(
				<PaginationItem
					key={`item ${i}`}
					disabled={!(i >= 0 && i <= maxPages)}
					active={currentPage === i}
				>
					<PaginationLink onClick={() => this.setPage(i)}>
						{i + 1}
					</PaginationLink>
				</PaginationItem>,
			);
		}

		return (
			<ul className="pagination">
				<PaginationItem disabled={currentPage === 0}>
					<PaginationLink previous onClick={() => this.setPage(currentPage - 1)} />
				</PaginationItem>

				{pages}

				<PaginationItem disabled={currentPage + 1 >= maxPages}>
					<PaginationLink next onClick={() => this.setPage(currentPage + 1)} />
				</PaginationItem>
			</ul>
		);
	}
}
