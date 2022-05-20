/*** Copyright 2018 Johannes Kessler
*
* This Source Code Form is subject to the terms of the Mozilla Public
* License, v. 2.0. If a copy of the MPL was not distributed with this
* file, You can obtain one at http://mozilla.org/MPL/2.0/. */

import { i18n, T } from 'calc2/i18n';
import * as store from 'calc2/store';
import { Group, HeaderTranslated } from 'calc2/store/groups';
import { translateHeader } from 'calc2/utils/misc';
import classNames from 'classnames';
import * as Immutable from 'immutable';
import memoize from 'memoize-one';
import * as React from 'react';
import { connect } from 'react-redux';
import { Link, NavLink, Redirect, useHistory, withRouter } from 'react-router-dom';
import { GROUPS_LOAD_REQUEST } from 'calc2/store/groups';
import { History } from 'history';

type Props = {
	groups: store.State['groups']['groups'],
	current: store.State['groups']['current']
	locale: store.State['session']['locale'],
	loadGroupTab: Function,
	datasetLoaded: Function,
};


export class Menu extends React.Component<Props> {

	gistLink: string;
	
	constructor(props: Props) {
		super(props);
		this.gistLink = '';
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
				category = t({lang: '', fallback: group.groupInfo.maintainerGroup});
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

		let recentlyUsedGroups = [];
		const rug = localStorage.getItem('groups');
		if(rug) {
			recentlyUsedGroups = JSON.parse(rug);
		}
		
		
		return (
			<div className="container">
				<div className="row">
					<div className="col-md-6">
						<h4><T id="calc.menu.headline" /></h4>

						<ul id="groups-selector-list">
							{groupsByHeadlineName.map((groups: any, headline: any) => (
								<li key={`${headline}`}>
									{!headline ? <T id="calc.maintainer-groups.misc" /> : headline}
									<ul>
										{groups.map((group: any, i: any) => {
											const { groupName, groupInfo } = group;
											const path = `/relax/calc/${groupInfo.source}/${groupInfo.id}/${groupInfo.filename}/${groupInfo.index}`;

											return (
												<li key={path} className={classNames({
													active: current && current.group.groupInfo === group.groupInfo,
												})}>
													<NavLink to={path} onClick={()=>{this.props.datasetLoaded(); }}>{translateHeader(groupName, locale)}</NavLink>
												</li>
											);
										})}
									</ul>
								</li>
							)).valueSeq().toArray()}
						</ul>
					</div>
					<div className="col-md-6 align-text-top align-top">
						<h4><T id="calc.menu.load-gist-headline" /></h4>
						<input type="text" className="form-control gist-load-input" placeholder="" data-i18n="[placeholder]calc.menu.load-gist-insert-placeholder" size={32} onChange={(event) => { this.gistLink = '/relax/calc/gist/' + event.target.value; }} />
						<button onClick={() => {document.location.href = this.gistLink; this.props.datasetLoaded(); }} type="button" className="fullWidthBtn btn btn-secondary gist-load-btn"><T id="calc.menu.load-gist-button" /></button>

						<hr />
						<h4><T id="calc.menu.recently-used" /></h4>
						<ul>
							{
								recentlyUsedGroups.reverse().map((el: any) => 
									<li key={el.name}>
										<NavLink to={'/relax/calc/gist/'+el.group.groupInfo.id} onClick={()=>{this.props.datasetLoaded(); document.location.href = '/relax/calc/gist/'+el.group.groupInfo.id; }}>{el.name}</NavLink>
									</li>,
								)
							}
							
						</ul>
						<hr />
						<h4><T id="calc.menu.create-own-dataset-headline" /></h4>
						<p><T id="calc.menu.create-own-dataset-text" /> <Link to="/relax/help#tutorial-maintainer"><T id="calc.menu.create-own-dataset-text-link" /></Link></p>
						<button type="button" className="fullWidthBtn btn btn-secondary open-group-new-btn" onClick={() => { this.props.loadGroupTab(false); } } >
							<i className="fa fa-plus-square-o fa-lg"></i> <span><T id="calc.menu.create-own-dataset-button-new" /></span>
						</button>
						<button type="button" className="fullWidthBtn btn btn-secondary open-group-current-btn" onClick={() => { this.props.loadGroupTab(true); }} >
							<i className="fa fa-pencil-square-o fa-lg"></i> <span><T id="calc.menu.create-own-dataset-button-modify" /></span>
						</button>
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

