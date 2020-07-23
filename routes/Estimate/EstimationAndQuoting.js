import React from 'react';
import { connect } from 'react-redux';
import zenscroll from 'zenscroll';
import accounting from 'accounting';
import * as actions from './../../actions/ActionTypes';
import * as API from './../../actions/api';
import { actionAlertNotify } from './../../actions/Notifications';
import history from './../../core/history';
import s from './EstimationAndQuoting.css';
import Layout from './../../components/Layout/Layout';
import Row from './../../components/Section/Row';
import Col from './../../components/Section/Col';
import Section from './../../components/Section/Section';
import Table from './../../components/Table/Table';
import TableRow from './../../components/Table/TableRow';
import TableCell from './../../components/Table/TableCell';
import Paragraph from './../../components/Content/Paragraph';
import Input from './../../components/Form/Input';
import TextArea from './../../components/Form/TextArea';
import Toggle from './../../components/Form/Toggle';
import DropdownContainer from './../../components/Form/DropdownContainer';
import OptionsList from './../../components/Form/OptionsList';
import Select from './../../components/Form/Select';
import Money from './../../components/Content/Money';
import Counter from './../../components/Form/Counter';
import Comments from './../../components/Buddha/Comments';
import ProjectPicker from './../../components/Buddha/ProjectPicker';
import GraphicsAudioVisualToggle from './../../components/Buddha/GraphicsAudioVisualToggle';
import Button from './../../components/Button/Button';
import LoadingShade from './../../components/Loaders/LoadingShade';
import LoadingSpinner from './../../components/Loaders/LoadingSpinner';
import IconCheckmarkGreen from './../../components/Icons/IconCheckmarkGreen';
import IconSendSubmit from './../../components/Icons/IconSendSubmit';
import IconSearchLoupe from './../../components/Icons/IconSearchLoupe';
import IconArrowLeftYellow from './../../components/Icons/IconArrowLeftYellow';
import AdditionalStaffList from './AdditionalStaffList';
import OutsideCosts from './OutsideCosts';
import GenericStaff from './GenericStaff';

const MAX_LOAD_WORKERS = 999;

class PageEstimateEstimationAndQuoting extends React.Component {
    constructor(props, context) {
        super(props, context);

        this.state = {
            estimateId: null,
            estimateStatus: undefined,
            estimateTypeOptions: [],
            estimateTypeOptionsLoading: false,
            estimateTypeSelected: 1,
            workersFilter: {
                search: '',
                rate: {
                    value: 'all',
                    label: 'All'
                }
            },
            loadedWorkers: [],
            visibleWorkers: [],
            selectedWorkers: {},
            additionalWorkers: [
            ],
            showAllWorkers: this.props.estimateId ? false : true,
            showEstimateDays: false,
            defaultProject: undefined,
            selectedProject: {
                projectId: null,
                campaignId: null,
                spotId: null,
                versionId: null
            },
            totalQuote: {
                baseValue: 0,
                markup: 150,
                totalValue: 0
            },
            notes: {
                technical: ''
            },
            isFinal: false,
            isWorkersLoading: false,
            isEstimateUploading: false,
            isEstimateLoading: false,
            outsideCosts: [
            ],
            genericStaff: [
            ],
            totalCostToClient: {
                baseValue: 0,
                markup: 110,
                totalValue: 0
            }
        };

        // Binding
        this.handleSelectProject = this.handleSelectProject.bind(this);
    }

