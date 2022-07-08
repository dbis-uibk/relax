/*** Copyright 2018 Johannes Kessler
*
* This Source Code Form is subject to the terms of the Mozilla Public
* License, v. 2.0. If a copy of the MPL was not distributed with this
* file, You can obtain one at http://mozilla.org/MPL/2.0/. */

import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Navbar, NavbarBrand, Nav, NavItem, UncontrolledDropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap';
import NavLink from 'reactstrap/lib/NavLink';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalculator, faBars, faComment, faQuestionCircle, faAddressCard } from '@fortawesome/free-solid-svg-icons';
import { T, i18n } from '../i18n';
import { IconProp } from '@fortawesome/fontawesome-svg-core';

type Props = {

};

type State = {

};

export class NavigationMobile extends React.Component<Props, State> {

    constructor(props: Props) {
        super(props);
        this.state = {};
        this.changeLocale = this.changeLocale.bind(this);
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
    
    render() {
        return (
            <Navbar color="light" light expand="md" className="mobileNavbar">
                <UncontrolledDropdown>
                    <DropdownToggle nav>
                        <FontAwesomeIcon icon={faBars  as IconProp} />
                    </DropdownToggle>
                    <DropdownMenu>
                        <DropdownItem href="/relax/calc"><FontAwesomeIcon icon={faCalculator as IconProp} /> <T id="calc.navigation.calc" /></DropdownItem>
                        <DropdownItem href="/relax/help"><FontAwesomeIcon icon={faComment as IconProp} /> <T id="calc.navigation.help" /></DropdownItem>
                        <DropdownItem href="/relax/imprint"><FontAwesomeIcon icon={faAddressCard as IconProp} /> <T id="calc.navigation.imprint" /></DropdownItem>
                        <DropdownItem href="https://github.com/dbis-uibk/relax/issues"><FontAwesomeIcon icon={faQuestionCircle  as IconProp} /> <T id="calc.navigation.feedback" /></DropdownItem>
                        <DropdownItem divider />
                        <DropdownItem onClick={() => this.changeLocale('en')}>en</DropdownItem>
                        <DropdownItem onClick={() => this.changeLocale('de')}>de</DropdownItem>
                        <DropdownItem onClick={() => this.changeLocale('es')}>es</DropdownItem>
                        <DropdownItem onClick={() => this.changeLocale('kr')}>kr</DropdownItem>
                    </DropdownMenu>
                </UncontrolledDropdown>
                <NavbarBrand href="/">RelaX</NavbarBrand>
            </Navbar>
        );
    }
}
