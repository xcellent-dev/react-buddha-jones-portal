import React from 'react';
import { connect } from 'react-redux';
import zenscroll from 'zenscroll';
import { debounce, toNumber } from 'lodash';
import * as API from './../../actions/api';
import * as actions from './../../actions/ActionTypes';
import { actionAlertNotify } from './../../actions/Notifications';
import history from './../../core/history';
import s from './GraphicsRequest.css';
import Layout from './../../components/Layout/Layout';
import Section from './../../components/Section/Section';
import Row from './../../components/Section/Row';
import Col from './../../components/Section/Col';
import Table from './../../components/Table/Table';
import TableRow from './../../components/Table/TableRow';
import TableCell from './../../components/Table/TableCell';
import Pagination from './../../components/Pagination/Pagination';
import Paragraph from './../../components/Content/Paragraph';
import Money from './../../components/Content/Money';
import Number from './../../components/Content/Number';
import Date from './../../components/Content/Date';
import Button from './../../components/Button/Button';
import Input from './../../components/Form/Input';
import DropdownContainer from './../../components/Form/DropdownContainer';
import OptionsList from './../../components/Form/OptionsList';
import ClientsFilter from './../../components/Buddha/ClientsFilter';
import IconArrowRight from './../../components/Icons/IconArrowRight';
import IconSearchLoupe from './../../components/Icons/IconSearchLoupe';
import IconPlusWhite from './../../components/Icons/IconPlusWhite';
import LoadingShade from './../../components/Loaders/LoadingShade';
import LoadingSpinner from './../../components/Loaders/LoadingSpinner';
import IconArrowLeftYellow from './../../components/Icons/IconArrowLeftYellow';
import Select from './../../components/Form/Select';
import ProjectPicker from './../../components/Buddha/ProjectPicker';
import IconSendSubmit from './../../components/Icons/IconSendSubmit';
import Toggle from './../../components/Form/Toggle';
import DatePicker from './../../components/Calendar/DatePicker';
import TextArea from './../../components/Form/TextArea';
import IconClose from './../../components/Icons/IconClose';

import moment from 'moment';


