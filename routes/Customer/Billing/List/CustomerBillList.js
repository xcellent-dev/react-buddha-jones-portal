import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import * as API from './../../../../actions/api';
import * as actions from './../../../../actions/ActionTypes';
import history from './../../../../core/history';

import Layout from './../../../../components/Layout/Layout';
import HeaderBackArrow from './../../../../components/Buddha/HeaderBackArrow';
import Section from './../../../../components/Section/Section';
import Button from './../../../../components/Button/Button';
import Table from './../../../../components/Table/Table';
import TableRow from './../../../../components/Table/TableRow';
import TableCell from './../../../../components/Table/TableCell';
import Pagination from './../../../../components/Pagination/Pagination';
import ClientsFilter from './../../../../components/Buddha/ClientsFilter';
import DropdownContainer from './../../../../components/Form/DropdownContainer';
import OptionsList from './../../../../components/Form/OptionsList';
import LoadingShade from './../../../../components/Loaders/LoadingShade';
import LoadingSpinner from './../../../../components/Loaders/LoadingSpinner';
import Paragraph from './../../../../components/Content/Paragraph';
import Date from './../../../../components/Content/Date';
import Money from './../../../../components/Content/Money';

import IconArrowRight from './../../../../components/Icons/IconArrowRight';
import IconPlusWhite from './../../../../components/Icons/IconPlusWhite';
import s from './CustomerBillList.css';

