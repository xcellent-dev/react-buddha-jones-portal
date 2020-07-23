import * as actions from './ActionTypes';

/*
 * Sample notification object:
 * {
 *   id: number - notification id,
 *   title: string - notification title
 *   description: string - additional details (optional)
 *   dismissable: boolean - if user should see "X" close button to dismiss notification (optional)
 *   dismissToHistory: boolean - if notification, when dismissed, should be added to allNotifications array (optional)
 *   dismissAutomatically: number - seconds after which notification will disappear (optional)
 *   date: date object - date when notification happened (optional)
 *   type: string, one of: default, success, error (optional)
 *   actions: array of objects with structure of {
 *     onClick: func - on click behavior (optional)
 *     dismisses: bool - should clicking the action button also dismiss the notification (optional)
 *     iconElement: icon object - icon to represent action button
 *     labelText: string - text describing the action
 *   } (optional)
 * }
 */

export default function ActionsNotifications(state = {

    liveNotifications: [],
    allNotifications: [],
    notificationIds: [1]

}, action) {
    let index;
    let notification;

    switch (action.type) {

        case actions.NOTIFICATIONS_CREATE_LIVE_NOTIFICATION:
            return Object.assign({}, state, {
                liveNotifications: [action.payload.notification].concat(state.liveNotifications),
                notificationIds: state.notificationIds.concat([action.payload.id])
            });

        case actions.NOTIFICATIONS_REMOVE_LIVE_NOTIFICATION:
            index = action.payload.index;
            notification = state.liveNotifications[index];
            if (typeof notification.dismissToHistory !== 'undefined' && notification.dismissToHistory === false) {
                return Object.assign({}, state, {
                    liveNotifications: state.liveNotifications
                        .slice(0, index)
                        .concat(state.liveNotifications.slice(index + 1)),
                });
            } else {
                return Object.assign({}, state, {
                    allNotifications: state.liveNotifications
                        .slice(index, index + 1)
                        .concat(state.allNotifications),
                    liveNotifications: state.liveNotifications
                        .slice(0, index)
                        .concat(state.liveNotifications.slice(index + 1)),
                });
            }

        case actions.NOTIFICATIONS_ADD_HISTORY_NOTIFICATION:
            return Object.assign({}, state, {
                allNotifications: [action.payload.notification].concat(state.allNotifications),
                notificationIds: typeof action.payload.id !== 'undefined' ? state.notificationIds.concat([action.payload.id]) : state.notificationIds
            });

        default:
            return state;

    }
}

export function actionAlertNotify(title, description, type, showDate, dismissable, dismissToHistory, dismissAutomatically) {
    title = typeof title !== 'undefined' && title ? title : '';
    description = typeof description !== 'undefined' && description ? description : '';
    type = typeof type !== 'undefined' && type ? type : 'default';
    showDate = typeof showDate !== 'undefined' && showDate !== null ? showDate : true;
    dismissable = typeof dismissable !== 'undefined' && dismissable !== null ? dismissable : true;
    dismissToHistory = typeof dismissToHistory !== 'undefined' && dismissToHistory !== null ? dismissToHistory : true;
    dismissAutomatically = typeof dismissAutomatically !== 'undefined' && dismissAutomatically ? dismissAutomatically : 0;
    const notificationId = Date.now();

    return {
        type: actions.NOTIFICATIONS_CREATE_LIVE_NOTIFICATION,
        payload: {
            id: notificationId,
            notification: {
                id: notificationId,
                title: title,
                description: description,
                dismissable: dismissable,
                dismissToHistory: dismissToHistory,
                dismissAutomatically: dismissAutomatically,
                date: showDate === true ? new Date() : undefined,
                type: type
            }
        }
    };
}
