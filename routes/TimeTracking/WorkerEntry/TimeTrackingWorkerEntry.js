import React from 'react';
import { connect } from 'react-redux';
import { merge, toString, toNumber } from 'lodash';
import zenscroll from 'zenscroll';
import moment from 'moment';
import * as API from './../../../actions/api';
import * as actions from './../../../actions/ActionTypes';
import { actionAlertNotify } from './../../../actions/Notifications';
import s from './TimeTrackingWorkerEntry.css';
import Layout from './../../../components/Layout/Layout';
import TimeTrackingCalendar from './TimeTrackingCalendar';
import Section from './../../../components/Section/Section';
import Row from './../../../components/Section/Row';
import Col from './../../../components/Section/Col';
import ProjectPicker from './../../../components/Buddha/ProjectPicker';
import Input from './../../../components/Form/Input';
import TextArea from './../../../components/Form/TextArea';
import Select from './../../../components/Form/Select';
import Checkmark from './../../../components/Form/Checkmark';
import Button from './../../../components/Button/Button';
import LoadingShade from './../../../components/Loaders/LoadingShade';
import LoadingBar from './../../../components/Loaders/LoadingBar';
import LoadingSpinner from './../../../components/Loaders/LoadingSpinner';
import IconSendSubmit from './../../../components/Icons/IconSendSubmit';

class PageTimeTrackingWorkerEntry extends React.Component {
    constructor(props, context) {
        super(props, context);

        this.state = {
            defaultTime: undefined,
            time: {
                startDate: null,
                start: null,
                end: null,
                duration: null
            },
            defaultProject: undefined,
            project: {
                projectId: null,
                campaignId: null,
                spotId: null,
                versionId: null
            },
            level: 1,
            activityId: null,
            activitiesLoading: false,
            activities: {
                level1: [],
                level2: [],
                level3: [],
                level4: [],
                level5: []
            },
            notes: '',
            editingEntryId: null,
            isActivityOverlappingWithOtherEntry: false,
            isLoading: false,
            isSaving: false,
            forceFetchDays: 0,
            forceProjectPickerReset: 0
        };
    }

    componentDidMount() {
        // Fetch initial activities
        this.fetchActivities();
    }

    componentWillMount() {
        // Scroll to top
        window.scrollTo(0, 0);

        // Dispatch header
        this.props.dispatch({
            type: actions.HEADER_SET_ALL,
            payload: {
                title: 'Staff time entry',
                elements: []
            }
        });
    }

    fetchActivities() {
        // Props
        const { level, activityId } = this.state;

        // Inform user activities are loading
        this.setState({
            activitiesLoading: true
        }, () => {
            // Get activities
            API.get(API.ACTIVITY, { level: level, user_type_id: this.props.user.type_id })
                .then(response => {
                    // Update activities level
                    this.setState({
                        activities: Object.assign({}, this.state.activities, {
                            ['level' + level]: typeof response.map !== 'undefined'
                                ? response.map(activity => {
                                    return { value: activity.id, label: activity.name };
                                })
                                : []
                        })
                    }, () => {
                        // Check if current activity id exists in new activities list
                        if (activityId !== null) {
                            const isActivityInNewActivities = this.state.activities['level' + level].some(activity => {
                                if (activity.value === activityId) {
                                    return true;
                                } else {
                                    return false;
                                }
                            });
                            if (isActivityInNewActivities === false) {
                                this.setState({
                                    activityId: null
                                });
                            }
                        }
                    });

                    // Stop loading activities
                    this.setState({
                        isLoading: false,
                        activitiesLoading: false
                    });
                })
                .catch(error => {
                    // Retry
                    setTimeout(() => {
                        this.fetchActivities();
                    }, 1024);
                });
        });
    }

    handleEnteredDateAndTimeChange(dateAndTime) {
        if (typeof dateAndTime !== 'undefined') {
            this.setState({
                isLoading: false,
                time: Object.assign({}, this.state.time, dateAndTime)
            });
        }
    }

    handleEntryOverlappingStatusChange(yes) {
        this.setState({
            isActivityOverlappingWithOtherEntry: typeof yes !== 'undefined' && yes ? true : false
        });
    }

