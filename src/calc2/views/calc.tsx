/*** Copyright 2018 Johannes Kessler
*
* This Source Code Form is subject to the terms of the Mozilla Public
* License, v. 2.0. If a copy of the MPL was not distributed with this
* file, You can obtain one at http://mozilla.org/MPL/2.0/. */

import { Calculator } from 'calc2/components/calculator';
import * as store from 'calc2/store';
import { Group, GROUPS_LOAD_REQUEST, GROUP_SET_DRAFT } from 'calc2/store/groups';
import * as React from 'react';
import { connect } from 'react-redux';
import { RouteComponentProps } from 'react-router-dom';
import { Api } from './api';
import queryString from 'query-string'

type Props = RouteComponentProps<{
	source: string,
	id: string,
	filename: string,
	index: string,
}> & {
	groups: store.State['groups'],
	locale: store.State['session']['locale'],
	params: any,
	setDraft(draft: Group): void,
	loadGroup(
		source: GROUPS_LOAD_REQUEST['source'],
		id: string,
		filename: string,
		index: number,
		maintainer: string,
		maintainerGroup: string,
	): void,
};

export class Calc extends React.Component<Props> {
	
	private init: boolean;
	private apiView: boolean = false;
	private params: any = {};
	
	constructor(props: Props) {
		super(props);
		this.init = false;
	}

	componentDidMount() {
		/*this.setState({
			params: queryString.parse(this.props.location.search)
		})*/
		this.apiView = this.props.location.pathname.split("/")[2] == "api"
		this.params = queryString.parse(this.props.location.search)

		// It's necessary to load remote group synchronouly
		if (this.apiView) {
			this.loadGroup(this.props);
		}
	}

	componentDidUpdate(prevProps: Props): void {
		const { params } = this.props.match;
		const { params: prevParams } = prevProps.match;
		if (
			this.init === false
			|| params.source !== prevParams.source
			|| params.id !== prevParams.id
			|| params.filename !== prevParams.filename
			|| params.index !== prevParams.index
		) {
			// change/load
			this.init = true;
			this.loadGroup(this.props);
		}
	}

	private loadGroup(props: Props) {
		const { source, id, filename, index } = props.match.params;

		this.props.loadGroup(source, id, filename, Number.parseInt(index, 10), '', '');
		// TODO: display errors
	}

	componentWillReceiveProps(nextProps: Props): void {
		const { params } = this.props.match;
		const { params: nextParams } = nextProps.match;
		if (
			nextParams.source !== params.source || nextParams.id !== params.id || nextParams.filename !== params.filename
			|| nextParams.index !== params.index
		) {
			// change/load
		}
	}

	render() {
		const { locale } = this.props;
		const { current } = this.props.groups;

		if (current !== null) {
			if (this.apiView == true) {
				return (
					<Api
						group={current.group}
						locale={locale}
						params={this.params}
					/>
				);
			} else {
				return (
					<Calculator
						group={current.group}
						locale={locale}
						setDraft={this.props.setDraft}
					/>
				);
			}
		}
		else {
			return <div>loading ...</div>;
		}
	}
}

export const ConnectedCalc = connect((state: store.State) => {

	// save current dataset to local storage to be shown as 'recently used groups'
	const lsGists = localStorage.getItem('groups');
	
	
	if(state.groups.current && Object.keys(state.groups.current.group.sourceInfo).length > 0) {
		if(!lsGists) {
			localStorage.setItem('groups', JSON.stringify([{name: state.groups.current.group.groupName.fallback, group: state.groups.current.group}]));
		} 
		else {
			let parsedGroups = JSON.parse(lsGists) as any[];
			// remove group from and add again to maintain order
			parsedGroups = parsedGroups.filter(r => r.name !== state!.groups!.current!.group.groupName.fallback);
			parsedGroups.push({name: state.groups.current.group.groupName.fallback, group: state.groups.current.group});
			localStorage.setItem('groups', JSON.stringify(parsedGroups));
		}
	}
	
	
	return {
		groups: state.groups,
		locale: state.session.locale,
	};
}, (dispatch) => {
	return {
		loadGroup: (
			source: GROUPS_LOAD_REQUEST['source'],
			id: string,
			filename: string,
			index: number,
			maintainer: string,
			maintainerGroup: string,
		) => {
			const action: GROUPS_LOAD_REQUEST = {
				type: 'GROUPS_LOAD_REQUEST',
				source,
				id,
				maintainer,
				maintainerGroup,
				setCurrent: {
					filename,
					index,
				},
			};

			dispatch(action);
		},
		setDraft: (draft: Group) => {
			const action: GROUP_SET_DRAFT = {
				type: 'GROUP_SET_DRAFT',
				draft,
			};
			dispatch(action);
		},
	};
})(Calc);
