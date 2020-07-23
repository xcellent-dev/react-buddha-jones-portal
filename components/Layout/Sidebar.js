import React from 'react';
import { connect } from 'react-redux';
import * as actions from './../../actions/ActionTypes';
import { startsWith } from 'lodash';
import history from './../../core/history';
import Link from './../Link';
import s from './Sidebar.css';

class Sidebar extends React.Component {
    constructor(props, context) {
        super(props, context);

        this.groupsList = null;
        this.subLinksList = null;
    }

    referenceGroupsList(ref) {
        this.groupsList = ref;
    }

    referenceSubLinksList(ref) {
        this.subLinksList = ref;
    };

    componentDidMount() {
        const { navigation } = this.props;
        const { navigationGroups } = navigation;
        const { pathname } = window.location;

        let groupIndex = null;
        for (let g = 0; g < navigationGroups.length; g++) {
            const group = navigationGroups[g];
            if (typeof group.links !== 'undefined' && group.links) {
                for (let l = 0; l < group.links.length; l++) {
                    const link = group.links[l];
                    if (startsWith(link.path, pathname)) {
                        groupIndex = g;
                        break;
                    }
                }
                if (groupIndex !== null) {
                    break;
                }
            }
        }
        if (groupIndex !== null) {
            this.props.dispatch({
                type: actions.SIDEBAR_CHANGE_ACTIVE_GROUP_INDEX,
                payload: groupIndex
            });
        }

        setTimeout(() => {
            this.props.dispatch({
                type: actions.SIDEBAR_COLLAPSE
            });
        }, 128);
    }

    componentDidUpdate(prevProps, prevState) {
        // Check if navigation is expanded and sub links nav needs realignment
        if (
            (this.props.navigation.expandedNavigationGroupIndex !== null) &&
            (prevProps.navigation.expandedNavigationGroupIndex !== this.props.navigation.expandedNavigationGroupIndex) &&
            (typeof this.subLinksList !== 'undefined' && this.subLinksList) &&
            (typeof this.groupsList !== 'undefined' && this.groupsList)
        ) {
            // Get list height and find expanded group
            const listHeight = this.subLinksList.offsetHeight;
            const sidebarHeight = window.innerHeight;
            const expandedGroupEntry = this.groupsList.querySelector('li.' + s.sidebarLinksListEntryExpanded);

            if (expandedGroupEntry) {
                // Calculate expanded group center
                const expandedGroupPos = expandedGroupEntry.offsetTop;
                const expandedGroupHeight = expandedGroupEntry.offsetHeight;
                const expandedGroupCenter = expandedGroupPos + (expandedGroupHeight / 2);

                // Calculate list position and check if it isn't off screen
                let listPosition = expandedGroupCenter - (listHeight / 2);
                if (listPosition + listHeight > sidebarHeight) {
                    const difference = sidebarHeight - (listPosition + listHeight);
                    listPosition = listPosition - difference;
                }
                if (listPosition < 0) {
                    listPosition = 0;
                }

                // Dispatch position change
                this.props.dispatch({
                    type: actions.SIDEBAR_CHANGE_ACTIVE_SUB_NAV_POSITION,
                    payload: expandedGroupPos
                });
            }
        }
    }

    handleSidebarHover(enter) {
        if (enter === true) {
            this.props.dispatch({
                type: actions.SIDEBAR_TOGGLE_VISIBILITY,
                payload: true
            });
        } else {
            this.props.dispatch({
                type: actions.SIDEBAR_CHANGE_ALL,
                payload: {
                    subSidebarExpanded: false,
                    sidebarExpanded: false,
                    expandedNavigationGroupIndex: null
                }
            });
        }
    }

    handleSidebarGroupClick(e, groupIndex) {
        e.preventDefault();

        const { navigation } = this.props;
        const { activeNavigationGroupIndex, navigationGroups } = navigation;

        if (typeof groupIndex !== 'undefined' && typeof navigationGroups[groupIndex] !== 'undefined') {
            const group = navigationGroups[groupIndex];

            if (typeof group.links !== 'undefined') {
                if (group.links.length > 1) {
                    this.props.dispatch({
                        type: actions.SIDEBAR_CHANGE_ALL,
                        payload: {
                            hidingAnimation: false,
                            subSidebarExpanded: true,
                            subNavigationLinks: group.links,
                            expandedNavigationGroupIndex: groupIndex
                        }
                    });
                } else if (group.links.length === 1) {
                    this.props.dispatch({
                        type: actions.SIDEBAR_CHANGE_ALL,
                        payload: {
                            activeNavigationGroupIndex: groupIndex,
                            expandedNavigationGroupIndex: null
                        }
                    });

                    history.push(group.links[0].path);
                }
            }
        }
    }

    handleSidebarLinkClick(e, linkIndex) {
        const { navigation } = this.props;
        const { expandedNavigationGroupIndex, navigationGroups } = navigation;

        if (typeof linkIndex !== 'undefined' && typeof navigationGroups[expandedNavigationGroupIndex].links[linkIndex] !== 'undefined') {
            this.props.dispatch({
                type: actions.SIDEBAR_CHANGE_ALL,
                payload: {
                    activeNavigationGroupIndex: expandedNavigationGroupIndex,
                    activeSubNavigationIndex: linkIndex,
                    expandedNavigationGroupIndex: null
                }
            });
        }
    }

