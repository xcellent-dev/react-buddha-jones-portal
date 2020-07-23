import React, {Component} from 'react';
import SidebarNavigation from './../sidebar/navigation';
import '/styles/reset';

class MainLayout extends Component {
    render () {
        return (
            <div id="main">
                <div id="page">
                    {this.props.children}
                </div>
                <SidebarNavigation />
            </div>
        );
    }
}

export default MainLayout;
