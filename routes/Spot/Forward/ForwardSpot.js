import React from 'react';
import {connect} from 'react-redux';
import * as actions from './../../../actions/ActionTypes';
import s from './ForwardSpot.css';
import Layout from './../../../components/Layout/Layout';
import Section from './../../../components/Section/Section';
import Row from './../../../components/Section/Row';
import Col from './../../../components/Section/Col';
import Paragraph from './../../../components/Content/Paragraph';
import Table from './../../../components/Table/Table';
import TableRow from './../../../components/Table/TableRow';
import Pagination from './../../../components/Pagination/Pagination';
import TextArea from './../../../components/Form/TextArea';
import Input from './../../../components/Form/Input';
import Dropdown from './../../../components/Form/Dropdown';
import Checkmark from './../../../components/Form/Checkmark';
import Button from './../../../components/Button/Button';
import IconPlusWhite from './../../../components/Icons/IconPlusWhite';
import IconSendSubmit from './../../../components/Icons/IconSendSubmit';

class PageForwardSpot extends React.Component {
    constructor (props, context) {
        super(props, context);

        this.state = {
            client: {
                selected: {
                    value: 1,
                    label: 'NBC Universal',
                    truncuateLabelTo: 64
                },
                search: ''
            },
            spots: [
                {
                    id: 1,
                    project: 'Mr Robot S2',
                    campaign: ':30',
                    spot: 'Elliot Monologue',
                    webLinks: ''
                },
                {
                    id: 2,
                    project: 'Mr Robot S2',
                    campaign: ':30',
                    spot: 'Hack The Break',
                    webLinks: ''
                },
                {
                    id: 3,
                    project: 'Mr Robot S2',
                    campaign: ':30',
                    spot: 'Critics Review',
                    webLinks: ''
                },
                {
                    id: 4,
                    project: 'Queen of the South',
                    campaign: 'Broadcast Campaign',
                    spot: 'Spot',
                    webLinks: ''
                },
                {
                    id: 5,
                    project: 'Queen of the South',
                    campaign: 'Launch Trailer Campaign',
                    spot: 'Spot',
                    webLinks: ''
                }
            ],
            selectedSpots: [],
            recipients: {
                existing: [
                    {
                        id: 1,
                        name: 'Caroline Lee',
                        email: 'caroline.lee@nbc.com',
                        selected: false
                    },
                    {
                        id: 2,
                        name: 'Christina Hendrick',
                        email: 'christina.hendrick@nbc.com',
                        selected: false
                    },
                    {
                        id: 3,
                        name: 'Ludmila Meltser',
                        email: 'ludmila.meltser@nbc.com',
                        selected: false
                    }
                ],
                created: [],
                input: {
                    name: '',
                    email: ''
                },
                createButton: {
                    label: 'Create new recipient',
                    color: 'blue'
                }
            }
        };
    }

    componentWillMount () {
        // Scroll to top
        window.scrollTo(0, 0);

        // Dispatch header
        this.props.dispatch({
            type: actions.HEADER_SET_ALL,
            payload: {
                title: 'Send spot to the client',
                elements: [
                    React.createElement(Dropdown, {
                        onChange: e => this.handleClientChange(e),
                        search: {
                            onChange: e => this.handleClientSearch(e),
                            label: 'Search client...',
                            searchViaApi: true,
                            value: this.state.client.search
                        },
                        align: 'right',
                        type: 'oneline',
                        isWhite: true,
                        label: 'Select client',
                        selected: this.state.client.selected
                    }, null)
                ]
            }
        });
    }

    handleClientChange (e) {

    }

    handleClientSearch (e) {

    }

