import React from 'react';
import { Dispatch } from 'redux';
import { connect } from 'react-redux';
import * as actions from './../../../actions/ActionTypes';
import * as user from './../../../actions/User';

class PageLogout extends React.Component {
    constructor(props, context) {
        super(props, context);
    }

    componentDidMount() {
        // Scroll to top
        window.scrollTo(0, 0);

        // Logout
        this.props.dispatch(user.actionLogout());
    }

    render() {
        return <div></div>;
    }
}

function mapStateToProps(state) {
    return {
        user: state.user
    };
}

export default connect(mapStateToProps)(PageLogout);
