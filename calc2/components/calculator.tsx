/*** Copyright 2018 Johannes Kessler
*
* This Source Code Form is subject to the terms of the Mozilla Public
* License, v. 2.0. If a copy of the MPL was not distributed with this
* file, You can obtain one at http://mozilla.org/MPL/2.0/. */

import { EditorGroup } from 'calc2/components/editorGroup';
import { EditorRelalg } from 'calc2/components/editorRelalg';
import { EditorSql } from 'calc2/components/editorSql';
import { GroupInfoDesc } from 'calc2/components/groupInfoDesc';
import { Popover } from 'calc2/components/popover';
import { T } from 'calc2/i18n';
import * as store from 'calc2/store';
import { Group } from 'calc2/store/groups';
import { translateHeader } from 'calc2/utils/misc';
import * as classnames from 'classnames';
import * as React from 'react';
import { Nav, NavItem, NavLink, TabContent, TabPane } from 'reactstrap';
import { GroupRelationList } from '../components/groupRelationList';
import { MenuConnected } from '../components/menu';

require('./calculator.scss');

type Props = {
	group: Group,
	locale: store.State['session']['locale'],
	setDraft(draft: Group): void,
};

type State = {
	activeTab: 'relalg' | 'sql' | 'group',
};

export class Calculator extends React.Component<Props, State> {
	private refEditorRelalg = React.createRef<EditorRelalg>();
	private refEditorSql = React.createRef<EditorSql>();
	private refEditorGroup = React.createRef<EditorGroup>();

	constructor(props: Props) {
		super(props);

		this.state = {
			activeTab: 'relalg',
		};

		this.getCurrentEditor = this.getCurrentEditor.bind(this);
	}

	private getCurrentEditor() {
		switch (this.state.activeTab) {
			case 'sql':
				return this.refEditorSql;
			case 'relalg':
				return this.refEditorRelalg;
			case 'group':
				return this.refEditorGroup;
		}
	}

	render() {
		const { group, locale } = this.props;
		const { activeTab } = this.state;

		return (
			<div className="calculator container">
				<div className="row">
					<div className="col-sm-3 col-md-2 groups-container">
						<Popover
							body={<MenuConnected />}
							trigger="click"
							placement="bottom left"
							className="calculator__menu"
						>
							<button className="btn btn-default dropdown-toggle" type="button" id="dropdownMenu1" data-toggle="dropdown" style={{ width: '100%', textAlign: 'left', textOverflow: 'ellipsis', overflow: 'hidden' }}>
								<span>{translateHeader(group.groupName, locale)}</span>
								<span className="caret" style={{ display: 'block', position: 'absolute', top: '50%', right: '10px' }}></span>
							</button>
						</Popover>

						<div>
							{/* this is the actual list of relation/columns */}
							<GroupRelationList
								tables={group.tables}
								replace={(text: string) => {
									const editor = this.getCurrentEditor();
									if (editor && editor.current) {
										editor.current.replaceSelection(text);
									}
								}}
							/>
						</div>

					</div>
					<div className="col-sm-9 col-md-10">

						<div>
							<Nav tabs>
								<NavItem>
									<NavLink
										className={classnames({ active: activeTab === 'relalg' })}
										onClick={() => { this.setState({ activeTab: 'relalg' }); }}
									>
										<T id="calc.editors.ra.tab-name" />
									</NavLink>
								</NavItem>
								<NavItem>
									<NavLink
										className={classnames({ active: activeTab === 'sql' })}
										onClick={() => { this.setState({ activeTab: 'sql' }); }}
									>
										<T id="calc.editors.sql.tab-name" />
									</NavLink>
								</NavItem>
								<NavItem>
									<NavLink
										className={classnames({ active: activeTab === 'group' })}
										onClick={() => { this.setState({ activeTab: 'group' }); }}
									>
										<T id="calc.editors.group.tab-name" />
									</NavLink>
								</NavItem>
							</Nav>
							<TabContent activeTab={this.state.activeTab} className="tab-content-border">
								<TabPane tabId="relalg">
									<EditorRelalg
										group={group}
										ref={this.refEditorRelalg}
									/>
								</TabPane>
								<TabPane tabId="sql">
									<EditorSql
										group={group}
										ref={this.refEditorSql}
									/>
								</TabPane>
								<TabPane tabId="group">
									<EditorGroup
										group={group}
										ref={this.refEditorGroup}
										setDraft={this.props.setDraft}
									/>
								</TabPane>
							</TabContent>

							<GroupInfoDesc group={group} locale={locale} />
						</div>
					</div>
				</div>
			</div>
		);
	}
}
