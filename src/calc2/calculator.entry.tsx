/*** Copyright 2018 Johannes Kessler
*
* This Source Code Form is subject to the terms of the Mozilla Public
* License, v. 2.0. If a copy of the MPL was not distributed with this
* file, You can obtain one at http://mozilla.org/MPL/2.0/. */

import { loadStaticGroups } from 'calc2/store/groups';
import { SET_LOCALE } from 'calc2/store/session';
import 'custom-event-polyfill';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { AppContainer } from 'react-hot-loader';
import './404.html';
import { i18n } from './i18n';
import Main from './main.hot';
import { store } from './store';



ReactDOM.render(
	(
		<AppContainer>
			<Main store={store} />
		</AppContainer>
	),
	document.getElementById('root'),
);


// init
{
	const action: SET_LOCALE = {
		type: 'SET_LOCALE',
		locale: i18n.language,
	};
	store.dispatch(action);
}

// load all predefined groups
for (const action of loadStaticGroups()) {
	store.dispatch(action);
}
