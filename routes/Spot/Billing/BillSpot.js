import React from 'react';
import s from './BillSpot.css';
import {connect} from 'react-redux';
import * as actions from './../../../actions/ActionTypes';
import {printDateAsYearMonthDay, printHoursNumberAsHoursMinutesString} from './../../../helpers/date';
import {capitalizePhraseOrWord} from './../../../helpers/text';
import Layout from './../../../components/Layout/Layout';
import Section from './../../../components/Section/Section';
import Row from './../../../components/Section/Row';
import Col from './../../../components/Section/Col';
import Paragraph from './../../../components/Content/Paragraph';
import Dropdown from './../../../components/Form/Dropdown';
import Table from './../../../components/Table/Table';
import TableRow from './../../../components/Table/TableRow';

class PageBillSpot extends React.Component {
    constructor (props, context) {
        super(props, context);

        this.state = {
            filterByType: {
                value: '',
                label: 'All'
            },
            filterByClient: {
                value: '',
                label: 'All'
            },
            clients: [
                {
                    id: 1,
                    name: 'Warner Bros. / New Line',
                    projects: [
                        {
                            id: 1,
                            name: 'Lights Out',
                            campaigns: [
                                {
                                    id: 1,
                                    name: 'Snapchat Campaign',
                                    spots: [
                                        {
                                            id: 1,
                                            name: 'Lightbulb Snapchat',
                                            billed: 'hourly',
                                            versions: [
                                                {
                                                    id: 1,
                                                    name: '1 A',
                                                    date: new Date('2016-06-07T12:00:00Z'),
                                                    dateBilled: new Date('2016-06-09T12:00:00Z'),
                                                    isBilled: true,
                                                    estimateId: 46843,
                                                    editor: 'Tally',
                                                    to: 'Michael Jones',
                                                    hours: 1.25,
                                                    notes: '',
                                                    status: 'Revision Billed'
                                                },
                                                {
                                                    id: 2,
                                                    name: '1 B',
                                                    date: new Date('2016-06-06T12:00:00Z'),
                                                    dateBilled: new Date('2016-06-09T12:00:00Z'),
                                                    isBilled: true,
                                                    estimateId: 46843,
                                                    editor: 'Tally',
                                                    to: 'Michael Jones',
                                                    hours: 1.5,
                                                    notes: '',
                                                    status: 'Revision Billed'
                                                },
                                                {
                                                    id: 3,
                                                    name: '2',
                                                    date: new Date('2016-06-09T12:00:00Z'),
                                                    dateBilled: new Date('2016-06-13T12:00:00Z'),
                                                    isBilled: true,
                                                    estimateId: 46884,
                                                    editor: 'Graham',
                                                    to: 'Michael Jones',
                                                    hours: 0.25,
                                                    notes: '',
                                                    status: 'Revision Billed'
                                                },
                                                {
                                                    id: 4,
                                                    name: '3',
                                                    date: new Date('2016-06-14T12:00:00Z'),
                                                    dateBilled: new Date('2016-06-17T12:00:00Z'),
                                                    isBilled: true,
                                                    estimateId: 46925,
                                                    editor: 'Tally',
                                                    to: 'Michael Jones',
                                                    hours: 0.25,
                                                    notes: '',
                                                    status: 'Revision Billed'
                                                },
                                                {
                                                    id: 5,
                                                    name: '3',
                                                    date: new Date('2016-06-14T12:00:00Z'),
                                                    dateBilled: new Date('2016-06-17T12:00:00Z'),
                                                    isBilled: true,
                                                    estimateId: 46926,
                                                    editor: null,
                                                    to: 'WB Marketing Post',
                                                    hours: 0.5,
                                                    notes: 'Full Prep',
                                                    status: 'Finished'
                                                }
                                            ]
                                        },
                                        {
                                            id: 2,
                                            name: 'Lights Out Snapchat',
                                            billed: 'hourly',
                                            versions: [
                                                {
                                                    id: 6,
                                                    name: '1',
                                                    date: new Date('2016-06-07T12:00:00Z'),
                                                    dateBilled: new Date('2016-06-13T12:00:00Z'),
                                                    isBilled: true,
                                                    estimateId: 46885,
                                                    editor: 'Tally',
                                                    to: 'Michael Jones',
                                                    hours: 0.75,
                                                    notes: '',
                                                    status: 'Revision Billed'
                                                },
                                                {
                                                    id: 7,
                                                    name: '2',
                                                    date: new Date('2016-06-09T12:00:00Z'),
                                                    dateBilled: new Date('2016-06-13T12:00:00Z'),
                                                    isBilled: true,
                                                    estimateId: 46885,
                                                    editor: 'Jimmy',
                                                    to: 'Michael Jones',
                                                    hours: 1,
                                                    notes: '',
                                                    status: 'Revision Billed'
                                                },
                                                {
                                                    id: 8,
                                                    name: '3',
                                                    date: new Date('2016-06-14T12:00:00Z'),
                                                    dateBilled: new Date('2016-06-17T12:00:00Z'),
                                                    isBilled: true,
                                                    estimateId: 46925,
                                                    editor: 'Tally',
                                                    to: 'Michael Jones',
                                                    hours: 0.25,
                                                    notes: '',
                                                    status: 'Revision Billed'
                                                },
                                                {
                                                    id: 9,
                                                    name: '3',
                                                    date: new Date('2016-06-14T12:00:00Z'),
                                                    dateBilled: new Date('2016-06-17T12:00:00Z'),
                                                    isBilled: true,
                                                    estimateId: 46926,
                                                    editor: null,
                                                    to: 'Michael Jones',
                                                    hours: 0.25,
                                                    notes: 'Full Prep',
                                                    status: 'Finished'
                                                },
                                                {
                                                    id: 10,
                                                    name: '3',
                                                    date: new Date('2016-06-15T12:00:00Z'),
                                                    dateBilled: null,
                                                    isBilled: true,
                                                    estimateId: null,
                                                    editor: null,
                                                    to: 'Matt Oldham',
                                                    hours: null,
                                                    notes: 'AAF per client request',
                                                    status: null
                                                },
                                                {
                                                    id: 11,
                                                    name: '3 Rev',
                                                    date: new Date('2016-06-15T12:00:00Z'),
                                                    dateBilled: null,
                                                    isBilled: false,
                                                    estimateId: 46947,
                                                    editor: 'Tally',
                                                    to: 'Michael Jones',
                                                    hours: 0.25,
                                                    notes: null,
                                                    status: 'Need to Bill'
                                                }
                                            ]
                                        }
                                    ]
                                }
                            ]
                        }
                    ]
                }
            ]
        };
    }

