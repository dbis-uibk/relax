/*** Copyright 2018 Johannes Kessler
*
* This Source Code Form is subject to the terms of the Mozilla Public
* License, v. 2.0. If a copy of the MPL was not distributed with this
* file, You can obtain one at http://mozilla.org/MPL/2.0/. */

import { faBars, faCalculator, faComment, faDatabase, faQuestionCircle } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { EditorGroup } from 'calc2/components/editorGroup';
import { EditorRelalg } from 'calc2/components/editorRelalg';
import { EditorBagalg } from 'calc2/components/editorBagalg';
import { EditorSql } from 'calc2/components/editorSql';
import { i18n, T, t } from 'calc2/i18n';
import * as store from 'calc2/store';
import { Group } from 'calc2/store/groups';
import { translateHeader } from 'calc2/utils/misc';
import classnames from 'classnames';
import * as React from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Button, DropdownItem, DropdownMenu, DropdownToggle, Modal, ModalBody, ModalFooter, ModalHeader, Nav, NavItem, NavLink, TabContent, TabPane, UncontrolledDropdown } from 'reactstrap';
import { GroupRelationList } from '../components/groupRelationList';
import { MenuConnected } from '../components/menu';
import { Navigation } from '../components/navigation';
import { IconProp } from '@fortawesome/fontawesome-svg-core';
require('./calculator.scss');


type Props = {
	group: Group,
	locale: store.State['session']['locale'],
	setDraft(draft: Group): void,
};

type State = {
	activeTab: 'relalg' | 'bagalg' | 'sql' | 'group',
	datasetModal: boolean,
	relationModal: boolean,
};


export class Calculator extends React.Component<Props, State> {
	private refEditorRelalg = React.createRef<EditorRelalg>();
	private refEditorBagalg = React.createRef<EditorBagalg>();
	private refEditorSql = React.createRef<EditorSql>();
	private refEditorGroup = React.createRef<EditorGroup>();

	constructor(props: Props) {
		super(props);

		toast.configure();

		this.state = {
			activeTab: 'relalg',
			datasetModal: false,
			relationModal: false,
		};
		

		this.getCurrentEditor = this.getCurrentEditor.bind(this);
		this.toggleDatasetModal = this.toggleDatasetModal.bind(this);
		this.insertRelationToggle = this.insertRelationToggle.bind(this);
		this.loadGroupEditor = this.loadGroupEditor.bind(this);
	}

	private toggleDatasetModal() {
		this.setState({
			datasetModal: !this.state.datasetModal,
		});
	}
	private insertRelationToggle() {
		this.setState({
			relationModal: !this.state.relationModal,
		});
	}

	private changeLocale(lang: string) {
		if (i18n.language === lang) {
			return;
		}
		if(window.confirm(i18n.t('local.change'))) {
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
			case 'bagalg':
				return this.refEditorBagalg;
			case 'group':
				return this.refEditorGroup;
		}
	}

	private loadGroupEditor(loadCurrentGroup: boolean) {
		let content = `-- this is an example
group: nameOfTheNewGroup 

A = {
a:string, b:number
example,  42
}`;
		if (loadCurrentGroup) {
			content = this.props.group.definition;
		}
		this.setState({
			activeTab: 'group',
		}, () => {
			const editor: any = this.getCurrentEditor().current;
			if (editor) {
				editor.editorBase.state.editor.setValue(content);
			}
			this.toggleDatasetModal();
		});
	}

