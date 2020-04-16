/*** Copyright 2018 Johannes Kessler
*
* This Source Code Form is subject to the terms of the Mozilla Public
* License, v. 2.0. If a copy of the MPL was not distributed with this
* file, You can obtain one at http://mozilla.org/MPL/2.0/. */

import * as i18next from 'i18next';
import * as LanguageDetector from 'i18next-browser-languagedetector';
import * as React from 'react';
const langDE = require('../locales/de.json');
const langEN = require('../locales/en.json');
const langES = require('../locales/es.json');
const langKR = require('../locales/kr.json');

export type LanguageKeys = keyof typeof langEN;

export const i18n = i18next
	.use(LanguageDetector)
	.init({
		// we init with resources
		resources: {
			en: {
				translations: langEN,
			},
			de: {
				translations: langDE,
			},
			es: {
				translations: langES,
			},
			kr: {
				translations: langKR,
			},
		},
		fallbackLng: 'en',

		nsSeparator: ':',
		keySeparator: false,
		defaultNS: 'translations',
		debug: true,
	});

export function t(key: LanguageKeys, options?: { [key: string]: string | number }): string {
	return String(i18n.t(key, options));
}

const {
	Provider,
	Consumer,
} = React.createContext(i18n);

/**
 * exposes the i18n instance
 */
export const I18NProvider: React.FunctionComponent<{}> = props => {
	return (
		<Provider value={i18n}>
			{props.children}
		</Provider>
	);
};

/**
 * translate the given id via the i18n instance of the context
 */
export const T: React.FunctionComponent<{ id: LanguageKeys, html?: boolean }> = ({ id, html = false }) => {
	return (
		<Consumer>
			{(_i18n: i18next.i18n) => (
				html
					? <span dangerouslySetInnerHTML={{ __html: String(_i18n.t(id, { interpolation: { escapeValue: false } })) }} />
					: <span>{String(_i18n.t(id))}</span>
			)}
		</Consumer>
	);
};
