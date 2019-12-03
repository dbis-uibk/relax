/*** Copyright 2018 Johannes Kessler
*
* This Source Code Form is subject to the terms of the Mozilla Public
* License, v. 2.0. If a copy of the MPL was not distributed with this
* file, You can obtain one at http://mozilla.org/MPL/2.0/. */

import { DropdownElement, DropdownList } from 'calc2/components/dropdownList';
import { Popover } from 'calc2/components/popover';
import { LanguageKeys, T, t } from 'calc2/i18n';
import * as React from 'react';

require('./toolbar.scss');

export type Item<V = string> = {
	type?: 'item',
	label: string | JSX.Element,
	tooltip: LanguageKeys,
	tooltipTitle?: LanguageKeys,
	onClick: (item: Item) => void,
} | {
	type: 'dropdown',
	label: string | JSX.Element,
	tooltip: LanguageKeys,
	tooltipTitle?: LanguageKeys,
	elements: DropdownElement<V>[],
	value: V,
	onChange: (value: V) => void,
};
export type Group = {
	/** defaults to false */
	math?: boolean,
	items: Item[],
};

interface Props {
	groups: Group[],
}

export class Toolbar extends React.Component<Props> {
	render() {
		const { groups } = this.props;
		return (
			<div className="toolbar codemirror-toolbar">
				{groups.map((group, index) => (
					<div className={group.math ? 'math' : ''} key={index}>
						{group.items.map((item, index) => (
							<Popover
								key={index}
								trigger={['hover', 'focus']}
								placement={item.type === 'dropdown' ? 'top' : 'bottom'}
								title={item.tooltipTitle ? t(item.tooltipTitle) : ''}
								body={<T id={item.tooltip} html={true} />}
								className="toolbar__popover"
							>
								{item.type === 'dropdown'
									? <DropdownList label={item.label} elements={item.elements} onChange={item.onChange} value={item.value} />
									: <span onClick={e => {
										e.preventDefault();
										e.stopPropagation();

										item.onClick(item);
									}}>{item.label}</span>
								}
							</Popover>
						))}
					</div>
				))}
			</div>
		);
	}
}