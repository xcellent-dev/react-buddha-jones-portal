import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import * as actions from './../../../actions/ActionTypes';
import Layout from './../../../components/Layout/Layout';
import Dashboard from './../../../components/Buddha/Dashboard';

class PageCustomerDashboard extends React.Component {
    constructor(props, context) {
        super(props, context);

        // Set header
        this.props.dispatch({
            type: actions.HEADER_SET_ALL,
            payload: {
                title: 'Customers'
            }
        });
    }

    render() {
        return (
            <Layout>
                <Dashboard
                    links={[
                        {
                            label: 'Pricing',
                            to: '/customer/pricing'
                        },
                        {
                            label: 'Billing',
                            to: '/customer/billing'
                        }
                    ]}
                />
            </Layout>
        );
    }
}

function mapStateToProps(state) {
    return {
        header: state.header
    };
}

export default connect(mapStateToProps)(PageCustomerDashboard);
