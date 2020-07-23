import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import * as actions from './../../../actions/ActionTypes';
import Layout from './../../../components/Layout/Layout';
import Section from './../../../components/Section/Section';
import HeaderBackArrow from './../../../components/Buddha/HeaderBackArrow';
import Input from './../../../components/Form/Input';
import ClientsFilter from './../../../components/Buddha/ClientsFilter';
import PricingTable from './PricingTable';
import { searchPhraseInString } from './../../../helpers/search';

class PageCustomerPricing extends React.Component {
    constructor(props, context) {
        super(props, context);

        // Set state
        this.state = {
            customerId: '',
            customerName: '',
            customerActivities: null,
            customerIsLoading: false,
            filterSearchQuery: '',
            filteredActivities: [],
            modifyingActivityId: null,
            modifyingActivityPrice: null
        };

        // Set header
        this.props.dispatch({
            type: actions.HEADER_SET_ALL,
            payload: {
                title: 'Customer pricing',
                elements: [
                    <HeaderBackArrow label="Back to customers dashboard" to="/customer" />
                ]
            }
        });

        // Mount
        this.isReady = true;

        // References
        this.searchInput = null;
    }

    setFilteredActivities() {
        const query = this.state.filterSearchQuery.trim();

        const filteredActivities = this.state.customerActivities.filter((activity, activityIndex) => {
            if (activity.status === 1 && [1, 2].indexOf(activity.type_id) !== -1) {
                if (query !== '') {
                    return searchPhraseInString(activity.name, query, true, true);
                } else {
                    return true;
                }
            } else {
                return false;
            }
        });

        this.setState({
            filteredActivities
        });
    }

    fetchCustomerActivities(customerId) {
        // TODO: Fetch from actual database

        // Simulate fetching
        setTimeout(() => {
            // Define activities
            const customerActivities = [
                { 'id': 1, 'type_id': 2, 'name': 'Assistant Editorial Work', 'status': 1, 'price': null },
                { 'id': 2, 'type_id': 2, 'name': 'Breakdown Movie', 'status': 1, 'price': null },
                { 'id': 3, 'type_id': 2, 'name': 'Digitize / Assemble Dailies', 'status': 1, 'price': null },
                { 'id': 4, 'type_id': 3, 'name': 'Downtime', 'status': 1, 'price': 0 },
                { 'id': 5, 'type_id': 2, 'name': 'Editorial', 'status': 1, 'price': 80 },
                { 'id': 6, 'type_id': 2, 'name': 'Finish Audio Mix', 'status': 1, 'price': 40 },
                { 'id': 7, 'type_id': 2, 'name': 'Finish Online', 'status': 1, 'price': 30 },
                { 'id': 8, 'type_id': 2, 'name': 'Finish Supervision', 'status': 1, 'price': 120 },
                { 'id': 9, 'type_id': 2, 'name': 'Finish / Prep for Finish', 'status': 1, 'price': 50 },
                { 'id': 10, 'type_id': 3, 'name': 'General Office', 'status': 1, 'price': 0 },
                { 'id': 11, 'type_id': 2, 'name': 'General Production', 'status': 1, 'price': 0 },
                { 'id': 12, 'type_id': 2, 'name': 'Design / Create Graphics', 'status': 1, 'price': 0 },
                { 'id': 13, 'type_id': 2, 'name': 'Graphic Exploration / Styleframes', 'status': 1, 'price': 0 },
                { 'id': 14, 'type_id': 2, 'name': 'Graphic Prep for Finish', 'status': 1, 'price': 60 },
                { 'id': 15, 'type_id': 2, 'name': 'Render Graphics', 'status': 1, 'price': 0 },
                { 'id': 16, 'type_id': 3, 'name': 'IT Work', 'status': 1, 'price': 0 },
                { 'id': 17, 'type_id': 3, 'name': 'Logging', 'status': 1, 'price': 0 },
                { 'id': 18, 'type_id': 2, 'name': 'Music Search', 'status': 1, 'price': 0 },
                { 'id': 19, 'type_id': 2, 'name': 'Narration Supervision', 'status': 1, 'price': 90 },
                { 'id': 20, 'type_id': 2, 'name': 'Produce', 'status': 1, 'price': 100 },
                { 'id': 21, 'type_id': 2, 'name': 'Screen Movie', 'status': 1, 'price': 0 },
                { 'id': 22, 'type_id': 3, 'name': 'Time Off', 'status': 1, 'price': 0 },
                { 'id': 23, 'type_id': 3, 'name': 'Waiting (specify in notes)', 'status': 1, 'price': 0 },
                { 'id': 24, 'type_id': 3, 'name': 'Work Orders', 'status': 1, 'price': 0 },
                { 'id': 25, 'type_id': 2, 'name': 'Writing', 'status': 1, 'price': null }
            ];

            // Update state
            this.setState({
                customerActivities,
                customerIsLoading: false
            }, () => {
                this.setFilteredActivities();
            });
        }, 1024);
    }

