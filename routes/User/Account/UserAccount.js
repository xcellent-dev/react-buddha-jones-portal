import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import * as actions from './../../../actions/ActionTypes';
import * as API from './../../../actions/api';
import { actionUpdateProfileImage } from './../../../actions/User';
import { actionAlertNotify } from './../../../actions/Notifications';
import history from './../../../core/history';
import Layout from './../../../components/Layout/Layout';
import Section from './../../../components/Section/Section';
import Row from './../../../components/Section/Row';
import Col from './../../../components/Section/Col';
import Button from './../../../components/Button/Button';
import Input from './../../../components/Form/Input';
import IconClose from './../../../components/Icons/IconClose';
import IconLockWhite from './../../../components/Icons/IconLockWhite';
import s from './UserAccount.css';

class PageUserAccount extends React.Component {
    constructor(props, context) {
        super(props, context);

        this.state = {
            loading: true,
            pictureUrl: null,
            pictureUploading: false,
            pictureUploadStatus: 0,
            email: '',
            firstName: '',
            lastName: '',
            fullName: '',
            initials: '',
            username: '',
            passwordOld: '',
            passwordNew: '',
            passwordNewRepeat: '',
            isUploadProfileChanges: false,
            errorProfileChangesMessage: '',
            errorProfileChanges: false,
            isUploadPassword: false,
            errorPasswordMessage: '',
            errorPassword: false
        };
    }

    componentDidMount() {
        // Scroll to top
        window.scrollTo(0, 0);

        // Dispatch header
        this.props.dispatch({
            type: actions.HEADER_SET_ALL,
            payload: {
                title: 'My account',
                elements: [
                    <Button
                        onClick={e => this.handleUserLogout(e)}
                        label={{
                            text: 'Logout',
                            color: 'white',
                            size: 'large',
                            onLeft: true
                        }}
                        icon={{
                            size: 'small',
                            background: 'orange',
                            element:
                                <IconLockWhite
                                    width={12}
                                    height={18}
                                    marginLeft={-6}
                                    marginTop={-9}
                                />
                        }}
                    />
                ]
            }
        });

        if (this.props.user) {
            this.initProfileInfo(this.props.user);
        }
    }

    initProfileInfo(user) {
        // Construct full name
        let fullName = '';
        fullName += user.first_name
            ? user.first_name
            : '';
        fullName += user.last_name
            ? fullName.length > 0 ? ' ' + user.last_name : user.last_name
            : '';

        // Construct initials
        let initials = user.initials ? user.initials : '';
        if (initials === '') {
            const fullNameWords = fullName.split(' ');
            fullNameWords.map(word => {
                initials += word.slice(0, 1).toUpperCase();
            });
        }

        // Set profile info
        this.setState({
            loading: false,
            pictureUrl: user.image || null,
            email: user.email,
            firstName: user.first_name,
            lastName: user.last_name,
            fullName: fullName,
            initials: initials,
            username: user.username
        });
    }

    componentWillReceiveProps(nextProps) {
        if (!this.props.user && nextProps.user) {
            this.initProfileInfo(nextProps.user);
        }
    }

    handleUserLogout(e) {
        history.push('/user/logout');
    }

    handlePictureEdit(e) {
        if (typeof this.refs !== 'undefined' && typeof this.refs.fileField !== 'undefined') {
            this.refs.fileField.click();
        }
    }

    handlePictureFileChange(e) {
        if (typeof e !== 'undefined' && typeof e.target !== 'undefined' && typeof e.target.files !== 'undefined') {
            // Check if file has been selected
            if (e.target.files.length > 0) {
                // Check if file is an image
                const file = e.target.files.item(0);
                if (file.type.match('image.*')) {
                    // Indicate that file is being uploaded
                    this.setState({
                        pictureUploading: true
                    });

                    // Invoke and execute file reader on file
                    const reader = new FileReader();
                    reader.addEventListener('load', () => {
                        // Get and post file to the API
                        const base64Image = reader.result;

                        // Request Params
                        const userId = this.props.user.user_id;
                        const params = {
                            image: base64Image
                        };

                        let that = this;
                        // Upload
                        API.put(API.USERS + '/' + userId, API.makePutData(params))
                            .then(response => {
                                // Notify to success
                                this.props.dispatch(
                                    actionAlertNotify(
                                        'Success',
                                        'Saved profile image successfully',
                                        'success',
                                        false,
                                        true,
                                        false,
                                        5
                                    )
                                );

                                const newImageUrl = response.data.image + '?' + Date.now();  // Appended cachebreaker to update with same url

                                this.setState({
                                    pictureUrl: newImageUrl,  // Appended cachebreaker to update with same url
                                    pictureUploadStatus: 0,
                                    pictureUploading: false
                                });

                                this.props.dispatch(actionUpdateProfileImage(newImageUrl));
                            })
                            .catch(error => {
                                this.setState({
                                    pictureUploadStatus: error.response.data.message,
                                    pictureUploading: false
                                });
                            });
                    });
                    reader.readAsDataURL(file);
                } else {
                    this.props.dispatch(
                        actionAlertNotify(
                            'File is not an image',
                            'You have to select .gif, .jpg, .jpeg, .png or .bmp image',
                            'error',
                            false,
                            true,
                            false,
                            5
                        )
                    );
                }
            } else {
                this.props.dispatch(
                    actionAlertNotify(
                        'No file has been picked',
                        'You have to select .gif, .jpg, .jpeg, .png or .bmp image',
                        'error',
                        false,
                        true,
                        false,
                        5
                    )
                );
            }
        }
    }

