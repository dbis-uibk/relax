/*** Copyright 2018 Johannes Kessler
*
* This Source Code Form is subject to the terms of the Mozilla Public
* License, v. 2.0. If a copy of the MPL was not distributed with this
* file, You can obtain one at http://mozilla.org/MPL/2.0/. */

import * as React from 'react';

interface Props {
	date: Date,
}

export class TimeAgo extends React.Component<Props> {
	render() {
		const { date } = this.props;
		return (
			<span>{`${fuzzy_time(date)}`}</span>
		);
	}
}


function fuzzy_time(date: Date) {
	const diff = ((new Date()).valueOf() - date.valueOf()) / 1000; // seconds
	const days = Math.ceil(diff / 86400);
	return diff < 60 && 'just now' ||
		diff < 120 && 'one minute ago' ||
		diff < 3600 && Math.ceil(diff / 60) + ' minutes ago' ||
		diff < 7200 && 'one hour ago' ||
		diff < 86400 && Math.floor(diff / 3600) + ' hours ago' ||
		diff < 86400 && 'yesterday' ||
		days < 7 && days + ' days ago' ||
		days < 14 && 'one week ago' ||
		days < 365 && Math.floor(days / 7) + ' weeks ago' ||
		days < 730 && 'one year ago' ||
		Math.floor(days / 365) + ' years ago'
		;
}
