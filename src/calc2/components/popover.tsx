/*** Copyright 2018 Johannes Kessler
*
* This Source Code Form is subject to the terms of the Mozilla Public
* License, v. 2.0. If a copy of the MPL was not distributed with this
* file, You can obtain one at http://mozilla.org/MPL/2.0/. */

import { randomString } from 'calc2/utils';
import memoize from 'memoize-one';
import * as React from 'react';
import { Popover as ReactStrapPopover, PopoverBody, PopoverHeader } from 'reactstrap';

type Placement = (
	| 'top'
	| 'bottom'
	| 'left'
	| 'right'
	| 'top left'
	| 'top center'
	| 'top right'
	| 'right top'
	| 'right middle'
	| 'right bottom'
	| 'bottom right'
	| 'bottom center'
	| 'bottom left'
	| 'left top'
	| 'left middle'
	| 'left bottom'
);

type Trigger = (
	| 'hover'
	| 'focus'
	| 'click'
);

type Props = {
	title?: string | JSX.Element,
	body: string | JSX.Element | (() => string | JSX.Element),
	trigger: Trigger[] | Trigger,
	placement: Placement,
	className?: string,
	onClick?: React.EventHandler<React.MouseEvent>,
	children?: any,
};
type State = {
	id: string,
	isOpen: boolean,
};

export class Popover extends React.Component<Props, State> {
	constructor(props: Props) {
		super(props);
		this.state = {
			id: 'popWrapper_' + randomString(),
			isOpen: false,
		};

		this.hoverOpen = this.hoverOpen.bind(this);
		this.hoverClose = this.hoverClose.bind(this);
		this.handleClick = this.handleClick.bind(this);
		this.open = this.open.bind(this);
		this.close = this.close.bind(this);
	}

	componentWillUnmount() {
		this.close();
	}

	private open() {
		this.setState({
			isOpen: true,
		});

		// listen for click on document to close on click outside
		document.addEventListener('click', this.close);
	}

	private close(e?: MouseEvent) {
		if (e) {
			// ignore click if it comes from _inside_ the popover
			const { target } = e;
			if (target instanceof Element && target.closest('.popover__inside') !== null) {
				return;
			}
		}

		this.setState({
			isOpen: false,
		});

		// stop listen for click on document to close on click outside
		document.removeEventListener('click', this.close);
	}

	private hoverOpen() {
		const { trigger } = this.props;
		if (trigger === 'hover' || Array.isArray(trigger) && trigger.includes('hover')) {
			this.open();
		}
	}

	private hoverClose() {
		const { trigger } = this.props;
		if (trigger === 'hover' || Array.isArray(trigger) && trigger.includes('hover')) {
			this.close();
		}
	}

	/** toggle open */
	private handleClick(e: React.MouseEvent) {
		const { trigger, onClick } = this.props;

		if (onClick) {
			onClick(e);
		}

		if (trigger === 'click' || Array.isArray(trigger) && trigger.includes('click')) {
			const { isOpen } = this.state;

			if (isOpen) {
				this.close();
			}
			else {
				this.open();
			}
		}
	}

	private body = memoize(
		(b: Props['body'], isOpen: boolean) => {
			if (isOpen === false) {
				return null;
			}
			else if (typeof b === 'function') {
				return b();
			}
			else {
				return b;
			}
		},
	);

	render() {
		const { id, isOpen } = this.state;

		const { title, className = '', placement} = this.props;
		const body = this.body(this.props.body, isOpen);

		return (
			<>
				<div
					onMouseEnter={this.hoverOpen}
					onMouseLeave={this.hoverClose}
					onFocus={this.hoverOpen}
					onBlur={this.hoverClose}
					onClick={this.handleClick}
					id={id}
					className={`popover__outside ${className}`}
				>
					{React.Children.only(this.props['children'])}
					<ReactStrapPopover
						target={`#${id}`}
						isOpen={isOpen}
						placement={'top'}
						className={`popover__inside ${className}`}
					>
						<PopoverHeader>{title}</PopoverHeader>
						<PopoverBody>{body}</PopoverBody>
					</ReactStrapPopover>
				</div>

			</>
		);
	}
}
