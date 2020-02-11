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
import { T, i18n } from 'calc2/i18n';
import * as store from 'calc2/store';
import { Group } from 'calc2/store/groups';
import { translateHeader } from 'calc2/utils/misc';
import * as classnames from 'classnames';
import * as React from 'react';
import { Nav, NavItem, NavLink, TabContent, TabPane, UncontrolledDropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap';
import { GroupRelationList } from '../components/groupRelationList';
import { MenuConnected } from '../components/menu';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBars } from '@fortawesome/free-solid-svg-icons'

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
	
	private changeLocale(lang: string) {
		if (i18n.language === lang) {
			return;
		}

		if (window.confirm('Reload page to change language?')) { // TODO: i18n
			i18n.changeLanguage(lang);
			window.location.reload();
		}
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
			<div className="calculator">
				<div className="row">
					<div className="d-none d-xs-block d-sm-block d-md-block col-lg-1 col-xl-2"></div>
					<div className="groups-container col-xs-2 col-sm-2 col-md-2 col-lg-2 col-xl-2">
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
					<div className="calculator-container col-xs-12 col-sm-12 col-md-12 col-lg-8 col-xl-6">
						<Nav tabs>
							<UncontrolledDropdown nav inNavbar className="showOnSM">
								<DropdownToggle nav>
									<FontAwesomeIcon icon={faBars} />
								</DropdownToggle>
									<DropdownMenu>
									<DropdownItem><T id="calc.navigation.calc" /></DropdownItem>
									<DropdownItem><T id="calc.navigation.help" /></DropdownItem>
									<DropdownItem><T id="calc.navigation.feedback" /></DropdownItem>
									<DropdownItem divider />
									<DropdownItem onClick={() => this.changeLocale('en')}>en</DropdownItem>
									<DropdownItem onClick={() => this.changeLocale('de')}>de</DropdownItem>
									<DropdownItem onClick={() => this.changeLocale('es')}>es</DropdownItem>
								</DropdownMenu>
							</UncontrolledDropdown>
							<NavItem>
								<NavLink
									className={classnames({ active: activeTab === 'relalg' })}
									onClick={() => { this.setState({ activeTab: 'relalg' }); }}
								>
									<span className="hideOnSM"><T id="calc.editors.ra.tab-name" /></span>
									<span className="showOnSM"><T id="calc.editors.ra.tab-name-short" /></span>
								</NavLink>
							</NavItem>
							<NavItem>
								<NavLink
									className={classnames({ active: activeTab === 'sql' })}
									onClick={() => { this.setState({ activeTab: 'sql' }); }}
								>
									<span className="hideOnSM"><T id="calc.editors.sql.tab-name" /></span>
									<span className="showOnSM"><T id="calc.editors.sql.tab-name-short" /></span>
								</NavLink>
							</NavItem>
							<NavItem>
								<NavLink
									className={classnames({ active: activeTab === 'group' })}
									onClick={() => { this.setState({ activeTab: 'group' }); }}
								>
									<span className="hideOnSM"><T id="calc.editors.group.tab-name" /></span>
									<span className="showOnSM"><T id="calc.editors.group.tab-name-short" /></span>
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


					</div>
				</div>
			</div>
		);
	}
}