class PageGraphicsRequest extends React.Component {
    constructor(props, context) {
        super(props, context);

        let formatOptions = [
            {
                value: 'null',
                label: 'None'
            },
            {
                value: '16 Bit Tiffs',
                label: '16 Bit Tiffs'
            },
            {
                value: 'Lossless Quicktimes',
                label: 'Lossless Quicktimes'
            },
            {
                value: 'ProRess 4444',
                label: 'ProRess 4444'
            }
        ];
        function getFormatOptions() {
            return formatOptions.map((item, index)=>{
                return {
                    value: item.value,
                    label: item.label
                }
            })
        }

        let checkFinalOptions = [
            {
                value: 'null',
                label: ''
            },
            {
                value: 'ASAP',
                label: 'ASAP'
            },
            {
                value: 'EOD',
                label: 'EOD'
            },
            {
                value: 'Morning tomorrow',
                label: 'Morning tomorrow'
            },
            {
                value: 'Lunch tomorrow',
                label: 'Lunch tomorrow'
            },
            {
                value: 'EOD tomorrow',
                label: 'EOD tomorrow'
            }
        ];

        function getCheckFinalOptions() {
            return checkFinalOptions.map((item, index)=>{
                return {
                    value: item.value,
                    label: item.label
                }
            })
        }        

        this.state = {
            requestId: null,
            requestStatus: undefined,
            requestTypeOptions: [
                {
                    value: '1',
                    label: 'Design work'
                },
                {
                    value: '2',
                    label: 'Finishing'
                }
            ],
            requestTypeSelected: '1',
            selectedProject: {
                projectId: null,
                campaignId: null,
                spotId: null,
                versionId: null
            },
            defaultProject: undefined,
            associatedPeople: [
                {
                    role: 'Producer',
                    name: 'Producer1'
                },
                {
                    role: 'Art Director',
                    name: 'Art Director1'
                },
                {
                    role: 'Editor',
                    name: 'Editor1'
                }
            ],
            isFinal: false,
            isRequestUploading: false,
            isFetchRequestLoading: false,
            designWork: {
                framerateOptions: [
                    {
                        value: '59.97',
                        label: '59.97'
                    },
                    {
                        value: '30',
                        label: '30'
                    },
                    {
                        value: '29.97',
                        label: '29.97'
                    },
                    {
                        value: '24',
                        label: '24'
                    },
                    {
                        value: '23.976',
                        label: '23.976'
                    }
                ],
                framerateSelected: '30',
                
                priorityOptions: [
                    {
                        value: 'null',
                        label: ''
                    },
                    {
                        value: 'ASAP',
                        label: 'ASAP'
                    },
                    {
                        value: 'EOD',
                        label: 'EOD'
                    },
                    {
                        value: 'Morning tomorrow',
                        label: 'Morning tomorrow'
                    },
                    {
                        value: 'Lunch tomorrow',
                        label: 'Lunch tomorrow'
                    },
                    {
                        value: 'EOD tomorrow',
                        label: 'EOD tomorrow'
                    }
                ],
                prioritySelected: 'null',
                priorityDate: 'null',

                burnInOptions: [
                    {
                        value: 'Standard',
                        label: 'Standard'
                    },
                    {
                        value: 'Broadcast/Games',
                        label: 'Broadcast/Games'
                    }
                ],
                burnInSelected: 'Standard'
            },
            finishing: {
                finisherOptions: [],
                finisherSelected: null,

                formatCompedOptions: getFormatOptions(),
                formatCompedSelected: null,

                formatTextlessOptions: getFormatOptions(),
                formatTextlessSelected: null,

                formatKeyableOptions: getFormatOptions(),
                formatKeyableSelected: null,

                checkersDueDate: 'null',
                checkersDueOptions: getCheckFinalOptions(),
                checkersDueSelected: 'null',

                finalRendersDueDate: 'null',
                finalRendersDueOptions: getCheckFinalOptions(),
                finalRendersDueSelected: 'null',

                finishingAtOptions: [
                    {
                        value: 'In House',
                        label: 'In House'
                    },
                    {
                        value: 'Technicolor',
                        label: 'Technicolor'
                    },
                    {
                        value: 'New Wave',
                        label: 'New Wave'
                    },
                    {
                        value: 'NBCUniversal',
                        label: 'NBCUniversal'
                    },
                    {
                        value: 'WB',
                        label: 'WB'
                    },
                    {
                        value: 'MSP',
                        label: 'MSP'
                    },
                    {
                        value: 'Disney',
                        label: 'Disney'
                    },
                    {
                        value: 'Efilm',
                        label: 'Efilm'
                    },
                    {
                        value: 'Paramount',
                        label: 'Paramount'
                    },
                    {
                        value: 'KMP',
                        label: 'KMP'
                    },
                    {
                        value: 'Focus',
                        label: 'Focus'
                    },
                    {
                        value: 'etc.',
                        label: 'etc.'
                    }
                ],
                finishingAtSelected: 'In House',
                finishingContact: '',

                projectCollectStatus: '0',
                projectCollectNote: '',

                stereoFinishStatus: '0',
                stereoFinishNote: ''
            },
            common: {
                resolutionOptions: [],
                resolutionSelected: null,
                resolutionNotes: '',
                referenceFileNames: [],
                notes: ''
            }
        };

        this.handleSelectProject = this.handleSelectProject.bind(this);
    }

    componentDidMount() {
        

        if( this.state.requestTypeSelected === '1') { // designWork
            this.setState({
                common: Object.assign({}, this.state.common, {
                    resolutionOptions: [
                        {
                            value: 'Standard HD',
                            label: 'Standard HD'
                        },
                        {
                            value: 'HDCC (Center Cut Safe)',
                            label: 'HDCC (Center Cut Safe)'
                        },
                        {
                            value: 'Instagram',
                            label: 'Instagram'
                        },
                        {
                            value: 'Snapchat',
                            label: 'Snapchat'
                        },
                        {
                            value: 'Other',
                            label: 'Other'
                        }
                    ],
                    resolutionSelected: 'Standard HD',
                    referenceFileNames: []
                })
            });
        } else { // finishing
            this.setState({
                common: Object.assign({}, this.state.common, {
                    resolutionOptions: [
                        {
                            value: '2K',
                            label: '2K'
                        },
                        {
                            value: '4K',
                            label: '4K'
                        },
                        {
                            value: 'HD',
                            label: 'HD'
                        },
                        {
                            value: 'HDCC',
                            label: 'HDCC'
                        },
                        {
                            value: 'Scope',
                            label: 'Scope'
                        },
                        {
                            value: 'Flat',
                            label: 'Flat'
                        },
                        {
                            value: 'Instagram',
                            label: 'Instagram'
                        },
                        {
                            value: 'Snapchat',
                            label: 'Snapchat'
                        },
                        {
                            value: 'Other',
                            label: 'Other'
                        }
                    ],
                    resolutionSelected: '2K',
                    referenceFileNames: [
                        'String1111',
                        'String2222'
                    ]
                })
            });
        }

        let headerElements = [];

        headerElements.push(
            <Button
                onClick={e => this.handleGoingBack(e)}
                label={{
                    text: 'Back to all requests',
                    color: 'white',
                    size: 'large',
                    onLeft: false
                }}
                icon={{
                    background: 'none-alt',
                    size: 'small',
                    element:
                        <IconArrowLeftYellow
                            width={15}
                            height={11}
                            marginTop={-5}
                            marginLeft={-7}
                        />
                }}
            />
        );

        // Dispatch header
        this.props.dispatch({
            type: actions.HEADER_SET_ALL,
            payload: {
                title: 'Graphics request',
                elements: headerElements
            }
        });

        API.get(API.USERS, {type: 2, length: 9999})
        .then(response => {
            this.setState({
                finishing: Object.assign({}, this.state.finishing, {
                    finisherSelected:response.users[0].id,
                    finisherOptions: response.users.map((item, index)=>{
                        return {
                            value: item.id,
                            label: item.full_name
                        };
                    })
                })
            });
        }).catch(error => {            
        });

        if (this.props.requestId) {
            this.fetchRequest(parseInt(this.props.requestId, 10));
        }
    }

