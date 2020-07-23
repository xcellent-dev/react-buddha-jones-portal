import React from 'react';
import { Dispatch } from 'redux';
import { connect } from 'react-redux';
import * as actions from './../../../actions/ActionTypes';
import history from './../../../core/history';
import s from './../Authentication.css';
import Paragraph from './../../../components/Content/Paragraph';
import Layout from './../../../components/Layout/Layout';
import Row from './../../../components/Section/Row';
import Col from './../../../components/Section/Col';
import Button from './../../../components/Button/Button';
import Input from './../../../components/Form/Input';
import LoadingSpinner from './../../../components/Loaders/LoadingSpinner';
import * as user from './../../../actions/User';

class PageUserLogin extends React.Component {

    // Contructor
    constructor(props, context) {
        super(props, context);

        this.state = {
            username: '',
            password: '',
            loading: false,
            errorUsername: false,
            errorPassword: false,
            errorMessage: ''
        };
    }

    componentDidMount() {
        // Scroll to top
        window.scrollTo(0, 0);
    }

    componentWillReceiveProps(nextProps) {
        if (typeof nextProps.user !== 'undefined' && typeof nextProps.user.failedStatus !== 'undefined') {
            this.setState({
                loading: false,
                errorUsername: true,
                errorPassword: true,
                errorMessage: nextProps.user.failedStatus === 'UNAUTHORIZED'
                    ? 'Wrong credentials'
                    : 'Invaild credentials'
            });
        } else {
            this.setState({
                errorUsername: false,
                errorPassword: false,
                errorMessage: ''
            });
        }
    }

    handleLoginFieldsChange(e, type) {
        if (typeof e !== 'undefined' && typeof e.target !== 'undefined' && typeof e.target.value !== 'undefined' && typeof type !== 'undefined') {
            this.setState({
                [type]: e.target.value
            });
        }
    }

    handleSubmitLogin(e) {
        e.preventDefault();

        // Trim username and password
        this.setState({
            loading: true,
            username: this.state.username.trim(),
            password: this.state.password.trim()
        }, () => {
            // Check if username and password are entered
            if (this.state.username === '' || this.state.password === '') {
                this.setState({
                    loading: false,
                    errorUsername: this.state.username === '' ? true : false,
                    errorPassword: this.state.password === '' ? true : false,
                    errorMessage: 'Both fields are required'
                });
            } else {
                this.setState({
                    errorUsername: false,
                    errorPassword: false,
                    errorMessage: ''
                }, () => {
                    const location = history.getCurrentLocation();
                    const toPathName = (
                        typeof location.query !== 'undefined' &&
                        typeof location.query['from'] !== 'undefined' &&
                        location.query['from'] !== null &&
                        location.query['from'].trim() !== ''
                    )
                        ? location.query['from'].trim()
                        : '/';
                    this.props.dispatch(user.actionLogin(this.state, toPathName));
                });
            }
        });
    }

    handleForgotPassword(e) {
        history.push('/user/reset-password');
    }

    // Render
    render() {
        return (
            <div className={s.page}>
                <div className={s.container}>
                    <div className={s.wrapper}>
                        <div className={s.header}>
                            <img src={require('./../../../assets/images/logos/buddha-jones-logo-large.png')} alt="Buddha Jones" />
                            <h1 className={this.state.errorMessage !== '' ? s.error : undefined}>
                                {
                                    this.state.errorMessage !== ''
                                        ? this.state.errorMessage
                                        : 'Login to Buddha Jones'
                                }
                            </h1>
                        </div>
                        <form className={s.form}>
                            <Input
                                className={s.firstField}
                                width={768}
                                color={this.state.errorUsername === true ? 'red' : 'brown'}
                                type="text"
                                label="Username"
                                autofocus={true}
                                value={this.state.username}
                                onChange={(e) => this.handleLoginFieldsChange(e, 'username')}
                            />
                            <Input
                                className={s.lastField}
                                width={768}
                                color={this.state.errorPassword === true ? 'red' : 'brown'}
                                type="password"
                                label="Password"
                                value={this.state.password}
                                onChange={(e) => this.handleLoginFieldsChange(e, 'password')}
                            />
                            <Button
                                onClick={(e) => this.handleSubmitLogin(e)}
                                className={s.button}
                                isInBox={true}
                                label={{
                                    text: this.state.loading ? 'Signing in' : 'Sign in',
                                    size: 'large',
                                    color: 'blue'
                                }}
                            />
                        </form>
                        <div className={s.footer}>
                            <Button
                                onClick={(e) => this.handleForgotPassword(e)}
                                align="center"
                                label={{
                                    text: 'Forgot your password?',
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

export default connect(mapStateToProps)(PageUserLogin);