    handleMyAccountClick(e) {
        this.props.dispatch({
            type: actions.SIDEBAR_CHANGE_ALL,
            payload: {
                activeNavigationGroupIndex: null,
                expandedNavigationGroupIndex: null
            }
        });
    }

    render() {
        const { navigation } = this.props;
        const pathname = window.location.pathname;

        // Nav container class name
        let containerNavClassName = s.sidebarNavigation;
        if (navigation.sidebarExpanded) {
            containerNavClassName = s.sidebarNavigationActive;
            if (navigation.subSidebarExpanded) {
                containerNavClassName = s.sidebarNavigationActiveWithSubNav;
            }
        }

        // Main nav class name
        let mainNavClassName = s.mainNav;
        if (navigation.sidebarExpanded) {
            mainNavClassName = s.mainNavActive;
        }

        // Sub nav class name
        let subNavClassName = s.subNav;
        if (navigation.subSidebarExpanded) {
            subNavClassName = s.subNavActive;
        }

        return (
            <div
                onMouseEnter={e => this.handleSidebarHover(true)}
                onMouseLeave={e => this.handleSidebarHover(false)}
                className={containerNavClassName}
            >

                <nav className={mainNavClassName}>
                    <div>
                        <img className={s.sidebarLogo + ' ' + s.sidebarLogoSmall} src={require('./../../assets/images/logos/buddha-jones-logo-small.png')} />
                        <img className={s.sidebarLogo + ' ' + s.sidebarLogoLarge} src={require('./../../assets/images/logos/buddha-jones-logo-large.png')} />
                    </div>

                    <hr className={s.sidebarSeparator} />

                    <ul className={s.sidebarLinksList} ref={ref => this.referenceGroupsList(ref)}>
                        {navigation.navigationGroups.map((group, groupIndex) => {
                            // Link class name
                            let groupClassName = '';
                            if (navigation.activeNavigationGroupIndex === groupIndex) {
                                groupClassName += ' ' + s.sidebarLinksListEntryActive;
                            }

                            if (navigation.expandedNavigationGroupIndex === groupIndex) {
                                groupClassName += ' ' + s.sidebarLinksListEntryExpanded;
                            }
                            groupClassName = groupClassName.trim();

                            // Link title
                            let groupTitle = group.title;
                            if (group.links.length === 1) {
                                groupTitle = group.links[0].title;
                            }

                            // Render link
                            return (
                                <li key={`group-${group.title}`} className={groupClassName ? groupClassName : undefined}>
                                    <a onClick={e => this.handleSidebarGroupClick(e, groupIndex)}>
                                        <img width="24" src={group.icon} />
                                        <span>{groupTitle}</span>
                                    </a>
                                </li>
                            );
                        })}
                    </ul>

                    <ul className={s.sidebarLinksList + ' ' + s.sidebarSettingsList}>
                        <li className={s.sidebarAccountEntry}>
                            <Link to="/user/account" onClick={e => this.handleMyAccountClick(e)}>
                                <img
                                    className={s.sidebarAccountImage + ' ' + s.sidebarAccountDefaultImage}
                                    src={
                                        this.props.user && this.props.user.image
                                        ? this.props.user.image
                                        : require('./../../assets/images/account/empty-user-profile-picture.png')
                                    }
                                    height="36"
                                    width="36"
                                />
                                <span>My Account</span>
                            </Link>
                        </li>
                    </ul>
                </nav>

                <nav className={subNavClassName}>
                    <ol
                        className={s.sidebarSubLinksList}
                        ref={ref => this.referenceSubLinksList(ref)}
                        style={{
                            transform: navigation.activeSubNavigationPosition
                                ? `translateY(${navigation.activeSubNavigationPosition}px)`
                                : undefined
                        }}
                    >
                        {navigation.subNavigationLinks.map((link, linkIndex) => {
                            // Sub link class name
                            let linkClassName = '';
                            if (
                                (navigation.expandedNavigationGroupIndex === navigation.activeNavigationGroupIndex) &&
                                (navigation.activeSubNavigationIndex === linkIndex)
                            ) {
                                linkClassName += ' ' + s.subNavigationLinkActive;
                            }
                            linkClassName = linkClassName.trim();

                            // Render sub link
                            return (
                                <li key={`sub-link-${link.path}`} className={linkClassName ? linkClassName : undefined}>
                                    <Link to={link.path} title={link.title} onClick={e => this.handleSidebarLinkClick(e, linkIndex)}>
                                        <span>{linkIndex + 1}.</span>
                                        {link.title}
                                    </Link>
                                </li>
                            );
                        })}
                    </ol>
                </nav>

            </div>
        );
    }
}

function mapStateToProps(state) {
    return {
        navigation: state.navigation,
        user: state.user
    };
}

export default connect(mapStateToProps)(Sidebar);
