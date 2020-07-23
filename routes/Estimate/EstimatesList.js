import React from 'react';
import { connect } from 'react-redux';
import { debounce, toNumber } from 'lodash';
import * as API from './../../actions/api';
import * as actions from './../../actions/ActionTypes';
import history from './../../core/history';
import Layout from './../../components/Layout/Layout';
import Section from './../../components/Section/Section';
import Row from './../../components/Section/Row';
import Col from './../../components/Section/Col';
import Table from './../../components/Table/Table';
import TableRow from './../../components/Table/TableRow';
import TableCell from './../../components/Table/TableCell';
import Pagination from './../../components/Pagination/Pagination';
import Paragraph from './../../components/Content/Paragraph';
import Money from './../../components/Content/Money';
import Number from './../../components/Content/Number';
import Date from './../../components/Content/Date';
import Button from './../../components/Button/Button';
import Input from './../../components/Form/Input';
import DropdownContainer from './../../components/Form/DropdownContainer';
import OptionsList from './../../components/Form/OptionsList';
import ClientsFilter from './../../components/Buddha/ClientsFilter';
import IconArrowRight from './../../components/Icons/IconArrowRight';
import IconSearchLoupe from './../../components/Icons/IconSearchLoupe';
import IconPlusWhite from './../../components/Icons/IconPlusWhite';
import LoadingShade from './../../components/Loaders/LoadingShade';
import LoadingSpinner from './../../components/Loaders/LoadingSpinner';

const ESTIMATE_PER_PAGE = 10;

class PageEstimatesList extends React.Component {
    constructor(props, context) {
        super(props, context);

        this.handleFilterEstimatesTableByStringChange = this.handleFilterEstimatesTableByStringChange.bind(this);
        this.filterEstimatesTableByString = debounce(this.filterEstimatesTableByString, 300);

        this.state = {
            estimatesFilter: {
                sort: 'priority',
                search: '',
                status: { value: '', label: 'All' },
                client: { value: '', label: 'All' },
                clientSearch: ''
            },
            estimates: [],
            currentPage: typeof this.props.estimatesPage !== 'undefined' ? toNumber(this.props.estimatesPage) : 1,
            totalCount: 0,
            isLoadingEstimate: false,
        };

        // Binding
        this.changeEstimatesTablePage = this.changeEstimatesTablePage.bind(this);
    }

    componentDidMount() {
        // Scroll to top
        window.scrollTo(0, 0);

        // Dispatch header
        this.props.dispatch({
            type: actions.HEADER_SET_ALL,
            payload: {
                title: 'All estimates',
                elements: [
                    <Button
                        onClick={e => this.handleCreateNewEstimateClick(e)}
                        label={{
                            text: 'Create new estimate',
                            color: 'white',
                            size: 'large',
                            onLeft: true
                        }}
                        icon={{
                            background: 'yellow',
                            size: 'small',
                            element:
                                <IconPlusWhite
                                    width={12}
                                    height={12}
                                    marginTop={-6}
                                    marginLeft={-6}
                                />
                        }}
                    />
                ]
            }
        });

        this.fetchEstimates();
    }

    componentWillUmount() {
        // Remove header
        this.props.dispatch({
            type: actions.HEADER_RESET
        });
    }

    fetchEstimates(resetOffset) {
        // Defaults
        resetOffset = typeof resetOffset !== 'undefined' ? resetOffset : false;

        // Show loading
        this.setState({
            isLoadingEstimate: true,
            currentPage: resetOffset ? 1 : this.state.currentPage
        }, () => {
            // Request params
            const params = {
                offset: (this.state.currentPage - 1) * ESTIMATE_PER_PAGE,
                length: ESTIMATE_PER_PAGE,
                status_id: this.state.estimatesFilter.status.value,
                customer_id: this.state.estimatesFilter.client.value,
                search: this.state.estimatesFilter.search,
                sort: this.state.estimatesFilter.sort
            };

            // Fetch
            API.getRaw(API.ESTIMATE, params)
                .then(response => {
                    const estimates = response.data.map(estimate => {
                        return {
                            id:             estimate.id,
                            customerName:   estimate.customerName,
                            projectName:    estimate.projectName,
                            campaignName:   estimate.campaignName,
                            spotName:       estimate.spotName,
                            versionName:    estimate.versionName,
                            createdAt:      estimate.createdAt,
                            updatedAt:      typeof estimate.updatedAt !== 'undefined' ? estimate.updatedAt : null,
                            multiplier:     estimate.multiplier,
                            totalAmount:    estimate.totalAmount,
                            status:         estimate.status,
                            statusId:       estimate.statusId
                        };
                    });

                    this.setState({
                        totalCount: response.total_count,
                        estimates: estimates,
                        isLoadingEstimate: false
                    });
                })
                .catch(error => {
                    this.setState({
                        isLoadingEstimate: false
                    });
                });
        });
    }