    handleGoingBack(e) {
        e.preventDefault();
        let url = '/graphics/';
        url += typeof this.props.fromRequestsPage !== 'undefined' ? this.props.fromRequestsPage : '1';
        history.push(url);
    }

    fetchDesignParam(response) {
        return {
            designWork: Object.assign({}, this.state.designWork, {
                framerateSelected: response.frameRate,
                prioritySelected: response.priority ? response.priority : 'null',
                priorityDate: response.priorityDate ? response.priorityDate: 'null',
                burnInSelected: response.burnIn
            })
        }
    }

    fetchFinishingParam(response) {
        return {
            finishing: Object.assign({}, this.state.finishing, {
                finisherSelected: response.finisherId,
                formatCompedSelected: response.formatComped,
                formatTextlessSelected: response.formatTextless,
                formatKeyableSelected: response.formatKeyable,
                checkersDueDate: response.checkerDueDate ? response.checkerDueDate: 'null',
                checkersDueSelected: response.checkerDue ? response.checkerDue: 'null',
                finalRendersDueDate: response.finalRendersDueDate ? response.finalRendersDueDate: 'null',
                finalRendersDueSelected: response.finalRendersDue ? response.finalRendersDue: 'null',
                finishingAtSelected: response.finishingAt,
                finishingContact: response.finishingContact==='null' ? '' : response.finishingContact,
                projectCollectStatus: response.projectCollect,
                projectCollectNote: response.projectCollectNote==='null' ? '' : response.projectCollectNote,
                stereoFinishStatus: response.stereoFinish,
                stereoFinishNote: response.stereoFinishNote==='null' ? '' : response.stereoFinishNote
            })
        }
    }

