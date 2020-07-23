/* eslint no-multi-spaces: 0 */

import * as axios from 'axios';

// General API constants
export const URL = 'http://api.buddhajones.redidemo.com';
export const AUTH_HEADER = 'Authorization';

// User type IDs sync with DB
export const USER_TYPE_ID = {
    editor:     1,
    designer:   2,
    producer:   3,
    billing:    4,
    writer:     5,
    musician:   6,
    manager:    7,
    admin:      100
};

// Comment type IDs sync with DB
export const COMMENT_TYPE = {
    Campaign:   1,
    Estimate:   2,
    Project:    3
};

// Status type IDs sync with DB
export const STATUS_TYPE = {
    Draft:              1,
    Final:              2,
    UnderReview:        3,
    Approved:           4,
    SentToCustomer:     5
};

// All API verbs
export const LOGIN                              = '/login';
export const LOGOUT                             = '/logout';
export const PASSWORD_RESET                     = '/password-reset';
export const LOGIN_REFRESH                      = '/login-refresh';
export const USER_TYPE                          = '/user-type';
export const USERS                              = '/users';
export const PROJECT                            = '/project';
export const CAMPAIGN                           = '/campaign';
export const SPOT                               = '/spot';
export const VERSION                            = '/version';
export const TIME_ENTRY                         = '/time-entry';
export const TIME_ENTRY_OF_USER                 = '/time-entry-of-user';
export const TIME_ENTRY_SUBMIT_FOR_REVIEW       = '/time-entry-submit-for-review';
export const ACTIVITY                           = '/activity';
export const ACTIVITY_LEVEL                     = '/activity-level';
export const COMMENT                            = '/comment';
export const ESTIMATE                           = '/estimate';
export const ESTIMATE_TYPE                      = '/estimate_type';
export const CUSTOMER                           = '/customer';
export const CUSTOMER_FIRST_LETTERS             = '/customer/first-letters';
export const CUSTOMER_CONTACT                   = '/customer-contact';
export const ASSIGN_CAMPAIGN_TO_PROJECT         = '/assign-campaign-to-project';
export const ASSIGN_SPOT_TO_CAMPAIGN            = '/assign-spot-to-campaign';
export const ASSIGN_VERSION_TO_SPOT             = '/assign-version-to-spot';
export const ASSIGN_MANAGEMENT_TO_CAMPAIGN      = '/assign-management-to-campaign';
export const WORK_STAGE                         = '/work-stage';
export const OUTSIDE_COST                       = '/outside-cost';
export const STAFF                              = '/staff';
export const GRAPHICS_REQUEST                   =  '/graphics-request';

export const requestConfig = {
    headers: {
        'Content-Type': 'text/plain'
    }
};

export const requestConfigFormData = {
    headers: {
        'Content-Type': 'multipart/form-data'
    }
};

export const requestConfigUrlEncoded = {
    headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
    }
};

//
// API GET
//
export function get(endpoint, query = {}) {
    let config = requestConfig;

    setAuthHeaders(config.headers);

    let promise = new Promise(
        (resolve, reject) => {
            let urlQuery = '';

            if (query) {
                urlQuery = Object.keys(query)
                    .filter((key) => key && query[key] !== undefined && (query[key] !== ''))
                    .map((key) => key + '=' + encodeURIComponent(query[key]))
                    .join('&');

                if (urlQuery !== '') {
                    urlQuery = '?' + urlQuery;
                }
            }

            axios.get(URL + endpoint + urlQuery, config)
                .then(
                    (response) => {
                        let data = response.data['data'];
                        resolve(data);
                    })
                .catch(
                    (response) => {
                        reject(response);
                    });
        }
    );

    return promise;
}

//
// API GET Raw(with response status)
//
export function getRaw(endpoint, query = {}) {
    let config = requestConfig;

    setAuthHeaders(config.headers);

    let promise = new Promise(
        (resolve, reject) => {
            let urlQuery = '';

            if (query) {
                urlQuery = Object.keys(query)
                    .filter((key) => key && query[key] !== undefined && (query[key] !== ''))
                    .map((key) => key + '=' + encodeURIComponent(query[key]))
                    .join('&');

                if (urlQuery !== '') {
                    urlQuery = '?' + urlQuery;
                }
            }

            axios.get(URL + endpoint + urlQuery, config)
                .then(
                    (response) => {
                        let data = response.data;
                        resolve(data);
                    })
                .catch(
                    (response) => {
                        reject(response);
                    });
        }
    );

    return promise;
}
//
// API POST
//
export function post(endpoint, body, conf = null) {
    let config = requestConfig;

    if (conf) {
        config = Object.assign(config, conf);
    } else if (body instanceof FormData) {
        config = Object.assign(config, requestConfigFormData);
    }

    setAuthHeaders(config.headers);

    let promise = new Promise(
        (resolve, reject) => {
            axios.post(URL + endpoint, body, config)
                .then(
                    (response) => {
                        let data = response.data;
                        resolve(data);
                    })
                .catch(
                    (response) => {
                        reject(response);
                    });
        }
    );

    return promise;
}

//
// API PUT
//
export function put(endpoint, body) {
    let config = requestConfig;

    if (body instanceof FormData) {
        config = Object.assign(config, requestConfigUrlEncoded);
    }

    setAuthHeaders(config.headers);

    let promise = new Promise(
        (resolve, reject) => {
            axios.put(URL + endpoint, body, config)
                .then(
                    (response) => {
                        let data = response.data;
                        resolve(data);
                    })
                .catch(
                    (response) => {
                        reject(response);
                    });
        }
    );

    return promise;
}

//
// API DELETE
//
export function del(endpoint) {
    let config = requestConfig;

    setAuthHeaders(config.headers);

    let promise = new Promise(
        (resolve, reject) => {
            axios.delete(URL + endpoint, config)
                .then(
                    (response) => {
                        let data = response.data;
                        resolve(data);
                    })
                .catch(
                    (response) => {
                        reject(response);
                    });
        }
    );

    return promise;
}

function setAuthHeaders(headers = {}) {
    if (typeof(Storage) !== 'undefined') {
        let token = localStorage.getItem(AUTH_HEADER) || '';

        if (token !== '') {
            headers[AUTH_HEADER] = token;
        } else {
            localStorage.removeItem(AUTH_HEADER);
        }
    }

    return headers;
}

export function makePutData(data = {}) {
    let query = [];
    let keys = Object.keys(data);

    keys.forEach((key) => {
        if (data[key] !== undefined) {
            query.push(`${key}=${encodeURIComponent(data[key])}`);
        }
    });

    let rlt = query.join('&');

    return rlt;
}

export function makePostData(data = {}) {
    let form = new FormData();
    let keys = Object.keys(data);

    keys.forEach((key) => {
        if (data[key] !== undefined) {
            form.append(key, data[key]);
        }
    });

    return form;
}
