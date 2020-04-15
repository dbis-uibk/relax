/*** Copyright 2018 Johannes Kessler
*
* This Source Code Form is subject to the terms of the Mozilla Public
* License, v. 2.0. If a copy of the MPL was not distributed with this
* file, You can obtain one at http://mozilla.org/MPL/2.0/. */

import * as React from 'react';
import Dropdown from 'reactstrap/lib/Dropdown';
import DropdownItem from 'reactstrap/lib/DropdownItem';
import DropdownMenu from 'reactstrap/lib/DropdownMenu';
import DropdownToggle from 'reactstrap/lib/DropdownToggle';

interface Props<V> {
	label: string | JSX.Element,
	elements: DropdownElement<V>[],
	value?: V,
	onChange?: (value: V) => void,
	disabled?: boolean,
}

export type DropdownElement<V> = (
	| {
		type: 'separator',
	}
	| {
		type: 'header',
		label: string | JSX.Element,
	}
	| {
		type?: 'element',
		label: string | JSX.Element,
		value: V,
		active?: boolean,
	}
);

type State = {
	isOpen: boolean,
};

export class DropdownList<V = string> extends React.Component<Props<V>, State> {
	private id: string = `dropdown-${Math.random().toString(36).substr(2, 10)}`;

	constructor(props: Props<V>) {
		super(props);

		this.state = {
			isOpen: false,
		};

		this.toggle = this.toggle.bind(this);
	}

	private toggle() {
		this.setState({
			isOpen: !this.state.isOpen,
		});
	}

	render() {
		const { label, elements, value, onChange, disabled = false } = this.props;
		const { isOpen } = this.state;

		return (
			<Dropdown isOpen={isOpen} toggle={this.toggle}>
				<DropdownToggle color="" disabled={disabled || elements.length === 0}>
					{label}
				</DropdownToggle>
				<DropdownMenu>
					{elements.map((e, i) => {
						if (e.type === 'separator') {
							return <DropdownItem key={i} divider />;
						}
						else if (e.type === 'header') {
							return <DropdownItem key={i} header>{e.label}</DropdownItem>;
						}
						else {
							return (
								<DropdownItem
									key={i}
									onClick={(event: React.MouseEvent) => {
										event.preventDefault();
										onChange && onChange(e.value);
									}}
									active={e.active || e.value === value}
								>
									{e.label}
								</DropdownItem>
							);
						}
					})}
				</DropdownMenu>
			</Dropdown>
		);
	}

	
}
