import React from 'react';
import { Dispatch } from 'redux';
import { connect } from 'react-redux';
import s from './Layout.css';
import Sidebar from './Sidebar';
import Header from './Header';
import NotificationsCenter from './../Notifications/NotificationsCenter';
import Modal from './../Modals/Modal';
import * as user from './../../actions/User';
import history from './../../core/history';

class Layout extends React.Component {
    constructor(props, context) {
        super(props, context);

        // TODO Redirected if token is not set, It will do initial rendering while checking token and redirect,
        // so it should be done when initial routing
        if (!user.getAuthToken()) {
            history.replace('/user/login');
        } else {
            // Refresh token every 30 mim
            this.props.dispatch(user.actionRefreshToken());
        }
    }

    componentDidMount() {
        // Check login and store user info if brower keeps token only, but not user info
        if (!this.props.user) {
            this.props.dispatch(user.actionCheckLogin());
        }
    }

    render() {
        if (!this.props.user) {
            return null;
        } else {
            return (
                <div>

                    <main>
                        <div className={s.content}>
                            <Header ref="headerElement" />
                            <div className={s.contentInner}>
                                {this.props.children}
                            </div>
                        </div>
                    </main>

                    <Sidebar />

                    <NotificationsCenter />

                    <Modal />

                </div>
            );
        }
    }
}

function mapStateToProps(state) {
    return {
        user: state.user
    };
}

export default connect(mapStateToProps)(Layout);
