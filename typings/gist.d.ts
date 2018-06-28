/*** Copyright 2018 Johannes Kessler
*
* This Source Code Form is subject to the terms of the Mozilla Public
* License, v. 2.0. If a copy of the MPL was not distributed with this
* file, You can obtain one at http://mozilla.org/MPL/2.0/. */

/**
 * https://developer.github.com/v3/gists/#get-a-single-gist
 */
declare namespace gist {
	interface File {
		filename: string,
		type: "text/plain",
		language: "Text",
		raw_url: string,
		size: number,
		truncated: boolean,
		content: string,
	}

	type url = string;
	type dateString = string;

	interface User {
		login: string,
		id: number,
		avatar_url: url,
		gravatar_id: "",
		url: url,
		html_url: url,
		followers_url: url,
		following_url: url,
		gists_url: url,
		starred_url: url,
		subscriptions_url: url,
		organizations_url: url,
		repos_url: url,
		events_url: url,
		received_events_url: url,
		type: "User",
		site_admin: boolean,
	}

	interface Fork {
		url: url,
		user: User,
		id: string,
		created_at: dateString,
		updated_at: dateString,
	}

	interface History {
		user: User,
		version: string,
		committed_at: dateString,
		change_status: {
			total: number,
			additions: number,
			deletions: number,
		},
		url: url,
	}

	export interface Gist {
		url: url,
		forks_url: url,
		commits_url: url,
		id: string,
		git_pull_url: url,
		git_push_url: url,
		html_url: url,
		files: { [filename: string]: File },
		public: boolean,
		created_at: dateString,
		updated_at: dateString,
		description: string,
		comments: number,
		user: null, // TODO: || User?
		comments_url: string,
		owner: null | User,
		forks: Fork[],
		history: History[],
		truncated: boolean,
	}
}