class PageCustomerBillList extends React.Component {
    constructor(props, context) {
        super(props, context);

        // Set header
        this.props.dispatch({
            type: actions.HEADER_SET_ALL,
            payload: {
                title: 'Customer billing',
                elements: [
                    <HeaderBackArrow label="Back to customers dashboard" to="/customer" />,
                    <Button
                        onClick={e => this.handleDefineNewBill(e)}
                        label={{
                            text: 'Create new bill',
                            color: 'white',
                            size: 'large',
                            onLeft: true
                        }}
                        icon={{
                            size: 'small',
                            background: 'yellow',
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

        // Constants
        this.billsPerPage = 10;

        // Set state
        this.state = {
            billsFilter: {
                status: { value: '', label: 'All' },
                client: { value: '', label: 'All' }
            },
            bills: [],
            billsCurrentPage: 1,
            billsTotalCount: 0,
            billsLoading: false
        };

        // References
        this.statusDropdown = null;
    }

    componentWillMount() {
        this.fetchBills(true);
    }

    fetchBills(resetOffset) {
        // Indicate loading
        this.setState({
            billsLoading: true
        }, () => {
            // TODO: Fetch bills from database
            setTimeout(() => {
                // Prepare bills array
                const bills = [
                    {
                        id: 1,
                        customerId: 1,
                        customerName: 'NBC Universal',
                        projectId: 1,
                        projectName: 'Babysitter',
                        campaignId: 1,
                        campaignName: 'AV Campaign',
                        spotId: null,
                        spotName: null,
                        lastUpdate: '2017-03-03',
                        total: 728,
                        statusId: 1,
                        statusName: 'Draft'
                    },
                    {
                        id: 2,
                        customerId: 2,
                        customerName: 'Warner Bros.',
                        projectId: 2,
                        projectName: 'Before I Wake',
                        campaignId: 1,
                        campaignName: 'AV Campaign',
                        spotId: 10,
                        spotName: 'Deadshot: 60',
                        lastUpdate: '2017-02-28',
                        total: 5420,
                        statusId: 1,
                        statusName: 'Draft'
                    },
                    {
                        id: 3,
                        customerId: 3,
                        customerName: 'HBO',
                        projectId: 3,
                        projectName: 'Bravo 14',
                        campaignId: 1,
                        campaignName: 'AV Campaign',
                        spotId: null,
                        spotName: null,
                        lastUpdate: '2017-02-24',
                        total: 1800,
                        statusId: 3,
                        statusName: 'Under Review'
                    },
                    {
                        id: 4,
                        customerId: 2,
                        customerName: 'Warner Bros.',
                        projectId: 2,
                        projectName: 'Before I Wake',
                        campaignId: 1,
                        campaignName: 'AV Campaign',
                        spotId: null,
                        spotName: null,
                        lastUpdate: '2017-02-14',
                        total: 3475,
                        statusId: 4,
                        statusName: 'Approved'
                    },
                    {
                        id: 5,
                        customerId: 3,
                        customerName: 'HBO',
                        projectId: 7,
                        projectName: 'Lights Out',
                        campaignId: 1,
                        campaignName: 'AV Campaign',
                        spotId: null,
                        spotName: null,
                        lastUpdate: '2017-02-09',
                        total: 9756,
                        statusId: 2,
                        statusName: 'Sent to Billing'
                    },
                    {
                        id: 6,
                        customerId: 1,
                        customerName: 'NBC Universal',
                        projectId: 13,
                        projectName: 'Storks',
                        campaignId: 1,
                        campaignName: 'AV Campaign',
                        spotId: null,
                        spotName: null,
                        lastUpdate: '2017-02-01',
                        total: 6470,
                        statusId: 5,
                        statusName: 'Sent to Customer'
                    }
                ];

                // Update state
                this.setState({
                    bills,
                    billsLoading: false,
                    billsCurrentPage: resetOffset ? 1 : this.state.billsCurrentPage,
                    billsTotalCount: bills.length
                });
            }, 1024);
        });
    }

    handleDefineNewBill(e) {
        history.push('/customer/billing/new');
    }

    handleBillsFilterByStatusChange(selected) {
        if (typeof selected !== 'undefined' && typeof selected.value !== 'undefined') {
            // Change state
            this.setState({
                billsFilter: Object.assign({}, this.state.billsFilter, {
                    status: Object.assign({}, this.state.billsFilter.status, selected)
                })
            }, () => {
                // Close status dropdown
                if (this.statusDropdown && typeof this.statusDropdown.closeDropdown !== 'undefined') {
                    this.statusDropdown.closeDropdown();
                }

                // Fetch bills
                this.fetchBills(true);
            });
        }
    }

    handleBillsFilterByClientChange(client) {
        if (typeof client !== 'undefined' && typeof client.value !== 'undefined') {
            // Change state
            this.setState({
                billsFilter: Object.assign({}, this.state.billsFilter, {
                    client: Object.assign({}, this.state.billsFilter.client, client)
                })
            }, () => {
                // Fetch bills
                this.fetchBills(true);
            });
        }
    }

    handleBillsPageChange(page) {
        console.log(page);
    }

    handleNavigationToBill(id) {
        if (typeof id !== 'undefined') {
            history.push('/customer/billing/' + id);
        }
    }

    render() {
        // Bills table header
        const billsTableHeader = [
            { title: 'Client', align: 'left' },
            { title: 'Project', align: 'left' },
            { title: 'Campaign', align: 'left' },
            { title: 'Changed', align: 'right' },
            { title: 'Amount', align: 'right' },
            { title: 'Status', align: 'right' },
            { title: 'Action', align: 'right' }
        ];
        const billsTableHeaderColumnsCount = billsTableHeader.length;

        // Bills rows
        let billsRows = [];
        if (this.state.bills.length > 0) {
            let prevBillStatusId = 0;
            billsRows = this.state.bills.map((bill, billIndex) => {
                let singleBillRows = [];

                // Check if bill type has changed
                if (prevBillStatusId === 1 && bill.statusId > 1) {
                    singleBillRows.push(
                        <TableRow type="subrow" key={`bill-separator-${bill.id}`}>
                            <TableCell colSpan={billsTableHeaderColumnsCount} />
                        </TableRow>
                    );
                }

                // Campaign + spot name
                let campaignSpotName = null;
                if (bill.campaignName && bill.spotName) {
                    campaignSpotName = <Paragraph>{bill.campaignName} <span>- {bill.spotName}</span></Paragraph>;
                } else if (bill.campaignName) {
                    campaignSpotName = <Paragraph>{bill.campaignName}</Paragraph>;
                }

                // Status name
                let status = null;
                switch (bill.statusId) {
                    case 1:
                        status = <Paragraph bold={true} type="default">Draft</Paragraph>;
                        break;

                    case 2:
                        status = <Paragraph bold={true} type="success">Sent to Billing</Paragraph>;
                        break;

                    case 3:
                        status = <Paragraph bold={false} type="alert">Under Review</Paragraph>;
                        break;

                    case 4:
                        status = <Paragraph bold={false} type="success">Approved</Paragraph>;
                        break;

                    case 5:
                        status = <Paragraph bold={true} type="success">Sent to Customer</Paragraph>;
                        break;

                    default:
                        break;
                }

                // Create bill table row
                singleBillRows.push(
                    <TableRow key={`bill-${bill.id}`}>

                        <TableCell align="left">
                            <Paragraph>{bill.customerName}</Paragraph>
                        </TableCell>

                        <TableCell align="left">
                            <Paragraph>{bill.projectName}</Paragraph>
                        </TableCell>

                        <TableCell align="left" className={s.cellCampaign}>
                            {campaignSpotName}
                        </TableCell>

                        <TableCell align="right">
                            <Date value={bill.lastUpdate} />
                        </TableCell>

                        <TableCell align="right">
                            <Money value={bill.total} />
                        </TableCell>

                        <TableCell align="right">
                            {status}
                        </TableCell>

                        <TableCell align="right">
                            <Button
                                onClick={e => this.handleNavigationToBill(bill.id)}
                                float="right"
                                tooltip={{
                                    text: bill.statusId === 1 ? 'Edit bill' : 'View bill',
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

                // Update bill status id
                prevBillStatusId = bill.statusId;

                // Render bill table row
                return singleBillRows;
            });
        } else if (this.state.billsLoading) {
            billsRows.push(
                <TableRow key="loading-bills">
                    <TableCell colSpan={billsTableHeaderColumnsCount} align="center">
                        <Paragraph type="dim">Loading bills...</Paragraph>
                    </TableCell>
                </TableRow>
            );
        } else {
            billsRows.push(
                <TableRow>
                    <TableCell key="no-bills-available" colSpan={billsTableHeaderColumnsCount} align="center">
                        <Paragraph type="alert">There are no bills available for current criteria.</Paragraph>
                    </TableCell>
                </TableRow>
            );
        }

        // Render
        return (
            <Layout>

                <Section
                    title="Bills list"
                    noSeparator={true}
                    headerElements={
                        [
                            {
                                element:
                                    <DropdownContainer
                                            ref={ref => this.statusDropdown = ref}
                                            align="right"
                                            label="Status"
                                            value={this.state.billsFilter.status.label}
                                    >
                                        <OptionsList
                                            onChange={(e) => this.handleBillsFilterByStatusChange(e)}
                                            value={this.state.billsFilter.status.value}
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
                                        label="Client"
                                        value={this.state.billsFilter.client.value}
                                        valueLabel={this.state.billsFilter.client.label}
                                        onChange={e => this.handleBillsFilterByClientChange(e)}
                                    />
                            }
                        ]
                    }
                >

                    <Table header={billsTableHeader}>
                        {billsRows}
                    </Table>

                    <Pagination
                        countPerPage={this.billsPerPage}
                        currentPage={this.state.billsCurrentPage}
                        countTotal={this.state.billsTotalCount}
                        onPageChange={this.handleBillsPageChange}
                        displayTotals={true}
                    />

                    {this.state.billsLoading && (
                        <LoadingShade background="rgba(247, 247, 247, 0.88)">
                            <LoadingSpinner />
                        </LoadingShade>
                    )}

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

export default connect(mapStateToProps)(PageCustomerBillList);
