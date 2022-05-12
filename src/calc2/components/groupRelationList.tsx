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
	onElementClick: Function | null,
}

// @ts-ignore
export const GroupRelationList: React.StatelessComponent<Props> = ({ tables, replace, onElementClick }) => (
	
	<div className="groupRelationList">
		<ul>
			{tables.map((table: any) => {
				const { columnNames, columnTypes, tableName } = table;
				return (
					<li key={tableName}>
						<span className="clickable" onClick={() => {
							replace && replace(tableName);
							if (onElementClick){
								onElementClick();
							}
						}}>{tableName}</span>
						<ul>
							{table.columnNames.map((name: any, i: number) => (
								<li key={name}><span className="clickable" onClick={() => {
									replace && replace(name); 
									if (onElementClick){
										onElementClick();
									}
								}}>{name} <small className="muted text-muted">{columnTypes[i]}</small></span> </li>
							))}
						</ul>
					</li>
				);
			})}
		</ul>
	</div>
);