    handleRowCheckedToggle (e, rowIndex, spotId) {
        if (typeof rowIndex !== 'undefined' && typeof spotId !== 'undefined') {
            // Check if item is toggled or not
            const indexOfSpotId = this.state.selectedSpots.indexOf(spotId);
            if (indexOfSpotId !== -1) {
                // Remove
                this.setState(
                    Object.assign({}, this.state, {
                        selectedSpots: this.state.selectedSpots
                            .slice(0, indexOfSpotId)
                            .concat(this.state.selectedSpots.slice(indexOfSpotId + 1))
                    })
                );
            } else {
                // Add
                this.setState(
                    Object.assign({}, this.state, {
                        selectedSpots: this.state.selectedSpots
                            .concat([spotId])
                    })
                );
            }
        }
    }

    handleSpotWebLinkChange (e, rowIndex, spotId) {
        if (typeof e !== 'undefined' && typeof e.target !== 'undefined' && typeof rowIndex !== 'undefined' && typeof spotId !== 'undefined') {
            // Update input value
            this.setState(
                Object.assign({}, this.state, {
                    spots: this.state.spots
                        .slice(0, rowIndex)
                        .concat([Object.assign({}, this.state.spots[rowIndex], {
                            webLinks: e.target.value
                        })])
                        .concat(this.state.spots.slice(rowIndex + 1))
                })
            );
        }
    }

    handleExistingRecipientToggle (e, recipientIndex) {
        if (typeof recipientIndex !== 'undefined') {
            this.setState(
                Object.assign({}, this.state, {
                    recipients: Object.assign({}, this.state.recipients, {
                        existing: this.state.recipients.existing
                            .slice(0, recipientIndex)
                            .concat([Object.assign({}, this.state.recipients.existing[recipientIndex], {
                                selected: !this.state.recipients.existing[recipientIndex].selected
                            })])
                            .concat(this.state.recipients.existing.slice(recipientIndex + 1))
                    })
                })
            );
        }
    }

    handleNewRecipientNameChange (e) {
        if (typeof e !== 'undefined' && typeof e.target !== 'undefined') {
            const name = e.target.value;
            if (typeof name === 'string') {
                this.setState(
                    Object.assign({}, this.state, {
                        recipients: Object.assign({}, this.state.recipients, {
                            input: Object.assign({}, this.state.recipients.input, {
                                name: name
                            })
                        })
                    })
                );
            }
        }
    }

    handleNewRecipientEmailChange (e) {
        if (typeof e !== 'undefined' && typeof e.target !== 'undefined') {
            const email = e.target.value;
            if (typeof email === 'string') {
                this.setState(
                    Object.assign({}, this.state, {
                        recipients: Object.assign({}, this.state.recipients, {
                            input: Object.assign({}, this.state.recipients.input, {
                                email: email
                            })
                        })
                    })
                );
            }
        }
    }

