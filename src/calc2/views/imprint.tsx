/*** Copyright 2018 Johannes Kessler
*
* This Source Code Form is subject to the terms of the Mozilla Public
* License, v. 2.0. If a copy of the MPL was not distributed with this
* file, You can obtain one at http://mozilla.org/MPL/2.0/. */

import * as React from 'react';
import { Navigation } from '../components/navigation';
import { NavigationMobile } from '../components/navigation-mobile';

export class Imprint extends React.Component {

    componentDidMount() {

    }

    render() {
        return (
            <div className="view-max">
                <Navigation></Navigation>
                <NavigationMobile></NavigationMobile>
                <div className="view-min">
                    Databases and Information System<br />
                    Universität Innsbruck<br />
                    ICT - building, second floor<br />
                    Technikerstrasse 21a<br />
                    A-6020 Innsbruck<br />
                </div>
            </div>
        );
    }

}