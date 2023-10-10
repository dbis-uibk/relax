/*** Copyright 2018 Johannes Kessler
*
* This Source Code Form is subject to the terms of the Mozilla Public
* License, v. 2.0. If a copy of the MPL was not distributed with this
* file, You can obtain one at http://mozilla.org/MPL/2.0/. */

import { faCalculator, faComment, faGlobeEurope, faQuestionCircle } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import 'bootstrap/dist/css/bootstrap.css';
import { I18NProvider, T } from 'calc2/i18n';
import { Store } from 'calc2/store';
import * as queryString from 'query-string';
import * as React from 'react';
import { Provider } from 'react-redux';
import { BrowserRouter as Router, Redirect, Route, Switch, useHistory } from 'react-router-dom';
import { Collapse, DropdownItem, DropdownMenu, DropdownToggle, Nav, Navbar, NavbarBrand, NavbarToggler, NavItem, UncontrolledDropdown } from 'reactstrap';
import NavLink from 'reactstrap/lib/NavLink';
import { i18n } from './i18n';
import { ConnectedCalc } from './views/calc';
import { Help } from './views/help';
import { Landing } from './views/landing';
import { Imprint } from './views/imprint';

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
	}
		
	
	componentDidMount(){
		const element = document.getElementById('loadingScreen');
		element?.parentNode?.removeChild(element);
	}

	render() {
		const { store } = this.props;
		const { isNavbarOpen } = this.state;

		return (
			<Router>
				<Provider store={store}>
					<I18NProvider>
							<Switch>
								<Redirect exact from="/" to={`/relax/landing`} />
								<Redirect exact from="/relax" to={`/relax/landing`} />
								<Route path="/relax/landing" component={Landing} />
								<Route path="/relax/help" component={Help} />
								<Route path="/relax/imprint" component={Imprint} />
								<Redirect from="/relax/calc" to="/relax/calc/local/ufes/local/0" exact strict />
								<Route path="/relax/calc/:source/:id/:filename/:index" component={ConnectedCalc} />
								<Route path="/relax/calc/:source/:id" component={ConnectedCalc} />
								<Route path="/relax/api/:source/:id/:filename/:index" component={ConnectedCalc} />
								<Route path="/relax/api/:source/:id" component={ConnectedCalc} />
								<Route render={match => (
									<div className="view-min"><h1>404</h1>
										<p>This route doesn't exist</p>
										<span>{JSON.stringify(match)}</span>
									</div>
								)} />
							</Switch>
					</I18NProvider>
				</Provider>
			</Router>
		);
	}
}