    handleNewRecipientCreation (e) {
        // Check state
        if (this.state.recipients.input.name !== '' && this.state.recipients.input.email !== '') {
            // Get values
            const name = this.state.recipients.input.name;
            const email = this.state.recipients.input.email;

            // Validate email field
            let emailValid = true;
            if (typeof this.refs.recipientEmail !== 'undefined'
                && typeof this.refs.recipientEmail.refs.input !== 'undefined'
                && typeof this.refs.recipientEmail.refs.input.checkValidity !== 'undefined'
                && this.refs.recipientEmail.refs.input.checkValidity() === false) {
                emailValid = false;
            }

            if (emailValid === true) {
                // Create new recipient
                this.setState(
                    Object.assign({}, this.state, {
                        recipients: Object.assign({}, this.state.recipients, {
                            created: this.state.recipients.created
                                .concat([{
                                    name: this.state.recipients.input.name,
                                    email: this.state.recipients.input.email,
                                    selected: true
                                }]),
                            input: Object.assign({}, this.state.recipients.input, {
                                name: '',
                                email: ''
                            })
                        })
                    })
                );
            } else {
                // Notify user about wrong email address
                this.setState(
                    Object.assign({}, this.state, {
                        recipients: Object.assign({}, this.state.recipients, {
                            createButton: Object.assign({}, this.state.recipients.createButton, {
                                label: 'Email address is not valid - try again',
                                color: 'orange'
                            })
                        })
                    })
                );

                // Reset error after delay
                setTimeout(() => {
                    this.setState(
                        Object.assign({}, this.state, {
                            recipients: Object.assign({}, this.state.recipients, {
                                createButton: Object.assign({}, this.state.recipients.createButton, {
                                    label: 'Create new recipient',
                                    color: 'blue'
                                })
                            })
                        })
                    );
                }, 1024 * 10);
            }
        } else {
            // Notify user about error
            this.setState(
                Object.assign({}, this.state, {
                    recipients: Object.assign({}, this.state.recipients, {
                        createButton: Object.assign({}, this.state.recipients.createButton, {
                            label: 'Both name and email are required - try again',
                            color: 'orange'
                        })
                    })
                })
            );

            // Reset error after delay
            setTimeout(() => {
                this.setState(
                    Object.assign({}, this.state, {
                        recipients: Object.assign({}, this.state.recipients, {
                            createButton: Object.assign({}, this.state.recipients.createButton, {
                                label: 'Create new recipient',
                                color: 'blue'
                            })
                        })
                    })
                );
            }, 1024 * 10);
        }
    }

    handleCreatedRecipientToggle (e, recipientIndex) {
        if (typeof recipientIndex !== 'undefined') {
            this.setState(
                Object.assign({}, this.state, {
                    recipients: Object.assign({}, this.state.recipients, {
                        created: this.state.recipients.created
                            .slice(0, recipientIndex)
                            .concat([Object.assign({}, this.state.recipients.created[recipientIndex], {
                                selected: !this.state.recipients.created[recipientIndex].selected
                            })])
                            .concat(this.state.recipients.created.slice(recipientIndex + 1))
                    })
                })
            );
        }
    }

    handleSpotSubmissionToClient (e) {

    }