    handleNewEntryCreation(dayIndex) {
        if (typeof dayIndex !== 'undefined') {
            this.setState({
                defaultProject: undefined,
                project: Object.assign({}, this.state.project, {
                    projectId: null,
                    campaignId: null,
                    spotId: null,
                    versionId: null
                }),
                level: 1,
                activityId: null,
                notes: '',
                editingEntryId: null,
                forceProjectPickerReset: this.state.forceProjectPickerReset + 1
            });
        }
    }

    handleExistingEntryEdit(entryId, dayIndex) {
        if ((typeof entryId !== 'undefined' && typeof dayIndex !== 'undefined') && entryId !== null) {
            // Inform user that entry is loading
            this.setState({
                isLoading: true,
                editingEntryId: entryId
            }, () => {
                API.get(API.TIME_ENTRY + '/' + entryId)
                    .then(response => {
                        // Calculate time
                        const responseDuration = response.duration;
                        const splitDuration = responseDuration.split('.');
                        let duration = toNumber(splitDuration[0]) * 60;
                        duration += splitDuration.length > 1 ? toNumber(splitDuration[1]) : 0;

                        const startDateTime = new Date(response.startDate);
                        const start = startDateTime.getHours() * 60 + startDateTime.getMinutes();

                        // Determine activities level
                        let level;
                        if (response.versionId) {
                            level = 5;
                        } else if (response.spotId) {
                            level = 4;
                        } else if (response.campaignId) {
                            level = 3;
                        } else if (response.projectId) {
                            level = 2;
                        } else {
                            level = 1;
                        }

                        // Update state
                        this.setState({
                            defaultTime: {
                                startDate: moment(response.startDate),
                                start: start,
                                end: start + duration,
                                duration: duration
                            },
                            time: Object.assign({}, this.state.time, {
                                startDate: moment(response.startDate),
                                start: start,
                                end: start + duration,
                                duration: duration
                            }),
                            defaultProject: {
                                project: {
                                    value: response.projectName || '',
                                    selectedId: response.projectId
                                },
                                campaign: {
                                    value: response.campaignName || '',
                                    selectedId: response.campaignId
                                },
                                spot: {
                                    value: response.spotName || '',
                                    selectedId: response.spotId
                                },
                                version: {
                                    value: response.versionName || '',
                                    selectedId: response.versionId
                                },
                            },
                            project: Object.assign({}, this.state.project, {
                                projectId: response.projectId,
                                campaignId: response.campaignId,
                                spotId: response.spotId,
                                versionId: response.versionId
                            }),
                            level: level,
                            activityId: response.activityTypeId,
                            activitiesLoading: false,
                            notes: response.notes,
                            isSaving: false
                        }, () => {
                            this.fetchActivities();
                        });
                    })
                    .catch(error => {
                        this.setState({
                            isLoading: false,
                            editingEntry: false
                        }, () => {
                            this.props.dispatch(
                                actionAlertNotify(
                                    'Something went wrong',
                                    'Try editing entry again',
                                    'error',
                                    false,
                                    true,
                                    false,
                                    5
                                )
                            );
                        });
                    });
            });
        } else {
            this.setState({
                level: 1,
                activityId: null,
                notes: '',
                editingEntryId: null,
                isActivityOverlappingWithOtherEntry: false,
                forceProjectPickerReset: this.state.forceProjectPickerReset + 1
            });
        }
    }

    handleProjectCampaignSpotChange(selected) {
        if (typeof selected !== 'undefined' && typeof selected.project !== 'undefined') {
            // Determine selection level
            let level;
            if (selected.version.selectedId) {
                level = 5;
            } else if (selected.spot.selectedId) {
                level = 4;
            } else if (selected.campaign.selectedId) {
                level = 3;
            } else if (selected.project.selectedId) {
                level = 2;
            } else {
                level = 1;
            }

            // Check if level has changed
            const levelChanged = this.state.level !== level;

            // Update state
            this.setState({
                level: level,
                project: Object.assign({}, this.state.project, {
                    projectId: selected.project.selectedId,
                    campaignId: selected.campaign.selectedId,
                    spotId: selected.spot.selectedId,
                    versionId: selected.version.selectedId
                })
            }, () => {
                if (levelChanged) {
                    this.fetchActivities();
                }
            });
        }
    }

    handleActivityTypeChange(e) {
        if (typeof e !== 'undefined' && typeof e.target !== 'undefined' && typeof e.target.value !== 'undefined') {
            this.setState({
                activityId: e.target.value
            });
        }
    }

