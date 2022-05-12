/*** Copyright 2018 Johannes Kessler
*
* This Source Code Form is subject to the terms of the Mozilla Public
* License, v. 2.0. If a copy of the MPL was not distributed with this
* file, You can obtain one at http://mozilla.org/MPL/2.0/. */
// @ts-ignore
import { Diagram } from 'railroad-diagrams';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import 'railroad-diagrams/railroad-diagrams.css';

interface Props {
	diagram: Diagram,
}

export class RailroadDiagram extends React.Component<Props> {
	componentDidMount() {
		
		const node = ReactDOM.findDOMNode(this) as Element | null;
		if (!node) {
			throw new Error(`could not find node`);
		}
		this.props.diagram.addTo(node);
	}

	shouldComponentUpdate(nextProps: Readonly<Props>) {
		return this.props.diagram !== nextProps.diagram;
	}

	render() {
		console.log('mounted..');
		return (
			<div />
		);
	}
}