    fetchRequest(requestId) {
        this.setState({
            isFetchRequestLoading: true
        });

        // Fetch
        API.get(API.GRAPHICS_REQUEST + '/' + requestId)
            .then(response => {                
                let requestTypeSelected = '1';
                if( response.finisherId )
                    requestTypeSelected = '2';

                const selectedProject = {
                    selectedProject: {
                        projectId: response.projectId,
                        campaignId: response.campaignId,
                        spotId: response.spotId,
                        versionId: response.versionId
                    }
                };
                const common = {
                    common: Object.assign({}, this.state.common, {
                        resolutionSelected: response.resolution,
                        resolutionNotes: response.resolutionNote,
                        referenceFileNames: response.files,
                        notes: response.note==='null' ? '' : response.note
                    })
                };

                const others = {
                    requestId: requestId,
                    requestStatus: response.status,
                    requestTypeSelected: requestTypeSelected,
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
                        }
                    },
                    isFinal: (response.statusId === '1') ? false : true
                };

                const designWork = this.fetchDesignParam(response);                
                const finishing = this.fetchFinishingParam(response);                
                
                let updatedState = Object.assign({},
                    this.state,
                    selectedProject,
                    common,
                    others,
                    designWork,
                    finishing
                );
                
                this.setState(
                    updatedState
                , ()=>{
                    this.setState(
                        {
                            isFetchRequestLoading: false
                        }
                    );
                });
            })
            .catch(error => {                
            });        
    }

    componentWillUmount() {
        // Remove header
        this.props.dispatch({
            type: actions.HEADER_RESET
        });
    }

    handleCreateNewRequestClick(e) {
        history.push('/graphic/graphics-request');
    }

    handleRequestTypeChange(e) {
        if (typeof e !== 'undefined' && typeof e.target !== 'undefined' && typeof e.target.value !== 'undefined') {
            this.setState({
                requestTypeSelected: e.target.value
            });
        }
    }

    handleSelectProject(selected) {
        if (typeof selected !== 'undefined') {            
            this.setState({
                selectedProject: {
                    projectId: selected.project.selectedId,
                    campaignId: selected.campaign.selectedId,
                    spotId: selected.spot.selectedId,
                    versionId: selected.version.selectedId
                }
            });
        }
    }

    getCommonParam() {        
        const { selectedProject, common, isFinal, requestId } = this.state;        

        let params = {
            graphics_request_id: requestId,
            project_id: selectedProject.projectId,
            campaign_id: selectedProject.campaignId,
            spot_id: selectedProject.spotId,
            version_id: selectedProject.versionId,
            resolution: common.resolutionSelected,
            resolution_note: common.resolutionNotes,
            note: common.notes,
            status_id: (isFinal === true) ? 2 : 1,
            files: JSON.stringify(common.referenceFileNames)
        };

        return params;
    }

    getDesignWorkParam() {
        const { designWork } = this.state;

        let params = {
            frame_rate: designWork.framerateSelected,            
            burn_in: designWork.burnInSelected
        };

        if ( designWork.prioritySelected !== 'null' ){
            params.priority = designWork.prioritySelected;
        } else if(designWork.priorityDate !== 'null') {
            params.priority_date = designWork.priorityDate;
        }

        return params;
    }

    getFinishingParam() {
        const { finishing } = this.state;
        
        let params = {
            finisher_id: finishing.finisherSelected,
            format_comped: finishing.formatCompedSelected,
            format_textless: finishing.formatTextlessSelected,
            format_keyable: finishing.formatKeyableSelected,
            //checker_due: finishing.checkersDueSelected,
            //checker_due_date: finishing.checkersDueDate,
            //final_renders_due: finishing.finalRendersDueSelected,
            //final_renders_due_date: finishing.finalRendersDueDate,
            finihsing_at: finishing.finishingAtSelected,
            finishing_contact: finishing.finishingContact,
            project_collect: finishing.projectCollectStatus,
            project_collect_note: finishing.projectCollectNote,
            stereo_finish: finishing.stereoFinishStatus,
            stereo_finish_note: finishing.stereoFinishNote
        };

        if ( finishing.checkersDueSelected !== 'null' ){
            params.checker_due = finishing.checkersDueSelected;
        } else if(finishing.checkersDueDate !== 'null') {
            params.checker_due_date = finishing.checkersDueDate;
        }

        if ( finishing.finalRendersDueSelected !== 'null' ){
            params.final_renders_due = finishing.finalRendersDueSelected;
        } else if ( finishing.finalRendersDueDate !== 'null' ){
            params.final_renders_due_date = finishing.finalRendersDueDate;
        }

        return params;
    }


    handleRequestSubmission() {
        // If project is not selected
        if (!this.state.selectedProject.projectId) {
            // Scroll to Project Pikcer
            this.scrollToProjectPicker();

            // Notify to select project
            this.props.dispatch(
                actionAlertNotify(
                    'Select project',
                    'Project have to be selected to create the graphics request.',
                    'error',
                    false,
                    true,
                    false,
                    5
                )
            );

            return;
        }

        // get designwork param
        let params = {};
        let designParams = this.getDesignWorkParam();
        let finishingParams = this.getFinishingParam();
        let commonParams = this.getCommonParam();

        if( this.state.requestTypeSelected === '1') {
            params = Object.assign({}, commonParams, designParams);
        } else {
            params = Object.assign({}, commonParams, finishingParams);
        }
        
        // Decide API mothod - PUT or POST
        const method = this.state.requestId === null ? 'post' : 'put';
        const url = this.state.requestId === null ? API.GRAPHICS_REQUEST : API.GRAPHICS_REQUEST + '/' + this.state.requestId;
        const send = this.state.requestId === null ? API.makePostData(params) : API.makePutData(params);


        this.setState({
            isRequestUploading: true
        });

        // Upload
        API[method](url, send)
            .then(response => {
                this.setState({
                    requestId: parseInt(response.data.id, 10) || null,
                    isRequestUploading: false
                });

                // Notification attributes
                let notificationTitle = '', notificationDescription = '';
                if (this.state.isFinal === true) {
                    notificationTitle = 'Graphics Request sent for approval';
                    notificationDescription = 'Graphics Request has been passed for approval';
                } else {
                    notificationTitle = 'Graphics Request\'s draft saved';
                    notificationDescription = 'You can come back and modify the graphics request whenever you like and send it for approval when ready.';
                }

                // Notify to success
                this.props.dispatch(
                    actionAlertNotify(
                        notificationTitle,
                        notificationDescription,
                        'success',
                        false,
                        true,
                        false,
                        5
                    )
                );

                // Redirect to requests list if it's final
                if (this.state.isFinal === true) {
                    history.push('/graphics');
                }
            })
            .catch(error => {
                //console.log(error);
                this.props.dispatch(
                    actionAlertNotify(
                        'Something went wrong',
                        'Please try again',
                        'error',
                        false,
                        true,
                        false,
                        5
                    )
                );
                this.setState({
                    isRequestUploading: false
                });
            });
    }

    handleRequestStatusToggle(e) {
        // Toggle state
        this.setState({
            isFinal: !this.state.isFinal
        });
    }

    handleElementChange(e, where, what) {
        let returnObj = {};
        returnObj[what] = e.target.value;

        if( where === 'designWork' ) {
            this.setState({
                designWork: Object.assign({}, this.state.designWork, returnObj)
            });
        } else if( where === 'finishing' ) {
            this.setState({
                finishing: Object.assign({}, this.state.finishing, returnObj)
            });
        } else {
            this.setState({
                common: Object.assign({}, this.state.common, returnObj)
            });            
        }
    }

    handleRefFileNames(e, index) {

        let commonState = Object.assign({}, this.state.common);
        commonState['referenceFileNames'][index] = e.target.value;

        this.setState({
            common: commonState
        });
    }

    handlePriorityDateChange(date) {
        this.setState({
            designWork: Object.assign({}, this.state.designWork, {
                priorityDate: date['_i'],
                prioritySelected: 'null'
            })
        });
    }    

    handleAddRefFileNames() {
        const commonState = Object.assign([], this.state.common);
        commonState['referenceFileNames'].push('');
        this.setState({
            common: commonState
        });
    }

    handleDelRefFileNames(index) {
        const commonState = Object.assign([], this.state.common);
        commonState.referenceFileNames.splice(index, 1);

        this.setState({
            common: commonState
        });
    }

    handleFinishingCheckersDueDateChange(date) {
        this.setState({
            finishing: Object.assign({}, this.state.finishing, {
                checkersDueDate: date['_i'],
                checkersDueSelected: 'null'
            })
        });
    }

    handleFinishingFinalRendersDueDateChange(date) {
        this.setState({
            finishing: Object.assign({}, this.state.finishing, {
                finalRendersDueDate: date['_i'],
                finalRendersDueSelected: 'null'
            })
        });
    }

    handleFinishingProjectCollectStatusToggle(e) {
        // Toggle state
        this.setState({
            projectCollectStatus: this.state.finishing.projectCollectStatus == '1' ? '0': '1'
        });
    }

    handleFinishingStereoFinishStatusToggle(e) {
        // Toggle state
        this.setState({
            stereoFinishStatus: this.state.finishing.stereoFinishStatus == '1' ? '0': '1'
        });
    }

    scrollToProjectPicker() {
        if (typeof this.refs.projectPicker !== 'undefined') {
            if (typeof this.refs.projectPicker.refs.sectionContainer !== 'undefined') {
                if (typeof this.refs.projectPicker.refs.sectionContainer.refs.container !== 'undefined') {
                    zenscroll.intoView(this.refs.projectPicker.refs.sectionContainer.refs.container);
                }
            }
        }
    }

    finishingPortion() {

        return (
            <Section>
                <Row removeGutter={true} className={s.cntSectionRow}>
                    <Col size={4}>
                        <Paragraph>Finisher</Paragraph>
                        <br />
                        <Select
                            value={this.state.finishing.finisherSelected}
                            onChange={e =>this.handleElementChange(e, 'finishing', 'finisherSelected')}
                            options={
                                this.state.finishing.finisherOptions
                            }
                        />
                    </Col>
                    <Col size={4}>
                        {this.commonResolution('Finishing resolution')}
                    </Col>                    
                    <Col size={4}>
                        <Paragraph>Format Comped</Paragraph>
                        <br />
                        <Select
                            value={this.state.finishing.formatCompedSelected}
                            onChange={e =>this.handleElementChange(e, 'finishing', 'formatCompedSelected')}
                            options={
                                this.state.finishing.formatCompedOptions
                            }
                        />
                        <br /><br />
                        <Paragraph>Format Textless</Paragraph>
                        <br />
                        <Select
                            value={this.state.finishing.formatTextlessSelected}
                            onChange={e =>this.handleElementChange(e, 'finishing', 'formatTextlessSelected')}
                            options={
                                this.state.finishing.formatTextlessOptions
                            }
                        />
                        <br /><br />
                        <Paragraph>Format Keyable</Paragraph>
                        <br />
                        <Select
                            value={this.state.finishing.formatKeyableSelected}
                            onChange={e =>this.handleElementChange(e, 'finishing', 'formatKeyableSelected')}
                            options={
                                this.state.finishing.formatKeyableOptions
                            }
                        />
                    </Col>
                </Row>
                <Row className={s.cntSectionRow}>
                    <Col size={4}>
                        <Paragraph>Checkers Due</Paragraph>
                        <br />
                        <Select
                            value={this.state.finishing.checkersDueSelected}
                            onChange={e =>this.handleElementChange(e, 'finishing', 'checkersDueSelected')}
                            options={
                                this.state.finishing.checkersDueOptions
                            }
                        />
                        <br />
                        <br />
                        <DatePicker                            
                            className={this.state.finishing.checkersDueSelected === 'null' ? 
                            (this.state.finishing.checkersDueDate==='null' ? s.disableDatePicker : s.enableDatePicker)
                            :s.disableDatePicker}
                            onChange={e => this.handleFinishingCheckersDueDateChange(e)}
                            label="Checkers Due Date"                            
                            value={moment(this.state.finishing.checkersDueDate).isValid() ? moment(this.state.finishing.checkersDueDate) : null}
                        />
                    </Col>
                    <Col size={4}>
                        <Paragraph>Final Renders Due</Paragraph>
                        <br />
                        <Select
                            value={this.state.finishing.finalRendersDueSelected}
                            onChange={e =>this.handleElementChange(e, 'finishing', 'finalRendersDueSelected')}
                            options={
                                this.state.finishing.finalRendersDueOptions
                            }
                        />
                        <br />
                        <br />
                        <DatePicker
                            className={this.state.finishing.finalRendersDueSelected === 'null' ? 
                            (this.state.finishing.finalRendersDueDate==='null' ? s.disableDatePicker : s.enableDatePicker)
                            :s.disableDatePicker}
                            onChange={e => this.handleFinishingFinalRendersDueDateChange(e)}
                            label="Final Renders Due Date"
                            value={moment(this.state.finishing.finalRendersDueDate).isValid() ? moment(this.state.finishing.finalRendersDueDate) : null}
                        />
                    </Col>
                    <Col size={4}>
                        <Paragraph>Finishing At</Paragraph>
                        <br />
                        <Select
                            value={this.state.finishing.finishingAtSelected}
                            onChange={e =>this.handleElementChange(e, 'finishing', 'finishingAtSelected')}
                            options={
                                this.state.finishing.finishingAtOptions
                            }
                        />
                    </Col>
                </Row>
                <Row className={s.cntSectionRow}>
                    <Col size={4}>
                        <Paragraph>Finishing Contact</Paragraph>
                        <br />
                        <Input
                            key={`ref-finishing-contact-input`}
                            label="Finishing Contact"
                            value={this.state.finishing.finishingContact}
                            onChange={e =>this.handleElementChange(e, 'finishing', 'finishingContact')}
                        />
                    </Col>
                    <Col size={4}>
                        <Paragraph>Project Collect</Paragraph>
                        <br />
                        <Toggle
                            onChange={e => this.handleFinishingProjectCollectStatusToggle(e)}
                            defaultRight={this.state.finishing.projectCollectStatus==='0' ? false : true}
                            align="left"
                            left={{
                                label: 'No',
                                value: '0'
                            }}
                            right={{
                                label: 'Yes',
                                value: '1'
                            }}
                        />
                        <br />
                        <Input
                            key={`ref-finishing-project-collect-input`}
                            label="Projct collect note"
                            value={this.state.finishing.projectCollectNote}
                            onChange={e =>this.handleElementChange(e, 'finishing', 'projectCollectNote')}
                        />
                    </Col>
                    <Col size={4}>
                        <Paragraph>Stereo Finish</Paragraph>
                        <br />
                        <Toggle
                            onChange={e => this.handleFinishingStereoFinishStatusToggle(e)}
                            defaultRight={this.state.stereoFinishStatus==='0' ? false : true}
                            align="left"
                            left={{
                                label: 'No',
                                value: '0'
                            }}
                            right={{
                                label: 'Yes',
                                value: '1'
                            }}
                        />
                        <br />
                        <Input
                            key={`ref-finishing-stereo-finish-input`}
                            label="Stereo finish note"
                            value={this.state.finishing.stereoFinishNote}
                            onChange={e =>this.handleElementChange(e, 'finishing', 'stereoFinishNote')}
                        />
                    </Col>
                </Row>
                <Row className={s.cntSectionRow}>
                    <Col size={4}>
                        {this.commonRefFiles()}
                    </Col>
                    <Col size={4}>
                        {this.commonNote()}
                    </Col>
                    <Col size={4}>
                    </Col>
                </Row>
            </Section>
        );
    }   

    designWorkPortion() {

        return (
            <Section>
                <Row removeGutter={true} className={s.cntSectionRow}>
                    <Col size={4}>
                        {this.commonResolution('Resolution')}
                    </Col>
                    <Col size={4}>
                        <Paragraph>Frame Rate</Paragraph>
                        <br />
                        <Select
                            value={this.state.designWork.framerateSelected}
                            onChange={e =>this.handleElementChange(e, 'designWork', 'framerateSelected')}
                            options={
                                this.state.designWork.framerateOptions
                            }
                        />
                    </Col>
                    <Col size={4}>
                        <Paragraph>Priority</Paragraph>
                        <br />
                        <Select
                            value={this.state.designWork.prioritySelected}
                            onChange={e =>this.handleElementChange(e, 'designWork', 'prioritySelected')}
                            options={
                                this.state.designWork.priorityOptions
                            }
                        />
                        <br />
                        <br />
                        <DatePicker
                            className={this.state.designWork.prioritySelected === 'null' ? 
                            (this.state.designWork.priorityDate==='null' ? s.disableDatePicker : s.enableDatePicker)
                            :s.disableDatePicker}
                            onChange={e => this.handlePriorityDateChange(e)}
                            label="Priority Date"
                            value={moment(this.state.designWork.priorityDate).isValid() ? moment(this.state.designWork.priorityDate) : null}
                        />
                    </Col>
                </Row>
                <Row className={s.cntSectionRow}>
                    <Col size={4}>
                        {this.commonRefFiles()}
                    </Col>
                    <Col size={4}>
                        <Paragraph>Burn In</Paragraph>
                        <br />
                        <Select
                            value={this.state.designWork.burnInSelected}
                            onChange={e =>this.handleElementChange(e, 'designWork', 'burnInSelected')}
                            options={
                                this.state.designWork.burnInOptions
                            }
                        />
                    </Col>
                    <Col size={4}>
                        {this.commonNote()}
                    </Col>
                </Row>
            </Section>
        )
    }
    commonRefFiles() {
        return (
            <div>
                <Paragraph>Reference Files</Paragraph>
                <Table className={s.refFilesTbl}>
                {
                    this.state.common.referenceFileNames.map((item, index)=>{
                        return ( 
                            <TableRow key={`ref-${index}`}>
                                <TableCell>
                                    <Input
                                        key={`ref-file-name${index}`}
                                        label="Reference Files"
                                        value={item}
                                        onChange={e =>this.handleRefFileNames(e, index)}
                                    />
                                </TableCell>
                                <TableCell>
                                    <Button
                                        onClick={e =>this.handleDelRefFileNames(index)}                                   
                                        icon={{
                                            background: 'white',
                                            size: 'small',
                                            element:
                                                <IconClose
                                                    width={12}
                                                    height={12}
                                                    marginLeft={-6}
                                                    marginTop={-6}
                                                />
                                        }}
                                    />
                                </TableCell>
                            </TableRow>
                        )
                    })
                }
                    <TableRow key="btn-staff">
                        <TableCell align="right" colSpan={8}>
                            <Button
                                onClick={this.handleAddRefFileNames.bind(this)}
                                float="right"
                                label={{
                                    size: 'small',
                                    color: 'blue',
                                    text: 'Add reference files'
                                }}
                            />
                        </TableCell>
                    </TableRow>
                </Table>
            </div>
        );
    }
    commonResolution(title) {
        return (
            <div>
                <Paragraph>{title}</Paragraph>
                <br />

                <Select
                    value={this.state.common.resolutionSelected}
                    onChange={e =>this.handleElementChange(e, 'common', 'resolutionSelected')}
                    options={
                        this.state.common.resolutionOptions.length <= 0
                            ? [{ value: 1, label: 'Loading...' }]
                            : this.state.common.resolutionOptions
                    }
                />
                <br />
                <br />
                <Input
                    onChange={e =>this.handleElementChange(e, 'common', 'resolutionNotes')}
                    label="Resolution note"                            
                    color="brown"
                />
            </div>
        );
    }

    commonNote() {
        return (
            <div>
                <Paragraph>Notes</Paragraph>
                <br />
                <TextArea
                    onChange={e =>this.handleElementChange(e, 'common', 'notes')}
                    label="Notes..."
                    value={this.state.common.notes}
                />
            </div>
        )
    }

    render() {
        const isNotDraftRequest =
            this.props.requestId &&
            typeof this.state.requestStatus !== 'undefined' && this.state.requestStatus !== 'Draft'
                ? true
                : false;
        
        return (
            <Layout>
                {(() => {
                    if (this.state.isFetchRequestLoading === true) {
                        return (
                            <LoadingShade background="rgba(247, 247, 247, 0.9)">
                                <LoadingSpinner size={64} color="#5A4D3F" />
                            </LoadingShade>
                        );
                    }
                })()}
                <Section title="Graphics Request User Type" noSeparator={true}>
                    <Row alignContent="center" alignItems="center">
                        <Col size={9}>
                            <Select
                                value={this.state.requestTypeSelected}
                                onChange={this.handleRequestTypeChange.bind(this)}
                                options={this.state.requestTypeOptions}
                            />
                        </Col>
                        <Col size={3}>
                        </Col>
                    </Row>
                    <br />
                    <br />
                </Section>               

                {(() => {
                    //console.log(this.state.defaultProject);
                    // Mount ProjectPicker if new, if not, then if defaultProject is given from api
                    if (!this.props.requestId || (this.props.requestId && this.state.defaultProject)) {
                        return (
                            <ProjectPicker
                                ref="projectPicker"
                                noSeparator={true}
                                showVersion={true}
                                levelRequired={2}
                                title="Select project"
                                defaultToOpenProjects={true}
                                defaultValue={this.state.defaultProject}
                                onChange={this.handleSelectProject}
                                readOnly={isNotDraftRequest}
                            />
                        );
                    }
                })()}

                {
                    this.state.selectedProject.campaignId !== null &&
                    <Section
                        title="Associated People"
                    >
                        {(() => {
                            // Set workers table header
                            let workersTableHeader = [
                                { title: 'Role', align: 'left' },
                                { title: 'Name', align: 'left' }
                            ];
                             // Set workers table columns widths
                            let workersTableColumnsWidth = [
                                '50%',
                                '50%'
                            ];

                            // Render workers table
                            return (
                                <Table
                                    ref="workersTable"
                                    header={workersTableHeader}
                                    columnsWidths={workersTableColumnsWidth}
                                >
                                    {(() => {
                                        let associatedPeople;
                                        associatedPeople = this.state.associatedPeople;

                                        let peopleRows;
                                        peopleRows = associatedPeople.map((item, index) => {
                                            // Render
                                            return (
                                                <TableRow key={`sample list ${index}`}>

                                                    <TableCell>
                                                        <Paragraph>{item.role}</Paragraph>
                                                    </TableCell>

                                                    <TableCell>
                                                        <Paragraph>{item.name}</Paragraph>
                                                    </TableCell>
                                                </TableRow>
                                            );
                                        });
                                        return peopleRows;
                                    })()}
                                </Table>
                            );
                        })()}

                    </Section>
                }

                {                    
                    (this.state.requestTypeSelected === '1') ? this.designWorkPortion() : this.finishingPortion()
                }

                 <Section title="Summary">
                    <Row removeGutter={true}>
                        <Col size={6}>
                            <Toggle
                                onChange={e => this.handleRequestStatusToggle(e)}
                                defaultRight={this.state.isFinal}
                                isRight={this.state.isFinal}
                                disabled={isNotDraftRequest}
                                align="left"
                                left={{
                                    label: 'Draft',
                                    value: '1'
                                }}
                                right={{
                                    label: 'Send for approval',
                                    value: '2'
                                }}
                            />
                        </Col>
                        
                        <Col size={6}>
                            <Button
                                onClick={e => this.handleRequestSubmission(e)}
                                icon={{
                                    size: 'large',
                                    background: 'orange',
                                    element:
                                        <IconSendSubmit
                                            width={25}
                                            height={26}
                                            marginLeft={-13}
                                            marginTop={-13}
                                        />
                                }}
                                label={{
                                    text: this.state.isRequestUploading
                                        ? 'Saving...'
                                        : this.state.isFinal ? 'Save and submit' : 'Save draft',
                                    size: 'small',
                                    color: 'orange',
                                    onLeft: true
                                }}
                                disabled={this.state.isRequestUploading}
                            />
                        </Col>                        
                    </Row>                    
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

export default connect(mapStateToProps)(PageGraphicsRequest);
