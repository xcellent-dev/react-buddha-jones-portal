import React from 'react';
import { connect } from 'react-redux';
import { debounce, merge } from 'lodash';
import * as actions from './../../../actions/ActionTypes';
import moment from 'moment';
import s from './EditorsProjectUpdates.css';
import Layout from './../../../components/Layout/Layout';
import Section from './../../../components/Section/Section';
import Row from './../../../components/Section/Row';
import Col from './../../../components/Section/Col';
import Table from './../../../components/Table/Table';
import TableRow from './../../../components/Table/TableRow';
import TableCell from './../../../components/Table/TableCell';
import Input from './../../../components/Form/Input';
import Button from './../../../components/Button/Button';
import Paragraph from './../../../components/Content/Paragraph';
import Date from './../../../components/Content/Date';
import Person from './../../../components/Buddha/Person';
import LoadingShade from './../../../components/Loaders/LoadingShade';
import LoadingSpinner from './../../../components/Loaders/LoadingSpinner';
import IconSearchLoupe from './../../../components/Icons/IconSearchLoupe';
import IconTickGreen from './../../../components/Icons/IconTickGreen';
import IconClose from './../../../components/Icons/IconClose';

import Toggle from './../../../components/Form/Toggle';
import Select from './../../../components/Form/Select';
import DatePicker from './../../../components/Calendar/DatePicker';
import IconSendSubmit from './../../../components/Icons/IconSendSubmit';

class PageEditorsProjectUpdate extends React.Component {
    constructor(props, context) {
        super(props, context);

        this.state = {
            isLoading: false,
            searchValue: '',
            visibleProjectsIds: [1, 2],
            allProjectIds: [1, 2],
            projects: [
                {
                    id: 1,
                    projectName: 'Annabelle',
                    isWatched: true,
                    isBrokenDown: true,
                    initialIsWatched: true,
                    initialIsBrokenDown: true,
                    lastUpdate: '2017-01-27T11:11:52Z',
                    changed: false,
                    fetching: false,
                    campaigns: [
                        {
                            campaignId: 1,
                            campaignName: 'Trailer',
                            statusId: 1,
                            due: '2016-09-30',
                            notes: 'Supposed to hear back by the end of day',
                            initialStatusId: 1,
                            initialDue: '2016-09-30',
                            initialNotes: 'Supposed to hear back by the end of day',
                            changed: false
                        },
                        {
                            campaignId: 2,
                            campaignName: '(:30) TV',
                            statusId: 2,
                            due: 'End of Day',
                            notes: 'Revising when done with new spot',
                            initialStatusId: 2,
                            initialDue: 'End of Day',
                            initialNotes: 'Revising when done with new spot',
                            changed: false
                        }
                    ]
                },
                {
                    id: 2,
                    projectName: 'Sorks',
                    isWatched: false,
                    isBrokenDown: true,
                    initialIsWatched: false,
                    initialIsBrokenDown: true,
                    lastUpdate: '2017-02-27T11:11:52Z',
                    changed: false,
                    fetching: false,
                    campaigns: [
                        {
                            campaignId: 2,
                            campaignName: '(:31) TV',
                            statusId: 1,
                            due: 'End of day',
                            notes: '',
                            initialStatusId: 1,
                            initialDue: 'End of day',
                            initialNotes: '',
                            changed: false
                        }
                    ]
                }
            ],

            campaignStatus: [
                { value: '1', label: 'Revising spot' },
                { value: '2', label: 'Cutting new spot' },
                { value: '3', label: 'Breaking down' },
                { value: '4', label: 'Watching' },
                { value: '5', label: 'Screening' },
                { value: '6', label: 'On fiber' },
                { value: '7', label: 'Waiting' },
                { value: '8', label: 'Downtime' },
            ],
        };
    }


    componentDidMount() {
        // Set header
        this.props.dispatch({
            type: actions.HEADER_SET_ALL,
            payload: {
                'title': 'Editor update'
            }
        });

        // Remove loading indicator
        setTimeout(() => {
            this.setState({
                isLoading: false
            });
        }, 1024);
    }


    setCampaignStatus(e, projectIndex, campaignIndex) {
        this.setState({
            projects: this.state.projects.slice(0, projectIndex)
                .concat([
                    Object.assign({}, this.state.projects[projectIndex], {
                        campaigns: this.state.projects[projectIndex].campaigns.slice(0, campaignIndex)
                            .concat([
                                Object.assign({}, this.state.projects[projectIndex].campaigns[campaignIndex], {
                                    statusId: parseInt(e.target.value.trim(), 10)
                                })
                            ])
                            .concat(this.state.projects[projectIndex].campaigns.slice(campaignIndex + 1))
                    })
                ])
                .concat(this.state.projects.slice(projectIndex + 1))
        }, () => {
            this.detectCampaignChange(projectIndex, campaignIndex);
        });
    }

