/*** Copyright 2018 Johannes Kessler
*
* This Source Code Form is subject to the terms of the Mozilla Public
* License, v. 2.0. If a copy of the MPL was not distributed with this
* file, You can obtain one at http://mozilla.org/MPL/2.0/. */

import { T } from 'calc2/i18n';
import classNames from 'classnames';
import * as CodeMirror from 'codemirror';
import { Editor } from 'codemirror';
// add colorize
import 'codemirror/addon/runmode/colorize';
import * as React from 'react';
import { findDOMNode } from 'react-dom';

declare module 'codemirror' {
	function colorize(collection: Element, defaultMode: string): void;
}

export type HistoryEntry = {
	time: Date,
	label: string,
	code: string,
};

interface Props {
	history: HistoryEntry[],
	editor: Editor,
}

export class History extends React.Component<Props>{
	componentDidMount() {
		const node = findDOMNode(this) as HTMLDivElement | null;
		if (node === null) {
			return;
		}
		const codeNode = node.querySelector('.colorize');
		if (!codeNode) {
			console.error(`could not find code node`);
			return;
		}

		CodeMirror.colorize(codeNode, this.props.editor.getOption('mode'));
	}

	render() {
		const { history } = this.props;
		return (
			<div>
				<button
					type="button"
					className={classNames('btn btn-default download-button', { disabled: history.length === 0 })}
					disabled={history.length === 0}
				>
					<T id="calc.editors.ra.button-download" />
				</button>

				<div className="btn-group history-container">
					<span className="btn btn-default dropdown-toggle disabled" data-toggle="dropdown" data-i18n="[prepend]calc.editors.button-history">&nbsp;<span className="caret"></span></span>
					<ul className="dropdown-menu">
						{history.map((entry, i) => (
							<li>
								<small className="muted text-muted">{formatTime(entry.time)}</small>
								<div className="replace-all colorize" data-text={entry.code}>{entry.code}</div>
							</li>
						))}
					</ul>
				</div>
			</div>
		);
	}
}

const formatTime = (t: Date) => {
	const h = t.getHours() >= 10 ? t.getHours() : '0' + t.getHours();
	const m = t.getMinutes() >= 10 ? t.getMinutes() : '0' + t.getMinutes();
	const s = t.getSeconds() >= 10 ? t.getSeconds() : '0' + t.getSeconds();
	return `${h}:${m}:${s}`;
};
