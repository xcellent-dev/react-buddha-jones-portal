import React from 'react';
import { connect } from 'react-redux';
import { debounce } from 'lodash';
import * as actions from './../../../actions/ActionTypes';
import moment from 'moment';
import s from './EditorsUpdates.css';
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

class PageEditorsUpdates extends React.Component {
    constructor(props, context) {
        super(props, context);

        this.debounceedFilteringOfEditors = debounce(function(e) {
            this.debounceFilteringOfEditors();
        }, 256);

        this.state = {
            isLoading: true,
            searchValue: '',
            visibleEditorsIds: [1, 2, 3],
            allEditorsIds: [1, 2, 3],
            editors: [
                {
                    id: 1,
                    firstName: 'Bill',
                    lastName: 'Rude',
                    initials: 'BRude',
                    image: null,
                    lastUpdate: '2017-01-27T11:11:52Z',
                    projects: [
                        {
                            projectId: 1,
                            projectName: 'Annabelle',
                            isWatched: true,
                            isBrokenDown: true,
                            campaigns: [
                                {
                                    campaignId: 1,
                                    campaignName: 'Trailer',
                                    statusId: 1,
                                    statusName: 'Waiting',
                                    due: null,
                                    notes: 'Supposed to hear back by the end of day'
                                },
                                {
                                    campaignId: 2,
                                    campaignName: '(:30) TV',
                                    statusId: 2,
                                    statusName: 'Revising spot',
                                    due: 'End of Day',
                                    notes: 'Revising when done with new spot'
                                }
                            ]
                        },
                        {
                            projectId: 2,
                            projectName: 'Sorks',
                            isWatched: true,
                            isBrokenDown: true,
                            campaigns: [
                                {
                                    campaignId: 2,
                                    campaignName: '(:30) TV',
                                    statusId: 1,
                                    statusName: 'Waiting',
                                    due: null,
                                    notes: null
                                }
                            ]
                        },
                        {
                            projectId: 3,
                            projectName: 'Fertile',
                            isWatched: true,
                            isBrokenDown: false,
                            campaigns: [
                                {
                                    campaignId: 3,
                                    campaignName: 'Digital',
                                    statusId: 1,
                                    statusName: 'Waiting',
                                    due: null,
                                    notes: null
                                }
                            ]
                        },
                        {
                            projectId: 4,
                            projectName: 'Sully',
                            isWatched: true,
                            isBrokenDown: true,
                            campaigns: [
                                {
                                    campaignId: 4,
                                    campaignName: 'Teaser',
                                    statusId: 3,
                                    statusName: 'Cutting new spot',
                                    due: '2016-09-30',
                                    notes: 'Cutting alt to existing trailer'
                                },
                                {
                                    campaignId: 3,
                                    campaignName: 'Digital',
                                    statusId: 1,
                                    statusName: 'Waiting',
                                    due: null,
                                    notes: null
                                }
                            ]
                        },
                        {
                            projectId: 5,
                            projectName: 'Jack Reacher',
                            isWatched: true,
                            isBrokenDown: false,
                            campaigns: [
                                {
                                    campaignId: 5,
                                    campaignName: 'Home Entertainment',
                                    statusId: 4,
                                    statusName: 'Watching',
                                    due: null,
                                    notes: 'To help out when Creal is out'
                                },
                                {
                                    campaignId: 2,
                                    cammpaignName: '(:30) TV',
                                    statusId: 5,
                                    statusName: 'Breaking down',
                                    due: null,
                                    notes: 'Cutting TV spot by the end of day'
                                }
                            ]
                        }
                    ]
                },
                {
                    id: 2,
                    firstName: 'Dave',
                    lastName: 'Drage',
                    initials: 'DD',
                    image: null,
                    lastUpdate: '2017-01-26T14:51:43Z',
                    projects: [
                        {
                            projectId: 6,
                            projectName: 'Lights Out',
                            isWatched: true,
                            isBrokenDown: true,
                            campaigns: [
                                {
                                    campaignId: 1,
                                    campaignName: 'Trailer',
                                    statusId: 6,
                                    statusName: 'On fiber',
                                    due: '2017-01-27',
                                    notes: 'Finishing'
                                },
                                {
                                    campaignId: 6,
                                    campaignName: '(:10) Digital',
                                    statusId: 7,
                                    statusName: 'Downtime',
                                    due: null,
                                    notes: null
                                }
                            ]
                        }
                    ]
                },
                {
                    id: 3,
                    firstName: 'Jan',
                    lastName: 'Sachs',
                    initials: 'JS',
                    image: null,
                    lastUpdate: '2017-01-26T12:31:12Z',
                    projects: [
                        {
                            projectId: 2,
                            projectName: 'Sorks',
                            isWatched: true,
                            isBrokenDown: true,
                            campaigns: [
                                {
                                    campaignId: 2,
                                    campaignName: '(:30) TV',
                                    statusId: 1,
                                    statusName: 'Waiting',
                                    due: null,
                                    notes: null
                                }
                            ]
                        },
                        {
                            projectId: 7,
                            projectName: 'Conjuring 2, The',
                            isWatched: false,
                            isBrokenDown: false,
                            campaigns: [
                                {
                                    campaignId: 4,
                                    campaignName: 'Teaser',
                                    statusId: 8,
                                    statusName: 'Screening',
                                    due: null,
                                    notes: null
                                }
                            ]
                        }
                    ]
                }
            ]
        };
    }

