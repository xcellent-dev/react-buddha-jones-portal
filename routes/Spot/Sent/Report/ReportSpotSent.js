import React from 'react';
import { connect } from 'react-redux';
import * as actions from './../../../../actions/ActionTypes';
import moment from 'moment';
import s from './ReportSpotSent.css';
import { capitalizePhraseOrWord } from './../../../../helpers/text';
import Layout from './../../../../components/Layout/Layout';
import HeaderSection from './../../../../components/Layout/HeaderSection';
import GraphicsAudioVisualToggle from './../../../../components/Buddha/GraphicsAudioVisualToggle';
import DatePicker from './../../../../components/Calendar/DatePicker';
import ProjectPicker from './../../../../components/Buddha/ProjectPicker';
import DropdownPeoplePicker from './../../../../components/Buddha/DropdownPeoplePicker';
import CustomerContactPicker from './../../../../components/Buddha/CustomerContactPicker';
import WorkStagePicker from './../../../../components/Buddha/WorkStagePicker';
import LoadingShade from './../../../../components/Loaders/LoadingShade';
import Section from './../../../../components/Section/Section';
import Row from './../../../../components/Section/Row';
import Col from './../../../../components/Section/Col';
import Select from './../../../../components/Form/Select';
import Radio from './../../../../components/Form/Radio';
import RadioGroup from './../../../../components/Form/RadioGroup';
import Toggle from './../../../../components/Form/Toggle';
import TextArea from './../../../../components/Form/TextArea';
import Dropdown from './../../../../components/Form/Dropdown';
import Checkmark from './../../../../components/Form/Checkmark';
import Button from './../../../../components/Button/Button';
import Paragraph from './../../../../components/Content/Paragraph';
import GraphicsMatrix from './../../../../components/Buddha/GraphicsMatrix';
import IconSendSubmit from './../../../../components/Icons/IconSendSubmit';

class PageSpotSentReport extends React.Component {
    constructor(props, context) {
        super(props, context);

        this.state = {
            loading: true,
            workersType: 'Editor',
            date: moment(),
            project: null,
            customerId: null,
            customerName: null,
            spots: [],
            sentTo: null,
            sentVia: {
                value: 'courier',
                dropdownMessenger: {
                    value: 'post',
                    label: 'Post',
                    truncuateLabelTo: 48
                }
            },
            note: '',
            progress: {
                value: 'active',
                dropdownFinishing: {
                    value: 'other',
                    label: 'Other',
                    truncuateLabelTo: 48
                },
                dropdownFinished: {
                    value: 'delivery',
                    label: 'Delivery / Ingest',
                    truncuateLabelTo: 48
                }
            },
            sendToPost: false
        };
    }

    componentDidMount() {
        // Scroll to top
        window.scrollTo(0, 0);

        // Dispatch header
        this.props.dispatch({
            type: actions.HEADER_SET_ALL,
            payload: {
                title: 'Spot sent',
                elements: [
                    <DatePicker
                        onChange={e => this.handleDateChange(e)}
                        label="Spot sent date"
                        value={this.state.date}
                        isWhite={true}
                    />
                ]
            }
        });

        // Stop loading
        this.setState(
            Object.assign({}, this.state, {
                loading: false
            })
        );
    }

    handleDateChange(date) {
        this.setState({
            date: date
        });
    }

    handleProjectChange(e) {
        if (typeof e !== 'undefined' && typeof e.project !== 'undefined') {
            this.setState({
                project: e.project.selectedId,
                customerId: e.project.customerId,
                customerName: e.project.customerName,
                spots: [
                    {
                        id: new Date().getTime(),
                        selected: {
                            project: {
                                value: e.project.value,
                                selectedId: e.project.selectedId,
                                customerId: e.project.customerId,
                                customerName: e.project.customerName
                            },
                            campaign: {
                                value: '',
                                selectedId: null
                            },
                            spot: {
                                value: '',
                                selectedId: null
                            },
                            version: {
                                value: '',
                                selectedId: null
                            }
                        },
                        workers: [],
                        files: [],
                        resend: false
                    }
                ]
            });
        }
    }

    handleSpotChange(e, spotIndex) {
        this.setState({
            spots: this.state.spots.slice(0, spotIndex)
                .concat([Object.assign({}, this.state.spots[spotIndex], {
                    selected: Object.assign({}, this.state.spots[spotIndex].selected, e)
                })])
                .concat(this.state.spots.slice(spotIndex + 1))
        });
    }

    handleSpotRemove(e, spotIndex) {
        if (typeof spotIndex !== 'undefined') {
            this.setState({
                spots: this.state.spots.slice(0, spotIndex)
                    .concat(this.state.spots.slice(spotIndex + 1))
            });
        }
    }

