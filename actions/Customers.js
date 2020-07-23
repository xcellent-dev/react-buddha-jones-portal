import * as actions from './ActionTypes';
import * as API from './api';

const initialState = {
    savingContact: false
};

export default function ActionsCustomers(state = initialState, action) {
    switch (action.type) {

        case actions.CUSTOMER_LOAD:
            if (typeof action.payload !== 'undefined' && typeof action.payload.id !== 'undefined') {
                return Object.assign({}, state, {
                    [action.payload.id]: Object.assign({}, state[action.payload.id], {
                        id: parseInt(action.payload.id, 10),
                        name: typeof action.payload.name !== 'undefined' ? action.payload.name : undefined,
                        contacts: typeof action.payload.contacts !== 'undefined' ? action.payload.contacts : undefined,
                        lastTimestamp: new Date().getTime(),
                        loading: false
                    })
                });
            } else {
                return state;
            }

        case actions.CUSTOMER_INIT:
            if (typeof action.payload !== 'undefined' && typeof state[action.payload] !== 'undefined') {
                return Object.assign({}, state, {
                    [action.payload]: {
                        id: parseInt(action.payload, 10),
                        name: '',
                        contacts: [],
                        lastTimestamp: 0,
                        loading: true
                    }
                });
            } else {
                return state;
            }

        case actions.CUSTOMER_TOGGLE_SAVING_CONTACT:
            return Object.assign({}, state, {
                savingContact: typeof action.payload ? action.payload : !state.savingContact
            });

        default:
            return state;
    }
}

export function actionInitializeCustomer(customerId) {
    if (typeof customerId !== 'undefined') {
        customerId = typeof customerId === 'number' ? customerId.toString() : customerId;

        return function(dispatch) {
            dispatch({
                type: actions.CUSTOMER_INIT,
                payload: customerId
            });
        };
    }
}

export function actionLoadCustomer(customerId) {
    if (typeof customerId !== 'undefined') {
        customerId = typeof customerId === 'number' ? customerId.toString() : customerId;

        return function(dispatch) {
            API.get(API.CUSTOMER + '/' + customerId).then(response => {
                if (typeof response !== 'undefined' && response && typeof response.customerName !== 'undefined') {
                    return dispatch({
                        type: actions.CUSTOMER_LOAD,
                        payload: {
                            id: customerId,
                            name: response.customerName,
                            contacts: response.contact
                        }
                    });
                }
            })
            .catch((error => {
                // TODO: error handling
                console.error('Could not load customer');
            }));
        };
    }
}

/**
 * Create customer contact and save it to databsae
 *
 * @export
 * @param {number} customerId ID of the customer / studio
 * @param {{ name: string, email: string, phoneMobile: string, phoneOffice: string, address: string }} details Object containing contact information
 * @param {array} projectsAndCampaigns
 */
export function actionCreateCustomerContact(customerId, details, projectsAndCampaigns) {
    if (typeof customerId !== 'undefined' && typeof details.name !== 'undefined' && details.name) {
        return function(dispatch) {
            return API.post(API.CUSTOMER_CONTACT, API.makePostData({
                customer_id: customerId,
                name: details.name,
                email: typeof details.email !== 'undefined' && details.email ? details.email : undefined,
                mobile_phone: typeof details.phoneMobile !== 'undefined' && details.phoneMobile ? details.phoneMobile : undefined,
                office_phone: typeof details.phoneOffice !== 'undefined' && details.phoneOffice ? details.phoneOffice : undefined,
                postal_address: typeof details.address !== 'undefined' && details.address ? details.address : undefined,
                project_campaign: typeof projectsAndCampaigns !== 'undefined' && projectsAndCampaigns ? projectsAndCampaigns : undefined
            })).then((response) => {
                console.log(response);
                return dispatch(actionLoadCustomer(customerId)).then(() => {
                    return dispatch({
                        type: actions.CUSTOMER_TOGGLE_SAVING_CONTACT,
                        payload: false
                    });
                });
            }).catch((error) => {
                console.error('Could not create contact: ', error);
            });
        };
    }
}