    componentDidMount() {
        // Set header
        this.props.dispatch({
            type: actions.HEADER_SET_ALL,
            payload: {
                'title': 'Editors updates'
            }
        });

        // Remove loading indicator
        setTimeout(() => {
            this.setState({
                isLoading: false
            });
        }, 1024);
    }

    componentWillUmount() {
        // Remove header content
        this.props.dispatch({
            type: actions.HEADER_RESET
        });
    }

    handleRefreshAndReset() {
        this.setState({
            isLoading: true,
            visibleEditorsIds: this.state.allEditorsIds
        }, () => {
            setTimeout(() => {
                this.setState({
                    isLoading: false
                });
            }, 1024);
        });
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

    debounceFilteringOfEditors() {
        this.filterEditors();
    }

    filterEditors() {
        const searchValue = this.state.searchValue.trim().toLowerCase();
        if (searchValue !== '') {
            // Show only editors matching query
            const queriedEditors = this.state.editors.filter((editor, editorIndex) => {
                // Get and check initials match
                if (editor.initials && editor.initials.toLowerCase().indexOf(searchValue) !== -1) {
                    return true;
                } else {
                    // Get and check last name match
                    if (editor.lastName && editor.lastName.toLowerCase().indexOf(searchValue) !== -1) {
                        return true;
                    } else {
                        // Get and check first name match
                        if (editor.firstName && editor.firstName.toLowerCase().indexOf(searchValue) !== -1) {
                            return true;
                        } else {
                            // Iterate projects
                            if (editor.projects && editor.projects.length > 0) {
                                return editor.projects.some((project, projectIndex) => {
                                    if (project.projectName && project.projectName.toLowerCase().indexOf(searchValue) !== -1) {
                                        return true;
                                    } else {
                                        return false;
                                    }
                                });
                            } else {
                                return false;
                            }
                        }
                    }
                }
            });

            // Display editors matching query
            this.setState({
                visibleEditorsIds: queriedEditors.map((editor) => {
                    return editor.id;
                })
            });
        } else {
            // Show all
            this.setState({
                visibleEditorsIds: this.state.allEditorsIds
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
            // Filter editors
            const filteredEditors = this.state.editors.filter((editor, editorIndex) => {
                if (this.state.visibleEditorsIds.indexOf(editor.id) !== -1) {
                    return true;
                } else {
                    return false;
                }
            });

            return (
                <Layout>

                    <Section
                        title="Editors' activity"
                        noSeparator={true}
                        headerElements={[
                            {
                                element:
                                    <Input
                                        onChange={e => this.handleActiveEditorSearchChange(e)}
                                        width={320}
                                        value={this.state.searchValue}
                                        label="Filter by editor's name, initials or active project..."
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

                        {filteredEditors.map((editor) => {
                            // Construct editor's full name
                            let editorFullName = [editor.firstName, editor.lastName].join(' ');
                            editorFullName += editorFullName !== '' && editor.initials ? ' / ' + editor.initials : '';
                            editorFullName = editorFullName.trim();

                            // Construct last update date
                            let lastUpdateDate = editor.lastUpdate ? moment(editor.lastUpdate) : null;
                            if (editor.lastUpdate) {
                                if (lastUpdateDate.isValid()) {
                                    lastUpdateDate = lastUpdateDate.fromNow();
                                } else {
                                    lastUpdateDate = null;
                                }
                            }

                            // Render editor
                            return (
                                <div key={'editor-' + editor.id} className={s.editor}>

                                    <Row className={s.lastUpdate} removeMargins={true}>
                                        <Col className={s.nameCol}>
                                            <Person
                                                align="left"
                                                nameOnLeft={false}
                                                name={editorFullName}
                                                image={editor.image}
                                            />
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
                                        <EditorProjects projects={editor.projects} />
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

function EditorProjects(props) {
    // Table rows
    let rows = [];

    // Iterate projects
    props.projects.map((project, projectIndex) => {
        // Push row separator
        if (projectIndex > 0) {
            rows.push(
                <TableRow key={'project-separator-' + project.projectId} type="subrow">
                    <TableCell colSpan={4} />
                </TableRow>
            );
        }

        // Push main project row
        const projectKey = 'project-' + project.projectId;
        const watchedStatus = project.isWatched
            ? <Paragraph><span>Watched</span><IconTickGreen /></Paragraph>
            : <Paragraph><span>Watched</span><IconClose /></Paragraph>;
        const brokenDownStatus = project.isBrokenDown
            ? <Paragraph><span>Broken Down</span><IconTickGreen /></Paragraph>
            : <Paragraph><span>Broken Down</span><IconClose /></Paragraph>;
        rows.push(
            <TableRow key={projectKey} className={s.projectHeader}>
                <TableCell colSpan={2} align="left">
                    <h3>{project.projectName}</h3>
                </TableCell>
                <TableCell colSpan={2} align="right">
                    {watchedStatus}
                    {brokenDownStatus}
                </TableCell>
            </TableRow>
        );

        // Campaigns header
        if (project.campaigns && project.campaigns.length > 0) {
            rows.push(
                <TableRow key={projectKey + '-campaigns-header'} className={s.campaignsHeader}>
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

        // Iterate campaigns
        project.campaigns.map((campaign, campaignIndex) => {
            const campaignKey = projectKey + '-campaign-' + campaign.campaignId;
            rows.push(
                <TableRow key={campaignKey}>
                    <TableCell align="left">
                        <Paragraph>{campaign.campaignName}</Paragraph>
                    </TableCell>
                    <TableCell align="left">
                        <Paragraph>{campaign.notes ? campaign.notes : ''}</Paragraph>
                    </TableCell>
                    <TableCell align="right">
                        <Date value={campaign.due} />
                    </TableCell>
                    <TableCell align="right">
                        <Paragraph>{campaign.statusName}</Paragraph>
                    </TableCell>
                </TableRow>
            );
        });
    });

    // Render
    return (
        <Table columnsWidths={['30%', '40%', '15%', '15%']}>
            {rows}
        </Table>
    );
}

function mapStateToProps(state) {
    return {
        header: state.header
    };
}

export default connect(mapStateToProps)(PageEditorsUpdates);