    handleSpotAdd(e) {
        this.setState({
            spots: this.state.spots.concat([{
                id: new Date().getTime(),
                selected: Object.assign({}, this.state.spots[0].selected, {
                    campaign: {
                        value: '',
                        selectedId: null
                    },
                    spot: {
                        value: '',
                        selectedId: null
                    },
                    version: {
                        value: '',
                        selectedId: null
                    }
                }),
                workers: [],
                files: [],
                resend: false
            }])
        });
    }

    handleWorkerAdded(e, spotIndex) {
        if (typeof e !== 'undefined' && typeof e.value !== 'undefined' && typeof e.value.id !== 'undefined' && typeof spotIndex !== 'undefined') {
            this.setState({
                spots: this.state.spots.slice(0, spotIndex)
                    .concat(Object.assign({}, this.state.spots[spotIndex], {
                        workers: [e.value.id].concat(this.state.spots[spotIndex].workers)
                    }))
                    .concat(this.state.spots.slice(spotIndex + 1))
            });
        }
    }

    handleWorkerRemoved(e, spotIndex) {
        if (typeof e !== 'undefined' && typeof e.id !== 'undefined' && typeof spotIndex !== 'undefined') {
            const { id } = e;
            let workerIndex = null;
            this.state.spots[spotIndex].workers.some((worker, workerIndex) => {
                if (worker === id) {
                    this.setState({
                        spots: this.state.spots.slice(0, spotIndex)
                            .concat(Object.assign({}, this.state.spots[spotIndex], {
                                workers: this.state.spots[spotIndex].workers.slice(0, workerIndex)
                                    .concat(this.state.spots[spotIndex].workers.slice(workerIndex + 1))
                            }))
                            .concat(this.state.spots.slice(spotIndex + 1))
                    });
                    return true;
                } else {
                    return false;
                }
            });
        }
    }

    handleResendToggle(e, checked, spotIndex) {
        if (typeof spotIndex !== 'undefined') {
            this.setState({
                spots: this.state.spots.slice(0, spotIndex)
                    .concat([Object.assign({}, this.state.spots[spotIndex], {
                        resend: checked
                    })])
                    .concat(this.state.spots.slice(spotIndex + 1))
            });
        }
    }

    handleGraphicsChange(graphics, spotIndex) {
        if (typeof graphics !== 'undefined' && graphics !== null && typeof spotIndex !== 'undefined' && spotIndex) {
            if (typeof this.state.spots[spotIndex] !== 'undefined') {
                this.setState({
                    spots: this.state.spots.slice(0, spotIndex)
                        .concat(Object.assign({}, this.state.spots[spotIndex], {
                            files: graphics
                        }))
                        .concat(this.state.spots.slice(spotIndex + 1))
                });
            }
        }
    }

    handleSentViaChange(radioGroupState) {
        if (typeof radioGroupState !== 'undefined' && this.state.loading === false) {
            if (radioGroupState.value === 'messenger') {
                this.setState(
                    Object.assign({}, this.state, {
                        sentVia: Object.assign({}, this.state.sentVia, {
                            value: radioGroupState.value,
                            dropdownMessenger: radioGroupState.dropdown
                        })
                    })
                );
            } else {
                this.setState(
                    Object.assign({}, this.state, {
                        sentVia: Object.assign({}, this.state.sentVia, {
                            value: radioGroupState.value
                        })
                    })
                );
            }
        }
    }

    handleCustomerContactsChange(contacts) {
        if (typeof contacts !== 'undefined' && typeof contacts.ids !== 'undefined') {
            this.setState({
                sentTo: contacts.ids
            });
        }
    }

    handleNoteTextChange(e) {
        // Update state
        if (typeof e !== 'undefined') {
            this.setState(
                Object.assign({}, this.state, {
                    note: e.target.value
                })
            );
        }
    }

    handleProgresschange(radioGroupState) {
        if (typeof radioGroupState !== 'undefined') {
            // Prepare new update state object
            let progressState = {
                value: radioGroupState.value
            };

            // Check if dropdown is available
            if (typeof radioGroupState.dropdown !== 'undefined') {
                const dropdownKey = 'dropdown' + capitalizePhraseOrWord(radioGroupState.value, true);
                if (radioGroupState.dropdown !== null) {
                    progressState[dropdownKey] = {
                        value: radioGroupState.dropdown.value,
                        label: radioGroupState.dropdown.label,
                        truncuateLabelTo: 48
                    };
                } else {
                    progressState[dropdownKey] = null;
                }
            }

            // Update state
            this.setState(
                Object.assign({}, this.state, {
                    progress: Object.assign({}, this.state.progress, progressState)
                })
            );
        }
    }

