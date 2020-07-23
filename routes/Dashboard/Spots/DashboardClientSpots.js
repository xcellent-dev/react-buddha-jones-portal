import React from 'react';
import { connect } from 'react-redux';
import * as actions from './../../../actions/ActionTypes';
import history from './../../../core/history';
import Layout from './../../../components/Layout/Layout';
import Section from './../../../components/Section/Section';
import Row from './../../../components/Section/Row';
import Col from './../../../components/Section/Col';
import Table from './../../../components/Table/Table';
import TableRow from './../../../components/Table/TableRow';
import TableCell from './../../../components/Table/TableCell';
import Button from './../../../components/Button/Button';
import Paragraph from './../../../components/Content/Paragraph';
import Date from './../../../components/Content/Date';
import IconArrowRight from './../../../components/Icons/IconArrowRight';
import IconArrowLeftYellow from './../../../components/Icons/IconArrowLeftYellow';

class PageDashboardClientSpots extends React.Component {
    constructor(props, context) {
        super(props, context);

        this.state = {
            spotDetails: [
                {
                    id: 1,
                    version: '7 Alt Rev',
                    editor: {
                        id: 1,
                        name: 'Fang'
                    },
                    notes: '',
                    sent: {
                        to: 'Internal',
                        date: '2016-08-11'
                    },
                    status: 'Requires action'
                },
                {
                    id: 2,
                    version: '7 Rev',
                    editor: {
                        id: 1,
                        name: 'Fang'
                    },
                    notes: '',
                    sent: {
                        to: 'Internal',
                        date: '2016-08-11'
                    },
                    status: 'Open'
                },
                {
                    id: 3,
                    version: '7 Alt',
                    editor: {
                        id: 2,
                        name: 'Justin'
                    },
                    notes: '',
                    sent: {
                        to: 'Ludmilla Meltser',
                        date: '2016-08-08'
                    },
                    status: 'Approved'
                },
                {
                    id: 4,
                    version: '7',
                    editor: {
                        id: 2,
                        name: 'Justin'
                    },
                    notes: '',
                    sent: {
                        to: 'Ludmilla Meltser',
                        date: '2016-08-08'
                    },
                    status: 'Approved'
                },
                {
                    id: 5,
                    version: '6 Alt Rev',
                    editor: {
                        id: 3,
                        name: 'Tony'
                    },
                    notes: 'Color Graded Front',
                    sent: {
                        to: 'Ludmilla Meltser',
                        date: '2016-08-01'
                    },
                    status: 'Billed'
                },
                {
                    id: 6,
                    version: '6 Rev',
                    editor: {
                        id: 3,
                        name: 'Tony'
                    },
                    notes: 'Color Graded Front',
                    sent: {
                        to: 'Ludmilla Meltser',
                        date: '2016-08-01'
                    },
                    status: 'Billed'
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
                title: 'Dashboard - spot details',
                elements: [
                    React.createElement(Button, {
                        onClick: this.goBack,
                        label: {
                            text: 'Go back',
                            color: 'white',
                            size: 'large',
                            onLeft: false
                        },
                        icon: {
                            element: React.createElement(IconArrowLeftYellow, {
                                width: 15,
                                marginLeft: -7,
                                height: 11,
                                marginTop: -5
                            }, null),
                            width: 15,
                            height: 11,
                            size: 'small',
                            background: 'none-alt'
                        }
                    }, null)
                ]
            }
        });
    }

    componentWillUmount() {
        // Remove header
        this.props.dispatch({
            type: actions.HEADER_RESET
        });
    }

    goBack(e) {
        e.preventDefault();
        history.push('/');
    }

    goToSpotSent(e, spotId) {
        e.preventDefault();
        if (typeof spotId !== 'undefined') {
            history.push('/spot/sent/' + spotId);
        }
    }

    render() {
        let sectionTitle = 'Spots sent for ';
        sectionTitle += typeof this.props.client !== 'undefined' ? ' – ' + this.props.client : '';
        sectionTitle += typeof this.props.project !== 'undefined' ? ' – ' + this.props.project : '';
        sectionTitle += typeof this.props.campaign !== 'undefined' ? ' – ' + this.props.campaign : '';
        sectionTitle += typeof this.props.spot !== 'undefined' ? ' – ' + this.props.spot : '';
        return (
            <Layout>
                <Row removeGutter={true}>
                    <Col>

                        <Section
                            title={sectionTitle}
                            noSeparator={true}
                        >

                            <Table
                                header={
                                    [
                                        { title: 'Version', align: 'left' },
                                        { title: 'Editor', align: 'left' },
                                        { title: 'Notes', align: 'left' },
                                        { title: 'Sent to', align: 'center' },
                                        { title: 'Sent date', align: 'right' },
                                        { title: 'Status', align: 'right' },
                                        { title: '' }
                                    ]
                                }
                            >

                                {this.state.spotDetails.map(ver => {
                                    // Status
                                    const status = ver.status;
                                    let type;
                                    switch (status) {
                                        case 'Billed':
                                            type = 'dim';
                                            break;

                                        case 'Approved':
                                            type = 'success';
                                            break;

                                        case 'Requires action':
                                            type = 'alert';
                                            break;

                                        default:
                                            type = 'default';
                                            break;
                                    }

                                    // Render
                                    return (
                                        <TableRow key={ver.id}>
                                            <TableCell>
                                                <Paragraph>{ver.version}</Paragraph>
                                            </TableCell>
                                            <TableCell>
                                                <Paragraph>{ver.editor.name}</Paragraph>
                                            </TableCell>
                                            <TableCell>
                                                <Paragraph>{ver.notes}</Paragraph>
                                            </TableCell>
                                            <TableCell align="center">
                                                <Paragraph>{ver.sent.to}</Paragraph>
                                            </TableCell>
                                            <TableCell align="right">
                                                <Date value={ver.sent.date} />
                                            </TableCell>
                                            <TableCell align="right">
                                                <Paragraph type={type}>{status}</Paragraph>
                                            </TableCell>
                                            <TableCell align="right">
                                                <Button
                                                    onClick={e => this.goToSpotSent(e, 6)}
                                                    tooltip={{
                                                        text: 'Go to spot sent details',
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
                                })}
                            </Table>

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

export default connect(mapStateToProps)(PageDashboardClientSpots);
