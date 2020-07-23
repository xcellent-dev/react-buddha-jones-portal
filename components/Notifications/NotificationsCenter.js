import React from 'react';
import { connect } from 'react-redux';
import * as actions from './../../actions/ActionTypes';
import s from './NotificationsCenter.css';
import Notification from './Notification';
import Paragraph from './../Content/Paragraph';
import Button from './../Button/Button';
import IconHamburgerMenu from './../Icons/IconHamburgerMenu';
import IconClose from './../Icons/IconClose';

class NotificationsCenter extends React.Component {
    constructor(props, context) {
        super(props, context);

        this.exists = true;

        this.state = {
            showHistory: false,
            unreadCount: 1
        };
    }

    componentWillUnmount() {
        this.exists = false;
    }

    handleNotificationDismiss(e, id) {
        // Iterate all live notifications to find id
        let index = null;
        for (let i = 0; i < this.props.notifications.liveNotifications.length; i++) {
            const notification = this.props.notifications.liveNotifications[i];
            if (notification.id === id) {
                index = i;
                break;
            }
        }

        // Remove unread count
        const newUnreadCount = this.state.unreadCount - 1;
        if (typeof this.exists !== typeof undefined && this.exists) {
            this.setState({
                unreadCount: newUnreadCount >= 0 ? newUnreadCount : 0
            });
        }

        // Remove live notification
        if (typeof index !== null) {
            this.props.dispatch({
                type: actions.NOTIFICATIONS_REMOVE_LIVE_NOTIFICATION,
                payload: {
                    index: index
                }
            });
        }
    }

    handleNotificationsHistoryToggle(e) {
        // Toggle hidden status of notifications history
        if (typeof this.exists !== typeof undefined && this.exists) {
            this.setState({
                showHistory: !this.state.showHistory
            });
        }
    }

    render() {
        // Notifications center class name
        let notificationsCenterClassName = s.notificationsCenter;
        notificationsCenterClassName += this.state.showHistory === false ? ' ' + s.hideHistory : '';

        // Render
        return (
            <div className={notificationsCenterClassName}>
                <Button
                    className={s.toggle}
                    onClick={e => this.handleNotificationsHistoryToggle(e)}
                    icon={{
                        size: 'large',
                        background: 'white',
                        element:
                            this.state.showHistory === false
                            ?
                                <IconHamburgerMenu
                                    width={14}
                                    height={12}
                                    marginTop={-6}
                                    marginLeft={-7}
                                />
                            :
                                <IconClose
                                    width={12}
                                    height={12}
                                    marginTop={-6}
                                    marginLeft={-6}
                                />
                    }}
                    tooltip={{
                        text: this.state.showHistory === false ? 'Notifications' : 'Close',
                        on: 'left'
                    }}
                />
                <div className={s.notificationsLive}>
                    {this.props.notifications.liveNotifications.map((notification, index) => {
                        if (notification !== null && typeof notification.title !== 'undefined') {
                            return (
                                <Notification
                                    key={notification.id}
                                    title={notification.title}
                                    description={typeof notification.description !== 'undefined' ? notification.description : undefined}
                                    type={typeof notification.type !== 'undefined' ? notification.type : undefined}
                                    showDate={false}
                                    dismissable={typeof notification.dismissable !== 'undefined' || typeof notification.dismissAutomatically !== 'undefined'
                                        ? {
                                            allow: typeof notification.dismissable !== 'undefined'
                                                ? notification.dismissable === true
                                                : undefined,
                                            onDismiss: e => this.handleNotificationDismiss(e, notification.id),
                                            automaticallyAfter: typeof notification.dismissAutomatically !== 'undefined'
                                                ? notification.dismissAutomatically
                                                : undefined,
                                        }
                                        : undefined}
                                    actions={typeof notification.actions !== 'undefined' && notification.actions !== null
                                        ? notification.actions
                                        : undefined}
                                />
                            );
                        }
                    })}
                </div>
                <div className={s.notificationsHistory}>
                    {this.props.notifications.allNotifications.map((notification, index) => {
                        if (notification !== null && typeof notification.title !== 'undefined') {
                            return (
                                <Notification
                                    key={notification.id}
                                    title={notification.title}
                                    description={typeof notification.description !== 'undefined' ? notification.description : undefined}
                                    type={typeof notification.type !== 'undefined' ? notification.type : undefined}
                                    date={typeof notification.date !== 'undefined' ? notification.date : undefined}
                                    showDate={typeof notification.date !== 'undefined' ? true : false}
                                    dismissable={{
                                        allow: false,
                                        automaticallyAfter: 0
                                    }}
                                />
                            );
                        }
                    })}
                    {(() => {
                        if (this.props.notifications.allNotifications.length <= 0) {
                            return (
                                <Notification
                                    title="You have no recent notifications"
                                    showDate={false}
                                    dismissable={{
                                        allow: false,
                                        automaticallyAfter: 0
                                    }}
                                />
                            );
                        }
                    })()}
                </div>
            </div>
        );
    }
}

function mapStateToProps(state) {
    return {
        notifications: state.notifications
    };
}

export default connect(mapStateToProps)(NotificationsCenter);
