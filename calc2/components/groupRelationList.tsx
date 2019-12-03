/*** Copyright 2018 Johannes Kessler
*
* This Source Code Form is subject to the terms of the Mozilla Public
* License, v. 2.0. If a copy of the MPL was not distributed with this
* file, You can obtain one at http://mozilla.org/MPL/2.0/. */

import { GroupTable } from 'calc2/store/groups';
import * as React from 'react';

require('./groupRelationList.scss');

interface Props {
	tables: GroupTable[],
	/**
	 * replace the current selection of the current editor with the given text
	 */
	replace?(text: string): void,
}

export const GroupRelationList: React.StatelessComponent<Props> = ({ tables, replace }) => (
	<div className="groupRelationList">
		<ul>
			{tables.map((table) => {
				const { columnNames, columnTypes, tableName } = table;
				return (
					<li key={tableName}>
						<span className="clickable" onClick={() => replace && replace(tableName)}>{tableName}</span>
						<ul>
							{table.columnNames.map((name, i) => (
								<li key={name}><span className="clickable" onClick={() => replace && replace(name)}>{name}</span> <small className="muted text-muted">{columnTypes[i]}</small></li>
							))}
						</ul>
					</li>
				);
			})}
		</ul>
	</div>
);

// TODO: popover

/*
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
*/
