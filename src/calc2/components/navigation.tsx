/*** Copyright 2018 Johannes Kessler
*
* This Source Code Form is subject to the terms of the Mozilla Public
* License, v. 2.0. If a copy of the MPL was not distributed with this
* file, You can obtain one at http://mozilla.org/MPL/2.0/. */

import * as React from 'react';
import { Navbar, NavbarBrand, Nav, NavItem, UncontrolledDropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap';
import NavLink from 'reactstrap/lib/NavLink';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
	faCalculator,
	faGlobeEurope,
	faComment,
	faQuestionCircle,
	faAddressCard,
	faSun,
} from '@fortawesome/free-solid-svg-icons';
import { T, i18n } from '../i18n';
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import { faMoon } from '@fortawesome/free-solid-svg-icons/faMoon';

type Props = {

};

type State = {
	currentTheme: string;
};

export class Navigation extends React.Component<Props, State> {
	
    constructor(props: Props) {
        super(props);
        this.state = {currentTheme: 'light'};
        this.changeLocale = this.changeLocale.bind(this);
				this.changeTheme = this.changeTheme.bind(this);
    }

	componentDidMount() {

		let lightModeLS = localStorage.getItem('lightMode');	
		// check if darkMode saved in localstorage	
		let darkModeLS = localStorage.getItem('darkMode');
		if(darkModeLS) {
			darkModeLS = JSON.parse(darkModeLS);
			if(darkModeLS) {
				this.changeTheme('dark');
			}
		} 
		else if(lightModeLS) {
			lightModeLS = JSON.parse(lightModeLS);
			if(lightModeLS) {
				this.changeTheme('light');
			}
		}
		else {
			// automatically switch to dark mode if user device is configured to dark mode	
			const matched = window.matchMedia('(prefers-color-scheme: dark)').matches;
			if(matched) {
				this.changeTheme('dark');
			}
		}
		

	}
		
		
    private changeLocale(lang: string) {
        if (i18n.language === lang) {
            return;
        }
        if (window.confirm('Reload page to change language?')) {
            i18n.changeLanguage(lang);
            window.location.reload();
        }
    }

	private changeTheme(theme: string) {
		switch (theme) {
			case 'light':
				document.body.classList.remove('dark-theme');
				localStorage.removeItem('darkMode');
				localStorage.setItem('lightMode', 'true');
				this.setState({currentTheme: 'light'});
				break;
			case 'dark':
				document.body.classList.add('dark-theme');
				localStorage.removeItem('lightMode');
				localStorage.setItem('darkMode', 'true');
				this.setState({currentTheme: 'dark'});
				break;
		}
	}


	render() {
        return (
            <Navbar color="light" light expand="md" className="desktopNavbar">
                <NavbarBrand href="/relax/">RelaX</NavbarBrand>
                <Nav className="ml-auto" navbar>
                    <NavItem className="navItemSpace"><NavLink href="/relax/calc"><FontAwesomeIcon icon={faCalculator  as IconProp} /> Calculator</NavLink></NavItem>
                    <UncontrolledDropdown nav inNavbar className="navItemSpace">
                        <DropdownToggle nav caret><FontAwesomeIcon icon={faGlobeEurope as IconProp} /> <T id="calc.navigation.language" /></DropdownToggle>
                        <DropdownMenu right>
                            <DropdownItem onClick={() => this.changeLocale('en')}>en</DropdownItem>
                            <DropdownItem onClick={() => this.changeLocale('de')}>de</DropdownItem>
                            <DropdownItem onClick={() => this.changeLocale('es')}>es</DropdownItem>
                            <DropdownItem onClick={() => this.changeLocale('kr')}>kr</DropdownItem>
                            <DropdownItem onClick={() => this.changeLocale('pt')}>pt</DropdownItem>
                        </DropdownMenu>
                    </UncontrolledDropdown>
                    <NavItem className="navItemSpace"><NavLink href="https://github.com/dbis-uibk/relax/issues"><FontAwesomeIcon icon={faComment as IconProp} /> <T id="calc.navigation.feedback" /></NavLink></NavItem>
                    <NavItem className="navItemSpace"><NavLink href="/relax/help"><FontAwesomeIcon icon={faQuestionCircle as IconProp} /> <T id="calc.navigation.help" /></NavLink></NavItem>
                    <NavItem className="navItemSpace"><NavLink href="/relax/imprint"><FontAwesomeIcon icon={faAddressCard as IconProp} /> <T id="calc.navigation.imprint" /></NavLink></NavItem>
									<NavItem className="navItemSpace">
										<div className="theme-mode-wrapper">
											{this.state.currentTheme === 'dark' ?
												<button className="theme-mode-toggle" onClick={() => this.changeTheme('light')}><FontAwesomeIcon
													icon={faSun as IconProp}/></button>
												:
												<button className="theme-mode-toggle" onClick={() => this.changeTheme('dark')}><FontAwesomeIcon
													icon={faMoon as IconProp}/></button>
											}
												</div>
									</NavItem>

								</Nav>
            </Navbar>
        );
    }
}

