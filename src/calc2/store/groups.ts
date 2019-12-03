/*** Copyright 2018 Johannes Kessler
*
* This Source Code Form is subject to the terms of the Mozilla Public
* License, v. 2.0. If a copy of the MPL was not distributed with this
* file, You can obtain one at http://mozilla.org/MPL/2.0/. */

import { t } from 'calc2/i18n';
import * as store from 'calc2/store';
import { loadGroupsFromSource } from 'calc2/utils/groupUtils';
import { Relation } from 'db/exec/Relation';
import * as Immutable from 'immutable';
import * as saga from 'redux-saga/effects';

export type State = {
	groups: Immutable.Map<string, Group>,

	current: {
		group: Group,
	} | null,
};

export type Action = (
	| GROUPS_LOAD_REQUEST
	| GROUPS_LOAD_SUCCESS
	| GROUP_SET_CURRENT
	| GROUP_SET_DRAFT
);


export function* rootSaga() {

	yield saga.takeEvery('GROUPS_LOAD_REQUEST', function* (action: GROUPS_LOAD_REQUEST) {
		const { source, id, setCurrent } = action;

		const state: store.State = yield saga.select();

		// check wether we have already loaded the group
		const found = state.groups.groups.find(g => (
			g.groupInfo.source === source
			&& g.groupInfo.id === id
			&& (!!setCurrent && (setCurrent === 'first' || setCurrent.filename === g.groupInfo.filename))
			&& (!!setCurrent && (setCurrent === 'first' || setCurrent.index === g.groupInfo.index))
		));
		if (found) {
			const { source, id, filename, index } = found.groupInfo;

			// already loaded => just switch
			const setCurrent: GROUP_SET_CURRENT = {
				type: 'GROUP_SET_CURRENT',
				source,
				id,
				filename,
				index,
			};
			yield saga.put(setCurrent);
		}
		else {
			// fetch
			try {
				if (source !== 'local' && source !== 'gist') {
					throw new Error(`unsupported source-type ${source}`);
				}

				const loadedGroups: Group[] = yield saga.call(loadGroupsFromSource, source, id);

				const success: GROUPS_LOAD_SUCCESS = {
					type: 'GROUPS_LOAD_SUCCESS',
					loadedGroups,
				};
				yield saga.put(success);

				if (setCurrent === 'first' && loadedGroups.length > 0) {
					const { source, id, filename } = loadedGroups[0].groupInfo;

					const setCurrent: GROUP_SET_CURRENT = {
						type: 'GROUP_SET_CURRENT',
						source,
						id,
						filename,
						index: 0,
					};
					yield saga.put(setCurrent);
				}
			}
			catch (e) {
				console.error('could not fetch group', e);
			}
		}
	});

	// init
	// yield loadStaticGroups();
}

export type GroupSourceType = 'http' | 'gist' | 'local';
export type GroupTable = {
	tableId: number,
	tableName: string,
	columnNames: string[],
	columnTypes: string[],
	relation: Relation,
};

export type HeaderTranslated = {
	/** key is the lowercase two digit iso language code */
	[lang: string]: string,
	fallback: string,
};

export type Group = {
	groupName: HeaderTranslated,
	groupDesc: HeaderTranslated,
	category: HeaderTranslated | null,

	tables: GroupTable[],
	definition: string,

	groupInfo: GroupInfo,
	sourceInfo: SourceInfo,

	isDraft?: boolean,
};
export type GroupInfo = {
	source: GroupSourceType,
	id: string,
	filename: string,
	/** nth definition within the file */
	index: number,
};
export type SourceInfo = {
	author?: string,
	authorUrl?: string,
	url?: string,
	lastModified?: Date,
};


// region actions

export type GROUPS_LOAD_REQUEST = {
	type: 'GROUPS_LOAD_REQUEST',
	source: string,
	id: string,

	setCurrent?: 'first' | {
		filename: string,
		index: number,
	},
};