    handleCreateNewEstimateClick(e) {
        history.push('/estimate/estimation-and-quoting');
    }

    handleFilterEstimatesTableByStringChange(e) {
        this.filterEstimatesTableByString(e.target);
    }

    filterEstimatesTableByString(target) {
        const query = target.value;

        this.setState({
            currentPage: 1,
            estimatesFilter: Object.assign({}, this.state.estimatesFilter, {
                search: query
            })
        }, () => {
            this.fetchEstimates(true);
        });
    }

    handleEstimatesFilterByStatusChange(selected) {
        if (typeof selected !== 'undefined' && typeof selected.value !== 'undefined') {
            // Change state
            this.setState({
                estimatesFilter: Object.assign({}, this.state.estimatesFilter, {
                    status: Object.assign({}, this.state.estimatesFilter.status, {
                        value: selected.value,
                        label: selected.label
                    })
                })
            }, () => {
                // Close status dropdown
                if (typeof this.refs.statusDropdownContainer !== 'undefined') {
                    if (typeof this.refs.statusDropdownContainer.closeDropdown !== 'undefined') {
                        this.refs.statusDropdownContainer.closeDropdown();
                    }
                }

                // Fetch estimates
                this.fetchEstimates(true);
            });
        }
    }

    handleEstimatesFilterByClientChange(selected) {
        if (typeof selected !== 'undefined' && typeof selected.value !== 'undefined') {
            this.setState({
                estimatesFilter: Object.assign({}, this.state.estimatesFilter, {
                    client: Object.assign({}, this.state, {
                        value: selected.value,
                        label: selected.label
                    })
                })
            }, () => {
                // Close client filter dropdown
                if (this.refs.clientFilter !== undefined
                    && this.refs.clientFilter.refs.clientsFilterDropdown !== undefined
                    && this.refs.clientFilter.refs.clientsFilterDropdown.closeDropdown !== undefined) {
                        this.refs.clientFilter.refs.clientsFilterDropdown.closeDropdown();
                }

                // Fetch estimates
                this.fetchEstimates(true);
            });
        }
    }

    handleNavigationToEstimate(estimateId) {
        if (typeof estimateId !== 'undefined') {
            history.push('/estimate/estimation-and-quoting/' + estimateId + '/' + this.state.currentPage);
        }
    }

    changeEstimatesTablePage(newPage) {
        history.push('/estimates/' + newPage);
        this.setState({
            currentPage: newPage
        }, () => {
            this.fetchEstimates();
        });
    }