    componentWillMount () {
        // Update header
        this.props.dispatch({
            type: actions.HEADER_SET_ALL,
            payload: {
                title: 'Bill spot',
                elements: []
            }
        });
    }

    handleClientFilterSearch (e) {
        // TODO
    }

    handleClientFilterChange (e) {
        // TODO
    }

    handleTypeFilterChange (seletedTypeFilter) {
        if (typeof seletedTypeFilter !== 'undefined') {
            this.setState(
                Object.assign({}, this.state, {
                    filterByType: seletedTypeFilter
                })
            );
        }
    }

    render () {
        return (
            <Layout>

                {this.state.clients.map((client, clientIndex) => {
                    return (
                        <Section
                            key={client.id}
                            title={client.name}
                            noSeparator={clientIndex === 0 ? true : false}
                            headerElements={clientIndex === 0 ? [
                                {
                                    element: React.createElement(Dropdown, {
                                        onChange: e => this.handleTypeFilterChange(e),
                                        type: 'oneline',
                                        label: 'Show only of type',
                                        options: [
                                            {value: '', label: 'All'},
                                            {value: 'resent', label: 'Resent'}
                                        ],
                                        selected: this.state.filterByType
                                    })
                                },
                                {
                                    element: React.createElement(Dropdown, {
                                        onChange: e => this.handleClientFilterChange(e),
                                        search: {
                                            label: 'Search for client',
                                            onChange: e => this.handleClientFilterSearch(e),
                                            searchViaApi: true
                                        },
                                        type: 'oneline',
                                        label: 'Show only for client',
                                        options: [
                                            {value: '', label: 'All'}
                                        ],
                                        selected: this.state.filterByClient
                                    })
                                }
                            ] : null}
                        >

                            {client.projects.map((project, projectIndex) => {
                                return (
                                    <div key={project.id}>
                                        {project.campaigns.map((campaign, campaignIndex) => {
                                            return (
                                                <Table
                                                    key={campaign.id}
                                                    header={[
                                                        {title: 'Ver', align: 'left'},
                                                        {title: 'Date', align: 'right'},
                                                        {title: 'Editor', align: 'left'},
                                                        {title: 'To', align: 'left'},
                                                        {title: 'Hours', align: 'left'},
                                                        {title: 'Comments', align: 'left'},
                                                        {title: 'Billed on', align: 'right'},
                                                        {title: 'Status', align: 'right'}
                                                    ]}
                                                >
                                                    {(() => {
                                                        // Init
                                                        let tableRows = [];

                                                        // Loop spots
                                                        for (let s = 0; s < campaign.spots.length; s++) {
                                                            const spot = campaign.spots[s];
                                                            tableRows.push(React.createElement(SeparatorTableRow, {key: spot.id + '-seprator'}));
                                                            tableRows.push(
                                                                React.createElement(SpotTableRow, {
                                                                    key: spot.id,
                                                                    title: 'Project: ' + project.name + ' - ' + campaign.name + ' - ' + spot.name,
                                                                    billed: spot.billed
                                                                })
                                                            );

                                                            // Loop versions
                                                            for (let v = 0; v < spot.versions.length; v++) {
                                                                const version = spot.versions[v];
                                                                tableRows.push(
                                                                    React.createElement(VersionTableRow, {
                                                                        key: spot.id + '-' + version.id,
                                                                        spot: spot,
                                                                        version: version
                                                                    })
                                                                );
                                                            }
                                                        }
                                                        return tableRows;
                                                    })()}
                                                </Table>
                                            );
                                        })}
                                    </div>
                                );
                            })}

                        </Section>
                    );
                })}

            </Layout>
        );
    }
}