    setCampaignNotes(e, projectIndex, campaignIndex) {
        this.setState({
            projects: this.state.projects.slice(0, projectIndex)
                .concat([
                    Object.assign({}, this.state.projects[projectIndex], {
                        campaigns: this.state.projects[projectIndex].campaigns.slice(0, campaignIndex)
                            .concat([
                                Object.assign({}, this.state.projects[projectIndex].campaigns[campaignIndex], {
                                    notes: e.target.value
                                })
                            ])
                            .concat(this.state.projects[projectIndex].campaigns.slice(campaignIndex + 1))
                    })
                ])
                .concat(this.state.projects.slice(projectIndex + 1))
        }, () => {
            this.detectCampaignChange(projectIndex, campaignIndex);
        });
    }

    setCampaignDueInfo(e, projectIndex, campaignIndex) {
        var newState = _.merge({}, this.state, {});
        var due = newState['projects'][projectIndex]['campaigns'][campaignIndex]['due'];

        if (typeof e !== 'undefined' && typeof e.isValid !== 'undefined' && e.isValid()) {
            if (!e.isSame(due, 'day')) {
                newState['projects'][projectIndex]['campaigns'][campaignIndex]['due'] = e['_i'];
                this.setState((previousState) => _.merge({}, previousState, newState), () => {this.detectCampaignChange(projectIndex, campaignIndex)});
            }
        } else {
            newState['projects'][projectIndex]['campaigns'][campaignIndex]['due'] = e.target.value;
            if (e.target.value === '' && moment(newState['projects'][projectIndex]['campaigns'][campaignIndex]['initialDue']).isValid()) {
                const initialDue = newState['projects'][projectIndex]['campaigns'][campaignIndex]['initialDue'];
                newState['projects'][projectIndex]['campaigns'][campaignIndex]['due'] = initialDue;
            }
            this.setState((previousState) => _.merge({}, previousState, newState), () => {this.detectCampaignChange(projectIndex, campaignIndex)});
        }
    }

    detectCampaignChange(projectIndex, campaignIndex) {
        var newState = _.merge({}, this.state, {});
        var campaign = newState['projects'][projectIndex]['campaigns'][campaignIndex];

        var changed = null;

        if (
            campaign['statusId'] !== campaign['initialStatusId'] ||
            campaign['due'] !== campaign['initialDue'] ||
            campaign['notes'] !== campaign['initialNotes']
        ) {
            changed = true;
        } else {
            changed = false;
        }

        if (changed !== campaign['changed']) {
            newState['projects'][projectIndex]['campaigns'][campaignIndex]['changed'] = changed;
            this.setState((previousState) => _.merge({}, previousState, newState));
        }
    }

    handleActiveEditorSearchChange(e) {
        if (typeof e !== 'undefined' && typeof e.target !== 'undefined' && typeof e.target.value !== 'undefined') {
            this.setState({
                searchValue: e.target.value
            }, () => {
                this.filterEditors();
            });
        }
    }

    handleProjectToggles(toggleType, value, projectIndex) {
        this.setState({
            projects: this.state.projects.slice(0, projectIndex)
                .concat([Object.assign({}, this.state.projects[projectIndex], {
                    [toggleType]: value
                })])
                .concat(this.state.projects.slice(projectIndex + 1))
        }, () => {
            this.setState({
                projects: this.state.projects.slice(0, projectIndex)
                    .concat([Object.assign({}, this.state.projects[projectIndex], {
                        changed:
                            (this.state.projects[projectIndex].isWatched !== this.state.projects[projectIndex].initialIsWatched) ||
                            (this.state.projects[projectIndex].isBrokenDown !== this.state.projects[projectIndex].initialIsBrokenDown)
                                ? true
                                : false
                    })])
                    .concat(this.state.projects.slice(projectIndex + 1))
            });
        });
    }

    handleProjectEditSubmission(e, projectIndex) {
        var newState = _.merge({}, this.state, {});
        newState['projects'][projectIndex]['fetching'] = true;
        this.setState((previousState) => _.merge({}, previousState, newState));

        setTimeout(()=>{
            var newState = _.merge({}, this.state, {});
            newState['projects'][projectIndex]['fetching'] = false;
            this.setState((previousState) => _.merge({}, previousState, newState));
        }, 1000);
    }

