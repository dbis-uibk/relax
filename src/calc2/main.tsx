/*** Copyright 2018 Johannes Kessler
*
* This Source Code Form is subject to the terms of the Mozilla Public
* License, v. 2.0. If a copy of the MPL was not distributed with this
* file, You can obtain one at http://mozilla.org/MPL/2.0/. */

import 'bootstrap/dist/css/bootstrap.css';
import { I18NProvider, T } from 'calc2/i18n';
import { Store } from 'calc2/store';
import 'font-awesome/css/font-awesome.css';
import * as queryString from 'query-string';
import * as React from 'react';
import { Provider } from 'react-redux';
import { BrowserRouter as Router, Redirect, Route, Switch } from 'react-router-dom';
import { Collapse, DropdownItem, DropdownMenu, DropdownToggle, Nav, Navbar, NavbarBrand, NavbarToggler, NavItem, UncontrolledDropdown } from 'reactstrap';
import NavLink from 'reactstrap/lib/NavLink';
import { i18n } from './i18n';
import { ConnectedCalc } from './views/calc';
import { Help } from './views/help';
import { Landing } from './views/landing';

require('calc2/style/index.scss');


type Props = {
	store: Store,
};

type State = {
	isNavbarOpen: boolean,
};


export class Main extends React.Component<Props, State> {
	constructor(props: Props) {
		super(props);

		this.state = {
			isNavbarOpen: true,
		};

		this.changeLocale = this.changeLocale.bind(this);
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

	render() {
		const { store } = this.props;
		const { isNavbarOpen } = this.state;

		return (
			<Router>
				<Provider store={store}>
					<I18NProvider>
						<div>
							<Navbar color="light" light expand="md">
								<NavbarBrand href="/">RelaX - relational algebra calculator</NavbarBrand>
								<NavbarToggler onClick={() => this.setState({ isNavbarOpen: !isNavbarOpen })} />
								<Collapse isOpen={isNavbarOpen} navbar>
									<Nav className="ml-auto" navbar>
										<NavItem><NavLink href="/calc">Calc</NavLink></NavItem>

										<UncontrolledDropdown nav inNavbar>
											<DropdownToggle nav caret><T id="calc.navigation.language" /></DropdownToggle>
											<DropdownMenu right>
												<DropdownItem onClick={() => this.changeLocale('en')}>en</DropdownItem>
												<DropdownItem onClick={() => this.changeLocale('de')}>de</DropdownItem>
												<DropdownItem onClick={() => this.changeLocale('es')}>es</DropdownItem>
												<DropdownItem divider />
												<DropdownItem><span className="text-danger"><T id="calc.navigation.language-warning-reload-required" /></span></DropdownItem>
											</DropdownMenu>
										</UncontrolledDropdown>
										{/*<NavItem><NavLink href="/help"><T id="calc.navigation.take-a-tour" /></NavLink></NavItem>*/}
										<NavItem><NavLink href="https://github.com/dbis-uibk/relax/issues"><T id="calc.navigation.feedback" /></NavLink></NavItem>
										<NavItem><NavLink href="/help"><T id="calc.navigation.help" /></NavLink></NavItem>
									</Nav>
								</Collapse>
							</Navbar>

							<div>
								<Switch>
									<Redirect exact from="/" to={`/landing`} />
									<Route path="/landing" component={Landing} />
									<Route path="/help" component={Help} />
									<Redirect from="/calc" to="/calc/local/uibk/local/0" exact strict />
									<Route path="/calc/:source/:id/:filename/:index" component={ConnectedCalc} />

									<Route exact path="(/.*)?/(calc|index|help).htm" render={({ location, match, history, staticContext }) => {
										// support old paths
										console.log('old path', location, match);
										const query = queryString.parse(location.search);
										const page = match.params[1];
										const lang: string = query.lang || 'en'; // TODO: fallback to en when not supported

										if (i18n.language !== lang) {
											i18n.changeLanguage(lang);
										}

										// ?data=source:id
										const data: string = query.data || undefined;
										if (data) {
											// try to parse data
											const match = data.trim().match(/(gist):(.*)/);
											if (match !== null) {
												const [, source, id] = match;
												return <Redirect to={`/calc/${source}/${id}`} />;
											}
											else {
												return <p>data syntax not correct</p>;
											}
										}
										else {
											// no data
											switch (page) {
												case 'calc':
													return <Redirect to={`/calc/`} />;
												case 'help':
													return <Redirect to={`/help${location.hash}`} />;
												case 'index':
												default:
													return <Redirect to={`/landing`} />;
											}
										}
									}} />

									<Route render={match => (
										<span>404 {JSON.stringify(match)}</span>
									)} />
								</Switch>
							</div>
						</div>
					</I18NProvider>
				</Provider>
			</Router>
		);
	}
}


/*<Switch>
	<Route exact path="/" render={(match) => (
		<Redirect to={`/en/landing`} />
	)} />
	<Route path="/landing" render={() => (
		<Redirect to={`/en/landing`} />
	)} />
	<Route path="/en/landing" component={Landing} />
	
	<Route path="/help" render={() => (
		<Redirect to={`/en/help`} />
	)} />
	<Route path="/en/help" component={Help} />

	<Route path="/:lang/calc/:source?/:id?" render={Calc} />
	
	<Route exact path="(/.*)?/(calc|index|help).htm" render={({location, match, history, staticContext}) => {
		console.log('test', location, match);
		const query = queryString.parse(location.search);
		const lang: string = query['lang'] || 'en';
		const page = match.params[1];

		// ?data=source:id
		const data: string = query['data'] || undefined;
		if(data){
			// try to parse data
			const match = data.trim().match(/(gist):(.*)/);
			if(match !== null){
				const [, source, id] = match;
				return <Redirect to={`/${lang}/calc/${source}/${id}`} />
			}
			else{
				return <p>data syntax not correct</p>;
			}
		}
		else{
			// no data
			switch(page){
				case 'calc':
					return <Redirect to={`/${lang}/calc/`} />
				case 'help':
					return <Redirect to={`/${lang}/help${location.hash}`} />;
				case 'index':
				default:
					return <Redirect to={`/${lang}/landing`} />;
			}
		}
	}} />
	
	<Route render={(match) => (
		<span>no match {JSON.stringify(match)}</span>
	)} />
</Switch>*/