    handleCustomerChange(e) {
        if (this.isReady) {
            this.setState({
                customerId: e.value,
                customerName: e.label,
                customerIsLoading: true,
                customerActivities: null,
                filteredActivities: [],
                modifiedActivities: []
            }, () => {
                // Load activities for newly selected customer
                this.fetchCustomerActivities(this.state.customerId);
            });

            // Focus on search field
            if (this.searchInput) {
                if (typeof this.searchInput.focus !== 'undefined') {
                    this.searchInput.focus();
                }
            }
        }
    }

    handleActivitySearch(e) {
        if (typeof e !== 'undefined' && typeof e.target !== 'undefined' && typeof e.target.value !== 'undefined') {
            this.setState({
                filterSearchQuery: e.target.value
            }, () => {
                this.setFilteredActivities();
            });
        }
    }

    handleModifyingActivityPriceChange(newPrice) {
        if (typeof newPrice !== 'undefined') {
            this.setState({
                modifyingActivityPrice: newPrice
            });
        }
    }

    handleModifyingActivityEdit(activityId) {
        if (typeof activityId !== 'undefined') {
            let activityPrice = 0;

            this.state.filteredActivities.some((activity) => {
                if (activity.id === activityId) {
                    activityPrice = activity.price;
                    return true;
                } else {
                    return false;
                }
            });

            this.setState({
                modifyingActivityId: activityId,
                modifyingActivityPrice: activityPrice
            });
        }
    }

    handleModifyingActivityCancel(e) {
        this.setState({
            modifyingActivityId: null,
            modifyingActivityPrice: null
        });
    }

    handleModifyingActivitySave(e) {
        // Get index of activity
        let activityIndex = null;
        this.state.customerActivities.some((activity, index) => {
            if (activity.id === this.state.modifyingActivityId) {
                activityIndex = index;
                return true;
            } else {
                return false;
            }
        });

        // TODO: Save to database

        // Hide editing UI and update price
        this.setState({
            modifyingActivityId: null,
            modifyingActivityPrice: null,
            customerActivities: activityIndex !== null
                ? this.state.customerActivities.slice(0, activityIndex)
                    .concat(Object.assign({}, this.state.customerActivities[activityIndex], {
                        price: this.state.modifyingActivityPrice
                    })).concat(this.state.customerActivities.slice(activityIndex + 1))
                : this.state.customerActivities
        }, () => {
            this.setFilteredActivities();
        });
    }

    render() {
        return (
            <Layout>

                <Section
                    title="Activities pricing"
                    noSeparator={true}
                    headerElements={[
                        {
                            maxWidth: 320,
                            element:
                                <ClientsFilter
                                    onChange={e => this.handleCustomerChange(e)}
                                    allAreAllowed={false}
                                    label={this.state.customerId ? 'Change customer ' : 'Pick customer'}
                                    value={this.state.customerId}
                                    valueLabel={this.state.customerName}
                                />
                        },
                        {
                            element:
                                <Input
                                    ref={ref => this.searchInput = ref}
                                    onChange={e => this.handleActivitySearch(e)}
                                    value={this.state.filterSearchQuery}
                                    label="Search activities by name..."
                                    minWidth={380}
                                />
                        }
                    ]}
                >

                    <PricingTable
                        onCustomerChange={e => this.handleCustomerChange(e)}
                        customerIsSelected={this.state.customerId ? true : false}
                        activities={this.state.filteredActivities}
                        activitiesLoading={this.state.customerIsLoading}
                        onModifyingActivityPriceChange={e => this.handleModifyingActivityPriceChange(e)}
                        onModifyingActivityEdit={e => this.handleModifyingActivityEdit(e)}
                        onModifyingActivityCancel={e => this.handleModifyingActivityCancel(e)}
                        onModifyingActivitySave={e => this.handleModifyingActivitySave(e)}
                        modifyingActivityId={this.state.modifyingActivityId}
                        modifyingActivityPrice={this.state.modifyingActivityPrice}
                    />

                </Section>

            </Layout>
        );
    }
}

function mapStateToProps(state) {
    return {
        header: state.header
    };
}

export default connect(mapStateToProps)(PageCustomerPricing);
