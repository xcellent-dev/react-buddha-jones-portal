import { createStore, combineReducers, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
import ActionsNavigation from './../actions/Navigation';
import ActionsModal from './../actions/Modal';
import ActionsHeader from './../actions/Header';
import ActionsNotifications from './../actions/Notifications';
import ActionsUser from './../actions/User';
import ActionsUsers from './../actions/Users';
import ActionsCustomers from './../actions/Customers';
import ActionsWork from './../actions/Work';

const reducers = combineReducers({
    navigation: ActionsNavigation,
    modal: ActionsModal,
    header: ActionsHeader,
    notifications: ActionsNotifications,
    user: ActionsUser,
    users: ActionsUsers,
    customers: ActionsCustomers,
    work: ActionsWork
});

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const store = createStore(
    reducers,
    composeEnhancers(
        applyMiddleware(thunk)
    )
);
// const store = createStore(reducers, applyMiddleware(thunk));
// window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
export default store;
