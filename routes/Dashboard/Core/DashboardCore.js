import React from 'react';
import { connect } from 'react-redux';
import { debounce } from 'lodash';
import * as actions from './../../../actions/ActionTypes';
import history from './../../../core/history';
import Layout from './../../../components/Layout/Layout';
import Section from './../../../components/Section/Section';
import Row from './../../../components/Section/Row';
import Col from './../../../components/Section/Col';
import Table from './../../../components/Table/Table';
import TableRow from './../../../components/Table/TableRow';
import TableCell from './../../../components/Table/TableCell';
import Pagination from './../../../components/Pagination/Pagination';
import Paragraph from './../../../components/Content/Paragraph';
import Number from './../../../components/Content/Number';
import Date from './../../../components/Content/Date';
import Button from './../../../components/Button/Button';
import Input from './../../../components/Form/Input';
import ClientsFilter from './../../../components/Buddha/ClientsFilter';
import DropdownContainer from './../../../components/Form/DropdownContainer';
import OptionsList from './../../../components/Form/OptionsList';
import IconArrowRight from './../../../components/Icons/IconArrowRight';
import IconSearchLoupe from './../../../components/Icons/IconSearchLoupe';

class PageDashboardCore extends React.Component {
    constructor(props, context) {
        super(props, context);

        this.handleFilterSpotsTableByStringChange = this.handleFilterSpotsTableByStringChange.bind(this);
        this.filterSpotsTableByString = debounce(this.filterSpotsTableByString, 300);

        this.state = {
            spotsFilter: {
                search: '',
                date: { value: 'all', label: 'All' },
                status: { value: 'all', label: 'All' },
                client: { value: 'all', label: 'All' },
                clientSearch: ''
            },
            spots: [
                {
                    client: { id: 1, name: 'NBC Universal' },
                    project: { id: 1, name: 'Mr Robot' },
                    campaign: { id: 1, name: 'Upfront Presentation' },
                    spot: { id: 1, name: 'Elliot Monologue' },
                    dateChanged: '2016-08-12',
                    status: 'Requires action'
                },
                {
                    client: { id: 1, name: 'NBC Universal' },
                    project: { id: 1, name: 'Mr Robot' },
                    campaign: { id: 2, name: 'Season 2 Teaser' },
                    spot: { id: 2, name: 'Hack The Break' },
                    dateChanged: '2016-08-11',
                    status: 'Requires action'
                },
                {
                    client: { id: 2, name: 'HBO' },
                    project: { id: 2, name: 'Quarry' },
                    campaign: { id: 3, name: 'Launch' },
                    spot: { id: 3, name: 'Memphis' },
                    dateChanged: '2016-08-05',
                    status: 'Open'
                },
                {
                    client: { id: 2, name: 'HBO' },
                    project: { id: 3, name: 'Silicon Valley' },
                    campaign: { id: 4, name: 'Season 3 Teaser' },
                    spot: { id: 4, name: 'GES Summit Sizzle' },
                    dateChanged: '2016-07-24',
                    status: 'Open'
                },
                {
                    client: { id: 3, name: 'Warner Bros.' },
                    project: { id: 4, name: 'Bravo 14' },
                    campaign: { id: 5, name: 'Audio/Visual' },
                    spot: { id: 5, name: 'Puppet Master' },
                    dateChanged: '2016-07-16',
                    status: 'Complete'
                },
                {
                    client: { id: 3, name: 'Warner Bros.' },
                    project: { id: 4, name: 'Bravo 14' },
                    campaign: { id: 6, name: 'Trailer' },
                    spot: { id: 6, name: 'Deadshot' },
                    dateChanged: '2016-07-15',
                    status: 'Complete'
                },
                {
                    client: { id: 3, name: 'Warner Bros.' },
                    project: { id: 5, name: 'Lights Out' },
                    campaign: { id: 7, name: 'Teaser' },
                    spot: { id: 7, name: 'Friend' },
                    dateChanged: '2016-06-29',
                    status: 'Complete'
                },
                {
                    client: { id: 3, name: 'Warner Bros.' },
                    project: { id: 5, name: 'Lights Out' },
                    campaign: { id: 8, name: 'Trailer' },
                    spot: { id: 8, name: 'Right Radio' },
                    dateChanged: '2016-06-27',
                    status: 'Complete'
                },
                {
                    client: { id: 4, name: 'Fox' },
                    project: { id: 6, name: 'Mike & Dave' },
                    campaign: { id: 9, name: 'International Trailer' },
                    spot: { id: 9, name: 'Played' },
                    dateChanged: '2016-06-27',
                    status: 'Complete'
                }
            ]
        };
    }

    componentDidMount() {
        // Scroll to top
        window.scrollTo(0, 0);

        // Dispatch header
        this.props.dispatch({
            type: actions.HEADER_SET_ALL,
            payload: {
                title: 'Dashboard'
            }
        });
    }

    componentWillUmount() {
        // Remove header
        this.props.dispatch({
            type: actions.HEADER_RESET
        });
    }

    handleFilterSpotsTableByStringChange(e) {
        this.filterSpotsTableByString(e.target);
    }

    filterSpotsTableByString(target) {
        const query = target.value;
    }

    handleSpotsFilterByDateChange(selected) {
        if (typeof selected !== 'undefined' && typeof selected.value !== 'undefined') {
            this.setState(
                Object.assign({}, this.state, {
                    spotsFilter: Object.assign({}, this.state.spotsFilter, {
                        date: Object.assign({}, this.state, {
                            value: selected.value,
                            label: selected.label
                        })
                    })
                })
            );
        }
    }

