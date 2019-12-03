/*** Copyright 2018 Johannes Kessler
*
* This Source Code Form is subject to the terms of the Mozilla Public
* License, v. 2.0. If a copy of the MPL was not distributed with this
* file, You can obtain one at http://mozilla.org/MPL/2.0/. */

// tslint:disable:no-magic-numbers

/**
 * @deprecated
 */
function stringHashCode(str: string) {
	// http://stackoverflow.com/a/7616484
	let hash = 0;
	if (str.length === 0) {
		return hash;
	}
	for (let i = 0, len = str.length; i < len; i++) {
		const chr = str.charCodeAt(i);
		// tslint:disable-next-line:no-bitwise
		hash = ((hash << 5) - hash) + chr;
		// tslint:disable-next-line:no-bitwise
		hash |= 0; // Convert to 32bit integer
	}
	return hash;
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

export function randomString() {
	return Math.random().toString(36).substr(2);
}