    handleProfileInfoChange(e, field) {
        if (typeof e !== 'undefined' && typeof e.target !== 'undefined' && typeof e.target.value !== 'undefined') {
            if (typeof field !== 'undefined' && typeof this.state[field] !== 'undefined') {
                this.setState({
                    [field]: e.target.value
                });
            }
        }
    }

    handleProfileInfoChangeSave(e) {
        // Display that saving
        this.setState({
            isUploadProfileChanges: true
        });

        // Request Params
        const userId = this.props.user.user_id;
        const params = {
            email: this.state.email.trim()
        };

        // Check if required params are filled
        if (params.email === '') {
            // Throw email error
            this.setState({
                isUploadProfileChanges: false,
                errorProfileChangesMessage: 'Email is required',
                errorProfileChanges: true
            });
        } else {
            // Upload
            API.put(API.USERS + '/' + userId, API.makePutData(params))
                .then(response => {
                    // Notify to success
                    this.props.dispatch(
                        actionAlertNotify(
                            'Success',
                            'Saved profile changes successfully',
                            'success',
                            false,
                            true,
                            false,
                            5
                        )
                    );

                    this.setState({
                        email: response.data.email,
                        isUploadProfileChanges: false,
                        errorProfileChangesMessage: '',
                        errorProfileChanges: false
                    });
                })
                .catch(error => {
                    this.setState({
                        isUploadProfileChanges: false,
                        errorProfileChangesMessage: 'Error: please try again',
                        errorProfileChanges: true
                    });
                });
        }
    }

    handlePasswordChange(e, field) {
        if (typeof e !== 'undefined' && typeof e.target !== 'undefined' && typeof e.target.value !== 'undefined') {
            if (typeof field !== 'undefined') {
                this.setState({
                    errorPassword: false,
                    ['password' + field]: e.target.value
                });
            }
        }
    }

    handlePasswordChangeSave(e) {
        if (this.state.passwordNew === '') {
            this.setState({
                errorPassword: true,
                errorPasswordMessage: 'New password can not be blank'
            });

            return;
        }

        if (this.state.passwordNew !== this.state.passwordNewRepeat) {
            this.setState({
                errorPassword: true,
                errorPasswordMessage: 'New password does not match'
            });

            return;
        }

        this.setState({
            isUploadPassword: true
        });

        // Request Params
        const userId = this.props.user.user_id;
        const params = {
            old_password: this.state.passwordOld,
            password: this.state.passwordNew
        };

        API.put(API.USERS + '/' + userId, API.makePutData(params))
            .then(response => {
                // Notify to success
                this.props.dispatch(
                    actionAlertNotify(
                        'Success',
                        'Changed password successfully',
                        'success',
                        false,
                        true,
                        false,
                        5
                    )
                );

                // Clear passwords
                this.setState({
                    passwordOld: '',
                    passwordNew: '',
                    passwordNewRepeat: '',
                    isUploadPassword: false
                });
            })
            .catch(error => {
                this.setState({
                    isUploadPassword: false,
                    errorPassword: true,
                    errorPasswordMessage: error.response.data.message
                });
            });
    }

