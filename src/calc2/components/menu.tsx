/*** Copyright 2018 Johannes Kessler
*
* This Source Code Form is subject to the terms of the Mozilla Public
* License, v. 2.0. If a copy of the MPL was not distributed with this
* file, You can obtain one at http://mozilla.org/MPL/2.0/. */

import { i18n, T } from 'calc2/i18n';
import * as store from 'calc2/store';
import { Group, HeaderTranslated } from 'calc2/store/groups';
import { translateHeader } from 'calc2/utils/misc';
import * as classNames from 'classnames';
import * as Immutable from 'immutable';
import memoize from 'memoize-one';
import * as React from 'react';
import { connect } from 'react-redux';
import { Link, NavLink } from 'react-router-dom';

type Props = {
	groups: store.State['groups']['groups'],
	current: store.State['groups']['current']
	locale: store.State['session']['locale'],
};

export class Menu extends React.Component<Props> {
	constructor(props: Props) {
		super(props);
	}

	private getGroupsByHeadlineName = memoize((groups: Props['groups'], locale: string) => {
		let groupsByHeadlineName = Immutable.OrderedMap<string | null, Group[]>();

		const t = (x: HeaderTranslated) => translateHeader(x, locale);

		// collect all groups and group them by group-name
		for (const group of groups.values()) {
			let category: string | null = null;

			if (group.isDraft === true) {
				category = i18n.t('calc.maintainer-groups.temp');
			}
			else if (group.category) {
				category = t(group.category);
			}

			const groups = [
				...(groupsByHeadlineName.get(category) || []),
				group,
			];
			groups.sort((a, b) => t(a.groupName).localeCompare(t(b.groupName)));

			groupsByHeadlineName = groupsByHeadlineName.set(category, groups);
		}

		return groupsByHeadlineName;
	});

	render(): JSX.Element {
		const { current, locale } = this.props;
		const groupsByHeadlineName = this.getGroupsByHeadlineName(this.props.groups, locale);

		return (
			<div className="container">
				<div className="row">
					<div className="col-md-6">
						<h3><T id="calc.menu.headline" /></h3>

						<ul id="groups-selector-list">
							{groupsByHeadlineName.map((groups:any, headline:any) => (
								<li key={`${headline}`}>
									{!headline ? <T id="calc.maintainer-groups.misc" /> : headline}
									<ul>
										{groups.map((group:any, i:any) => {
											const { groupName, groupInfo } = group;
											const path = `/calc/${groupInfo.source}/${groupInfo.id}/${groupInfo.filename}/${groupInfo.index}`;

											return (
												<li key={path} className={classNames({
													active: current && current.group.groupInfo === group.groupInfo,
												})}>
													<NavLink to={path}>{translateHeader(groupName, locale)}</NavLink>
												</li>
											);
										})}
									</ul>
								</li>
							)).valueSeq().toArray()}
						</ul>
					</div>
					<div className="col-md-6">
						<div>
							<h4><T id="calc.menu.load-gist-headline" /></h4>
							<table>
								<tbody>
									<tr>
										<td>
											<input type="text" className="form-control gist-load-input" placeholder="" data-i18n="[placeholder]calc.menu.load-gist-insert-placeholder" size={32} style={{ maxWidth: '400px' }} />
										</td>
										<td>
											<button type="button" className="btn btn-primary gist-load-btn"><T id="calc.menu.load-gist-button" /></button>
										</td>
									</tr>
								</tbody>
							</table>
						</div>

						<hr />

						<div>
							<h4><T id="calc.menu.create-own-dataset-headline" /></h4>

							<p><T id="calc.menu.create-own-dataset-text" /> <Link to="/help#tutorial-maintainer"><T id="calc.menu.create-own-dataset-text-link" /></Link></p>

							<button type="button" className="btn btn-default open-group-new-btn">
								<i className="fa fa-plus-square-o fa-lg"></i> <span><T id="calc.menu.create-own-dataset-button-new" /></span>
							</button>
							<button type="button" className="btn btn-default open-group-current-btn">
								<i className="fa fa-pencil-square-o fa-lg"></i> <span><T id="calc.menu.create-own-dataset-button-modify" /></span>
							</button>
						</div>
					</div>
				</div>
			</div>
		);
	}
}

export const MenuConnected = connect((state: store.State) => {
	return {
		groups: state.groups.groups,
		current: state.groups.current,
		locale: state.session.locale,
	};
})(Menu);