    render () {
        // Selected spots count
        const selectedSpotsCount = this.state.selectedSpots.length;

        // Render
        return (
            <Layout>

                <Section title="Spots" noSeparator={true}>
                    <Table
                        header={[
                            {title: 'Project', align: 'left'},
                            {title: 'Campaign', align: 'left'},
                            {title: 'Spot', align: 'left'},
                            {title: '', align: 'right'}
                        ]}
                        footerRows={[
                            React.createElement(TableRow, {
                                key: 0,
                                className: s.spotsSelectedRow,
                                cells: [
                                    {
                                        key: 0,
                                        align: 'center',
                                        element: React.createElement(Paragraph, {type: selectedSpotsCount === 0 ? 'alert' : 'success'},
                                            selectedSpotsCount === 1
                                                ? selectedSpotsCount + ' spot selected'
                                                : selectedSpotsCount + ' spots selected'
                                        ),
                                        colSpan: 4
                                    }
                                ]
                            })
                        ]}
                    >
                        {this.state.spots.map((spot, index) => {
                            // Selected
                            const spotSelected = this.state.selectedSpots.indexOf(spot.id) !== -1 ? true : false;

                            // Row
                            const tableRow = React.createElement(TableRow, {
                                key: spot.id,
                                type: spotSelected === true ? 'highlight' : undefined,
                                cells: [
                                    {
                                        key: 0,
                                        element: React.createElement(Paragraph, null, spot.project),
                                        align: 'left'
                                    },
                                    {
                                        key: 1,
                                        element: React.createElement(Paragraph, null, spot.campaign),
                                        align: 'left'
                                    },
                                    {
                                        key: 2,
                                        element: React.createElement(Paragraph, null, spot.spot),
                                        align: 'left'
                                    },
                                    {
                                        key: 3,
                                        element: React.createElement(Checkmark, {
                                            onClick: e => this.handleRowCheckedToggle(e, index, spot.id),
                                            checked: spotSelected,
                                            type: 'green'
                                        }),
                                        align: 'right'
                                    }
                                ]
                            });

                            // Render
                            if (spotSelected === true) {
                                return [
                                    tableRow,
                                    <TableRow
                                        key={spot.id + 'SubRow'}
                                        type="subrow"
                                        cells={[
                                            {
                                                key: 0
                                            },
                                            {
                                                key: 1,
                                                element: React.createElement(TextArea, {
                                                    onChange: e => this.handleSpotWebLinkChange(e, index, spot.id),
                                                    label: 'Optional web links',
                                                    value: spot.webLinks,
                                                    width: 768,
                                                    height: 43
                                                }),
                                                colSpan: 3
                                            }
                                        ]}
                                    />
                                ];
                            } else {
                                return [
                                    tableRow
                                ];
                            }
                        })}
                    </Table>
                </Section>

                <Section title="Recipients">
                    <Row removeGutter={true} className={s.recipientsContainerRow}>
                        <Col size={9}>
                            <Row className={s.recipientsRow}>
                                {this.state.recipients.existing.map((existingRecipient, index) => {
                                    return (
                                        <Col key={'er' + existingRecipient.id}>
                                            <Checkmark
                                                onClick={e => this.handleExistingRecipientToggle(e, index)}
                                                checked={existingRecipient.selected}
                                                label={{
                                                    text: existingRecipient.name,
                                                    onLeft: false
                                                }}
                                            />
                                        </Col>
                                    );
                                })}
                                {this.state.recipients.created.map((createdRecipient, index) => {
                                    return (
                                        <Col key={'cr' + index}>
                                            <Checkmark
                                                onClick={e => this.handleCreatedRecipientToggle(e, index)}
                                                checked={createdRecipient.selected}
                                                label={{
                                                    text: createdRecipient.name,
                                                    onLeft: false
                                                }}
                                            />
                                        </Col>
                                    );
                                })}
                            </Row>
                        </Col>
                        <Col size={3}>
                            <Button
                                onClick={e => this.handleSpotSubmissionToClient(e)}
                                float="right"
                                icon={{
                                    element: React.createElement(IconSendSubmit, {
                                        width: 25,
                                        height: 26,
                                        marginLeft: -13,
                                        marginTop: -13
                                    }, null),
                                    size: 'large',
                                    background: 'orange'
                                }}
                                label={{
                                    text: 'Send notification',
                                    size: 'small',
                                    color: 'orange',
                                    onLeft: true
                                }}
                            />
                        </Col>
                    </Row>
                    <Row removeGutter={true} className={s.createRecipientRow}>
                        <Col>
                            <Input
                                ref="recipientName"
                                onChange={e => this.handleNewRecipientNameChange(e)}
                                value={this.state.recipients.input.name}
                                label="New recipient's name"
                                type="text"
                            />
                        </Col>
                        <Col>
                            <Input
                                ref="recipientEmail"
                                onChange={e => this.handleNewRecipientEmailChange(e)}
                                value={this.state.recipients.input.email}
                                label="New recipient's email"
                                type="email"
                            />
                        </Col>
                        <Col>
                            <Button
                                onClick={e => this.handleNewRecipientCreation(e)}
                                float="right"
                                icon={{
                                    element: React.createElement(IconPlusWhite, {
                                        width: 12,
                                        height: 12,
                                        marginTop: -6,
                                        marginLeft: -6
                                    }),
                                    size: 'small',
                                    background: 'blue'
                                }}
                                label={{
                                    text: this.state.recipients.createButton.label,
                                    color: this.state.recipients.createButton.color,
                                    size: 'small',
                                    onLeft: true
                                }}
                            />
                        </Col>
                    </Row>
                </Section>

            </Layout>
        );
    }
}

function mapStateToProps (state) {
    return {
        header: state.header
    };
}

export default connect(mapStateToProps)(PageForwardSpot);
