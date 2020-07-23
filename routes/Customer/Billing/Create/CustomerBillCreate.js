import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import * as API from './../../../../actions/api';
import * as actions from './../../../../actions/ActionTypes';
import * as history from './../../../../core/history';
import Layout from './../../../../components/Layout/Layout';
import HeaderBackArrow from './../../../../components/Buddha/HeaderBackArrow';
import Section from './../../../../components/Section/Section';

class PageCustomerBillCreate extends React.Component {
    constructor(props, context) {
        super(props, context);

        // Set header
        this.props.dispatch({
            type: actions.HEADER_SET_ALL,
            payload: {
                title: 'Create bill',
                elements: [
                    <HeaderBackArrow label="Back to bills list" to="/customer/billing" />
                ]
            }
        });
    }

    render() {
        return (
            <Layout>
            </Layout>
        );
    }
}

function mapStateToProps(state) {
    return {
        header: state.header
    };
}

export default connect(mapStateToProps)(PageCustomerBillCreate);