    handleCampaignEditSubmission(e, projectIndex, campaignIndex) {
        console.log('Campaign submission');
    }

    filterEditors() {
        const searchValue = this.state.searchValue.trim().toLowerCase();
        var matchFilter = new RegExp(searchValue, 'i');
        if (searchValue !== '') {
            // Show only projects matching query
            const queriedProjects = this.state.projects.filter((project, projectIndex) => {
                if (matchFilter.test(project.projectName)) {
                    return true;
                } else {
                    // Iterate projects
                    if (project.campaigns && project.campaigns.length > 0) {
                        return project.campaigns.some((campaign, campaignIndex) => {
                            return matchFilter.test(campaign.campaignName);
                        });
                    } else {
                        return false;
                    }
                }
            });

            // Display editors matching query
            this.setState({
                visibleProjectsIds: queriedProjects.map((project) => {
                    return project.id;
                })
            });
        } else {
            // Show all
            this.setState({
                visibleProjectsIds: this.state.allProjectIds
            });
        }
    }

    render() {
        if (this.state.isLoading) {
            return (
                <Layout>
                    <LoadingShade background="rgba(247, 247, 247, 0.9)">
                        <LoadingSpinner />
                    </LoadingShade>
                </Layout>
            );
        } else {
            const filteredProjects = this.state.projects.filter((project, projectIndex) => {
                if (this.state.visibleProjectsIds.indexOf(project.id) !== -1) {
                    return true;
                } else {
                    return false;
                }
            });

            return (
                <Layout>

                    <Section
                        title="Project update"
                        noSeparator={true}
                        headerElements={[
                            {
                                element:
                                    <Input
                                        onChange={e => this.handleActiveEditorSearchChange(e)}
                                        width={320}
                                        value={this.state.searchValue}
                                        label="Filter by project, campaign"
                                        icon={
                                            <IconSearchLoupe
                                                width={13}
                                                height={13}
                                                marginTop={-6}
                                            />
                                        }
                                    />
                            }
                        ]}
                    >

                        {filteredProjects.map((project, projectIndex) => {
                            // Construct last update date
                            let lastUpdateDate = project.lastUpdate ? moment(project.lastUpdate) : null;
                            if (project.lastUpdate) {
                                if (lastUpdateDate.isValid()) {
                                    lastUpdateDate = lastUpdateDate.fromNow();
                                } else {
                                    lastUpdateDate = null;
                                }
                            }


                            const watchedStatus =
                                <div>
                                    <Toggle
                                        isRight = {project.isWatched}
                                        defaultRight={project.isWatched}
                                        left={{
                                            value: false,
                                            label: 'Watched: No'
                                        }}
                                        right={{
                                            value: true,
                                            label: 'Yes'
                                        }}
                                        onChange={(value)=>this.handleProjectToggles('isWatched', value, projectIndex)}
                                    />
                                </div>;

                            const brokenDownStatus =
                                <div>
                                    <Toggle
                                        defaultRight = {project.isBrokenDown}
                                        isRight = {project.isBrokenDown}
                                        left={{
                                            value: false,
                                            label: 'Broken down: No'
                                        }}
                                        right={{
                                            value: true,
                                            label: 'Yes'
                                        }}
                                        onChange={(value)=>this.handleProjectToggles('isBrokenDown', value, projectIndex)}
                                    />
                                </div>;

                            // Render editor
                            return (
                                <div key={'project-' + project.id} className={s.editor}>

                                    <Row className={s.lastUpdate} removeMargins={true}>

                                        <Col className={s.nameCol}>
                                            <Paragraph>
                                                <b>{project.projectName}</b>
                                            </Paragraph>
                                        </Col>

                                        <Col>
                                            {watchedStatus}
                                        </Col>
                                        <Col>
                                            {brokenDownStatus}
                                        </Col>

                                        <Col width={128}>
                                            {(project.changed) &&
                                                <Button
                                                    onClick={e => this.handleProjectEditSubmission(e, projectIndex)}
                                                    icon={{
                                                        element: React.createElement(IconSendSubmit, {
                                                            width: 15,
                                                            height: 16,
                                                            marginLeft: -8,
                                                            marginTop: -8
                                                        }, null),
                                                        size: 'small',
                                                        background: 'orange'
                                                    }}
                                                    float="right"
                                                    label={{
                                                        text: (project.fetching) ? 'Saving...' : 'Save changes',
                                                        size: 'small',
                                                        color: 'orange',
                                                        onLeft: true
                                                    }}
                                                />
                                            }
                                        </Col>

                                        <Col className={s.dateCol}>
                                            {(lastUpdateDate) && (
                                                <Paragraph>
                                                    <i>Last update</i>
                                                    <span>{lastUpdateDate}</span>
                                                </Paragraph>
                                            )}
                                        </Col>

                                    </Row>

                                    <Row className={s.projectsGroup} removeMargins={true}>
                                        <ProjectCampaigns
                                            campaigns={project.campaigns}
                                            projectIndex={projectIndex}
                                            campaignStatus={this.state.campaignStatus}
                                            onChangeStatus={this.setCampaignStatus.bind(this)}
                                            onChangeNotes={this.setCampaignNotes.bind(this)}
                                            onChangeDueInput={this.setCampaignDueInfo.bind(this)}
                                            handleCampaignEdit = {this.handleCampaignEditSubmission.bind(this)}
                                        />
                                    </Row>
                                </div>
                            );
                        })}
                    </Section>
                </Layout>
            );
        }
    }
}

