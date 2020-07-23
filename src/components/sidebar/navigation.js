import React, { Component } from 'react';
import { Link } from 'react-router';
import './navigation-style';

class SidebarNavigation extends Component {

    render() {
        return (
            <div id="sidebar-navigation">

                <div id="sidebar-logo">
                    <img className="small" src="/src/images/logos/buddha-jones-logo-small.png" />
                    <img className="large" src="/src/images/logos/buddha-jones-logo-large.png" />
                </div>

                <hr id="sidebar-separator" />

                <ul id="sidebar-navigation" className="nav">
                    <li id="nav-icon-time">
                        <Link to="/time-tracking/entry" activeClassName="active">
                            <img width="24" src="/src/images/navigation/navigation-icon-time.png" />
                            <span>Time Entry</span>
                        </Link>
                    </li>
                    <li id="nav-icon-estimate">
                        <Link to="/estimate/estimation-and-quoting" activeClassName="active">
                            <img width="24" src="/src/images/navigation/navigation-icon-estimate.png" />
                            <span>Estimate &amp; Quote</span>
                        </Link>
                    </li>
                    <li id="nav-icon-send">
                        <Link to="/spot/forward" activeClassName="active">
                            <img width="24" src="/src/images/navigation/navigation-icon-send.png" />
                            <span>Forward Spot</span>
                        </Link>
                    </li>
                    <li id="nav-icon-spot">
                        <Link to="/spot/sent" activeClassName="active">
                            <img width="24" src="/src/images/navigation/navigation-icon-spot.png" />
                            <span>Spot Sent</span>
                        </Link>
                    </li>
                    <li id="nav-icon-billing">
                        <Link to="/spot/billing" activeClassName="active">
                            <img width="24" src="/src/images/navigation/navigation-icon-billing.png" />
                            <span>Spot Billing</span>
                        </Link>
                    </li>
                </ul>

               <ul id="sidebar-account" className="nav">
                    <li id="nav-icon-user">
                        <Link to="/account" activeClassName="active">
                            <img width="36" height="36" src="/src/images/account/empty-user-profile-picture.png" />
                            <span>My Account</span>
                        </Link>
                    </li>
                </ul>

            </div>
        );
    }
}

export default SidebarNavigation;
