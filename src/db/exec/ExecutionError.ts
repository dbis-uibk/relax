/*** Copyright 2016 Johannes Kessler 2016 Johannes Kessler
*
* This Source Code Form is subject to the terms of the Mozilla Public
* License, v. 2.0. If a copy of the MPL was not distributed with this
* file, You can obtain one at http://mozilla.org/MPL/2.0/. */

import { CodeInfo } from './CodeInfo';

export class ExecutionError extends Error {
	codeInfo: CodeInfo | undefined;

	constructor(message: string, codeInfo?: CodeInfo | null) {
		super(message);

		this.codeInfo = codeInfo || undefined;
	}
}