function SeparatorTableRow (props) {
    return (
        <TableRow
            type="subrow"
            cells={[
                {
                    key: 0,
                    colSpan: 8
                }
            ]}
            />
    );
}

function SpotTableRow (props) {
    return (
        <TableRow
            type="border"
            cells={[
                {
                    key: 1,
                    element: React.createElement(Paragraph, null, props.title),
                    align: 'left',
                    colSpan: 6
                },
                {
                    key: 2,
                    element: React.createElement(Paragraph, null, 'Billed ' + props.billed),
                    align: 'right',
                    colSpan: 2
                }
            ]}
        />
    );
};

function VersionTableRow (props) {
    return (
        <TableRow
            cells={[
                {
                    key: 1,
                    element: React.createElement(Paragraph, null, props.version.name),
                    align: 'left'
                },
                {
                    key: 2,
                    element: React.createElement(Paragraph, null, props.version.date !== null
                        ? printDateAsYearMonthDay(props.version.date, true)
                        : ''),
                    align: 'right'
                },
                {
                    key: 3,
                    element: React.createElement(Paragraph, null, props.version.editor !== null
                        ? props.version.editor
                        : ''),
                    align: 'left'
                },
                {
                    key: 4,
                    element: React.createElement(Paragraph, null, props.version.to !== null
                        ? props.version.to
                        : ''),
                    align: 'left'
                },
                {
                    key: 5,
                    element: React.createElement(Paragraph, null, props.version.hours !== null
                        ? printHoursNumberAsHoursMinutesString(props.version.hours)
                        : ''),
                    align: 'left'
                },
                {
                    key: 6,
                    element: React.createElement(Paragraph, null, props.version.note !== null
                        ? props.version.note
                        : ''),
                    align: 'left'
                },
                {
                    key: 7,
                    element: React.createElement(Paragraph, null, props.version.dateBilled !== null
                        ? printDateAsYearMonthDay(props.version.dateBilled, true)
                        : ''),
                    align: 'right'
                },
                {
                    key: 8,
                    element: React.createElement(Paragraph, null, props.version.status),
                    align: 'right'
                }
            ]}
        />
    );
};

function mapStateToProps (state) {
    return {
        header: state.header
    };
}

export default connect(mapStateToProps)(PageBillSpot);