    render() {
        // Account image button
        let accountImageButtonClassName = s.accountImageButton;
        accountImageButtonClassName += this.state.pictureUploading ? ' ' + s.uploading : '';
        const accountImageButtonLabel = this.state.pictureUploading ? 'Uploading' : 'Edit photo';

        // Save password button
        const savePasswordButtonLabel = this.state.isUploadPassword
                                            ? 'Saving new password'
                                            : this.state.errorPassword
                                                ? this.state.errorPasswordMessage
                                                : 'Save new password';
        const savePasswordButtonColor = this.state.isUploadPassword
                                            ? 'black'
                                            : this.state.errorPassword
                                                ? 'orange'
                                                : 'blue';

        // Save profile changes button
        const saveProfileChangesButtonLabel = this.state.isUploadProfileChanges
                                                  ? 'Saving profile changes'
                                                  : this.state.errorProfileChanges
                                                      ? this.state.errorProfileChangesMessage
                                                      : 'Save profile changes';
        const saveProfileChangesButtonColor = this.state.isUploadProfileChanges
                                                  ? 'black'
                                                  : this.state.errorProfileChanges
                                                      ? 'orange'
                                                      : 'blue';

        // If user info is not fetched by refreshing the browser
        if (!this.props.user) {
            return (
                <Layout />
            );
        }

        // Render
        return (
            <Layout>

                <Row>

                    <Col size={3}>
                        <Section noSeparator={true}>
                            <button
                                onClick={e => this.handlePictureEdit(e)}
                                className={accountImageButtonClassName}
                            >
                                <p>{accountImageButtonLabel}</p>
                                <img
                                    src={
                                        this.state.pictureUrl
                                            ? this.state.pictureUrl
                                            : require('./../../../assets/images/account/empty-user-profile-picture.png')
                                    }
                                    height="128"
                                    width="128"
                                />
                            </button>
                            {(() => {
                                if (this.state.pictureUploadStatus !== 0) {
                                    return (
                                        <p className={s.accountImageUploadError}>
                                            {this.state.pictureUploadStatus}
                                        </p>
                                    );
                                }
                            })()}
                            <input
                                ref="fileField"
                                className={s.accountImageFileField}
                                onChange={e => this.handlePictureFileChange(e)}
                                accept=".gif,.jpg,.jpeg,.png,.bmp"
                                type="file"
                            />
                        </Section>
                    </Col>

                    <Col size={9}>
                        <Section noSeparator={true}>
                            <Row className={s.profileDetails} justifyContent="flex-start">
                                {(() => {
                                    if (this.state.username) {
                                        return <UserName label="Username:" value={this.state.username} />;
                                    }
                                })()}
                                {(() => {
                                    if (this.state.firstName) {
                                        return <UserName label="First name:" value={this.state.firstName} />;
                                    }
                                })()}
                                {(() => {
                                    if (this.state.lastName) {
                                        return <UserName label="Last name:" value={this.state.lastName} />;
                                    }
                                })()}
                                {(() => {
                                    if (this.state.initials) {
                                        return <UserName label="Initials:" value={this.state.initials} />;
                                    }
                                })()}
                            </Row>
                        </Section>

                        <Section title="Email address">
                            <Input
                                onChange={e => this.handleProfileInfoChange(e, 'email')}
                                value={this.state.email}
                                label="Email address"
                                type="text"
                            />
                            <br />
                            <Button
                                onClick={e => this.handleProfileInfoChangeSave(e)}
                                float="right"
                                label={{
                                    text: saveProfileChangesButtonLabel,
                                    color: saveProfileChangesButtonColor,
                                    size: 'large'
                                }}
                            />
                            <br />
                        </Section>

                        <Section title="Change password">
                            <Input
                                onChange={e => this.handlePasswordChange(e, 'Old')}
                                value={this.state.passwordOld}
                                label="Old password"
                                type="password"
                            />
                            <br />
                            <Input
                                onChange={e => this.handlePasswordChange(e, 'New')}
                                value={this.state.passwordNew}
                                label="New password"
                                type="password"
                            />
                            <br />
                            <Input
                                onChange={e => this.handlePasswordChange(e, 'NewRepeat')}
                                value={this.state.passwordNewRepeat}
                                label="Repeat new password"
                                type="password"
                            />
                            <br />
                            <Button
                                onClick={e => this.handlePasswordChangeSave(e)}
                                float="right"
                                label={{
                                    text: savePasswordButtonLabel,
                                    color: savePasswordButtonColor,
                                    size: 'large'
                                }}
                            />
                        </Section>
                    </Col>

                </Row>

            </Layout>
        );
    }
}

function UserName(props) {
    return (
        <Col size={0}>
            <p>
                <span>{props.label}</span>
                <br />
                <strong>{props.value}</strong>
            </p>
        </Col>
    );
}

function mapStateToProps(state) {
    return {
        user: state.user,
        header: state.header,
        notifications: state.notifications
    };
}

export default connect(mapStateToProps)(PageUserAccount);