	render() {
		const { group, locale } = this.props;
		const { activeTab } = this.state;

		return (
			<div className="view-max">
			<Navigation></Navigation>
			<div className="calculator">
				<ToastContainer enableMultiContainer position={toast.POSITION.TOP_RIGHT} />
				<div className="row">
					<div className="d-none d-xs-block d-sm-block d-md-block col-lg-1 col-xl-2"></div>
					<div className="groups-container col-xs-2 col-sm-2 col-md-2 col-lg-2 col-xl-2">
						<button className="btn btn-default dropdown-toggle" type="button" id="dropdownMenu1" onClick={this.toggleDatasetModal} style={{ width: '100%', textAlign: 'left', textOverflow: 'ellipsis', overflow: 'hidden' }}>
							<span>Select DB ({translateHeader(group.groupName, locale)})</span>
							<span className="caret" style={{ display: 'block', position: 'absolute', top: '50%', right: '10px' }}></span>
						</button>

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
								onElementClick={null}
							/>
						</div>
					</div>
					<div className="calculator-container col-xs-12 col-sm-12 col-md-12 col-lg-8 col-xl-6">
						<Nav tabs>
							<UncontrolledDropdown nav inNavbar className="showOnSM">
								<DropdownToggle nav>
									<FontAwesomeIcon icon={faBars as IconProp} />
								</DropdownToggle>
								<DropdownMenu>
									<DropdownItem href="/relax/calc"><FontAwesomeIcon icon={faCalculator as IconProp} /> <T id="calc.navigation.calc" /></DropdownItem>
									<DropdownItem href="/relax/help"><FontAwesomeIcon icon={faComment as IconProp } /> <T id="calc.navigation.help" /></DropdownItem>
									<DropdownItem href="https://github.com/dbis-uibk/relax/issues"><FontAwesomeIcon icon={faQuestionCircle as IconProp} /> <T id="calc.navigation.feedback" /></DropdownItem>
									<DropdownItem onClick={this.toggleDatasetModal}><FontAwesomeIcon icon={faDatabase as IconProp} /> <T id="calc.menu.datasets" /></DropdownItem>
									<DropdownItem divider />
									<DropdownItem onClick={() => this.changeLocale('en')}>en</DropdownItem>
									<DropdownItem onClick={() => this.changeLocale('de')}>de</DropdownItem>
									<DropdownItem onClick={() => this.changeLocale('es')}>es</DropdownItem>
									<DropdownItem onClick={() => this.changeLocale('kr')}>kr</DropdownItem>
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
									className={classnames({ active: activeTab === 'bagalg' })}
									onClick={() => { this.setState({ activeTab: 'bagalg' }); }}
								>
									<span className="hideOnSM"><T id="calc.editors.bags.tab-name" /></span>
									<span className="showOnSM"><T id="calc.editors.bags.tab-name-short" /></span>
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
									relInsertModalToggle={this.insertRelationToggle}
								/>
							</TabPane>
							<TabPane tabId="bagalg">
								<EditorBagalg
									group={group}
									ref={this.refEditorBagalg}
									relInsertModalToggle={this.insertRelationToggle}
								/>
							</TabPane>
							<TabPane tabId="sql">
								<EditorSql
									group={group}
									ref={this.refEditorSql}
									relInsertModalToggle={this.insertRelationToggle}
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

				<Modal isOpen={this.state.datasetModal} toggle={this.toggleDatasetModal}>
					<ModalHeader toggle={this.toggleDatasetModal}>{translateHeader(group.groupName, locale)}</ModalHeader>
					<ModalBody>
						<div>
							<MenuConnected datasetLoaded={() => { this.setState({ datasetModal: false }); }} loadGroupTab={(loadCurrentGroup: boolean) => { this.loadGroupEditor(loadCurrentGroup); }} />
						</div>
					</ModalBody>
					<ModalFooter>
						<Button color="secondary" onClick={this.toggleDatasetModal}>{t('calc.result.modal.close')}</Button>
					</ModalFooter>
				</Modal>

				<Modal isOpen={this.state.relationModal} toggle={this.insertRelationToggle}>
					<ModalHeader toggle={this.insertRelationToggle}>{translateHeader(group.groupName, locale)}</ModalHeader>
					<ModalBody>
						<GroupRelationList
							tables={group.tables}
							replace={(text: string) => {
								const editor = this.getCurrentEditor();
								if (editor && editor.current) {
									editor.current.replaceSelection(text);
								}
							}}
							onElementClick={this.insertRelationToggle}
						/>
					</ModalBody>
					<ModalFooter>
						<Button color="secondary" onClick={this.insertRelationToggle}>{t('calc.result.modal.close')}</Button>
					</ModalFooter>
				</Modal>

			</div>
			</div>
		);
	}
}