    handleDetailedNotesChange(e) {
        if (typeof e !== 'undefined' && typeof e.target !== 'undefined' && typeof e.target.value !== 'undefined') {
            this.setState({
                notes: e.target.value
            });
        }
    }

    handleSubmit(e) {
        // Inform user time entry is being saved
        this.setState({
            isSaving: true
        }, () => {
            // Check if activity has been selected by the user
            if (this.state.activityId) {
                // Check if entry's time is not overlapping with different entry's time
                if (this.state.isActivityOverlappingWithOtherEntry === false) {
                    // Copy start date and set its hours and minutes
                    let startDateAndTime = moment(this.state.time.startDate);
                    const startHours = this.state.time.start / 60;
                    const startHour = Math.floor(startHours);
                    startDateAndTime.hour(startHour);
                    startDateAndTime.minute((startHours - startHour) * 60);

                    // Calculate duration
                    const durationInHours = this.state.time.duration / 60;
                    const baseDurationHour = Math.floor(durationInHours);

                    // Determine HTTP method and URL
                    const httpMethod = this.state.editingEntryId ? 'put' : 'post';
                    const timeEntryApiUrl = API.TIME_ENTRY + (httpMethod === 'post' ? '' : '/' + this.state.editingEntryId.toString());

                    API[httpMethod](timeEntryApiUrl, API.makePostData(
                        {
                            start_date_time: startDateAndTime.format('YYYY-MM-DD HH:mm:ss'),
                            duration: toString(baseDurationHour) + '.' + toString((durationInHours - baseDurationHour) * 60),
                            project_id: this.state.project.projectId ? toNumber(this.state.project.projectId) : undefined,
                            campaign_id: this.state.project.campaignId ? toNumber(this.state.project.campaignId) : undefined,
                            spot_id: this.state.project.spotId ? toNumber(this.state.project.spotId) : undefined,
                            version_id: this.state.project.versionId ? toNumber(this.state.project.versionId) : undefined,
                            activity_type_id: toNumber(this.state.activityId),
                            activity_description: '',
                            notes: this.state.notes
                        }
                    )).then(response => {
                        this.setState({
                            isSaving: false,
                            project: Object.assign({}, this.state.project, {
                                projectId: null,
                                campaignId: null,
                                spotId: null,
                                versionId: null
                            }),
                            level: 1,
                            activityId: null,
                            editingEntryId: null
                        }, () => {
                            // Success message
                            this.props.dispatch(
                                actionAlertNotify(
                                    'Time entry saved',
                                    'To submit entry for review add all remaining entries for the day and then close and submit the day',
                                    'success',
                                    false,
                                    true,
                                    false,
                                    10
                                )
                            );

                            // Fetch calendar entries
                            this.setState({
                                forceFetchDays: this.state.forceFetchDays + 1
                            }, () => {
                                // Fetch activities
                                this.fetchActivities();

                                // Reset project picker
                                if (typeof this.refs.projectPicker !== 'undefined') {
                                    if (typeof this.refs.projectPicker.resetProjectPicker !== 'undefined') {
                                        this.refs.projectPicker.resetProjectPicker();
                                    }
                                }
                            });
                        });
                    }).catch(error => {
                        this.setState({
                            isSaving: false
                        }, () => {
                            this.props.dispatch(
                                actionAlertNotify(
                                    'Please try again',
                                    'We\'ve encountered a problem - please try again',
                                    'error',
                                    false,
                                    true,
                                    false,
                                    15
                                )
                            );
                        });
                    });
                } else {
                    // Throw an error when entry's time is overlapping with different one
                    this.props.dispatch(
                        actionAlertNotify(
                            'Activity\'s time overlaps with other activity',
                            'Two activities cannot happen at the same time',
                            'error',
                            false,
                            true,
                            false,
                            5
                        )
                    );

                    // Scroll to element
                    if (typeof this.refs.activitySection !== 'undefined') {
                        if (typeof this.refs.activitySection.refs.container !== 'undefined') {
                            zenscroll.toY(0);
                        }
                    }

                    // Remove saving indicator
                    this.setState({
                        isSaving: false
                    });
                }
            } else {
                // Throw an error when activity is not selected
                this.props.dispatch(
                    actionAlertNotify(
                        'Activity type not selected',
                        'You are required to report type of activity performed',
                        'error',
                        false,
                        true,
                        false,
                        5
                    )
                );

                // Scroll to element
                if (typeof this.refs.activitySection !== 'undefined') {
                    if (typeof this.refs.activitySection.refs.container !== 'undefined') {
                        zenscroll.intoView(this.refs.activitySection.refs.container);
                    }
                }

                // Remove saving indicator
                this.setState({
                    isSaving: false
                });
            }
        });
    }

