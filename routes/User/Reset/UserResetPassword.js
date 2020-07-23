import React from 'react';
import { Dispatch } from 'redux';
import { connect } from 'react-redux';
import * as actions from './../../../actions/ActionTypes';
import history from './../../../core/history';
import s from './../Authentication.css';
import Layout from './../../../components/Layout/Layout';
import Row from './../../../components/Section/Row';
import Col from './../../../components/Section/Col';
import Button from './../../../components/Button/Button';
import Input from './../../../components/Form/Input';
import LoadingSpinner from './../../../components/Loaders/LoadingSpinner';
import * as user from './../../../actions/User';

class PageUserResetPassword extends React.Component {

    // Contructor
    constructor(props, context) {
        super(props, context);

        this.state = {
            username: '',
            error: false,
            verifying: false
        };
    }

    componentDidMount() {
        var { resetToken } = this.props;

        if (resetToken) {
            this.props.dispatch(user.actionSentResetPassword(resetToken));
        }
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.user && nextProps.user.resetPasswordStatus === 'FAILED_RESET_PWD') {
            this.setState({
                error: true,
                verifying: false
            });
        } else {
            this.setState({
                verifying: false
            });
        }
    }

    handleChangeUsername(e) {
        this.setState({
            username: e.target.value,
            error: false
        });

        this.props.dispatch(user.actionChangeResetStatus());
    }

    handleSubmitResetPassword(e) {
        if (this.state.username.trim() !== '') {
            this.setState({
                verifying: true
            }, () => {
                this.props.dispatch(user.actionSubmitResetPassword(this.state.username));
            });
        } else {
            this.setState({
                error: true,
                verifying: false
            });
        }

        e.preventDefault();
    }

    handleNavigationBackToLoginForm(e) {
        history.push('/user/login');
    }

    render() {
        // Define labels
        var { user, resetToken } = this.props;

        let showForm = true;
        let label = 'Reset password';
        let buttonText = 'Email me instructions';

        if (resetToken || (user && user.resetPasswordStatus === 'SENT_EMAIL')) {
            showForm = false;

            if (user && user.resetPasswordStatus === 'SENT_EMAIL') {
                label = 'Please check your email inbox for instructions to follow.';
            }

            if (resetToken) {
                buttonText = 'Reset password';

                if (user && user.resetPasswordStatus === 'SENT_EMAIL_WITH_PWD') {
                    label = 'Please check your email inbox for new password.';
                } else if (user && user.resetPasswordStatus === 'SENT_FAIL') {
                    label = 'Resetting password process has failed. Please try again later.';
                }
            }
        } else if (this.state.username.trim() === '') {
            label = 'Username is required';
        } else if (user && user.resetPasswordStatus === 'FAILED_RESET_PWD') {
            label = 'Username does not match';
        }

        if (this.state.verifying === true) {
            buttonText = 'Emailing instructions';
        }

        // Render
        return (
            <div className={s.page}>
                <div className={s.container}>
                    <div className={s.wrapper}>
                        <div className={s.header}>
                            <img src={require('./../../../assets/images/logos/buddha-jones-logo-large.png')} alt="Buddha Jones" />
                            <h1 className={this.state.error === true ? s.error : undefined}>
                                {label}
                            </h1>
                        </div>
                        {(() => {
                            if (showForm === true) {
                                return (
                                    <form className={s.form}>
                                        <Input
                                            className={s.firstField + ' ' + s.lastField}
                                            width={768}
                                            color={this.state.error === true ? 'red' : 'brown'}
                                            type="text"
                                            label="Username"
                                            autofocus={true}
                                            value={this.state.username}
                                            onChange={(e) => this.handleChangeUsername(e)}
                                        />
                                        <Button
                                            onClick={(e) => this.handleSubmitResetPassword(e)}
                                            className={s.button}
                                            isInBox={true}
                                            label={{
                                                text: buttonText,
                                                size: 'large',
                                                color: 'blue'
                                            }}
                                        />
                                    </form>
                                );
                            }
                        })()}
                        <div className={s.footer}>
                            <Button
                                onClick={(e) => this.handleNavigationBackToLoginForm(e)}
                                align="center"
                                label={{
                                    text: 'Back to login form',
                                    size: 'small',
                                    color: 'black',
                                    onLeft: false
                                }}
                            />
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

function mapStateToProps(state) {
    return {
        user: state.user
    };
}

export default connect(mapStateToProps)(PageUserResetPassword);