    render() {
        return (
            <Layout>
                <Row removeGutter={true}>
                    <Col>
                        <Section
                            title="Estimates"
                            noSeparator={true}
                            headerElements={
                                [
                                    {
                                        element:
                                            <DropdownContainer
                                                ref="statusDropdownContainer"
                                                align="right"
                                                label="Status"
                                                value={this.state.estimatesFilter.status.label}
                                            >
                                                <OptionsList
                                                    onChange={(e) => this.handleEstimatesFilterByStatusChange(e)}
                                                    value={this.state.estimatesFilter.status.value}
                                                    options={[
                                                        { value: '', label: 'All' },
                                                        { value: API.STATUS_TYPE.Draft, label: 'Draft' },
                                                        { value: API.STATUS_TYPE.UnderReview, label: 'Under Review' },
                                                        { value: API.STATUS_TYPE.Approved, label: 'Approved' },
                                                        { value: API.STATUS_TYPE.SentToCustomer, label: 'Sent To Customer' }
                                                    ]}
                                                />
                                            </DropdownContainer>
                                    },
                                    {
                                        element:
                                            <ClientsFilter
                                                ref="clientFilter"
                                                onChange={e => this.handleEstimatesFilterByClientChange(e)}
                                            />
                                    },
                                    {
                                        element:
                                            <Input
                                                onChange={this.handleFilterEstimatesTableByStringChange}
                                                label="Search estimate by project, campaign or spot name..."
                                                minWidth={360}
                                                maxWidth={456}
                                                icon={
                                                    <IconSearchLoupe
                                                        width={13}
                                                        height={13}
                                                        marginTop={-6}
                                                    />
                                                }
                                            />
                                    }
                                ]
                            }
                        >

                            <Table
                                header={
                                    [
                                        { title: 'Client', align: 'left' },
                                        { title: 'Project', align: 'left' },
                                        { title: 'Campaign', align: 'left' },
                                        { title: 'Spot', align: 'left' },
                                        { title: 'Changed', align: 'right' },
                                        { title: 'Markup', algin: 'right' },
                                        { title: 'Amount', algin: 'right' },
                                        { title: 'Status', align: 'right' },
                                        { title: 'Action', align: 'left' }
                                    ]
                                }
                            >
                                {(() => {
                                    if (this.state.estimates.length === 0) {
                                        return (
                                            <TableRow type="border">
                                                <TableCell colSpan={9} align="center">
                                                    <Paragraph>No estimate matches selected criteria</Paragraph>
                                                </TableCell>
                                            </TableRow>
                                        );
                                    } else {
                                        let estimatesResultNodes = this.state.estimates.map((estimate, index) => {
                                            // Determine status
                                            let statusIsBold, statusColor;
                                            switch (estimate.statusId) {
                                                case API.STATUS_TYPE.Approved:
                                                    statusColor = 'success';
                                                    statusIsBold = false;
                                                    break;

                                                case API.STATUS_TYPE.UnderReview:
                                                    statusColor = 'alert';
                                                    statusIsBold = false;
                                                    break;

                                                case API.STATUS_TYPE.Draft:
                                                    statusColor = 'default';
                                                    statusIsBold = true;
                                                    break;

                                                case API.STATUS_TYPE.SentToCustomer:
                                                    statusColor = 'success';
                                                    statusIsBold = true;
                                                    break;

                                                default:
                                                    statusColor = 'default';
                                                    statusIsBold = false;
                                                    break;
                                            }

                                            // Render estimate table row
                                            return (
                                                <TableRow key={estimate.id}>
                                                    <TableCell>
                                                        <Paragraph>{estimate.customerName}</Paragraph>
                                                    </TableCell>
                                                    <TableCell>
                                                        <Paragraph>{estimate.projectName}</Paragraph>
                                                    </TableCell>
                                                    <TableCell>
                                                        <Paragraph>{estimate.campaignName}</Paragraph>
                                                    </TableCell>
                                                    <TableCell>
                                                        <Paragraph>
                                                            {estimate.spotName + (estimate.versionName ? ' - ver. #' + estimate.versionName : '')}
                                                        </Paragraph>
                                                    </TableCell>
                                                    <TableCell align="right">
                                                        <Date value={estimate.updatedAt ? estimate.updatedAt : estimate.createdAt} />
                                                    </TableCell>
                                                    <TableCell align="right">
                                                        <Number value={estimate.multiplier} precision={2} />
                                                    </TableCell>
                                                    <TableCell align="right">
                                                        <Money value={estimate.totalAmount} valueBold={false} />
                                                    </TableCell>
                                                    <TableCell align="right">
                                                        <Paragraph
                                                            bold={statusIsBold}
                                                            type={statusColor}
                                                        >
                                                            {estimate.status}
                                                        </Paragraph>
                                                    </TableCell>
                                                    <TableCell align="right">
                                                        <Button
                                                            onClick={e => this.handleNavigationToEstimate(estimate.id)}
                                                            float="right"
                                                            tooltip={{
                                                                text: estimate.status === 'Draft' ? 'Edit estimate\'s draft' : 'Go to estimate',
                                                                on: 'left'
                                                            }}
                                                            icon={{
                                                                size: 'small',
                                                                background: 'none',
                                                                element:
                                                                    <IconArrowRight
                                                                        width={15}
                                                                        marginLeft={-7}
                                                                        height={11}
                                                                        marginTop={-5}
                                                                    />
                                                            }}
                                                        />
                                                    </TableCell>
                                                </TableRow>
                                            );
                                        });

                                        if (this.state.estimatesFilter.sort === 'priority') {
                                            let countOfDraft = this.state.estimates.filter(estimate => estimate.status === 'Draft').length;

                                            // If current view has 'Draft' and other type
                                            if (countOfDraft !== 0 && countOfDraft !== this.state.estimates.length) {
                                                // Add a seperator into view
                                                estimatesResultNodes.splice(countOfDraft, 0,
                                                    <TableRow key="subrow" type="subrow">
                                                        <TableCell colSpan={9} />
                                                    </TableRow>
                                                );
                                            }
                                        }

                                        return estimatesResultNodes;
                                    }
                                })()}
                            </Table>

                            <Pagination
                                currentPage={this.state.currentPage}
                                countPerPage={ESTIMATE_PER_PAGE}
                                countTotal={this.state.totalCount}
                                displayTotals={true}
                                onPageChange={this.changeEstimatesTablePage}
                            />

                            {(() => {
                                if (this.state.isLoadingEstimate === true) {
                                    return (
                                        <LoadingShade background="rgba(247, 247, 247, 0.9)">
                                            <LoadingSpinner size={64} color="#5A4D3F" />
                                        </LoadingShade>
                                    );
                                }
                            })()}
                        </Section>
                    </Col>
                </Row>
            </Layout>
        );
    }
}

function mapStateToProps(state) {
    return {
        header: state.header
    };
}

export default connect(mapStateToProps)(PageEstimatesList);
