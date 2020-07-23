import React from 'react';
import { merge } from 'lodash';
import { connect } from 'react-redux';
import * as actions from './../../../actions/ActionTypes';
import Layout from './../../../components/Layout/Layout';
import ProjectPicker from './../../../components/Buddha/ProjectPicker';
import Toggle from './../../../components/Form/Toggle';
import IconExpand from './../../../components/Icons/IconExpand';
import IconDownload from './../../../components/Icons/IconDownload';
import FinishRequestFull from './FinishRequestFull';
import FinishRequestPrep from './FinishRequestPrep';
import FinishRequestSelection from './FinishRequestSelection';

class PageFinishRequest extends React.Component {
    constructor(props, context) {
        super(props, context);

        this.state = {
            projectPicked: {
                project: {
                    value: '',
                    selectedId: null
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
            isFullFinish: true,
            softOrHardLock: 'soft',
            filePath: '',
            deliverablesNotes: '',
            requestType: 1
        };
    }

    componentDidMount() {
        // Set header
        this.setHeader(this.state.isFullFinish);
    }

    setHeader(toggleValue) {
        this.props.dispatch({
            type: actions.HEADER_SET_ALL,
            payload: {
                title: 'Finish request',
                elements: [
                    <Toggle
                        onChange={(e) => this.handleFullFinishToggle(e)}
                        isWhite={true}
                        align="right"
                        isRight={toggleValue}
                        left={{
                            label: 'Out of house - prep for finish',
                            value: false,
                            icon:
                                <IconExpand
                                    width={12}
                                    height={12}
                                />
                        }}
                        right={{
                            label: 'In house - full finish',
                            value: true,
                            icon:
                                <IconDownload
                                    width={12}
                                    height={12}
                                />
                        }}
                    />
                ]
            }
        });
    }

    handleFullFinishToggle(value) {
        this.setState({
            isFullFinish: value
        }, () => {
            this.setHeader(value);
        });
    }

    handleProjectChange(selected) {
        this.setState({
            projectPicked: merge(this.state.projectPicked, selected)
        });
    }

    handleSoftOrHardLockChange(value) {
        this.setState({
            softOrHardLock: value
        });
    }

    handleFilePathOrDeliverablesNotesChange(value, type) {
        if (typeof value !== 'undefined' && typeof type !== 'undefined') {
            if (type === 'filePath') {
                this.setState({
                    filePath: value
                });
            } else if (type === 'deliverablesNotes') {
                this.setState({
                    deliverablesNotes: value
                });
            }
        }
    }

    handleRequestTypeChange(value) {
        this.setState({
            requestType: value
        });
    }

    render() {
        // Project picker
        const projectPicker =
            <ProjectPicker
                onChange={(e) => this.handleProjectChange(e)}
                defaultToOpenProjects={true}
                levelRequired={5}
                noSeparator={true}
            />;

        // Request progress
        const requestProgress =
            <FinishRequestSelection
            />;

        // Render either full finish or prep for finish
        if (this.state.isFullFinish) {
            return (
                <Layout>

                    {projectPicker}

                    <FinishRequestFull
                        project={this.state.projectPicked}
                        onRequestTypeSwitch={val => this.handleFullFinishToggle(val)}
                        onSoftOrHardLockChange={val => this.handleSoftOrHardLockChange(val)}
                        onFilePathOrDeliverablesNotesChange={(val, type) => this.handleFilePathOrDeliverablesNotesChange(val, type)}
                    />

                    {requestProgress}

                </Layout>
            );
        } else {
            return (
                <Layout>

                    {projectPicker}

                    <FinishRequestPrep
                        project={this.state.projectPicked}
                        onRequestTypeSwitch={val => this.handleFullFinishToggle(val)}
                    />

                    {requestProgress}

                </Layout>
            );
        }
    }
}

function mapStateToProps(state) {
    return {
        header: state.header
    };
}

export default connect(mapStateToProps)(PageFinishRequest);
