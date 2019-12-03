/*** Copyright 2018 Johannes Kessler
*
* This Source Code Form is subject to the terms of the Mozilla Public
* License, v. 2.0. If a copy of the MPL was not distributed with this
* file, You can obtain one at http://mozilla.org/MPL/2.0/. */

import * as React from 'react';
import * as remark from 'remark';
import * as reactRenderer from 'remark-react';

interface Props {
	source: string,
}

export const Markdown: React.StatelessComponent<Props> = ({ source }) => (
	<div>
		{remark().use(reactRenderer, {
			sanitize: true,
		}).processSync(source).contents}
	</div >
);