function ProjectCampaigns(props) {
     // Table rows
    let rows = [];

    const campaignKey = 'campaign';

    const { campaigns, projectIndex, campaignStatus } = props;
    const { onChangeStatus, onChangeNotes, onChangeDueInput, handleCampaignEdit } = props;


    // Campaigns header
    if (campaigns && campaigns.length > 0) {
        rows.push(
            <TableRow key={campaignKey + '-campaigns-header'} className={s.campaignsHeader}>
                <TableCell align="left">
                    <Paragraph>Campaign</Paragraph>
                </TableCell>
                <TableCell align="left">
                    <Paragraph>Notes</Paragraph>
                </TableCell>
                <TableCell align="right">
                    <Paragraph>Due</Paragraph>
                </TableCell>
                <TableCell align="right">
                    <Paragraph>Status</Paragraph>
                </TableCell>
            </TableRow>
        );
    }

    // Iterate projects
    campaigns.map((campaign, campaignIndex) => {
        // Push row separator
        if (campaignIndex > 0) {
            rows.push(
                <TableRow key={'campaign-separator-' + campaign.campaignId} type="subrow">
                    <TableCell colSpan={4} />
                </TableRow>
            );
        }


        let campaignDue = moment(campaign.due);
        let campaignDueDate = null;
        let campaignDueText= '';
        if (campaignDue.isValid()) {
            campaignDueDate = campaignDue;
        } else {
            campaignDueText = campaign.due;
        }


        // Iterate campaigns

        const campaignKey = 'campaign-' + campaign.campaignId;
        rows.push(
            <TableRow key={campaignKey}>
                <TableCell align="left">
                    <Paragraph>{campaign.campaignName}</Paragraph>
                </TableCell>
                <TableCell align="left">
                    <Input
                        value={campaign.notes ? campaign.notes : ''}
                        onChange={e => { onChangeNotes(e, projectIndex, campaignIndex) }}
                    />
                </TableCell>
                <TableCell align="right">
                    <Input
                        value={campaignDueText}
                        className={s.dueInput}
                        onChange={e=>onChangeDueInput(e, projectIndex, campaignIndex) }
                    />
                    <DatePicker
                        label="Date"
                        value={campaignDueDate}
                        onChange={e=>onChangeDueInput(e, projectIndex, campaignIndex)}
                        className={s.dueDatePicker}
                    />
                </TableCell>
                <TableCell align="right">
                    <div className={(campaign.changed)?s.statusSelect:''}>
                        <Select
                            onChange={e => { onChangeStatus(e, projectIndex, campaignIndex) }}
                            value={campaign.statusId}
                            options={campaignStatus}
                        />
                    </div>
                    {(campaign.changed) &&
                        <Button
                            onClick={e => handleCampaignEdit(e, projectIndex, campaignIndex)}
                            icon={{
                                element: React.createElement(IconSendSubmit, {
                                    width: 15,
                                    height: 16,
                                    marginLeft: -8,
                                    marginTop: -8
                                }, null),
                                size: 'small',
                                background: 'orange'
                            }}
                            float="right"
                            label={{
                                text: 'Send',
                                size: 'small',
                                color: 'orange',
                                onLeft: true
                            }}
                        />
                    }

                </TableCell>
            </TableRow>
        );
    });


     // Render
    return (
        <Table columnsWidths={['20%', '40%', '20%', '20%']}>
            {rows}
        </Table>
    );
}

function mapStateToProps(state) {
    return {
        header: state.header
    };
}

export default connect(mapStateToProps)(PageEditorsProjectUpdate);
