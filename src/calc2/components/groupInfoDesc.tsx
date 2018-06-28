/*** Copyright 2018 Johannes Kessler
*
* This Source Code Form is subject to the terms of the Mozilla Public
* License, v. 2.0. If a copy of the MPL was not distributed with this
* file, You can obtain one at http://mozilla.org/MPL/2.0/. */

import { Markdown } from 'calc2/components/markdown';
import { TimeAgo } from 'calc2/components/timeAgo';
import { Group } from 'calc2/store/groups';
import { translateHeader } from 'calc2/utils/misc';
import * as React from 'react';
import * as ReactDOM from 'react-dom';

interface Props {
	group: Group,
	locale: string,
}

export class GroupInfoDesc extends React.Component<Props> {
	componentDidMount() {
		this.externalizeLinks();
	}

	ComponentDidUpdate() {
		this.externalizeLinks();
	}

	private externalizeLinks() {
		const node = ReactDOM.findDOMNode(this) as HTMLDivElement | null;
		if (!node) {
			return;
		}
		const links = node.getElementsByTagName('a');
		for (let i = 0; i < links.length; i++) {
			links[i].setAttribute('target', '_blank');
		}
	}

	// TODO: render as markdown
	render() {
		const { group, locale } = this.props;
		const { groupDesc, groupInfo, sourceInfo } = group;
		return (
			<div>
				<div id="groups-desc">
					<Markdown source={translateHeader(groupDesc, locale)} />
				</div>
				<div id="groups-info">
					<p>Source: <a target="_blank" href={sourceInfo.url}>{translateHeader(group.groupName, locale)}</a><br />
						<small className="text-muted">
							by <a target="_blank" href={sourceInfo.authorUrl}>{sourceInfo.author}</a>
							<br />
							{sourceInfo.lastModified
								? <span>last modified <TimeAgo date={sourceInfo.lastModified} /></span>
								: null
							}
						</small>
					</p>
				</div>
			</div>
		);
	}
}
