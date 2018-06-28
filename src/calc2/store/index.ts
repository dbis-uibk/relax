/*** Copyright 2018 Johannes Kessler
*
* This Source Code Form is subject to the terms of the Mozilla Public
* License, v. 2.0. If a copy of the MPL was not distributed with this
* file, You can obtain one at http://mozilla.org/MPL/2.0/. */

import * as redux from 'redux';
import { applyMiddleware, compose, createStore } from 'redux';
import createSagaMiddleware from 'redux-saga';
import * as groups from './groups';
import * as session from './session';


export type Store = redux.Store<State>;

export type State = {
	version: '1',
	session: session.State,
	groups: groups.State,
};

export type Action = (
	| groups.Action
	| session.Action
);

function reduce(oldState: State | undefined, action: Action): State {
	if (!oldState) {
		return {
			version: '1',
			session: session.reduce(undefined, action),
			groups: groups.reduce(undefined, action),
		};
	}

	const state = {
		version: oldState.version,
		session: session.reduce(oldState.session, action), // TODO: session reducer
		groups: groups.reduce(oldState.groups, action),
	};

	// exec child reducers
	for (const key of Object.keys(state) as (keyof typeof state)[]) {
		if (state[key] !== oldState[key]) {
			return state;
		}
	}

	return oldState;
}

// export type Thunk = (dispatch: (action: Action) => void, getState: () => State) => void;
export type Dispatch = redux.Dispatch<Action>;

// plug into redux-devtools
declare const window: any;
const composeEnhancers: typeof compose = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const sagaMiddleware = createSagaMiddleware();


export const store: Store = createStore<State, Action, {}, {}>(
	reduce,
	composeEnhancers(applyMiddleware(sagaMiddleware)),
);


// run the saga(s)
sagaMiddleware.run(groups.rootSaga);