    componentDidMount() {
        // Scroll to top
        window.scrollTo(0, 0);

        // Provide sample estimate type options
        this.setState({
            estimateTypeOptionsLoading: true
        }, () => {
            // API.get(API.ESTIMATE_TYPE+ '?active=1', {})
            API.get(API.ESTIMATE_TYPE, {})
            .then(response => {
                //console.log(response);
                this.setState({
                    estimateTypeOptionsLoading: false,
                    estimateTypeOptions: response.map((item, index)=>{
                        return {
                            value: item.id,
                            label: item.name
                        };
                    })
                });
            }).catch(error => {
                this.setState({
                    estimateTypeOptionsLoading: false
                });
            });
        });

        let headerElements = [];

        headerElements.push(
            <Button
                onClick={e => this.handleGoingBack(e)}
                label={{
                    text: 'Back to all estimates',
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

        if (!this.props.estimateId || (this.props.estimateId && this.state.estimateStatus === 'Draft')) {
            headerElements.push(
                <GraphicsAudioVisualToggle
                    onChange={e => this.handleGraphicsAudioVisualToggle(e)}
                    isWhite={true}
                    isLarge={true}
                    defaultToGraphics={false}
                    disabled={this.state.isWorkersLoading === true ? true : false}
                />
            );
        }

        // Dispatch header
        this.props.dispatch({
            type: actions.HEADER_SET_ALL,
            payload: {
                title: 'Estimate and quote the spot',
                elements: headerElements
            }
        });

        if (this.props.estimateId) {
            // For existing estimate
            this.loadWorkers('', 0, 9999, () => {
                this.fetchEstimate(parseInt(this.props.estimateId, 10));
            });
        } else {
            // For new estimate
            this.loadWorkers();
        }
    }

    componentWillUmount() {
        // Remove header
        this.props.dispatch({
            type: actions.HEADER_RESET
        });
    }

    fetchEstimate(estimateId) {
        // Show that estimate is loading
        this.setState({
            isEstimateLoading: true
        });

        // Fetch
        API.get(API.ESTIMATE + '/' + estimateId)
            .then(response => {
                console.log(response);
                let selectedWorkers = {};

                const workers = response.workers.forEach(worker => {
                    const workerValues = {
                        rate: worker.hourlyRate || 0.0,
                        regular: parseFloat(worker.estimatedRegular) || 0.0,
                        overtime: parseFloat(worker.estimatedOvertime) || 0.0,
                        doubletime: parseFloat(worker.estimatedDoubletime) || 0.0,
                        totalCost: parseFloat(worker.totalAmount) || 0.0
                    };

                    selectedWorkers[worker.workerId] = workerValues;
                });

                const defaultProject = {
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
                };

                const selectedProject = {
                    projectId: response.projectId,
                    campaignId: response.campaignId,
                    spotId: response.spotId,
                    versionId: response.versionId,
                };

                const additionalWorkers = response.temporaryStaff.map((item, index)=>{
                    return {
                        role: item.name,
                        rate: item.rate,
                        regular: item.estimatedTime,
                        overtime: 0,
                        doubletime: 0,
                        totalCost: item.totalAmount
                    };
                });

                const outsideCosts = response.outsideCost.map((item, index)=>{
                    return {
                        expenseId: item.outsideCostId,
                        amount: item.cost,
                        budgetType: (item.outsideCostType === 'Part of Budget') ? false : true
                    };
                });

                let genericStaff=[];
                genericStaff = response.staffs.map((item, index)=>{
                    return {
                        id: item.staffId,
                        regular: item.estimatedRegular,
                        overtime: item.estimatedOvertime,
                        doubletime: item.estimatedDoubletime,
                        totalCost: item.totalAmount
                    };
                });                

                // Update state
                this.setState(
                    Object.assign({}, this.state, {
                        estimateId: estimateId,
                        estimateStatus: response.status,
                        workersType: response.workType,
                        selectedWorkers: selectedWorkers,
                        defaultProject: defaultProject,
                        selectedProject: selectedProject,
                        totalQuote: {
                            markup: (response.multiplier < 100 ? response.multiplier*100 : response.multiplier)
                        },
                        notes: {
                            technical: response.notes
                        },
                        isFinal: response.status !== 'Draft',
                        additionalWorkers: additionalWorkers,
                        outsideCosts: outsideCosts,
                        genericStaff: genericStaff,
                        isEstimateLoading: false
                    }), ()=>{
                        this.calcTotalQuote();
                        this.calcTotalCostToClient();
                    }
                );

                // Reset Header elements
                if (response.status === 'Draft') {
                    this.props.dispatch({
                        type: actions.HEADER_SET_ELEMENTS,
                        payload: [
                            <Button
                                onClick={e => this.handleGoingBack(e)}
                                label={{
                                    text: 'Back to all estimates',
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
                        ]
                    });
                }
            })
            .catch(error => {
                this.setState({
                    isEstimateLoading: false
                });
            });
    }

    loadWorkers(query, offset, length, callback) {
        // Method params
        query = typeof query !== 'undefined' ? query : '';
        offset = typeof offset !== 'undefined' ? offset : 0;
        length = typeof length !== 'undefined' ? length : 99999;

        // API fetch params
        const params = {
            search: query,
            offset: offset,
            length: length
        };

        // Show that results are loading
        this.setState({
            isWorkersLoading: true
        });

        if (!this.props.estimateId || this.props.estimateId && this.state.estimateStatus === 'Draft') {
            // Disable workers toggle
            this.props.dispatch({
                type: actions.HEADER_SET_ELEMENTS,
                payload: [
                    <Button
                        onClick={e => this.handleGoingBack(e)}
                        label={{
                            text: 'Back to all estimates',
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
                ]
            });
        }

        // Fetch workers
        API.get(API.USERS, params)
            .then(response => {
                const workers = response.users.map(worker => {
                    let fullName = (worker.first_name || '') + (worker.last_name ? ' ' + worker.last_name : '');

                    return {
                        id: worker.id,
                        name: fullName,
                        initials: worker.initials || '',
                        rate: accounting.parse(worker.hourly_rate) || 0.0
                    };
                });

                this.setState({
                    loadedWorkers: workers,
                    visibleWorkers: workers,
                    isWorkersLoading: false
                }, () => {
                    if (callback) {
                        callback();
                    }
                });

                if (!this.props.estimateId || this.props.estimateId && this.state.estimateStatus === 'Draft') {
                    // Reenable workers toggle
                    this.props.dispatch({
                        type: actions.HEADER_SET_ELEMENTS,
                        payload: [
                            <Button
                                onClick={e => this.handleGoingBack(e)}
                                label={{
                                    text: 'Back to all estimates',
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
                        ]
                    });
                }
            })
            .catch(error => {
                this.setState({
                    isWorkersLoading: false
                });
            });
    }

    uploadEstimate() {
        let workers = [], additionalStaff = [], outsideCost = [], genericStaff = [];
        let workerId, worker;
        const selectedWorkerIds = Object.keys(this.state.selectedWorkers);

        // Collect selected worker's param
        for (workerId of selectedWorkerIds) {
            worker = this.state.selectedWorkers[workerId];

            if (worker.regular === 0 && worker.overtime === 0 && worker.doubletime === 0) {
                continue;
            }

            workers.push({
                worker_id: workerId,
                estimated_regular: worker.regular,
                estimated_overtime: worker.overtime,
                estimated_doubletime: worker.doubletime,
                total_amount: worker.totalCost
            });
        }

        this.state.additionalWorkers.map((worker, index)=>{
            if (worker.regular !== 0 && worker.role.trim() !== '') {
                additionalStaff.push({
                    name: worker.role,
                    rate: worker.rate,
                    estimated_time: worker.regular,
                    total_amount: worker.rate * worker.regular * ((this.state.showEstimateDays === true) ? 8 : 1)
                });
            }
        });

        this.state.outsideCosts.map((item, index)=>{
            if (item.amount !== 0 && item.expenseId !== null) {
                outsideCost.push({
                    outside_cost_id: item.expenseId,
                    cost: item.amount,
                    type_id: (item.budgetType === true) ? 2 : 1
                });
            }
        });

        this.state.genericStaff.map((worker, index)=>{
            if (worker.regular !== 0 && worker.rate !== 0) {
                genericStaff.push({
                    staff_id: worker.id,
                    estimated_regular: worker.regular,
                    estimated_overtime: worker.overtime,
                    estimated_doubletime: worker.doubletime,
                    total_amount: worker.totalCost

                });
            }
        });


        // Request params
        let params = {
            spot_id: this.state.selectedProject.spotId,
            version_id: this.state.selectedProject.versionId,
            multiplier: this.state.totalQuote.markup,
            submit_to: 99, // Fake value
            notes: this.state.notes.technical,
            status_id: this.state.isFinal === true ? 3 : 1,
            workers: JSON.stringify(workers),
            time_unit: this.state.showEstimateDays ? 'D' : 'H',
            temporary_staff: JSON.stringify(additionalStaff),
            outside_cost: JSON.stringify(outsideCost),
            staffs: JSON.stringify(genericStaff)
        };

        // Show that estimate is uploading
        this.setState({
            isEstimateUploading: true
        });

        // Decide API mothod - PUT or POST
        const method = this.state.estimateId === null ? 'post' : 'put';
        const url = this.state.estimateId === null ? API.ESTIMATE : API.ESTIMATE + '/' + this.state.estimateId;
        const send = this.state.estimateId === null ? API.makePostData(params) : API.makePutData(params);

        // Upload
        API[method](url, send)
            .then(response => {
                this.setState({
                    estimateId: parseInt(response.data.id, 10) || null,
                    isEstimateUploading: false
                });

                // Notification attributes
                let notificationTitle = '', notificationDescription = '';
                if (this.state.isFinal === true) {
                    notificationTitle = 'Estimate sent for review';
                    notificationDescription = 'Estimate has been passed to billing department for review.';
                } else {
                    notificationTitle = 'Estimate\'s draft saved';
                    notificationDescription = 'You can come back and modify the estimate whenever you like and send it for review when ready.';
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

                // Redirect to estimates list if it's final
                if (this.state.isFinal === true) {
                    history.push('/estimates');
                }
            })
            .catch(error => {
                this.setState({
                    isEstimateUploading: false
                });
            });
    }

    handleGoingBack(e) {
        e.preventDefault();
        let url = '/estimates/';
        url += typeof this.props.fromEstimatesPage !== 'undefined' ? this.props.fromEstimatesPage : '1';
        history.push(url);
    }

    handleWorkersFilterByRateChange(selected) {
        // Check if new selection is passed and that value has changed
        if (typeof selected !== 'undefined' && typeof selected.value !== 'undefined') {
            if (selected.value !== this.state.workersFilter.rate.value) {
                // Init
                let visibleWorkers = [];

                // Filter workers
                if (selected.value === 'all') {
                    visibleWorkers = this.state.loadedWorkers;
                } else {
                    this.state.loadedWorkers.map((worker, index) => {
                        const split = selected.value.split('-');
                        if (worker.rate >= accounting.parse(split[0]) && worker.rate < unformat(split[1])) {
                            visibleWorkers.push(worker);
                        }
                    });
                }

                // Update state
                this.setState({
                    visibleWorkers: visibleWorkers,
                    workersFilter: Object.assign({}, this.state.workersFilter, {
                        rate: Object.assign({}, this.state.workersFilter.rate, {
                            value: selected.value,
                            label: selected.label
                        })
                    })
                });
            }
        }
    }

    handleWorkersFilterByNameChange(e) {
        if (typeof e !== 'undefined' && typeof e.target !== 'undefined' && typeof e.target.value !== 'undefined') {
            // Init
            const val = e.target.value.trim();
            let visibleWorkers = [];

            // Filte workers
            if (val === '') {
                visibleWorkers = this.state.loadedWorkers;
            } else {
                const valueSplit = val.toLowerCase().split(' ');
                this.state.loadedWorkers.map((worker, index) => {
                    let workerMatches = 0;
                    const nameSplit = worker.name.toLowerCase().split(' ');
                    const initials = worker.initials.toLowerCase();

                    for (let v = 0; v < valueSplit.length; v++) {
                        const word = valueSplit[v];
                        for (let n = 0; n < nameSplit.length; n++) {
                            const nameWord = nameSplit[n];
                            if (nameWord.indexOf(word) !== -1) {
                                workerMatches++;
                            }
                        }
                    }

                    if (workerMatches === 0) {
                        if (initials.indexOf(valueSplit[0]) !== -1) {
                            workerMatches++;
                        }
                    }

                    if (workerMatches > 0) {
                        visibleWorkers.push(worker);
                    }
                });
            }

            // Update state
            this.setState({
                visibleWorkers: visibleWorkers,
                workersFilter: Object.assign({}, this.state.workersFilter, {
                    search: val
                })
            });
        }
    }

    handleMarkupChange(markup) {
        // For markup
        if (typeof markup === 'number') {
            this.setState({
                totalQuote: Object.assign({}, this.state.totalQuote, {
                    markup: markup,
                    totalValue: this.state.totalQuote.baseValue * this.conversionPercent(markup)
                })
            });
        }
    }

    getTotalOutsideCosts() {
        let total = [0, 0]; // bill back to client, part of budget
        this.state.outsideCosts.map((item, index)=>{
            if (item.budgetType === true) {  // Bill back to client
                total[0] += item.amount;
            } else { // Part of budget
                total[1] += item.amount;
            }
        });
        return total;
    }

    handleHoursChange(workerId, rate, hoursType, hoursCount) {
        // Check if all values are defined
        if (typeof workerId !== 'undefined' && typeof hoursType !== 'undefined' && typeof hoursCount !== 'undefined') {
            hoursCount = parseFloat(hoursCount);

            // Get worker
            const selectedWorker = this.state.selectedWorkers[workerId];

            // Prepare values object
            let workerValues = {
                rate: 0,
                regular: 0,
                overtime: 0,
                doubletime: 0,
                totalCost: 0
            };

            // Check if worker exists
            if (typeof selectedWorker !== 'undefined') {
                // Get values
                workerValues.rate = rate;
                workerValues.regular = selectedWorker.regular;
                workerValues.overtime = selectedWorker.overtime;
                workerValues.doubletime = selectedWorker.doubletime;
                workerValues[hoursType] = hoursCount;
            } else {
                // Prepare values
                workerValues.rate = rate;
                workerValues.regular = 0;
                workerValues.overtime = 0;
                workerValues.doubletime = 0;
                workerValues[hoursType] = hoursCount;
            }

            // Calculate total cost
            let multiplieris = 1;
            if (this.state.showEstimateDays === true) {
                multiplieris = 8;
            }

            const estimatedTotalFromRegularHours = workerValues.regular * workerValues.rate * multiplieris;
            const estimatedTotalFromOvertimeHours = workerValues.overtime * workerValues.rate * 1.5 * multiplieris;
            const estimatedTotalFromDoubletimeHours = workerValues.doubletime * workerValues.rate * 2.0 * multiplieris;

            workerValues.totalCost = estimatedTotalFromRegularHours + estimatedTotalFromOvertimeHours + estimatedTotalFromDoubletimeHours;

            // Update state
            this.setState({
                selectedWorkers: Object.assign({}, this.state.selectedWorkers, {
                    [workerId]: workerValues
                })
            }, ()=>{
                this.calcTotalQuote();
            });
        }
    }

    handleShowingAllWorkersChange(value) {
        if (typeof value !== 'undefined') {
            this.setState({
                showAllWorkers: value
            });
        }
    }

    calcTotalQuote() {
        let workerId, worker;
        let selectedWorkersArray = Object.assign({}, this.state.selectedWorkers);
        let selectedWorkerIds = Object.keys(selectedWorkersArray);
        let allWorkersTotalCost = 0;
        let showEstimateDays = this.state.showEstimateDays;

        function plus(employmentMode) {
            for (workerId of selectedWorkerIds) {
                worker = selectedWorkersArray[workerId];

                if (worker.regular === 0 && worker.overtime === 0 && worker.doubletime === 0) {
                    continue;
                }

                let multiplieris = 1;
                let overtimeMultiplieris = 1;
                let doubletimeMultiplieris = 1;

                if (showEstimateDays === true) {
                    multiplieris = 8;
                }

                if (employmentMode === 'staff') {
                    overtimeMultiplieris = 1.5;
                    doubletimeMultiplieris = 2;
                }

                selectedWorkersArray[workerId].totalCost = worker.rate * worker.regular * multiplieris
                    + worker.rate * worker.overtime * overtimeMultiplieris * multiplieris
                    + worker.rate * worker.doubletime * doubletimeMultiplieris * multiplieris;
                allWorkersTotalCost += selectedWorkersArray[workerId].totalCost;
            }
        }
        plus('staff');

        // 
        selectedWorkersArray = Object.assign({}, this.state.additionalWorkers);
        selectedWorkerIds = Object.keys(selectedWorkersArray);

        plus('additionalStaff');

        // 
        selectedWorkersArray = Object.assign({}, this.state.genericStaff);
        selectedWorkerIds = Object.keys(selectedWorkersArray);        
        plus('genericStaff');

        // outside costs
        let totalOutsideCosts = this.getTotalOutsideCosts();
        allWorkersTotalCost += totalOutsideCosts[1];
        
        this.setState({
            totalQuote: Object.assign({}, this.state.totalQuote, {
                baseValue: allWorkersTotalCost,
                totalValue: allWorkersTotalCost * this.conversionPercent(this.state.totalQuote.markup)
            })
        });
    }
    

    calcTotalCostToClient() {
        let totalOutsideCosts = this.getTotalOutsideCosts();
        let totalCost = {
            baseValue: totalOutsideCosts[0],
            markup: this.state.totalCostToClient.markup,
            totalValue: totalOutsideCosts[0] * this.conversionPercent(this.state.totalCostToClient.markup)
        };

        this.setState({
            totalCostToClient: totalCost
        });
    }

    handleEstimatingDaysChange(value) {
        if (typeof value !== 'undefined') {
                let workerId, worker;
                let selectedWorkersArray = Object.assign({}, this.state.selectedWorkers);
                let selectedWorkerIds = Object.keys(selectedWorkersArray);
                let showEstimateDays = this.state.showEstimateDays;

                function plus(employmentMode) {
                    for (workerId of selectedWorkerIds) {
                        worker = selectedWorkersArray[workerId];

                        if (worker.regular === 0 && worker.overtime === 0 && worker.doubletime === 0) {
                            continue;
                        }

                        let multiplieris = 1;
                        let overtimeMultiplieris = 1;
                        let doubletimeMultiplieris = 1;

                        if (showEstimateDays === true) {
                            multiplieris = 8;
                        }

                        if (employmentMode === 'staff') {
                            overtimeMultiplieris = 1.5;
                            doubletimeMultiplieris = 2;
                        }
                        if (value) {
                            selectedWorkersArray[workerId].doubletime = 0;
                        }
                        selectedWorkersArray[workerId].totalCost = worker.rate * worker.regular * multiplieris
                            + worker.rate * worker.overtime * overtimeMultiplieris * multiplieris
                            + worker.rate * worker.doubletime * doubletimeMultiplieris * multiplieris;
                    }
                }
                plus('staff');
				
				// 
                let selectedWorkersStateArray = Object.assign({}, selectedWorkersArray);

                selectedWorkersArray = Object.assign([], this.state.additionalWorkers);
                selectedWorkerIds = Object.keys(selectedWorkersArray);

                plus('additionalStaff');

                let additionalWorkersStateArray = Object.assign([], selectedWorkersArray);

				//
				selectedWorkersArray = Object.assign([], this.state.genericStaff);
                selectedWorkerIds = Object.keys(selectedWorkersArray);

				plus('genericStaff');

				let genericStaffArray = Object.assign([], selectedWorkersArray);

                this.setState({
                    selectedWorkers: selectedWorkersStateArray,
                    additionalWorkers: additionalWorkersStateArray,
					genericStaff: genericStaffArray,
                    showEstimateDays: value
                }, ()=>{
                    this.calcTotalQuote();
                });
        }
    }

    handleTechnicalDetailsChange(e) {
        // Update state
        this.setState({
            notes: Object.assign({}, this.state.notes, {
                technical: e.target.value
            })
        });
    }

    handleInternalNotesChange(e) {
        // Update state
        this.setState({
            notes: Object.assign({}, this.state.notes, {
                internal: e.target.value
            })
        });
    }

    handleEstimateTypeChange(e) {
        if (typeof e !== 'undefined' && typeof e.target !== 'undefined' && typeof e.target.value !== 'undefined') {
            this.setState({
                estimateTypeSelected: e.target.value
            });
        }
    }

    handleEstimateStatusToggle(e) {
        // Toggle state
        this.setState({
            isFinal: !this.state.isFinal
        });
    }

    handleNotifyPersonSearch(query) {
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

    handleEstimateSubmission(e) {
        // If project is not selected
        if (!this.state.selectedProject.spotId) {
            // Scroll to Project Pikcer
            this.scrollToProjectPicker();

            // Notify to select project
            this.props.dispatch(
                actionAlertNotify(
                    'Select spot',
                    'Project, campaign and spot have to be selected to create the estimate.',
                    'error',
                    false,
                    true,
                    false,
                    5
                )
            );

            return;
        }

        // If Workers are not selected
        if (!this.hasWorkersSelected()) {
            // Scroll to Workers to select
            this.scrollToWorkers();

            // Notify to select workers
            this.props.dispatch(
                actionAlertNotify(
                    'Select staff',
                    'At least one work hour has to be assigned to create the estimate.',
                    'error',
                    false,
                    true,
                    false,
                    5
                )
            );

            return;
        }

        // Upload Estimate
        this.uploadEstimate();
    }

    conversionPercent(factor) {
        return (factor<100) ? factor : _.round(factor/100, 2).toFixed(2);
    }

    /**
     * Helpers
     */

    scrollToProjectPicker() {
        if (typeof this.refs.projectPicker !== 'undefined') {
            if (typeof this.refs.projectPicker.refs.sectionContainer !== 'undefined') {
                if (typeof this.refs.projectPicker.refs.sectionContainer.refs.container !== 'undefined') {
                    zenscroll.intoView(this.refs.projectPicker.refs.sectionContainer.refs.container);
                }
            }
        }
    }

    scrollToWorkers() {
        if (typeof this.refs.workersTable !== 'undefined') {
            if (typeof this.refs.workersTable.refs.container !== 'undefined') {
                zenscroll.intoView(this.refs.workersTable.refs.container);
            }
        }
    }

    hasWorkersSelected() {
        let workerId, worker;
        const selectedWorkerIds = Object.keys(this.state.selectedWorkers);

        for (workerId of selectedWorkerIds) {
            worker = this.state.selectedWorkers[workerId];

            if (worker.regular >= 1 || worker.overtime >= 1 || worker.doubletime >= 1) {
                return true;
            }
        }

        return false;
    }

    /**
    * Set the role of additional staff
    * @param {index} index of additinal staff array
    * @param {event} onchange event of input object
    * @return {void}
    */
    handleAdditionalRoleChange(index, e) {
        const updatedAdditionalWorkersArray = [...this.state.additionalWorkers];
        updatedAdditionalWorkersArray[index].role = e.target.value;
        this.setState({
            additionalWorkers: updatedAdditionalWorkersArray
        });
    }

    /**
    * Set the value of rate in additional staff row with index {index}
    * @param {index} index of additinal staff array
    * @param {int} rate
    * @return {void}
    */
    handleAdditionalRateChange(index, rate) {
        const updatedAdditionalWorkersArray = [...this.state.additionalWorkers];
        updatedAdditionalWorkersArray[index].rate = rate;
        this.setState({
            additionalWorkers: updatedAdditionalWorkersArray
        }, ()=>{
            this.handleAdditionalHoursChange(index, rate, 'regular', this.state.additionalWorkers[index]['regular']);
        });
    }

    /**
    * Set the value of regular or overtime or double
    * @param {index} index of additinal staff array
    * @param {str} hoursType - regular/overtime/double
    * @param {int} hoursCount
    * @return {void}
    */
    handleAdditionalHoursChange(index, rate, hoursType, hoursCount) {
        // Check if all values are defined
        if (typeof hoursType !== 'undefined' && typeof hoursCount !== 'undefined') {
            hoursCount = parseFloat(hoursCount);

            // Get worker
            const selectedWorker = this.state.additionalWorkers[index];

            // Prepare values object
            let workerValues = {
                rate: 1,
                regular: 0,
                overtime: 0,
                doubletime: 0,
                totalCost: 0
            };

            // Check if worker exists
            if (typeof selectedWorker !== 'undefined') {
                // Get values
                workerValues.rate = rate;
                workerValues.regular = selectedWorker.regular;
                workerValues.overtime = selectedWorker.overtime;
                workerValues.doubletime = selectedWorker.doubletime;
                workerValues[hoursType] = hoursCount;
            } else {
                // Prepare values
                workerValues.rate = rate;
                workerValues.regular = 0;
                workerValues.overtime = 0;
                workerValues.doubletime = 0;
                workerValues[hoursType] = hoursCount;
            }

            // Calculate total cost
            let multiplieris = 1;
            if (this.state.showEstimateDays === true) {
                multiplieris = 8;
            }

            const estimatedTotalFromRegularHours = workerValues.regular * workerValues.rate * multiplieris;
            const estimatedTotalFromOvertimeHours = workerValues.overtime * workerValues.rate * multiplieris;
            const estimatedTotalFromDoubletimeHours = workerValues.doubletime * workerValues.rate * multiplieris;

            workerValues.totalCost = estimatedTotalFromRegularHours + estimatedTotalFromOvertimeHours + estimatedTotalFromDoubletimeHours;


            const updatedAdditionalWorkersArray = [...this.state.additionalWorkers];
            updatedAdditionalWorkersArray[index][hoursType] = hoursCount;
            updatedAdditionalWorkersArray[index]['totalCost'] = workerValues.totalCost;

            this.setState({
                additionalWorkers: updatedAdditionalWorkersArray
            }, ()=>{
                this.calcTotalQuote();
            });
        }
    }

    /**
    * Set the id of the expense selected
    * @param {index} index of outside array
    * @param {int} expense id
    * @return {void}
    */

    handleExpensePicked(index, expenseId) {
        const updatedOutsideCostsArray = [...this.state.outsideCosts];
        updatedOutsideCostsArray[index].expenseId = expenseId;
        this.setState({
            outsideCosts: updatedOutsideCostsArray
        });
    }

    /**
    * Set a value of amount or budgetType.
    * @param {index} index of outside array
    * @param {str} amount or budgetType
    * @return {void}
    */
    handleOutsideCostsChange(index, type, value) {
        const updatedOutsideCostsArray = [...this.state.outsideCosts];
        updatedOutsideCostsArray[index][type] = value;
        this.setState({
            outsideCosts: updatedOutsideCostsArray
        }, ()=>{
            this.calcTotalQuote();
            this.calcTotalCostToClient();
        });
    }

    /**
    * Set the id of the expense just created
    * @param {index} index of outside array
    * @param {json} expense info just created
    * @return {void}
    */
    handleCreateExpensePicked(index, e) {
        const updatedOutsideCostsArray = [...this.state.outsideCosts];
        updatedOutsideCostsArray[index].expenseId = e.value;
        this.setState({
            outsideCosts: updatedOutsideCostsArray
        });
    }

    /**
    * Remove the additional staff item
    * @param {int} index of item to be removed
    * @return {void}
    */
    handleRemoveAdditionalStaff(index) {
        const updatedAdditionalWorkersArray = [...this.state.additionalWorkers];
        updatedAdditionalWorkersArray.splice(index, 1);

        this.setState({
            additionalWorkers: updatedAdditionalWorkersArray
        }, ()=>{
            this.calcTotalQuote();
        });
    }

    /**
    * Remove the outside cost item
    * @param {int} index of item to be removed
    * @return {void}
    */
    handleRemoveOutsideCosts(index) {
        const updatedOutsideCostsArray = [...this.state.outsideCosts];
        updatedOutsideCostsArray.splice(index, 1);

        this.setState({
            outsideCosts: updatedOutsideCostsArray
        }, ()=>{
            this.calcTotalQuote();
            this.calcTotalCostToClient();
        });
    }

    /**
    * Add a new additional staff
    * @return {void}
    */
    handleAddAdditionalStaff() {
        const updatedAdditionalWorkersArray = Object.assign([], this.state.additionalWorkers);
        updatedAdditionalWorkersArray.push({
            role: '',
            rate: 40,
            regular: 0,
            overtime: 0,
            doubletime: 0,
            totalCost: 0
        });
        this.setState({
            additionalWorkers: updatedAdditionalWorkersArray
        });
    }

    /**
    * Add a new outside cost
    * @return {void}
    */
    handleAddOutsideCosts() {
        const updatedOutsideCostsArray = [...this.state.outsideCosts];
        updatedOutsideCostsArray.push({
            expenseId: null,
            amount: 0,
            budgetType: true
        });
        this.setState({
            outsideCosts: updatedOutsideCostsArray
        });
    }

    /**
    * Add a new generic staff
    * @return {void}
    */
    handleAddGenericStaff() {
        const updatedGenericStaffArray = [...this.state.genericStaff];
        updatedGenericStaffArray.push({
            id: null,
            rate: 0,
            regular: 0,
            overtime: 0,
            doubletime: 0,
            totalCost: 0
        });
        this.setState({
            genericStaff: updatedGenericStaffArray
        });
    }

    /**
    * Set the id of the staffpicker selected
    * @param {index} index of staff state array
    * @param {int} staff item id
    * @return {void}
    */

    handleGenericStaffPicked(index, id, rate) {
        //console.log("KKKK");
        const updatedGenericStaffArray = [...this.state.genericStaff];
        //let hours = updatedGenericStaffArray[index].hours;
        updatedGenericStaffArray[index].id = id;
        updatedGenericStaffArray[index].rate = rate;
        //updatedGenericStaffArray[index].totalCost = rate * hours;
        this.setState({
            genericStaff: updatedGenericStaffArray
        }, ()=>{this.calcTotalQuote()});
    }

    /**
    * Set hours on itme with index
    * @param {index} index of staff array
    * @param {value} hours value
    * @return {void}
    */
    handleGenericStaffChange(index, rate, hoursType, hoursCount) {
        // Check if all values are defined
        if (typeof hoursType !== 'undefined' && typeof hoursCount !== 'undefined') {
            hoursCount = parseFloat(hoursCount);

            // Get worker
            const selectedWorker = this.state.genericStaff[index];

            // Prepare values object
            let workerValues = {
                rate: 1,
                regular: 0,
                overtime: 0,
                doubletime: 0,
                totalCost: 0
            };

            // Check if worker exists
            if (typeof selectedWorker !== 'undefined') {
                // Get values
                workerValues.rate = rate;
                workerValues.regular = selectedWorker.regular;
                workerValues.overtime = selectedWorker.overtime;
                workerValues.doubletime = selectedWorker.doubletime;
                workerValues[hoursType] = hoursCount;
            } else {
                // Prepare values
                workerValues.rate = rate;
                workerValues.regular = 0;
                workerValues.overtime = 0;
                workerValues.doubletime = 0;
                workerValues[hoursType] = hoursCount;
            }

            // Calculate total cost
            let multiplieris = 1;
            if (this.state.showEstimateDays === true) {
                multiplieris = 8;
            }

            const estimatedTotalFromRegularHours = workerValues.regular * workerValues.rate * multiplieris;
            const estimatedTotalFromOvertimeHours = workerValues.overtime * workerValues.rate * multiplieris;
            const estimatedTotalFromDoubletimeHours = workerValues.doubletime * workerValues.rate * multiplieris;

            workerValues.totalCost = estimatedTotalFromRegularHours + estimatedTotalFromOvertimeHours + estimatedTotalFromDoubletimeHours;


            const updatedGenericStaffArray = [...this.state.genericStaff];
            updatedGenericStaffArray[index][hoursType] = hoursCount;
            updatedGenericStaffArray[index]['totalCost'] = workerValues.totalCost;

            this.setState({
                genericStaff: updatedGenericStaffArray
            }, ()=>{
                this.calcTotalQuote();
            });
        }
    }

    /**
    * Remove the generic staff item
    * @param {int} index of item to be removed
    * @return {void}
    */
    handleRemoveGenericStaff(index) {
        const updatedGenericStaffArray = [...this.state.genericStaff];
        updatedGenericStaffArray.splice(index, 1);

        this.setState({
            genericStaff: updatedGenericStaffArray
        }, ()=>{
            this.calcTotalQuote();
        });
    }

    // Render
    render() {
        // Check if estimate is no longer a draft
        const isNotDraftEstimate =
            this.props.estimateId &&
            typeof this.state.estimateStatus !== 'undefined' && this.state.estimateStatus !== 'Draft'
                ? true
                : false;

        // Section header elements
        let staffSectionHeaderElements = [];
        if (!isNotDraftEstimate || !this.props.estimateId) {
            staffSectionHeaderElements.push({
                element: (
                    <Toggle
                        onChange={e => this.handleShowingAllWorkersChange(e)}
                        isRight={this.state.showAllWorkers}
                        left={{
                            label: 'Assigned staff only',
                            value: false
                        }}
                        right={{
                            label: 'All available staff',
                            value: true
                        }}
                    />
                )
            });

            staffSectionHeaderElements.push({
                element: (
                    <Input
                        onChange={e => this.handleWorkersFilterByNameChange(e)}
                        label="Filter staff by name..."
                        icon={
                            <IconSearchLoupe
                                width={13}
                                height={13}
                                marginTop={-6}
                            />
                        }
                        color="brown"
                        minWidth={250}
                        maxWidth={250}
                    />
                )
            });
        }

        return (
            <Layout>

                <Section title="Estimate type" noSeparator={true}>
                    <Row alignContent="center" alignItems="center">
                        <Col size={9}>
                            <Select
                                value={this.state.estimateTypeSelected}
                                onChange={this.handleEstimateTypeChange.bind(this)}
                                options={
                                    this.state.estimateTypeOptionsLoading || this.state.estimateTypeOptions.length <= 0
                                        ? [{ value: 1, label: 'Loading...' }]
                                        : this.state.estimateTypeOptions
                                }
                            />
                        </Col>
                        <Col size={3}>
                            <Toggle
                                onChange={e => this.handleEstimatingDaysChange(e)}
                                isRight={this.state.showEstimateDays}
                                left={{
                                    label: 'Hours',
                                    value: false
                                }}
                                right={{
                                    label: 'Days',
                                    value: true
                                }}
                                label='Estimate in'
                            />
                        </Col>
                    </Row>
                    <br />
                    <br />
                </Section>

                {(() => {
                    // Mount ProjectPicker if new, if not, then if defaultProject is given from api
                    if (!this.props.estimateId || this.props.estimateId && this.state.defaultProject) {
                        return (
                            <ProjectPicker
                                ref="projectPicker"
                                noSeparator={true}
                                showVersion={true}
                                levelRequired={4}
                                title="Select spot"
                                defaultToOpenProjects={true}
                                defaultValue={this.state.defaultProject}
                                onChange={this.handleSelectProject}
                                readOnly={isNotDraftEstimate}
                            />
                        );
                    }
                })()}

                <Section
                    className={s.workersSection}
                    title="Staff"
                    headerElements={staffSectionHeaderElements}
                >

                    {(() => {
                        // Set workers table header
                        let workersTableHeader = [
                            { title: 'Full Name', align: 'left' },
                            { title: 'ID', align: 'left' },
                            { title: 'Rate', align: 'right' },
                            { title: this.state.showEstimateDays?'Regular Days':'Regular Hours', align: 'center' },
                            { title: this.state.showEstimateDays?'Overtime Days':'Overtime Hours', align: 'center' },
                            { title: 'Total', align: 'right' }
                        ];

                        if (isNotDraftEstimate === false) {
                            workersTableHeader.push({
                                title: '', align: 'right', width: 22
                            });
                        }

                        // Set workers table columns widths
                        let workersTableColumnsWidth = [
                            '30%',
                            '10%',
                            '15%',
                            '14%',
                            '14%'
                        ];

                        if (!this.state.showEstimateDays) {
                            workersTableHeader.splice(5, 0, { title: 'Double Time Hours', align: 'center' });
                            workersTableColumnsWidth = [
                                '23%',
                                '10%',
                                '14%',
                                '12%',
                                '12%',
                                '12%'
                            ];
                        }


                        if (isNotDraftEstimate === false) {
                            workersTableColumnsWidth.push('9%');
                            workersTableColumnsWidth.push('8%');
                        } else {
                            workersTableColumnsWidth.push('17%');
                        }

                        // Render workers table
                        return (
                            <Table
                                ref="workersTable"
                                header={workersTableHeader}
                                columnsWidths={workersTableColumnsWidth}
                            >
                                {(() => {
                                    if ((!this.props.estimateId && this.state.loadedWorkers.length > 0) ||
                                        (this.props.estimateId && Object.keys(this.state.selectedWorkers).length !== 0)) {
                                        let visibleWorkers;

                                        if (this.state.showAllWorkers) {
                                            visibleWorkers = this.state.visibleWorkers;
                                        } else {
                                            visibleWorkers = this.state.visibleWorkers
                                                .filter(worker => typeof this.state.selectedWorkers[worker.id] !== 'undefined');
                                        }

                                        let workerRows;
                                        if (visibleWorkers.length > 0) {
                                            workerRows = visibleWorkers.map((worker, index) => {
                                                // Prepare values
                                                let estimatedTotal = 0;
                                                const selectedWorker = this.state.selectedWorkers[worker.id];

                                                // Check if worker is selected
                                                if (typeof selectedWorker !== 'undefined') {
                                                    // Get estimated total
                                                    estimatedTotal = selectedWorker.totalCost;
                                                }

                                                // Worker hours
                                                let workerRegularHours = typeof selectedWorker === 'undefined' ? 0 : selectedWorker.regular;
                                                let workerOvertimeHours = typeof selectedWorker === 'undefined' ? 0 : selectedWorker.overtime;
                                                let workerDoubletimeHours = typeof selectedWorker === 'undefined' ? 0 : selectedWorker.doubletime;

                                                // Render
                                                return (
                                                    <TableRow key={worker.id}>

                                                        <TableCell>
                                                            <Paragraph>{worker.name}</Paragraph>
                                                        </TableCell>

                                                        <TableCell>
                                                            <Paragraph>{worker.initials}</Paragraph>
                                                        </TableCell>

                                                        <TableCell align="right">
                                                            <Money value={worker.rate} />
                                                        </TableCell>

                                                        <TableCell align="center">
                                                            <Counter
                                                                onChange={count => this.handleHoursChange(worker.id, worker.rate, 'regular', count)}
                                                                min={0}
                                                                multipleOf={0.25}
                                                                increment={1}
                                                                showPlusMinus={false}
                                                                value={workerRegularHours}
                                                                readOnly={isNotDraftEstimate}
                                                                readOnlyTextAfter={
                                                                    this.state.showEstimateDays?' day':' hour' + (workerRegularHours > 1 ? 's' : '')
                                                                }
                                                            />
                                                        </TableCell>

                                                        <TableCell align="center">
                                                            <Counter
                                                                onChange={count => this.handleHoursChange(worker.id, worker.rate, 'overtime', count)}
                                                                min={0}
                                                                multipleOf={0.25}
                                                                increment={1}
                                                                showPlusMinus={false}
                                                                value={workerOvertimeHours}
                                                                readOnly={isNotDraftEstimate}
                                                                readOnlyTextAfter={
                                                                    this.state.showEstimateDays?' day':' hour' + (workerOvertimeHours > 1 ? 's' : '')
                                                                }
                                                            />
                                                        </TableCell>


                                                        {
                                                            !this.state.showEstimateDays &&
                                                                <TableCell align="center">
                                                                    <Counter
                                                                        onChange={count => this.handleHoursChange(worker.id, worker.rate, 'doubletime', count)}
                                                                        min={0}
                                                                        multipleOf={0.25}
                                                                        increment={1}
                                                                        showPlusMinus={false}
                                                                        value={workerDoubletimeHours}
                                                                        readOnly={isNotDraftEstimate}
                                                                        readOnlyTextAfter={
                                                                            this.state.showEstimateDays?' day':' hour' + (workerDoubletimeHours > 1 ? 's' : '')
                                                                        }
                                                                    />
                                                                </TableCell>
                                                        }

                                                        <TableCell align="right">
                                                            <Money value={estimatedTotal} />
                                                        </TableCell>

                                                        {isNotDraftEstimate === false && (
                                                            <TableCell align="right">
                                                                {(workerRegularHours > 0 || workerOvertimeHours > 0 || workerDoubletimeHours > 0) && (
                                                                    <IconCheckmarkGreen marginLeftAuto={true} width={22} height={22} />
                                                                )}
                                                            </TableCell>
                                                        )}

                                                    </TableRow>
                                                );
                                            });
                                        } else {
                                            workerRows = [
                                                <TableRow key="no-staff-selected">
                                                    <TableCell align="center" colSpan={8}>
                                                        <Paragraph>There is no staff assigned to this estimate yet</Paragraph>
                                                        <br />
                                                    </TableCell>
                                                </TableRow>
                                            ];
                                        }

                                        if ((!isNotDraftEstimate || !this.props.estimateId) && workerRows.length > 0) {
                                            workerRows.push(
                                                <TableRow key="toggle-all-row">
                                                    <TableCell colSpan={3} align="left">
                                                        {this.state.showAllWorkers === false && (
                                                            <Paragraph type="dim">Showing only assigned staff</Paragraph>
                                                        )}
                                                    </TableCell>
                                                    <TableCell colSpan={5} align="right">
                                                        <Button
                                                            onClick={e => this.handleShowingAllWorkersChange(this.state.showAllWorkers ? false : true)}
                                                            float="right"
                                                            label={{
                                                                size: 'small',
                                                                color: 'blue',
                                                                text: this.state.showAllWorkers
                                                                    ? 'Show only assigned staff'
                                                                    : 'Show all staff',
                                                            }}
                                                        />
                                                    </TableCell>
                                                </TableRow>
                                            );
                                        }

                                        return workerRows;
                                    }
                                })()}
                                {(() => {
                                    if (!this.props.estimateId && this.state.visibleWorkers.length === 0
                                        || this.props.estimateId && Object.keys(this.state.selectedWorkers).length === 0) {
                                        return (
                                            <TableRow>
                                                <TableCell align="center" colSpan={8}>
                                                    <Paragraph>
                                                        {
                                                            this.state.isWorkersLoading === true || this.state.isEstimateLoading === true
                                                                ? 'Loading staff...'
                                                                : 'There is no staff matching criteria.'
                                                        }
                                                    </Paragraph>
                                                </TableCell>
                                            </TableRow>
                                        );
                                    }
                                })()}
                            </Table>
                        );
                    })()}

                    <Section title="Additional staff">
                        <AdditionalStaffList
                            info={this.state}
                            estimateId={this.props.estimateId}
                            onHandleAdditionalHoursChange={this.handleAdditionalHoursChange.bind(this)}
                            onHandleAdditionalRoleChange={this.handleAdditionalRoleChange.bind(this)}
                            onHandleAdditionalRateChange={this.handleAdditionalRateChange.bind(this)}
                            onHandleRemoveAdditionalStaff={this.handleRemoveAdditionalStaff.bind(this)}
                            onHandleAddAdditionalStaff={this.handleAddAdditionalStaff.bind(this)}
                        />
                    </Section>

                    <Section title="Outside costs">
                        <OutsideCosts
                            outCostArr={this.state.outsideCosts}
                            onHandleExpensePicked={this.handleExpensePicked.bind(this)}
                            onHandleCreateExpensePicked={this.handleCreateExpensePicked.bind(this)}
                            onHandleOutsideCostsChange={this.handleOutsideCostsChange.bind(this)}
                            onHandleAddOutsideCosts={this.handleAddOutsideCosts.bind(this)}
                            onHandleRemoveOutsideCosts={this.handleRemoveOutsideCosts.bind(this)}
                        />
                    </Section>

                    <Section title="Generic staff">
                        <GenericStaff
                            info={this.state}
                            estimateId={this.props.estimateId}
                            genericStaffArr={this.state.genericStaff}
                            onHandleStaffPicked={this.handleGenericStaffPicked.bind(this)}
                            onHandleStaffChange={this.handleGenericStaffChange.bind(this)}
                            onHandleAddStaff={this.handleAddGenericStaff.bind(this)}
                            onHandleRemoveStaff={this.handleRemoveGenericStaff.bind(this)}
                            excludeIds={this.state.genericStaff.map(c => c.id)}
                        />
                    </Section>

                    {(() => {
                        if (!this.props.estimateId || this.props.estimateId && Object.keys(this.state.selectedWorkers).length !== 0) {
                            return (
                                <Table>
                                    <TableRow>

                                        <TableCell>
                                            <div className={s.estimateSummaryRow}>
                                                <h3>Total Hard Cost</h3>
                                                <Money
                                                    value={this.state.totalQuote.baseValue}
                                                    valueBold={true}
                                                    currency="USD"
                                                />
                                            </div>
                                        </TableCell>

                                        <TableCell align="center">
                                            {isNotDraftEstimate && (
                                                <div className={s.estimateSummaryRow}>
                                                    <h3>Mark Up Factor</h3>
                                                    <Paragraph bold={true}>
                                                        {`${this.state.totalQuote.markup} %`}
                                                    </Paragraph>
                                                </div>
                                            ) || (
                                                <div className={s.estimateSummaryRow + ' ' + s.estimateSummaryRowWithCounter}>
                                                    <Counter
                                                        onChange={e => this.handleMarkupChange(e)}
                                                        multipleOf={0.05}
                                                        increment={10}
                                                        decimals={2}
                                                        showPlusMinus={true}
                                                        value={this.state.totalQuote.markup}
                                                        min={100}
                                                        readOnlyTextAfter=' %'
                                                        readOnly={true}
                                                    />
                                                </div>
                                            )}
                                        </TableCell>

                                        <TableCell align="right">
                                            <div className={s.estimateSummaryRow}>
                                                <h3>Total Quotation</h3>
                                                <Money
                                                    value={this.state.totalQuote.totalValue}
                                                    valueBold={true}
                                                    currency="USD"
                                                />
                                            </div>
                                        </TableCell>

                                    </TableRow>

                                    <TableRow>
                                        <TableCell>
                                            <div className={s.estimateSummaryRow}>
                                                <h3>Total cost (bill to client): = </h3>
                                                <Money
                                                    value={this.state.totalCostToClient.baseValue}
                                                    valueBold={true}
                                                    currency="USD"
                                                />
                                            </div>
                                        </TableCell>
                                        <TableCell align="center">
                                            <div className={s.estimateSummaryRow}>
                                                <Paragraph bold={true}>
                                                    {`${this.state.totalCostToClient.markup} %`}
                                                </Paragraph>
                                            </div>
                                        </TableCell>
                                        <TableCell align="right">
                                            <div className={s.estimateSummaryRow}>
                                                <Money
                                                    value={this.state.totalCostToClient.totalValue}
                                                    valueBold={true}
                                                    currency="USD"
                                                />
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                </Table>
                            );
                        }
                    })()}

                    {(
                        !this.props.estimateId && this.state.isWorkersLoading === true ||
                        this.props.estimateId && Object.keys(this.state.selectedWorkers).length === 0
                    ) && (
                        <LoadingShade background="rgba(247, 247, 247, 0.9)">
                            <LoadingSpinner size={64} color="#5A4D3F" />
                        </LoadingShade>
                    )}

                </Section>

                {(!this.props.estimateId || this.props.estimateId && Object.keys(this.state.selectedWorkers).length !== 0) && (
                    <Section title="Notes">
                        <Row removeGutter={true}>
                            <Col size={12}>
                                {(() => {
                                    if (isNotDraftEstimate) {
                                        return (
                                            <Paragraph>
                                                {this.state.notes.technical ? this.state.notes.technical : 'No technical notes have been provided.'}
                                            </Paragraph>
                                        );
                                    } else {
                                        return (
                                            <TextArea
                                                value={this.state.notes.technical}
                                                onChange={e => this.handleTechnicalDetailsChange(e)}
                                                label="Technical details, visible to the client..."
                                                width={1152}
                                                height={96}
                                            />
                                        );
                                    }
                                })()}
                            </Col>
                        </Row>
                    </Section>
                )}
                {(() => {
                    if ((!this.props.estimateId || this.props.estimateId && Object.keys(this.state.selectedWorkers).length !== 0)) {
                        return (
                            <Section>
                                <Row removeGutter={true}>
                                    <Col size={isNotDraftEstimate ? 12 : 7}>
                                        <Section title="Comments" noSeparator={true}>
                                            <Comments
                                                label="Write your internal note..."
                                                noParentLabel="Save initial draft for internal notes to become available."
                                                parentId={this.state.estimateId}
                                                typeId={API.COMMENT_TYPE.Estimate}
                                            />
                                        </Section>
                                    </Col>
                                    {(!isNotDraftEstimate) && (
                                        <Col size={5} className={s.summarySectionCol}>
                                            <Section title="Summary" noSeparator={true}>
                                                <Row removeGutter={true} className={s.summarySectionRow}>
                                                    <Col size={6}>
                                                        <Toggle
                                                            onChange={e => this.handleEstimateStatusToggle(e)}
                                                            defaultRight={isNotDraftEstimate}
                                                            disabled={isNotDraftEstimate}
                                                            align="left"
                                                            left={{
                                                                label: 'Draft',
                                                                value: 'draft'
                                                            }}
                                                            right={{
                                                                label: 'Final',
                                                                value: 'final'
                                                            }}
                                                        />
                                                    </Col>
                                                    {(!this.props.estimateId || this.props.estimateId && this.state.estimateStatus === 'Draft') && (
                                                        <Col size={6} className={s.submitCol}>
                                                            <Button
                                                                onClick={e => this.handleEstimateSubmission(e)}
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
                                                                    text: this.state.isEstimateUploading
                                                                        ? 'Saving...'
                                                                        : this.state.isFinal ? 'Submit estimate for review' : 'Save estimate\'s draft',
                                                                    size: 'small',
                                                                    color: 'orange',
                                                                    onLeft: true
                                                                }}
                                                                disabled={this.state.isEstimateUploading}
                                                            />
                                                        </Col>
                                                    )}
                                                </Row>

                                                {this.state.isFinal === true && (
                                                    <Row removeGutter={true}>
                                                        <Col size={8}>
                                                            <br />
                                                            <DropdownContainer
                                                                value="Nobody"
                                                                label="Notify and submit to"
                                                                type="twolines"
                                                            >
                                                                <OptionsList
                                                                    value={0}
                                                                    search={{
                                                                        onChange: query => this.handleNotifyPersonSearch(query),
                                                                        label: 'Search person to notify...',
                                                                        searchViaApi: true
                                                                    }}
                                                                />
                                                            </DropdownContainer>
                                                        </Col>
                                                        <Col size={4}></Col>
                                                    </Row>
                                                )}

                                            </Section>
                                        </Col>
                                    )}
                                </Row>
                            </Section>
                        );
                    }
                })()}
            </Layout>
        );
    }
}

function mapStateToProps(state) {
    return {
        header: state.header
    };
}

export default connect(mapStateToProps)(PageEstimateEstimationAndQuoting);
