/*** Copyright 2018 Johannes Kessler
*
* This Source Code Form is subject to the terms of the Mozilla Public
* License, v. 2.0. If a copy of the MPL was not distributed with this
* file, You can obtain one at http://mozilla.org/MPL/2.0/. */

declare module 'jquery-i18next' {
	interface JQueryStatic {
		i18n: () => void
	}

	export function init(
		i18nextInstance: any,
		$: any,
		options?: {
			tName?: 't', // --> appends $.t = i18next.t
			i18nName?: 'i18n', // --> appends $.i18n = i18next
			handleName?: 'localize', // --> appends $(selector).localize(opts);
			selectorAttr?: 'data-i18n', // selector for translating elements
			targetAttr?: 'i18n-target', // data-() attribute to grab target element to translate (if diffrent then itself)
			optionsAttr?: 'i18n-options', // data-() attribute that contains options, will load/set if useOptionsAttr = true
			useOptionsAttr?: false, // see optionsAttr
			parseDefaultValueFromContent?: true // parses default values from content ele.val or ele.text
		},
	): void;
}