    handleSpotsFilterByStatusChange(selected) {
        if (typeof selected !== 'undefined' && typeof selected.value !== 'undefined') {
            this.setState(
                Object.assign({}, this.state, {
                    spotsFilter: Object.assign({}, this.state.spotsFilter, {
                        status: Object.assign({}, this.state, {
                            value: selected.value,
                            label: selected.label
                        })
                    })
                })
            );
        }
    }

    handleSpotsFilterByClientChange(selected) {
        if (typeof selected !== 'undefined' && typeof selected.value !== 'undefined') {
            this.setState(
                Object.assign({}, this.state, {
                    spotsFilter: Object.assign({}, this.state.spotsFilter, {
                        client: Object.assign({}, this.state, {
                            value: selected.value,
                            label: selected.label
                        })
                    })
                })
            );
        }
    }

    changeSpotsTablePage(newPage) {

    }

    goToClientSpots(e, spotsSendPath) {
        if (typeof spotsSendPath !== 'undefined') {
            history.push('/dashboard/spots' + spotsSendPath);
        }
    }

    render() {
        return (
            <Layout>
                <Row removeGutter={true}>
                    <Col>
                        <Section
                            title="Spots"
                            noSeparator={true}
                            headerElements={
                                [
                                    {
                                        element:
                                            <DropdownContainer
                                                label="Date"
                                                align="right"
                                                value={this.state.spotsFilter.date.label}
                                            >
                                                <OptionsList
                                                    onChange={selected => this.handleSpotsFilterByDateChange(selected)}
                                                    value={this.state.spotsFilter.date.value}
                                                    options={[
                                                        { value: 'all', label: 'All' },
                                                        { value: 'thisweek', label: 'This week' },
                                                        { value: 'prevweek', label: 'Previous week' },
                                                        { value: 'thismonth', label: 'This month' },
                                                        { value: 'prevmonth', label: 'Previous month' },
                                                        { value: 'last3months', label: 'Last 3 months' },
                                                        { value: 'thisyear', label: 'This year' },
                                                        { value: 'lastyear', label: 'Last year' }
                                                    ]}
                                                />
                                            </DropdownContainer>
                                    },
                                    {
                                        element:
                                            <DropdownContainer
                                                label="Status"
                                                align="right"
                                                value={this.state.spotsFilter.status.label}
                                            >
                                                <OptionsList
                                                    onChange={selected => this.handleSpotsFilterByStatusChange(selected)}
                                                    value={this.state.spotsFilter.status.value}
                                                    options={[
                                                        { value: 'all', label: 'All' },
                                                        { value: 'alert', label: 'Requires action' },
                                                        { value: 'open', label: 'Open' },
                                                        { value: 'complete', label: 'Complete' },
                                                    ]}
                                                />
                                            </DropdownContainer>
                                    },
                                    {
                                        element:
                                            <ClientsFilter
                                                onChange={selected => this.handleSpotsFilterByClientChange(selected)}
                                            />
                                    },
                                    {
                                        element:
                                            <Input
                                                onChange={this.handleFilterSpotsTableByStringChange}
                                                label={'Search...'}
                                                color="brown"
                                                minWidth={288}
                                                maxWidth={360}
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
                                        { title: 'Status', align: 'right' },
                                        { title: '' }
                                    ]
                                }
                            >

                                {this.state.spots.map(spot => {
                                    // Status
                                    const status = spot.status;
                                    let type = 'default';
                                    if (status === 'Complete') {
                                        type = 'success';
                                    } else if (status === 'Requires action') {
                                        type = 'alert';
                                    }

                                    // Constructor URL
                                    let path = '/' + spot.client.id + '/' + spot.client.name + '/' + spot.spot.id;
                                    path += '/' + spot.project.name + '/' + spot.campaign.name + '/' + spot.spot.name;

                                    // Render
                                    return (
                                        <TableRow key={spot.spot.id}>
                                            <TableCell>
                                                <Paragraph>{spot.client.name}</Paragraph>
                                            </TableCell>
                                            <TableCell>
                                                <Paragraph>{spot.project.name}</Paragraph>
                                            </TableCell>
                                            <TableCell>
                                                <Paragraph>{spot.campaign.name}</Paragraph>
                                            </TableCell>
                                            <TableCell>
                                                <Paragraph>{spot.spot.name}</Paragraph>
                                            </TableCell>
                                            <TableCell align="right">
                                                <Date value={spot.dateChanged} />
                                            </TableCell>
                                            <TableCell align="right">
                                                <Paragraph type={type}>{status}</Paragraph>
                                            </TableCell>
                                            <TableCell align="right">
                                                <Button
                                                    onClick={e => this.goToClientSpots(e, path)}
                                                    tooltip={{
                                                        text: 'Go to spot',
                                                        on: 'left'
                                                    }}
                                                    icon={{
                                                        element: React.createElement(IconArrowRight, {
                                                            width: 15,
                                                            marginLeft: -7,
                                                            height: 11,
                                                            marginTop: -5
                                                        }, null),
                                                        size: 'small',
                                                        background: 'none'
                                                    }}
                                                />
                                            </TableCell>
                                        </TableRow>
                                    );
                                })}

                            </Table>

                            <Pagination
                                currentPage={1}
                                countPerPage={10}
                                countTotal={196}
                                displayTotals={true}
                                onPageChange={this.changeSpotsTablePage}
                            />

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

export default connect(mapStateToProps)(PageDashboardCore);
