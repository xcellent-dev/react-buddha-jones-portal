import * as actions from './ActionTypes';
import * as API from './api';
import history from './../core/history';

export default function ActionsUser(state = null, action) {
    let token;
    let status;

    switch (action.type) {

        case actions.USER_LOGIN:
            token = action.payload.token;

            if (token) {
                saveAuthToken(token);
            }

            return action.payload;

        case actions.USER_SET_TOKEN:
            saveAuthToken(action.payload);
            return state;

        case actions.USER_FORGOT_PASSWORD:
            return Object.assign({}, state, {
                resetPasswordStatus: 'SENT_EMAIL'
            });

        case actions.USER_SENT_PASSWORD:
            return Object.assign({}, state, {
                resetPasswordStatus: 'SENT_EMAIL_WITH_PWD'
            });

        case actions.USER_INVALID_RESET_TOKEN:
            return Object.assign({}, state, {
                resetPasswordStatus: 'SENT_FAIL'
            });

        case actions.USER_SET_IMAGE:
            return Object.assign({}, state, {
                image: action.payload
            });

        case actions.USER_LOGOUT:
            saveAuthToken(null);
            return null;

        case actions.USER_LOGIN_FAILED:
            status = typeof action.payload.status !== 'undefined'
                ? action.payload.status === 401 ? 'UNAUTHORIZED' : 'BAD REQUEST'
                : 'BAD REQUEST';

            return Object.assign({}, state, {
                failedStatus: status
            });

        case actions.USER_RESET_PWD_FAILED:
            status = action.payload.status === 400 ? 'FAILED_RESET_PWD' : 'UNEXPECTED';

            return Object.assign({}, state, {
                resetPasswordStatus: status
            });

        case actions.USER_CHANGE_RESET_STATUS:
            return Object.assign({}, state, {
                resetPasswordStatus: ''
            });

        default:
            return state;

    }
}

export function actionLogin(loginCredential, toPathName) {
    return function(dispatch, getState) {
        var { username, password } = loginCredential;

        var send = {
            username,
            password
        };

        API.post(API.LOGIN, API.makePostData(send))
            .then((response) => {
                if (response.status === 1) {
                    var { data } = response;

                    dispatch({
                        type: actions.USER_LOGIN,
                        payload: data
                    });

                    history.replace(typeof toPathName !== 'undefined' && toPathName ? toPathName : '/');
                }
            })
            .catch((error) => {
                console.error('Could not login: ', error);
                dispatch({
                    type: actions.USER_LOGIN_FAILED,
                    payload: typeof error.response !== 'undefined' ? error.response : null
                });
            });
    };
}

export function actionCheckLogin() {
    return function(dispatch, getState) {
        API.get(API.LOGIN)
            .then((response) => {
                dispatch({
                    type: actions.USER_LOGIN,
                    payload: response
                });
            })
            .catch(() => {
                console.log('Failed to check login');
                const location = history.getCurrentLocation();
                let pathname = '/user/login';
                pathname += typeof location.pathname !== 'undefined' && location.pathname ? '?from=' + location.pathname : '';
                history.replace(pathname);
            });
    };
}

export function actionLogout() {
    return function(dispatch, getState) {
        API.get(API.LOGOUT)
            .then((response) => {
                dispatch({
                    type: actions.USER_LOGOUT
                });

                history.replace('/user/login');
            })
            .catch((response) => {
                // TODO error handle
            });
    };
}

export function actionRefreshToken() {
    return function(dispatch, getState) {
        var timer = setInterval(() => {
            var currentToken = getAuthToken();

            if (!currentToken) {
                const location = history.getCurrentLocation();
                let pathname = '/user/login';
                pathname += typeof location.pathname !== 'undefined' && location.pathname ? '?from=' + location.pathname : '';
                history.replace(pathname);
                clearInterval(timer);
            } else {
                API.get(API.LOGIN_REFRESH)
                    .then(response => {
                        dispatch({
                            type: actions.USER_SET_TOKEN,
                            payload: response.token
                        });
                    })
                    .catch(response => {
                        console.log('Failed to refresh token', response);

                        if (response.message === 'Network Error') {
                            // if failed because of network connection, try 10 times every 10s again
                            dispatch(refreshNetworkConnection());
                        } else {
                            const location = history.getCurrentLocation();
                            let pathname = '/user/login';
                            pathname += typeof location.pathname !== 'undefined' && location.pathname ? '?from=' + location.pathname : '';
                            history.replace(pathname);
                        }

                        clearInterval(timer);
                    });
            }
        // Refresh token every 25mins because token will be refreshed every 30mins on the server
        }, 1000 * 60 * 25);
    };
}

function refreshNetworkConnection() {
    return function(dispatch, getState) {
        var tryCount = 0;

        var networkTimer = setInterval(() => {
            tryCount++;

            if (tryCount > 10) {
                // Stop to try if try is over 10
                const location = history.getCurrentLocation();
                let pathname = '/user/login';
                pathname += typeof location.pathname !== 'undefined' && location.pathname ? '?from=' + location.pathname : '';
                history.replace(pathname);
                clearInterval(networkTimer);
            } else {
                API.get(API.LOGIN_REFRESH)
                    .then(response => {
                        clearInterval(networkTimer);

                        dispatch({
                            type: actions.USER_SET_TOKEN,
                            payload: response.token
                        });

                        dispatch(actionRefreshToken());
                    })
                    .catch(response => {
                        if (response.message !== 'Network Error') {
                            // Stop to try if it is not network connection
                            const location = history.getCurrentLocation();
                            let pathname = '/user/login';
                            pathname += typeof location.pathname !== 'undefined' && location.pathname ? '?from=' + location.pathname : '';
                            history.replace(pathname);
                            clearInterval(networkTimer);
                        }
                    });
            }
        }, 1000 * 10); // try every 10s
    };
}

export function actionSubmitResetPassword(username) {
    return function(dispatch) {
        var send = {
            email: username,
            // url: 'http://localhost:3000/user/reset-password/'    // Use it for develop
            url: 'http://buddhajones.redidemo.com/user/reset-password/'      // Use it for live
        };

        API.post(API.PASSWORD_RESET, API.makePutData(send), API.requestConfigUrlEncoded)
            .then(response => {
                dispatch({
                    type: actions.USER_FORGOT_PASSWORD
                });
            })
            .catch(error => {
                dispatch({
                    type: actions.USER_RESET_PWD_FAILED,
                    payload: error.response
                });
            });
    };
}

export function actionSentResetPassword(resetToken) {
    return function(dispatch) {
        API.get(API.PASSWORD_RESET + '/' + resetToken)
            .then(response => {
                dispatch({
                    type: actions.USER_SENT_PASSWORD
                });
            })
            .catch(response => {
                console.log('Reset token is invalid');
                dispatch({
                    type: actions.USER_INVALID_RESET_TOKEN
                });
            });
    };
}

export function actionUpdateProfileImage(imageUrl) {
    return {
        type: actions.USER_SET_IMAGE,
        payload: imageUrl
    };
}

export function actionChangeResetStatus() {
    return {
        type: actions.USER_CHANGE_RESET_STATUS
    };
}

export function getAuthToken() {
    var token = '';

    if (typeof(Storage) !== 'undefined') {
        token = localStorage.getItem(API.AUTH_HEADER) || '';
    }

    return token;
}

function saveAuthToken(token) {
    if (typeof(Storage) !== 'undefined') {
        if (token && (token !== '')) {
            localStorage.setItem(API.AUTH_HEADER, token);
        } else {
            localStorage.removeItem(API.AUTH_HEADER);
        }
    }
}