    handleStatusToggle(value) {
        if (typeof value !== 'undefined') {
            this.setState({
                sendToPost: value === 'final' ? true : false
            });
        }
    }

    handleReportSubmission(e) {
        // TODO
    }

    render() {
        // Worker picker label
        let workerPickerLabel = '';
        if (this.state.workersType === 'Editor') {
            workerPickerLabel = 'Select editor';
        } else {
            if (this.state.progress.value === 'active') {
                workerPickerLabel = 'Select graphics designer';
            } else {
                workerPickerLabel = 'Select graphics finisher';
            }
        }

        // Sent to label
        let sentToLabel = 'Sent to person';
        if (this.state.workersType !== 'Editor' && this.state.progress.value !== 'active') {
            sentToLabel = 'Sent to person or finishing facility';
        }

        // Get current date
        const now = new Date();

        // Get limit to date as week from
        let limitTo = new Date();
        limitTo.setDate(limitTo.getUTCDate() + 7);

        // Set limit from date as January 01 past year
        let limitFrom = new Date();
        limitFrom.setFullYear(limitFrom.getUTCFullYear() - 1);
        limitFrom.setMonth(0);
        limitFrom.setDate(1);

        // Render
        return (
            <Layout>

                <ProjectPicker
                    onChange={e => this.handleProjectChange(e)}
                    noSeparator={true}
                    title="Pick project"
                    subTitle=""
                    showCampaign={false}
                    showSpot={false}
                    showVersion={false}
                    defaultToOpenProjects={true}
                />
                
                {this.state.project !== null && (
                    <div>
                        {this.state.spots.map((spotPicker, spotPickerIndex) => {
                            return (
                                <div key={'spot-picker-' + spotPicker.id}>
                                    <ProjectPicker
                                        onChange={e => this.handleSpotChange(e, spotPickerIndex)}
                                        noSeparator={false}
                                        projectHeaderElements={[
                                            {
                                                element: (
                                                    <Checkmark
                                                        onClick={(e, checked) => this.handleResendToggle(e, checked, spotPickerIndex)}
                                                        checked={spotPicker.resend}
                                                        size="small"
                                                        label={{
                                                            text: 'Spot resend',
                                                            onLeft: true
                                                        }}
                                                    />
                                                )
                                            },
                                            {
                                                element: (
                                                    <Button
                                                        onClick={e => this.handleSpotRemove(e, spotPickerIndex)}
                                                        label={{
                                                            text: 'Remove spot',
                                                            size: 'small',
                                                            color: 'orange'
                                                        }}
                                                    />
                                                )
                                            }
                                        ]}
                                        title={`Spot sent #${spotPickerIndex + 1}`}
                                        subTitle="pick campaign, spot and version"
                                        showProject={false}
                                        defaultToOpenCampaigns={true}
                                        defaultValue={spotPicker.selected}
                                    />
                                    <Row className={s.spotDetails}>
                                        <Col>
                                            <GraphicsMatrix onChange={e => this.handleGraphicsChange(e, spotPickerIndex)} />
                                        </Col>
                                    </Row>
                                    <Row className={s.spotDetails} removeMargins={true} doWrap={true}>
                                        <Col flex="0 1 auto">
                                            <DropdownPeoplePicker
                                                onPersonPicked={e => this.handleWorkerAdded(e, spotPickerIndex)}
                                                onPersonRemoved={e => this.handleWorkerRemoved(e, spotPickerIndex)}
                                                type="editor"
                                                label="Pick"
                                                valueLabel={this.state.workersType === 'Editor' ? 'Editors' : 'Designers'}
                                                pickedPeopleIds={spotPicker.workers}
                                            />
                                        </Col>
                                    </Row>
                                </div>
                            );
                        })}
                        <Row>
                            <Col>
                                <br />
                                <Button
                                    onClick={e => this.handleSpotAdd(e)}
                                    float="right"
                                    label={{
                                        text: 'Add spot sent',
                                        size: 'small',
                                        color: 'blue',
                                        onLeft: true
                                    }}
                                />
                            </Col>
                        </Row>
                    </div>
                )}

                <div className={s.container}>

                    <Section title="Sent via">
                        <RadioGroup
                            className={s.sentViaRadioGroup}
                            onChange={e => this.handleSentViaChange(e)}
                            options={
                                this.state.workersType === 'Editor'
                                ? [
                                    { key: 'post', value: 'post', label: 'Post' },
                                    { key: 'fiber', value: 'fiber', label: 'Fiber' },
                                    { key: 'messenger', value: 'messenger', dropdown: {
                                        label: 'Messenger',
                                        selected: this.state.sentVia.dropdownMessenger,
                                        options: [
                                            { value: 'courier', label: 'Courier' },
                                            { value: 'fedex', label: 'FedEx' },
                                            { value: 'pickup', label: 'Pick Up' }
                                        ]
                                    } },
                                    { key: 'email', value: 'email', label: 'Email' }
                                ]
                                : [
                                    { key: 'aspera', value: 'aspera', label: 'Aspera' },
                                    { key: 'ftp', value: 'ftp', label: 'FTP / Transmit' },
                                    { key: 'wiredrive', value: 'wiredrive', label: 'Wiredrive' },
                                    { key: 'physical', value: 'physical', label: 'Hard Drive / Physical' }
                                ]
                            }
                        />
                    </Section>

                    {this.state.customerId && (
                        <Section title={sentToLabel}>
                            <CustomerContactPicker
                                customerId={this.state.customerId}
                                customerName={this.state.customerName}
                                pickedPeopleIds={this.state.sentTo}
                                onChange={e => this.handleCustomerContactsChange(e)}
                            />
                        </Section>
                    )}

                    <Section title="Notes">
                        <Row removeGutter={true}>
                            <Col>
                                <TextArea
                                    onChange={e => this.handleNoteTextChange(e)}
                                    value={this.state.note}
                                    label="Enter notes..."
                                    width={1152}
                                    height={96}
                                />
                            </Col>
                        </Row>
                    </Section>

                    <Section title="Details">
                        <Row removeGutter={true}>
                            <Col size={6}>

                                <WorkStagePicker />

                                {/*<RadioGroup
                                    onChange={e => this.handleProgresschange(e)}
                                    options={
                                        this.state.workersType === 'Editor'
                                        ? [
                                            { key: 'active', value: 'active', label: 'Active Work' },
                                            { key: 'finishing', value: 'finishing', dropdown: {
                                                label: 'Finishing Prep',
                                                selected: this.state.progress.dropdownFinishing,
                                                options: [
                                                    { value: 'audio', label: 'Audio Prep' },
                                                    { value: 'picture', label: 'Picture Prep' },
                                                    { value: 'unmatted', label: 'Unmatted' },
                                                    { value: 'other', label: 'Other' },
                                                    { value: 'mxcue', label: 'MX Cue Sheet Sent' },
                                                    { value: 'voartist', label: 'VO Artist' },
                                                    { value: 'finalinhouse', label: 'Final Version In-House' }
                                                ]
                                            } },
                                            { key: 'finished', value: 'finished', dropdown: {
                                                label: 'Finished Spot',
                                                selected: this.state.progress.dropdownFinished,
                                                options: [
                                                    { value: 'creative', label: 'Creative Approval' },
                                                    { value: 'technical', label: 'Technical Approval' },
                                                    { value: 'delivery', label: 'Delivery / Ingest' },
                                                    { value: 'assets', label: 'Submasters / Assets' }
                                                ]
                                            } }
                                        ]
                                        : [
                                            { key: 'active', value: 'active', label: 'Active Work' },
                                            { key: 'finishing', value: 'finishing', label: 'Finishing Graphics' },
                                            { key: 'finished', value: 'finished', label: 'Finished Graphics' }
                                        ]
                                    }
                                />*/}

                            </Col>
                            <Col size={3}>
                                <Toggle
                                    onChange={e => this.handleStatusToggle(e)}
                                    isRight={this.state.sendToPost}
                                    align="right"
                                    left={{
                                        label: 'Draft',
                                        value: 'draft'
                                    }}
                                    right={{
                                        label: 'Send to post',
                                        value: 'final'
                                    }}
                                />
                            </Col>
                            <Col size={3} width={184}>
                                <Button
                                    className={s.submitButton}
                                    onClick={e => this.handleReportSubmission(e)}
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
                                        text: this.state.sendToPost ? 'Save and submit' : 'Save',
                                        size: 'small',
                                        color: 'orange',
                                        onLeft: true
                                    }}
                                />
                            </Col>
                        </Row>
                    </Section>

                    {this.state.project === null && (
                        <LoadingShade background="rgba(247, 247, 247, 0.8)" contentCentered={true}>
                            <Paragraph type="dim">Select project first...</Paragraph>
                        </LoadingShade>
                    )}

                </div>

            </Layout>
        );
    }
}

function mapStateToProps(state) {
    return {
        header: state.header
    };
}

export default connect(mapStateToProps)(PageSpotSentReport);
