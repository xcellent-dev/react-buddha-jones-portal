import { USERS_LIST_LOAD, USERS_LIST_INIT } from './ActionTypes';
import * as API from './api';

const initialState = {};

export default function ActionsUsers(state = initialState, action) {
    switch (action.type) {

        case USERS_LIST_LOAD:
            if (typeof action.payload !== 'undefined' && typeof action.payload.users !== 'undefined' && typeof action.payload.userType !== 'undefined') {
                return Object.assign({}, state, {
                    [action.payload.userType]: action.payload.users,
                    [action.payload.userType + 'LastTimestamp']: new Date().getTime(),
                    [action.payload.userType + 'Loading']: false
                });
            } else {
                return state;
            }

        case USERS_LIST_INIT:
            if (typeof action.payload !== 'undefined') {
                return Object.assign({}, state, {
                    [action.payload]: [],
                    [action.payload + 'LastTimestamp']: 0,
                    [action.payload + 'Loading']: true
                });
            } else {
                return state;
            }

        default:
            return state;
    }
}

export function actionInitializeUserType(userType) {
    return function(dispatch) {
        dispatch({
            type: USERS_LIST_INIT,
            payload: userType
        });
    };
}

export function actionUsersListLoad(userType, length = 9999) {
    return function(dispatch) {
        API.get(API.USERS, userType === 'all' ? { length } : {
            type: API.USER_TYPE_ID[userType],
            length
        }).then(response => {
            const users = response.users.map(user => {
                const { id, username, full_name, image, type_id } = user;

                return {
                    id,
                    userName: username,
                    image,
                    fullName: full_name,
                    typeId: type_id
                };
            });

            dispatch({
                type: USERS_LIST_LOAD,
                payload: {
                    userType,
                    users
                }
            });
        })
        .catch((error => {
            // TODO: error handling
            console.error('Could not load users');
        }));
    };
}
