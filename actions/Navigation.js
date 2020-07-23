import * as actions from './ActionTypes';

export default function ActionsNavigation(state = {

    sidebarExpanded: false,
    activeNavigationGroupIndex: 0,
    navigationGroups: [
        {
            title: 'Dashboard',
            icon: require('./../assets/images/navigation/navigation-icon-dashboard.png'),
            links: [
                { path: '/', title: 'Dashboard' }
            ]
        },
        {
            title: 'Work',
            icon: require('./../assets/images/navigation/navigation-icon-projects.png'),
            links: [
                { path: '/projects', title: 'Projects board' },
                { path: '/time-tracking/create-entry', title: 'Create time entry' },
                { path: '/editors/project-updates', title: 'Update project progress' },
                { path: '/editors/updates', title: 'Editors updates' },
                { path: '/finish/request', title: 'Finish request' },
                { path: '/graphics', title: 'Graphics Request' }
            ]
        },
        {
            title: 'Billing',
            icon: require('./../assets/images/navigation/navigation-icon-time.png'),
            links: [
                { path: '/estimates', title: 'Estimate & Quote' },
                { path: '/spot/billing', title: 'Spot Billing' },
                { path: '/customer/billing', title: 'Customer' },
                { path: '/customer/pricing', title: 'Customer rate card' }
            ]
        },
        {
            title: 'Customer',
            icon: require('./../assets/images/navigation/navigation-icon-send.png'),
            links: [
                { path: '/spot-sent/report', title: 'Producer spot sent' },
                { path: '/spot-sent/finalize', title: 'Post team spot sent' },
                { path: '/spot/forward', title: 'Forward Spot' }
            ]
        },
        {
            title: 'Configuration',
            icon: require('./../assets/images/navigation/navigation-icon-activity.png'),
            links: [
                { path: '/activity', title: 'Activity definition' },
                { path: '/generic-staff', title: 'Generic staff' }
            ]
        }
    ],
    subSidebarExpanded: false,
    expandedNavigationGroupIndex: null,
    activeSubNavigationIndex: null,
    activeSubNavigationPosition: 0,
    subNavigationLinks: []

}, action) {
    switch (action.type) {

        case actions.SIDEBAR_TOGGLE_VISIBILITY:
            return Object.assign({}, state, {
                sidebarExpanded: (typeof action.payload !== 'undefined' && (action.payload === true || action.payload === false))
                    ? action.payload
                    : !state.sidebarExpanded
            });

        case actions.SIDEBAR_TOGGLE_SUB_NAV_VISIBILITY:
            return Object.assign({}, state, {
                subSidebarExpanded: (typeof action.payload !== 'undefined' && (action.payload === true || action.payload === false))
                    ? action.payload
                    : !state.subSidebarExpanded
            });

        case actions.SIDEBAR_CHANGE_ACTIVE_GROUP_INDEX:
            if (typeof action.payload !== 'undefined') {
                return Object.assign({}, state, {
                    activeNavigationGroupIndex: action.payload
                });
            } else {
                return state;
            }

        case actions.SIDEBAR_CHANGE_EXPANDED_GROUP_INDEX:
            if (typeof action.payload !== 'undefined') {
                return Object.assign({}, state, {
                    expandedNavigationGroupIndex: action.payload
                });
            } else {
                return state;
            }

        case actions.SIDEBAR_CHANGE_ACTIVE_SUB_LINK_INDEX:
            if (typeof action.payload !== 'undefined') {
                return Object.assign({}, state, {
                    activeSubNavigationIndex: action.payload
                });
            } else {
                return state;
            }

        case actions.SIDEBAR_CHANGE_ACTIVE_SUB_NAV_POSITION:
            if (typeof action.payload !== 'undefined') {
                return Object.assign({}, state, {
                    activeSubNavigationPosition: action.payload
                });
            } else {
                return state;
            }

        case actions.SIDEBAR_CHANGE_NAVIGATION_SUB_LINKS:
            return Object.assign({}, state, {
                subNavigationLinks: typeof action.payload !== 'undefined' && typeof action.payload.length !== 'undefined'
                    ? action.payload
                    : []
            });

        case actions.SIDEBAR_CHANGE_NAVIGATION_GROUPS:
            return Object.assign({}, state, {
                navigationGroups: typeof action.payload !== 'undefined' && typeof action.payload.length !== 'undefined'
                    ? action.payload
                    : []
            });

        case actions.SIDEBAR_COLLAPSE:
            return Object.assign({}, state, {
                sidebarExpanded: false,
                subSidebarExpanded: false
            });

        case actions.SIDEBAR_CHANGE_ALL:
            if (typeof action.payload !== 'undefined') {
                return Object.assign({}, state, action.payload);
            } else {
                return state;
            }

        default:
            return state;

    }
}