type GROUPS_LOAD_SUCCESS = {
	type: 'GROUPS_LOAD_SUCCESS',
	loadedGroups: Group[],
};

type GROUPS_LOAD_ERROR = {
	type: 'GROUPS_LOAD_ERROR',
	error: string,
};

type GROUP_SET_CURRENT = {
	type: 'GROUP_SET_CURRENT',
	source: GroupSourceType,
	id: string,
	filename: string,
	index: number,
};

export type GROUP_SET_DRAFT = {
	type: 'GROUP_SET_DRAFT',
	draft: Group,
};

function loadGroup(
	source: string,
	id: string,
	filename: string,
	index: number | string,
): GROUP_SET_CURRENT {
	if (
		source !== 'gist'
		&& source !== 'http'
		&& source !== 'local'
	) {
		throw new Error(`invalid source ${source}`);
	}

	try {
		const action: GROUP_SET_CURRENT = {
			type: 'GROUP_SET_CURRENT',
			source,
			id,
			filename,
			index: (
				typeof index === 'number'
					? index
					: Number.parseInt(index)
			),
		};
		return action;
	}
	catch (e) {
		throw e;
	}
}

// endregion

// region: action creators

export function loadStaticGroups() {
	const groups: {
		maintainerGroup: string,
		maintainer: string,
		source: GroupSourceType,
		id: string,
	}[] = [
			{
				maintainerGroup: t('calc.maintainer-groups.misc'),
				maintainer: '',

				source: 'local',
				id: 'uibk',
			},
			{
				maintainerGroup: t('calc.maintainer-groups.uibk'),
				maintainer: '<a href="https://github.com/mtschu">mtschu</a>',

				source: 'gist',
				id: '2923a30a474fdcb46bee',
			},
			{
				maintainerGroup: t('calc.maintainer-groups.uibk'),
				maintainer: '<a href="https://gist.github.com/woolfg">Wolfgang Gassler</a>',

				source: 'gist',
				id: '7d1871f79a8bcb4788de',
			},
		];

	let first: boolean = true;

	const actions: GROUPS_LOAD_REQUEST[] = (
		groups.map(({ source, id }) => {
			const action: GROUPS_LOAD_REQUEST = {
				type: 'GROUPS_LOAD_REQUEST',
				source,
				id,
				setCurrent: first ? 'first' : undefined,
			};

			first = false;

			return action;
		})
	);

	return actions;
}

// endregion


export function reduce(oldState: State | undefined, action: store.Action): State {
	if (!oldState) {
		return {
			groups: Immutable.Map(),
			current: null,
		};
	}

	switch (action.type) {
		case 'GROUP_SET_CURRENT': {
			const { source, id, filename, index } = action;
			const group = oldState.groups.find(g => (
				g.groupInfo.source === source
				&& g.groupInfo.id === id
				&& g.groupInfo.filename === filename
				&& g.groupInfo.index === index
			));

			if (!group) {
				console.error('could not find group ', group);
				return oldState;
			}

			return {
				...oldState,
				current: {
					...oldState.current,
					group,
				},
			};
		}

		case 'GROUPS_LOAD_SUCCESS': {
			// merge new groups
			const { loadedGroups } = action;
			let newState = oldState;

			for (const group of loadedGroups) {
				newState = {
					...newState,
					groups: newState.groups.set(getGroupPath(group), group),
				};
			}
			return newState;
		}

		case 'GROUP_SET_DRAFT': {
			// merge new groups
			let { draft } = action;

			draft = {
				...draft,
				isDraft: true,
			};

			oldState = {
				...oldState,
				groups: oldState.groups.set(getGroupPath(draft), draft),
				current: {
					...oldState.current,
					group: draft,
				},
			};
		}

		default: {
			return oldState;
		}
	}
}

function getGroupPath(g: Group) {
	const { source, id, filename, index } = g.groupInfo;
	return `${source}/${id}/${filename}/${index}`;
}