    render() {
        return (
            <Layout>

                <TimeTrackingCalendar
                    ref="timeTrackingCalendar"
                    defaultValue={this.state.defaultTime}
                    onChange={e => this.handleEnteredDateAndTimeChange(e)}
                    onEntryEdit={(id, day) => this.handleExistingEntryEdit(id, day)}
                    onEntryCreate={(dayIndex) => this.handleNewEntryCreation(dayIndex)}
                    onOverlappingChange={(yesOrNo) => this.handleEntryOverlappingStatusChange(yesOrNo)}
                    editingEntryId={this.state.editingEntryId}
                    forceFetchDays={this.state.forceFetchDays}
                    increments={15}
                    isAmerican={true}
                    limitToSingleDay={true}
                />

                {(() => {
                    if (this.state.isLoading) {
                        return (
                            <LoadingShade background="#F7F7F7">
                                <LoadingSpinner />
                            </LoadingShade>
                        );
                    } else {
                        return (
                            <div>
                                <ProjectPicker
                                    ref="projectPicker"
                                    noSeparator={true}
                                    onChange={e => this.handleProjectCampaignSpotChange(e)}
                                    defaultToOpenProjects={false}
                                    defaultValue={this.state.defaultProject}
                                    showVersion={true}
                                    forceClear={this.state.forceProjectPickerReset}
                                />

                                <Section ref="activitySection" title="Activity">
                                    <Row removeGutter={true}>
                                        <Col className={s.activities} size={12}>
                                            <Select
                                                onChange={e => this.handleActivityTypeChange(e)}
                                                label="Select activity type"
                                                value={this.state.activityId}
                                                options={this.state.activities['level' + this.state.level]}
                                            />
                                            {(() => {
                                                if (this.state.activitiesLoading) {
                                                    return (
                                                        <LoadingShade background="rgba(247, 247, 247, 1)" contentCentered={false}>
                                                            <LoadingBar label="Loading activities..." />
                                                        </LoadingShade>
                                                    );
                                                }
                                            })()}
                                        </Col>
                                    </Row>
                                </Section>

                                <Section title="Details">
                                    <Row removeGutter={true} alignItems="center">
                                        <Col size={9}>
                                            <TextArea
                                                onChange={e => this.handleDetailedNotesChange(e)}
                                                label="Enter optional notes..."
                                                value={this.state.notes}
                                                height={96}
                                                width={768}
                                            />
                                        </Col>
                                        <Col size={3}>
                                            {(() => {
                                                // Check if entry is being saved
                                                let buttonOnClick, buttonLabelColor, buttonLabelText;
                                                if (this.state.isSaving) {
                                                    buttonOnClick = null;
                                                    buttonLabelColor = 'black';
                                                    buttonLabelText = 'Saving time entry';
                                                } else {
                                                    buttonOnClick = e => this.handleSubmit(e);
                                                    buttonLabelColor = 'orange';
                                                    buttonLabelText = 'Save time entry' + (this.state.editingEntryId ? ' changes' : '');
                                                }

                                                // Render submit button
                                                return (
                                                    <Button
                                                        onClick={buttonOnClick}
                                                        float="right"
                                                        icon={{
                                                            background: 'orange',
                                                            size: 'large',
                                                            element:
                                                                <IconSendSubmit
                                                                    width={25}
                                                                    height={26}
                                                                    marginLeft={-13}
                                                                    marginTop={-13}
                                                                />
                                                        }}
                                                        label={{
                                                            text: buttonLabelText,
                                                            size: 'small',
                                                            color: buttonLabelColor,
                                                            onLeft: true
                                                        }}
                                                    />
                                                );
                                            })()}
                                        </Col>
                                    </Row>
                                </Section>
                            </div>
                        );
                    }
                })()}


            </Layout>
        );
    }
}

function mapStateToProps(state) {
    return {
        user: state.user,
        header: state.header,
        notifications: state.notifications
    };
}

export default connect(mapStateToProps)(PageTimeTrackingWorkerEntry);
