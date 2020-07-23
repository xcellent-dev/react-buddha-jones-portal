// Libraries
import React from 'react';
import { connect } from 'react-redux';
import { toNumber, merge } from 'lodash';
import { printDateAsFullYear, printDateAsYeardMonthDateTime, printDateAsTimeAgo } from './../../../helpers/date';

// Actions
import * as actions from './../../../actions/ActionTypes';
import history from './../../../core/history';
import * as API from './../../../actions/api';

// Common components
import Layout from './../../../components/Layout/Layout';
import HeaderSection from './../../../components/Layout/HeaderSection';
import Section from './../../../components/Section/Section';
import Row from './../../../components/Section/Row';
import Col from './../../../components/Section/Col';
import Accordion from './../../../components/Section/Accordion';
import Paragraph from './../../../components/Content/Paragraph';
import Button from './../../../components/Button/Button';
import Input from './../../../components/Form/Input';
import Radio from './../../../components/Form/Radio';
import TextArea from './../../../components/Form/TextArea';
import Dropdown from './../../../components/Form/Dropdown';
import Counter from './../../../components/Form/Counter';
import DropdownContainer from './../../../components/Form/DropdownContainer';
import OptionsList from './../../../components/Form/OptionsList';
import Select from './../../../components/Form/Select';
import Table from './../../../components/Table/Table';
import TableRow from './../../../components/Table/TableRow';
import Comments from './../../../components/Buddha/Comments';
import ClientsFilter from './../../../components/Buddha/ClientsFilter';
import PeoplePicker from './../../../components/Buddha/PeoplePicker';
import CampaignPicker from './../../../components/Buddha/CampaignPicker';
import SpotPicker from './../../../components/Buddha/SpotPicker';
import Person from './../../../components/Buddha/Person';
import LoadingSpinner from './../../../components/Loaders/LoadingSpinner';

// Page related components
import ChangesLog from './ChangesLog';
import CreativeExecutive from './CreativeExecutive';
import CampaignManagement from './CampaignManagement';
import Spots from './Spots';

// Styles
import IconLightbulb from './../../../components/Icons/IconLightbulb';
import IconEmail from './../../../components/Icons/IconEmail';
import IconPhone from './../../../components/Icons/IconPhone';
import IconBriefcase from './../../../components/Icons/IconBriefcase';
import IconPlusBlue from './../../../components/Icons/IconPlusBlue';
import IconCheckmarkGreen from './../../../components/Icons/IconCheckmarkGreen';
import IconTickBlue from './../../../components/Icons/IconTickBlue';
import IconArrowLeftYellow from './../../../components/Icons/IconArrowLeftYellow';
import IconArrowRightYellow from './../../../components/Icons/IconArrowRightYellow';
import s from './ProjectBoard.css';

// Page
class PageProjectBoard extends React.Component {
    constructor(props, context) {
        super(props, context);

        this.cr = React.createElement;

        const now = new Date();
        let tomorrow = new Date(now);
        tomorrow.setDate(now.getDate() + 1);

        this.state = {
            loading: true,
            projectCoreEditable: false,
            projectId: typeof props.projectId !== 'undefined' && props.projectId ? toNumber(props.projectId) : null,
            projectName: typeof props.projectName !== 'undefined' && props.projectName ? props.projectName : '',
            customerId: typeof props.clientId !== 'undefined' && props.clientId ? parseInt(props.clientId, 10) : null,
            customerName: typeof props.clientName !== 'undefined' && props.clientName ? props.clientName : '',
            customerCreativeExecutives: [],
            creativeExecutives: [
                {
                    id: 0,
                    name: 'Create new creative executive'
                },
                {
                    id: 1,
                    name: 'Michael Jones',
                    address: '1156 High Street Santa Cruz, CA 95064',
                    email: 'micheal.jones@warnerbros.com',
                    phone: '(323) 469-1743'
                }
            ],
            allVersions: [],
            savingCampaign: false,
            editing: {
                creativeExecutive: {
                    error: false,
                    adding: false,
                    saving: false,
                    campaignId: undefined,
                    id: undefined,
                    name: '',
                    phone: '',
                    email: '',
                    address: ''
                }
            },
            campaigns: [],
            history: [],
            teams: {
                creative: {
                    options: [
                        { value: 1, label: 'John Doe' },
                        { value: 2, label: 'John Smith' },
                        { value: 3, label: 'Adam Smith' },
                        { value: 4, label: 'Joe Smith' },
                        { value: 5, label: 'Jonas Smith' },
                    ],
                    leadProducer: {
                        id: 1,
                        name: 'John Doe'
                    },
                    producer: {
                        id: 2,
                        name: 'John Smith'
                    },
                    associateProducer: {
                        id: 3,
                        name: 'Adam Smith'
                    },
                    creativeManager: {
                        id: 4,
                        name: 'Joe Smith'
                    },
                    creativeCoordinator: {
                        id: 5,
                        name: 'Jonas Smith'
                    }
                },
                editorial: {
                    startDate: new Date('2016-08-02T12:00:00Z'),
                    version1Deadline: new Date('2016-08-14T12:00:00Z'),
                    deliveryDate: new Date('2016-08-22T12:00:00Z'),
                    requestedEditor: {
                        id: 20,
                        name: 'Fred "FG" Gago'
                    },
                    assignedEditor: {
                        id: undefined,
                        name: undefined
                    },
                    notes: ''
                },
                finance: {
                    notes: '',
                    requestedBudget: undefined,
                    assignedbudget: undefined,
                    specWork: ''
                },
                graphics: {
                    requestedArtDirector: {
                        id: 0,
                        name: 'Art director'
                    },
                    assignedArtDirector: {
                        id: undefined,
                        name: undefined
                    },
                    requestedDesigner: {
                        id: 0,
                        name: 'Graphics designer'
                    },
                    assignedDesigner: {
                        id: undefined,
                        name: undefined
                    },
                    notes: ''
                },
                writing: {
                    assignedWriters: [],
                    notes: ''
                },
                music: {
                    assignedMusicians: [],
                    contact: '',
                    notes: '',
                }
            },
            meetings: {
                create: {
                    error: false,
                    adding: false,
                    saving: false,
                    date: tomorrow,
                    creativeCoordinator: {
                        id: null,
                        name: 'Assign coordinator'
                    },
                    notes: ''
                },
                list: [
                    {
                        id: 1,
                        date: new Date('2016-11-03T12:00:00Z'),
                        creativeCoordinator: {
                            id: 1,
                            name: 'John Doe'
                        },
                        notes: 'Creative kick-off meeting'
                    }
                ]
            }
        };

        this.componentIsMounted = true;
    }

    componentDidMount() {
        // Scroll to top
        window.scrollTo(0, 0);

        // Load page header
        this.loadPageHeader();

        // Load versions
        this.fetchAllVersions();

        // Load project details
        this.fetchProjectDetail();

        // Load customer's creative executives
        this.fetchCustomerCreativeExecutives();
    }

    componentWillUnmount() {
        this.componentIsMounted = false;
    }

    loadPageHeader() {
        // Page title
        let pageTitle = null;
        let pageSubTitle = null;
        if (typeof this.props.clientName !== 'undefined' && typeof this.props.projectName !== 'undefined') {
            if (this.state.projectCoreEditable === false) {
                pageTitle = this.props.projectName;
                pageSubTitle = this.props.clientName;
            } else {
                pageTitle = 'Edit project';
            }
        } else {
            pageTitle = 'Define new project';
        }

        // Dispatch header
        this.props.dispatch({
            type: actions.HEADER_SET_ALL,
            payload: {
                title: pageTitle,
                subTitle: pageSubTitle,
                elements: [
                    React.createElement(Button, {
                        onClick: e => this.handleBackToBoardNavigation(e),
                        label: {
                            text: 'Back to projects board',
                            color: 'white',
                            size: 'large',
                            onLeft: false
                        },
                        icon: {
                            element: React.createElement(IconArrowLeftYellow, {
                                width: 15,
                                height: 11,
                                marginTop: -5,
                                marginLeft: -7
                            }),
                            size: 'small',
                            background: 'none-alt'
                        }
                    })
                ]
            }
        });
    }

    fetchAllVersions() {
        API.get(API.VERSION + '?offset=0&length=9999').then((versions) => {
            if (typeof versions !== 'undefined' && versions) {
                const allVersionsMapped = versions.map((version) => {
                    return {
                        value: version.id,
                        label: version.versionName
                    };
                });
                this.setState({
                    allVersions: allVersionsMapped
                });
            }
        }).catch((error) => {
            if (this.componentIsMounted) {
                setTimeout(() => {
                    this.fetchAllVersions();
                }, 1024);
            }
        });
    }

    fetchProjectDetail() {
        this.setState({
            loading: true
        });

        API.get(API.PROJECT + '/' + this.state.projectId)
            .then(response => {
                this.setState({
                    loading: false,
                    projectName: response.projectName,
                    history: response.history.map(h => {
                        return {
                            id: parseInt(h.id, 10),
                            user: h.fullName,
                            date: h.createdAt,
                            text: h.message,
                            image: h.image
                        };
                    }),
                    campaigns: response.campaign.map(c => {
                        return {
                            id: c.campaignId,
                            name: c.campaignName,
                            editable: false,
                            creativeExecutive: undefined,
                            showCreativeExecutiveInfo: false,
                            manager: typeof c.manager !== 'undefined' && c.manager ? c.manager : [],
                            producer: typeof c.producer !== 'undefined' && c.producer ? c.producer : [],
                            spots: c.spot.map(s => {
                                return {
                                    editing: false,
                                    id: parseInt(s.id, 10),
                                    name: s.spotName,
                                    notes: s.notes,
                                    numberOfRevisions: s.revisions,
                                    firstRevisionCost: toNumber(s.firstRevisionCost),
                                    graphicsIncluded: s.graphicsRevisions === 1 ? true : false,
                                    versions: s.version.map(v => {
                                        return {
                                            id: parseInt(v.id, 10),
                                            name: v.versionName
                                        };
                                    }),
                                    justAdded: false
                                };
                            })
                        };
                    })
                });
            }).catch(error => {
                this.setState({
                    loading: false
                });
            });
    }

    fetchCustomerCreativeExecutives() {
        if (this.state.customerId !== null) {
            API.get(API.CUSTOMER + '/' + this.state.customerId).then((response) => {
                if (typeof response.contact !== 'undefined') {
                    this.setState({
                        customerCreativeExecutives: response.contact
                    });
                }
            }).catch((error) => {
                if (this.componentIsMounted) {
                    setTimeout(() => {
                        this.fetchCustomerCreativeExecutives();
                    }, 1024);
                }
            });
        }
    }

    fetchProjectHistory() {
        API.get(API.PROJECT + '/' + this.state.projectId).then((response) => {
            if (typeof response.history !== 'undefined') {
                this.setState({
                    history: response.history.map((h) => {
                        return {
                            id: parseInt(h.id, 10),
                            user: h.fullName,
                            date: h.createdAt,
                            text: h.message,
                            image: h.image
                        };
                    })
                });
            }
        });
    }

    handleBackToBoardNavigation(e) {
        e.preventDefault();
        history.push('/projects');
    }

    handleProjectNameChange(e) {
        if (this.state.projectCoreEditable === true && typeof e !== 'undefined' && typeof e.target !== 'undefined' && typeof e.target.value !== 'undefined') {
            this.setState(
                Object.assign({}, this.state, {
                    projectName: e.target.value
                })
            );
        }
    }

    handleClientChange(e) {
        // TODO
        console.log(e);
    }

    handleCreativeExecutiveInfoToggle(campaignId) {
        if (typeof campaignId !== 'undefined') {
            // Iterate campaigns to find the one
            let campaignIndex;
            for (let i = 0; i < this.state.campaigns.length; i++) {
                const campaign = this.state.campaigns[i];
                if (campaign.id === campaignId) {
                    campaignIndex = i;
                    break;
                }
            }

            // Update state
            if (typeof campaignIndex !== 'undefined') {
                this.setState(
                    Object.assign({}, this.state, {
                        campaigns: this.state.campaigns
                            .slice(0, campaignIndex)
                            .concat([
                                Object.assign({}, this.state.campaigns[campaignIndex], {
                                    showCreativeExecutiveInfo: !this.state.campaigns[campaignIndex].showCreativeExecutiveInfo
                                })
                            ])
                            .concat(this.state.campaigns.slice(campaignIndex + 1))
                    })
                );
            }
        }
    }

    handleCreativeExecutiveInfoEdit(e, campaignId, exec) {
        // Check if exec is defined
        let execEdit = Object.assign({}, this.state.editing.creativeExecutive, {
            error: false,
            saving: false,
            adding: true
        });

        // When exec is defined
        if (typeof exec !== 'undefined') {
            execEdit = Object.assign({}, execEdit, {
                id: exec.id,
                name: exec.name,
                phone: typeof exec.phone !== 'undefined' ? exec.phone : '',
                email: typeof exec.email !== 'undefined' ? exec.email : '',
                address: typeof exec.address !== 'undefined' ? exec.address : ''
            });
        }

        // When campaign id is defined
        if (typeof campaignId !== 'undefined') {
            execEdit = Object.assign({}, execEdit, {
                campaignId: campaignId
            });
        }

        // Update state
        this.setState(
            Object.assign({}, this.state, {
                editing: Object.assign({}, this.state.editing, {
                    creativeExecutive: execEdit
                })
            })
        );
    }

    handleCreativeExecutiveChange(selected, campaignIndex) {
        if (typeof selected !== 'undefined' && typeof selected.value !== 'undefined' && typeof selected.label !== 'undefined') {
            // Values
            let name = '';
            let phone = '';
            let email = '';
            let address = '';

            // Find exec
            if (selected.value !== 0) {
                this.state.creativeExecutives.some((exec => {
                    if (exec.id === selected.value) {
                        name = exec.name;
                        phone = exec.phone;
                        email = exec.email;
                        address = exec.address;
                        return true;
                    }
                }));
            }

            // Determine values
            let execEdit = Object.assign({}, this.state.editing.creativeExecutive, {
                id: selected.value,
                name: name,
                phone: phone,
                email: email,
                address: address
            });

            // Update state
            this.setState(
                Object.assign({}, this.state, {
                    editing: Object.assign({}, this.state.editing, {
                        creativeExecutive: Object.assign({}, this.state.editing.creativeExecutive, execEdit)
                    })
                })
            );
        }
    }

    handleCreativeExecutiveInfoEditChange(e, field) {
        if (typeof e !== 'undefined' && typeof e.target !== 'undefined' && typeof e.target.value !== 'undefined' && typeof field !== 'undefined') {
            this.setState(
                Object.assign({}, this.state, {
                    editing: Object.assign({}, this.state.editing, {
                        creativeExecutive: Object.assign({}, this.state.editing.creativeExecutive, {
                            [field]: e.target.value
                        })
                    })
                })
            );
        }
    }

    handleCreativeExecutiveInfoChangesSave(e, campaignIndex) {
        // Creative exec
        let creativeExec = {
            id: typeof this.state.editing.creativeExecutive.id !== 'undefined' ? this.state.editing.creativeExecutive.id : 0,
            name: this.state.editing.creativeExecutive.name.trim(),
            phone: this.state.editing.creativeExecutive.phone.trim(),
            email: this.state.editing.creativeExecutive.email.trim(),
            address: this.state.editing.creativeExecutive.address.trim()
        };

        // Indicate saving
        this.setState(
            Object.assign({}, this.state, {
                editing: Object.assign({}, this.state.editing, {
                    creativeExecutive: Object.assign({}, this.state.editing.creativeExecutive, {
                        error: false,
                        adding: true,
                        saving: true
                    })
                })
            })
        );

        // Check if name is defined
        if (creativeExec.name !== '') {
            // Simulate API delay
            setTimeout(() => {
                // When new executive needs to be created
                if (creativeExec.id === 0) {
                    // Get id of new creative executive
                    creativeExec = Object.assign({}, creativeExec, {
                        id: this.state.creativeExecutives.length + 1
                    });

                    // Create new executive and assign it to campaign
                    this.setState(
                        Object.assign({}, this.state, {
                            creativeExecutives: this.state.creativeExecutives
                                .concat([creativeExec]),
                            campaigns: typeof campaignIndex !== 'undefined'
                                ? this.state.campaigns
                                    .slice(0, campaignIndex)
                                    .concat([
                                        Object.assign({}, this.state.campaigns[campaignIndex], {
                                            creativeExecutive: creativeExec.id
                                        })
                                    ])
                                    .concat(this.state.campaigns.slice(campaignIndex + 1))
                                : this.state.campaigns,
                            editing: Object.assign({}, this.state.editing, {
                                creativeExecutive: Object.assign({}, this.state.editing.creativeExecutive, {
                                    error: false,
                                    adding: false,
                                    saving: false,
                                    campaignId: undefined,
                                    id: undefined,
                                    name: '',
                                    phone: '',
                                    email: '',
                                    address: ''
                                })
                            })
                        })
                    );

                    // TODO: Save new creative executive to the database
                    // TODO: Save change of creative executive in the campaign
                } else {
                    // Get existing executive's index
                    const creativeExecIndex = this.state.creativeExecutives.some((exec, execIndex) => {
                        if (exec.id === creativeExec.id) {
                            return execIndex;
                        }
                    });

                    // Update executive's info
                    this.setState(
                        Object.assign({}, this.state, {
                            creativeExecutives: this.state.creativeExecutives
                                .slice(0, creativeExecIndex)
                                .concat([
                                    Object.assign({}, this.state.creativeExecutives[creativeExecIndex], creativeExec)
                                ])
                                .concat(this.state.creativeExecutives.slice(creativeExecIndex + 1)),
                            campaigns: typeof campaignIndex !== 'undefined'
                                ? this.state.campaigns
                                    .slice(0, campaignIndex)
                                    .concat([
                                        Object.assign({}, this.state.campaigns[campaignIndex], {
                                            creativeExecutive: creativeExec.id
                                        })
                                    ])
                                    .concat(this.state.campaigns.slice(campaignIndex + 1))
                                : this.state.campaigns,
                            editing: Object.assign({}, this.state.editing, {
                                creativeExecutive: Object.assign({}, this.state.editing.creativeExecutive, {
                                    error: false,
                                    adding: false,
                                    saving: false,
                                    campaignId: undefined,
                                    id: undefined,
                                    name: '',
                                    phone: '',
                                    email: '',
                                    address: ''
                                })
                            })
                        })
                    );

                    // TODO: Update executive's info in the database via API request
                }
            }, 1024);
        } else {
            // Display error
            this.setState(
                Object.assign({}, this.state, {
                    editing: Object.assign({}, this.state.editing, {
                        creativeExecutive: Object.assign({}, this.state.editing.creativeExecutive, {
                            error: true,
                            adding: true,
                            saving: false
                        })
                    })
                })
            );
        }
    }

    handleCampaignPicked(e) {
        if (typeof e !== 'undefined' && typeof e.value !== 'undefined' && typeof e.label !== 'undefined') {
            // Indicate campaign is being saved
            this.setState({
                savingCampaign: true
            });

            // Campaign
            const campaignId = e.value;
            const campaignName = e.label.trim();

            if (typeof e.project === 'undefined' && campaignName) {
                // Assign campaign to project
                API.post(API.ASSIGN_CAMPAIGN_TO_PROJECT, API.makePostData({
                    project_id: this.state.projectId,
                    campaign_id: campaignId
                })).then((response) => {
                    // Add new campaign to the state
                    this.addEmptyCampaignToState(campaignId, campaignName);
                    this.fetchProjectHistory();
                });
            } else if (typeof e.project !== 'undefined') {
                // Campaign already assigned to the project, just add to the state
                this.addEmptyCampaignToState(campaignId, campaignName);
            }
        }
    }

    addEmptyCampaignToState(campaignId, campaignName) {
        this.setState({
            savingCampaign: false,
            campaigns: this.state.campaigns
                .concat([
                    {
                        id: campaignId,
                        name: campaignName,
                        editable: false,
                        creativeExecutive: null,
                        showCreativeExecutiveInfo: false,
                        manager: [],
                        producer: [],
                        spots: []
                    }
                ])
        });
    }

    handleCampaignRemoval(campaignId) {
        if (typeof campaignId !== 'undefined' && campaignId && this.state.projectId) {
            // Indicate campaign is being removed
            this.setCampaignBeingRemovedState(campaignId, true);

            // Call remove API
            API.del(API.CAMPAIGN + '/' + campaignId + '/' + this.state.projectId).then((response) => {
                this.setCampaignRemovedFromState(campaignId);
                this.fetchProjectHistory();
            }).catch((error) => {
                this.setCampaignBeingRemovedState(campaignId, false);
            });
        }
    }

    getCampaignIndexById(campaignId) {
        if (typeof campaignId !== 'undefined') {
            if (this.state.campaigns.length > 0) {
                let campaignOfIdIndex = null;
                this.state.campaigns.some((campaign, campaignIndex) => {
                    if (campaign.id === campaignId) {
                        campaignOfIdIndex = campaignIndex;
                        return true;
                    } else {
                        return false;
                    }
                });
                return campaignOfIdIndex;
            }
        }

        return null;
    }

    setCampaignBeingRemovedState(campaignId, isBeingRemoved) {
        if (typeof campaignId !== 'undefined' && typeof isBeingRemoved !== 'undefined') {
            const campaignIndex = this.getCampaignIndexById(campaignId);
            if (campaignIndex !== null) {
                this.setState({
                    campaigns: this.state.campaigns.slice(0, campaignIndex)
                        .concat(Object.assign({}, this.state.campaigns[campaignIndex], {
                            isBeingRemoved: isBeingRemoved
                        })).concat(this.state.campaigns.slice(campaignIndex + 1))
                });
            }
        }
    }

    setCampaignRemovedFromState(campaignId) {
        if (typeof campaignId !== 'undefined') {
            const campaignIndex = this.getCampaignIndexById(campaignId);
            if (campaignIndex !== null) {
                this.setState({
                    campaigns: this.state.campaigns.slice(0, campaignIndex)
                        .concat(this.state.campaigns.slice(campaignIndex + 1))
                });
            }
        }
    }

    handleSpotSaved(e) {
        if (typeof e !== 'undefined' && typeof e.campaign_id !== 'undefined' && typeof e.spot_id !== 'undefined') {
            // Find campaign
            let campaignIndex = null;
            this.state.campaigns.some((c, cIndex) => {
                if (c.id === e.campaign_id) {
                    campaignIndex = cIndex;
                    return true;
                } else {
                    return false;
                }
            });

            // If campaign was found
            if (campaignIndex !== null) {
                // Create spot object
                let spotObject = {
                    editing: false,
                    id: e.spot_id,
                    name: e.name,
                    notes: e.notes,
                    numberOfRevisions: e.revisions,
                    firstRevisionCost: e.first_revision_cost,
                    graphicsIncluded: e.graphics_revisions === 1 ? true : false,
                    versions: []
                };

                // For new spot
                if (e.new === true) {
                    // Mark spot as just added
                    spotObject = Object.assign({}, spotObject, {
                        justAdded: true
                    });

                    // Update state with new spot
                    this.setState({
                        campaigns: this.state.campaigns.slice(0, campaignIndex)
                            .concat([Object.assign({}, this.state.campaigns[campaignIndex], {
                                spots: this.state.campaigns[campaignIndex].spots
                                    .concat(spotObject)
                            })])
                            .concat(this.state.campaigns.slice(campaignIndex + 1))
                    });
                } else {
                    // Find updated spot
                    let spotIndex = null;
                    this.state.campaigns[campaignIndex].spots.some((s, sIndex) => {
                        if (s.id === e.spot_id) {
                            spotIndex = sIndex;
                            return true;
                        } else {
                            return false;
                        }
                    });

                    // If spot was found
                    if (spotIndex !== null) {
                        // Update versions
                        spotObject = Object.assign({}, spotObject, {
                            versions: this.state.campaigns[campaignIndex].spots[spotIndex].versions
                        });

                        // Update spot already in state
                        this.setState({
                            campaigns: this.state.campaigns.slice(0, campaignIndex)
                                .concat([Object.assign({}, this.state.campaigns[campaignIndex], {
                                    spots: this.state.campaigns[campaignIndex].spots.slice(0, spotIndex)
                                        .concat([merge(this.state.campaigns[campaignIndex].spots[spotIndex], spotObject)])
                                        .concat(this.state.campaigns[campaignIndex].spots.slice(spotIndex + 1))
                                })])
                                .concat(this.state.campaigns.slice(campaignIndex + 1))
                        }, () => {
                            this.fetchProjectHistory();
                        });
                    }
                }
            }
        }
    }

    handleSpotRemoved(e) {
        if (typeof e !== 'undefined' && typeof e.spotId !== 'undefined') {
            // Find campaign
            let campaignIndex = null;
            this.state.campaigns.some((c, cIndex) => {
                if (c.id === e.campaignId) {
                    campaignIndex = cIndex;
                    return true;
                } else {
                    return false;
                }
            });

            // If campaign was found
            if (campaignIndex !== null) {
                // Find updated spot
                let spotIndex = null;
                this.state.campaigns[campaignIndex].spots.some((s, sIndex) => {
                    if (s.id === e.spotId) {
                        spotIndex = sIndex;
                        return true;
                    } else {
                        return false;
                    }
                });

                // If spot was found
                if (spotIndex !== null) {
                    // Remove spot from state
                    this.setState({
                        campaigns: this.state.campaigns.slice(0, campaignIndex)
                            .concat([Object.assign({}, this.state.campaigns[campaignIndex], {
                                spots: this.state.campaigns[campaignIndex].spots.slice(0, spotIndex)
                                    .concat(this.state.campaigns[campaignIndex].spots.slice(spotIndex + 1))
                            })])
                            .concat(this.state.campaigns.slice(campaignIndex + 1))
                    }, () => {
                        this.fetchProjectHistory();
                    });
                }
            }
        }
    }

    handleSpotVersionAdded(e) {
        if (typeof e !== 'undefined' && typeof e.version !== 'undefined') {
            // Find campaign
            let campaignIndex = null;
            this.state.campaigns.some((c, cIndex) => {
                if (c.id === e.campaignId) {
                    campaignIndex = cIndex;
                    return true;
                } else {
                    return false;
                }
            });

            // If campaign was found
            if (campaignIndex !== null) {
                // Find updated spot
                let spotIndex = null;
                this.state.campaigns[campaignIndex].spots.some((s, sIndex) => {
                    if (s.id === e.spotId) {
                        spotIndex = sIndex;
                        return true;
                    } else {
                        return false;
                    }
                });

                // If spot was found
                if (spotIndex !== null) {
                    // Update state with new version
                    this.setState({
                        campaigns: this.state.campaigns.slice(0, campaignIndex)
                            .concat([Object.assign({}, this.state.campaigns[campaignIndex], {
                                spots: this.state.campaigns[campaignIndex].spots.slice(0, spotIndex)
                                    .concat([Object.assign({}, this.state.campaigns[campaignIndex].spots[spotIndex], {
                                        versions: this.state.campaigns[campaignIndex].spots[spotIndex].versions
                                            .concat([e.version])
                                    })])
                                    .concat(this.state.campaigns[campaignIndex].spots.slice(spotIndex + 1))
                            })])
                            .concat(this.state.campaigns.slice(campaignIndex + 1))
                    }, () => {
                        this.fetchProjectHistory();
                    });
                }
            }
        }
    }

    handleSpotVersionRemoved(e) {
        if (typeof e !== 'undefined' && typeof e.versionId !== 'undefined') {
            // Find campaign
            let campaignIndex = null;
            this.state.campaigns.some((c, cIndex) => {
                if (c.id === e.campaignId) {
                    campaignIndex = cIndex;
                    return true;
                } else {
                    return false;
                }
            });

            // If campaign was found
            if (campaignIndex !== null) {
                // Find spot from which version was removed
                let spotIndex = null;
                this.state.campaigns[campaignIndex].spots.some((s, sIndex) => {
                    if (s.id === e.spotId) {
                        spotIndex = sIndex;
                        return true;
                    } else {
                        return false;
                    }
                });

                // If spot was found
                if (spotIndex !== null) {
                    // Find version to be removed
                    let versionIndex = null;
                    this.state.campaigns[campaignIndex].spots[spotIndex].versions.some((v, vIndex) => {
                        if (v.id === e.versionId) {
                            versionIndex = vIndex;
                            return true;
                        } else {
                            return false;
                        }
                    });

                    // If version was found
                    if (versionIndex !== null) {
                        this.setState({
                            campaigns: this.state.campaigns.slice(0, campaignIndex)
                                .concat([Object.assign({}, this.state.campaigns[campaignIndex], {
                                    spots: this.state.campaigns[campaignIndex].spots.slice(0, spotIndex)
                                        .concat([Object.assign({}, this.state.campaigns[campaignIndex].spots[spotIndex], {
                                            versions: this.state.campaigns[campaignIndex].spots[spotIndex].versions.slice(0, versionIndex)
                                                .concat(this.state.campaigns[campaignIndex].spots[spotIndex].versions.slice(versionIndex + 1))
                                        })])
                                        .concat(this.state.campaigns[campaignIndex].spots.slice(spotIndex + 1))
                                })])
                                .concat(this.state.campaigns.slice(campaignIndex + 1))
                        }, () => {
                            this.fetchProjectHistory();
                        });
                    }
                }
            }
        }
    }

    handleManagementUserAdded(e) {
        if (typeof e !== 'undefined' && typeof e.campaignId !== 'undefined' && typeof e.type !== 'undefined' && typeof e.value.id !== 'undefined') {
            // Find campaign
            let campaignIndex = null;
            this.state.campaigns.some((c, cIndex) => {
                if (c.id === e.campaignId) {
                    campaignIndex = cIndex;
                    return true;
                } else {
                    return false;
                }
            });

            // If campaign was found
            if (campaignIndex !== null) {
                // Update state
                this.setState({
                    campaigns: this.state.campaigns.slice(0, campaignIndex)
                        .concat([Object.assign({}, this.state.campaigns[campaignIndex], {
                            [e.type]: [{
                                id: e.value.id,
                                image: e.value.image,
                                fullName: e.value.fullname
                            }].concat(this.state.campaigns[campaignIndex][e.type])
                        })])
                        .concat(this.state.campaigns.slice(campaignIndex + 1))
                });
            }
        }
    }

    handleManagementUserRemoved(e) {
        if (typeof e !== 'undefined' && typeof e.campaignId !== 'undefined' && typeof e.type !== 'undefined' && typeof e.userId !== 'undefined') {
            // Find campaign
            let campaignIndex = null;
            this.state.campaigns.some((c, cIndex) => {
                if (c.id === e.campaignId) {
                    campaignIndex = cIndex;
                    return true;
                } else {
                    return false;
                }
            });

            // If campaign was found
            if (campaignIndex !== null) {
                // Check if there is one or more users
                if (this.state.campaigns[campaignIndex][e.type].length > 1) {
                    // Find user
                    let userIndex = null;
                    this.state.campaigns[campaignIndex][e.type].some((u, uIndex) => {
                        if (u.id === e.userId) {
                            userIndex = uIndex;
                            return true;
                        } else {
                            return false;
                        }
                    });

                    // If user was found
                    if (userIndex !== null) {
                        this.setState({
                            campaigns: this.state.campaigns.slice(0, campaignIndex)
                                .concat([Object.assign({}, this.state.campaigns[campaignIndex], {
                                    [e.type]: this.state.campaigns[campaignIndex][e.type].slice(0, userIndex)
                                        .concat(this.state.campaigns[campaignIndex][e.type].slice(userIndex + 1))
                                })])
                                .concat(this.state.campaigns.slice(campaignIndex + 1))
                        });
                    }
                } else {
                    this.setState({
                        campaigns: this.state.campaigns.slice(0, campaignIndex)
                            .concat([Object.assign({}, this.state.campaigns[campaignIndex], {
                                [e.type]: []
                            })])
                            .concat(this.state.campaigns.slice(campaignIndex + 1))
                    });
                }
            }
        }
    }

    handleCreativeTeamChange(e, member) {
        if (typeof e !== 'undefined' && typeof e.value !== 'undefined' && typeof member !== 'undefined') {
            this.setState(
                Object.assign({}, this.state, {
                    teams: Object.assign({}, this.state.teams, {
                        creative: Object.assign({}, this.state.teams.creative, {
                            [member]: Object.assign({}, this.state.teams.creative[member], {
                                id: e.value,
                                name: e.label
                            })
                        })
                    })
                })
            );
        }
    }

    handleEditorialRequesteEditorChange(selected) {
        if (typeof selected !== 'undefined' && typeof selected.value !== 'undefined' && typeof selected.label !== 'undefined') {
            this.setState(
                Object.assign({}, this.state, {
                    teams: Object.assign({}, this.state.teams, {
                        editorial: Object.assign({}, this.state.teams.editorial, {
                            requestedEditor: Object.assign({}, this.state.teams.editorial.requestedEditor, {
                                id: selected.value,
                                name: selected.label
                            })
                        })
                    })
                })
            );
        }
    }

    handleMeetingCreate(e) {
        this.setState(
            Object.assign({}, this.state, {
                meetings: Object.assign({}, this.state.meetings, {
                    create: Object.assign({}, this.state.meetings.create, {
                        error: false,
                        adding: !this.state.meetings.create.adding,
                        saving: false
                    })
                })
            })
        );
    }

    handleMeetingCoordinatorChange(selected) {
        if (typeof selected !== 'undefined' && typeof selected.value !== 'undefined' && typeof selected.label !== 'undefined') {
            this.setState(
                Object.assign({}, this.state, {
                    meetings: Object.assign({}, this.state.meetings, {
                        create: Object.assign({}, this.state.meetings.create, {
                            creativeCoordinator: Object.assign({}, this.state.meetings.create.creativeCoordinator, {
                                id: selected.value,
                                name: selected.label
                            })
                        })
                    })
                })
            );
        }
    }

    handleMeetingDateChange(e) {
        if (typeof e !== 'undefined' && typeof e.target !== 'undefined' && typeof e.target.value !== 'undefined') {
            // TODO: Date picker value change
        }
    }

    handleMeetingNotesChange(e) {
        if (typeof e !== 'undefined' && typeof e.target !== 'undefined' && typeof e.target.value !== 'undefined') {
            this.setState(
                Object.assign({}, this.state, {
                    meetings: Object.assign({}, this.state.meetings, {
                        create: Object.assign({}, this.state.meetings.create, {
                            notes: e.target.value
                        })
                    })
                })
            );
        }
    }

    handleMeetingSave(e) {
        // Indicate saving to user
        this.setState(
            Object.assign({}, this.state, {
                meetings: Object.assign({}, this.state.meetings, {
                    create: Object.assign({}, this.state.meetings.create, {
                        adding: true,
                        error: false,
                        saving: true
                    })
                })
            })
        );

        // Data
        const coordinator = this.state.meetings.create.creativeCoordinator;
        const date = this.state.meetings.create.date;
        const notes = this.state.meetings.create.notes;

        // TODO: Remove - only temporary date selector
        const now = new Date();
        let tomorrow = new Date(now);
        tomorrow.setDate(now.getDate() + 1);

        // Check if all data required is provided
        if (typeof coordinator.id !== 'undefined' && coordinator.id !== null && coordinator.id !== '' && date !== '') {
            // Simulate API delay
            setTimeout(() => {
                // New meeting id
                const meetingId = this.state.meetings.list.length + 1;

                // Create new meeting
                this.setState(
                    Object.assign({}, this.state, {
                        meetings: Object.assign({}, this.state.meetings, {
                            create: Object.assign({}, this.state.meetings.create, {
                                error: false,
                                adding: false,
                                saving: false,
                                date: tomorrow,
                                creativeCoordinator: Object.assign({}, this.state.meetings.create.creativeCoordinator, {
                                    id: null,
                                    name: 'Assign coordinator'
                                }),
                                notes: ''
                            }),
                            list: [{
                                id: meetingId,
                                creativeCoordinator: {
                                    id: coordinator.id,
                                    name: coordinator.name
                                },
                                date: tomorrow,
                                notes: notes
                            }].concat(this.state.meetings.list)
                        })
                    })
                );
            }, 1024);
        } else {
            // Display error
            this.setState(
                Object.assign({}, this.state, {
                    meetings: Object.assign({}, this.state.meetings, {
                        create: Object.assign({}, this.state.meetings.create, {
                            adding: true,
                            error: true,
                            saving: false
                        })
                    })
                })
            );
        }
    }

    render() {
        if (this.state.loading === true) {
            return this.renderLoader();
        } else {
            return this.renderProject();
        }
    }

    renderLoader() {
        return (
            <Layout>

                <Row justifyContent="center">
                    <Col width={64}>
                        <br /><br />
                        <LoadingSpinner size={64} />
                    </Col>
                </Row>

            </Layout>
        );
    }

    renderProject() {
        // Render
        return (
            <Layout>

                {this.state.projectCoreEditable && (
                    <HeaderSection marginBottom={true}>
                        <Row removeGutter={true}>
                            <Col size={8}>
                                <Input
                                    className={s.projectName}
                                    onChange={e => this.handleProjectNameChange(e)}
                                    value={this.state.projectName}
                                    label="Project name"
                                    color="blueFill"
                                    width={1152}
                                />
                            </Col>
                            <Col size={4}>
                                <ClientsFilter
                                    onChange={e => this.handleClientChange(e)}
                                />
                            </Col>
                        </Row>
                    </HeaderSection>
                )}

                <ChangesLog history={this.state.history} />

                <Section noSeparator={true} title="Project's campaigns">
                    {(() => {
                        // Columns
                        let campaignsColumnOne = [];
                        let campaignsColumnTwo = [];

                        // Iterate campaigns
                        let campaignCounter = 1;
                        this.state.campaigns.map((campaign, campaignIndex) => {
                            // Creative executive
                            let creativeExec = null;
                            if (typeof campaign.creativeExecutive !== 'undefined' && campaign.creativeExecutive !== null) {
                                if (this.state.creativeExecutives.length > 0) {
                                    for (let i = 0; i < this.state.creativeExecutives.length; i++) {
                                        const thisExec = this.state.creativeExecutives[i];
                                        if (thisExec.id === campaign.creativeExecutive) {
                                            creativeExec = thisExec;
                                            break;
                                        }
                                    }
                                }
                            }

                            // Check if campaign has creative exec assigned
                            let hasCreativeExecAssigned = false;
                            if (typeof campaign.creativeExecutive !== 'undefined' && campaign.creativeExecutive !== null) {
                                hasCreativeExecAssigned = true;
                            }

                            // Check if campaign has spots assigned
                            let hasSpotsAssigned = false;
                            if (typeof campaign.spots !== 'undefined' && campaign.spots && campaign.spots.length > 0) {
                                hasSpotsAssigned = true;
                            }

                            // Prepare campaign's content
                            let campaignContent =
                                <div className={s.campaign} key={campaign.id}>

                                    <Row className={s.campaignName} removeMargins={true}>
                                        <Col>
                                            <h2>{campaign.name}</h2>
                                        </Col>
                                        {(hasCreativeExecAssigned === false && hasSpotsAssigned === false) && (
                                            <Col>
                                                <Button
                                                    className={s.removeCampaignButton}
                                                    onClick={
                                                        campaign.isBeingRemoved
                                                            ? e => e.preventDefault()
                                                            : e => this.handleCampaignRemoval(campaign.id)
                                                    }
                                                    float="right"
                                                    label={{
                                                        text: campaign.isBeingRemoved ? 'Removing...' : 'Remove',
                                                        color: 'orange',
                                                        size: 'small'
                                                    }}
                                                />
                                            </Col>
                                        )}
                                    </Row>

                                    <CreativeExecutive
                                        allExecutives={this.state.customerCreativeExecutives}
                                        executiveId={typeof campaign.firstPointOfContactId !== 'undefined' ? campaign.firstPointOfContactId : null}
                                    />

                                    <CampaignManagement
                                        onUserPicked={e => this.handleManagementUserAdded(e)}
                                        onUserRemoved={e => this.handleManagementUserRemoved(e)}
                                        projectId={this.state.projectId}
                                        campaignId={campaign.id}
                                        type="producer"
                                        title="Producers"
                                        titleEmpty="No producers assigned"
                                        users={campaign.producer}
                                    />

                                    <CampaignManagement
                                        onUserPicked={e => this.handleManagementUserAdded(e)}
                                        onUserRemoved={e => this.handleManagementUserRemoved(e)}
                                        projectId={this.state.projectId}
                                        campaignId={campaign.id}
                                        type="manager"
                                        title="Managers"
                                        titleEmpty="No managers assigned"
                                        users={campaign.manager}
                                    />

                                    <Spots
                                        onSpotSaved={e => this.handleSpotSaved(e)}
                                        onSpotRemoved={e => this.handleSpotRemoved(e)}
                                        onVersionAddedToSpot={e => this.handleSpotVersionAdded(e)}
                                        onVersionRemovedFromSpot={e => this.handleSpotVersionRemoved(e)}
                                        projectId={this.state.projectId}
                                        campaignId={campaign.id}
                                        spots={campaign.spots}
                                        allVersions={this.state.allVersions}
                                    />

                                </div>;

                            // Append to appropriate column
                            if (campaignCounter % 2 > 0) {
                                campaignsColumnOne.push(campaignContent);
                            } else {
                                campaignsColumnTwo.push(campaignContent);
                            }

                            // Iterate
                            campaignCounter++;
                        });

                        // Add new campaign fields or add campaign button
                        const newCampaignContent = (this.state.savingCampaign)
                            ? <Paragraph type="blue">Saving new campaign...</Paragraph>
                            : <CampaignPicker
                                ref="campaignsPicker"
                                align="left"
                                label="Add new campaign"
                                projectId={this.state.projectId}
                                onNewCreated={(e) => this.handleCampaignPicked(e)}
                                onChange={(e) => this.handleCampaignPicked(e)}
                                excludeIds={this.state.campaigns.map(c => c.id)}
                            />;

                        const newCampaign =
                            <div className={s.campaign + ' ' + s.newCampaignFields} key={'new-campaign-fields-' + campaignCounter}>
                                <Row removeMargins={true}>
                                    <Col>
                                        <div className={s.newCampaignBox}>
                                            {newCampaignContent}
                                        </div>
                                    </Col>
                                </Row>
                            </div>
                        ;

                        // Add new campaign to render
                        if (campaignCounter % 2 > 0) {
                            campaignsColumnOne.push(newCampaign);
                        } else {
                            campaignsColumnTwo.push(newCampaign);
                        }
                        campaignCounter++;

                        // Render
                        return (
                            <Row className={s.campaigns}>
                                <Col size={6}>
                                    {campaignsColumnOne}
                                </Col>
                                <Col size={6}>
                                    {campaignsColumnTwo}
                                </Col>
                            </Row>
                        );
                    })()}
                </Section>

                {/*
                <Section>
                    <Row removeGutter={true}>
                        <Col size={8}>
                            <Section title="Teams" noSeparator={true}>
                                <Accordion
                                    sections={[
                                        {
                                            title: 'Creative team',
                                            content:
                                                <Row doWrap={true}>

                                                    <Col size={6}>
                                                        <Dropdown
                                                            onChange={e => this.handleCreativeTeamChange(e, 'leadProducer')}
                                                            label="Lead producer"
                                                            type="twolines"
                                                            selected={{
                                                                value: this.state.teams.creative.leadProducer.id,
                                                                label: this.state.teams.creative.leadProducer.name
                                                            }}
                                                            options={this.state.teams.creative.options}
                                                        />
                                                        <br />
                                                    </Col>
                                                    <Col size={6}>
                                                        <Dropdown
                                                            onChange={e => this.handleCreativeTeamChange(e, 'producer')}
                                                            label="Producer"
                                                            type="twolines"
                                                            selected={{
                                                                value: this.state.teams.creative.producer.id,
                                                                label: this.state.teams.creative.producer.name
                                                            }}
                                                            options={this.state.teams.creative.options}
                                                        />
                                                        <br />
                                                    </Col>

                                                    <Col size={6}>
                                                        <Dropdown
                                                            onChange={e => this.handleCreativeTeamChange(e, 'associateProducer')}
                                                            label="Associate producer"
                                                            type="twolines"
                                                            selected={{
                                                                value: this.state.teams.creative.associateProducer.id,
                                                                label: this.state.teams.creative.associateProducer.name
                                                            }}
                                                            options={this.state.teams.creative.options}
                                                        />
                                                        <br />
                                                    </Col>
                                                    <Col size={6}>
                                                        <Dropdown
                                                            onChange={e => this.handleCreativeTeamChange(e, 'creativeManager')}
                                                            label="Creative manager"
                                                            type="twolines"
                                                            selected={{
                                                                value: this.state.teams.creative.creativeManager.id,
                                                                label: this.state.teams.creative.creativeManager.name
                                                            }}
                                                            options={this.state.teams.creative.options}
                                                        />
                                                        <br />
                                                    </Col>

                                                    <Col size={6}>
                                                        <Dropdown
                                                            onChange={e => this.handleCreativeTeamChange(e, 'creativeCoordinator')}
                                                            label="Creative coordinator"
                                                            type="twolines"
                                                            selected={{
                                                                value: this.state.teams.creative.creativeCoordinator.id,
                                                                label: this.state.teams.creative.creativeCoordinator.name
                                                            }}
                                                            options={this.state.teams.creative.options}
                                                        />
                                                    </Col>
                                                    <Col size={6}>
                                                    </Col>

                                                </Row>
                                        },
                                        {
                                            title: 'Editorial manager',
                                            content:
                                                <Row doWrap={true}>

                                                    <Col size={6}>
                                                        <Input
                                                            width={768}
                                                            label="Start date"
                                                            value={printDateAsFullYear(this.state.teams.editorial.startDate)}
                                                        />
                                                        <br />
                                                    </Col>
                                                    <Col size={6}>
                                                        <Input
                                                            width={768}
                                                            label="First version deadline"
                                                            value={printDateAsFullYear(this.state.teams.editorial.version1Deadline)}
                                                        />
                                                        <br />
                                                    </Col>

                                                    <Col size={6}>
                                                        <Input
                                                            width={768}
                                                            label="Delivery date"
                                                            value={printDateAsFullYear(this.state.teams.editorial.deliveryDate)}
                                                        />
                                                        <br />
                                                    </Col>
                                                    <Col size={6}>
                                                        <Dropdown
                                                            onChange={e => this.handleEditorialRequesteEditorChange(e)}
                                                            label="Requested editor"
                                                            type="twolines"
                                                            search={{
                                                                label: 'Search editor name or initials...',
                                                                searchViaApi: false
                                                            }}
                                                            options={this.state.editors}
                                                            selected={{
                                                                value: this.state.teams.editorial.requestedEditor.id,
                                                                label: this.state.teams.editorial.requestedEditor.name,
                                                                truncuateLabelTo: 64
                                                            }}
                                                        />
                                                        <br />
                                                    </Col>

                                                    <Col size={12}>
                                                        <TextArea
                                                            width={768}
                                                            height={96}
                                                            label="Additional notes"
                                                            value={this.state.teams.editorial.notes}
                                                        />
                                                    </Col>

                                                </Row>
                                        },
                                        {
                                            title: 'Finance team',
                                            content:
                                                <Row doWrap={true}>

                                                    <Col size={12}>
                                                        <TextArea
                                                            width={768}
                                                            height={96}
                                                            label="Billing / client notes"
                                                            value={this.state.teams.finance.notes}
                                                        />
                                                        <br />
                                                    </Col>

                                                    <Col size={6}>
                                                        <Input
                                                            width={768}
                                                            value={this.state.teams.finance.requestedBudget}
                                                            label="Requested budget"
                                                        />
                                                        <br />
                                                    </Col>
                                                    <Col size={6}>
                                                        <Input
                                                            width={768}
                                                            value={this.state.teams.finance.assignedbudget}
                                                            label="Assigned budget"
                                                            readOnly={true}
                                                        />
                                                        <br />
                                                    </Col>

                                                    <Col size={12}>
                                                        <TextArea
                                                            width={768}
                                                            height={96}
                                                            label="Spec work"
                                                            value={this.state.teams.finance.specWork}
                                                        />
                                                    </Col>

                                                </Row>
                                        },
                                        {
                                            title: 'Graphics team',
                                            content:
                                                <Row doWrap={true}>
                                                    <Col size={12}>
                                                        <PeoplePicker
                                                            type="Editor"
                                                            label="Select Editors"
                                                        />
                                                    </Col>
                                                    <Col size={12}>
                                                        <PeoplePicker
                                                            label="Requested art director"
                                                            selectMultiple={false}
                                                            type="editors"
                                                        />
                                                        <br />
                                                    </Col>

                                                    <Col size={12}>
                                                        <PeoplePicker
                                                            label="Assigned art director"
                                                            selectMultiple={false}
                                                            type="editors"
                                                        />
                                                        <br />
                                                    </Col>

                                                    <Col size={12}>
                                                        <PeoplePicker
                                                            label="Requested graphic designers"
                                                            selectMultiple={true}
                                                            type="editors"
                                                        />
                                                        <br />
                                                    </Col>

                                                    <Col size={12}>
                                                        <PeoplePicker
                                                            label="Assigned graphic designers"
                                                            selectMultiple={true}
                                                            type="editors"
                                                        />
                                                        <br />
                                                    </Col>

                                                </Row>
                                        },
                                        {
                                            title: 'Writing team',
                                            content:
                                                <Row doWrap={true}>

                                                    <Col size={12}>
                                                        <TextArea
                                                            width={768}
                                                            height={96}
                                                            label="Notes"
                                                            value={this.state.teams.writing.notes}
                                                        />
                                                        <br />
                                                    </Col>

                                                    <Col size={12}>
                                                        <PeoplePicker
                                                            label="Assigned writers"
                                                            selectMultiple={true}
                                                            type="editors"
                                                        />
                                                    </Col>

                                                </Row>
                                        },
                                        {
                                            title: 'Music team',
                                            content:
                                                <Row doWrap={true}>

                                                    <Col size={12}>
                                                        <Input
                                                            width={768}
                                                            label="Music contact"
                                                            value={this.state.teams.music.contact}
                                                        />
                                                        <br />
                                                    </Col>

                                                    <Col size={12}>
                                                        <TextArea
                                                            label="Notes"
                                                            value={this.state.teams.music.notes}
                                                        />
                                                        <br />
                                                    </Col>

                                                    <Col size={12}>
                                                        <PeoplePicker
                                                            label="Assigned musicians"
                                                            selectMultiple={true}
                                                            type="editors"
                                                        />
                                                    </Col>

                                                </Row>
                                        }
                                    ]}
                                    expandedByDefault={true}
                                    onlySingleExpanded={true}
                                />
                            </Section>
                        </Col>
                        <Col size={4}>
                            <Section title="Schedule meeting" noSeparator={true}>
                                {(() => {
                                    if (this.state.meetings.create.adding === true) {
                                        // Save meeting button
                                        let saveMeetingButton = {
                                            label: 'Schedule a meeting',
                                            color: 'blue'
                                        };
                                        if (this.state.meetings.create.saving === true) {
                                            saveMeetingButton = {
                                                label: 'Saving the meeting',
                                                color: 'black'
                                            };
                                        }
                                        if (this.state.meetings.create.error === true) {
                                            saveMeetingButton = {
                                                label: 'Date, time and coordinator are required',
                                                color: 'orange'
                                            };
                                        }

                                        // Render
                                        return (
                                            <div>
                                                <Dropdown
                                                    onChange={e => this.handleMeetingCoordinatorChange(e)}
                                                    label="Coordinator"
                                                    options={this.state.teams.creative.options}
                                                    selected={{
                                                        value: this.state.meetings.create.creativeCoordinator.id,
                                                        label: this.state.meetings.create.creativeCoordinator.name
                                                    }}
                                                />
                                                <br />
                                                <Input
                                                    width={512}
                                                    onChange={e => this.handleMeetingDateChange(e)}
                                                    value={printDateAsYeardMonthDateTime(this.state.meetings.create.date, true)}
                                                    label="Meeting date and time"
                                                />
                                                <br />
                                                <TextArea
                                                    width={512}
                                                    height={96}
                                                    onChange={e => this.handleMeetingNotesChange(e)}
                                                    value={this.state.meetings.create.notes}
                                                    label="Meeting details and notes..."
                                                />
                                                <br />
                                                <Button
                                                    onClick={e => this.handleMeetingSave(e)}
                                                    float="right"
                                                    label={{
                                                        text: saveMeetingButton.label,
                                                        color: saveMeetingButton.color,
                                                        size: 'small',
                                                        onLeft: true
                                                    }}
                                                    icon={{
                                                        element:
                                                            <IconCheckmarkGreen
                                                                width={24}
                                                                marginLeft={-12}
                                                                height={24}
                                                                marginTop={-12}
                                                            />,
                                                        size: 'small',
                                                        background: 'none'
                                                    }}
                                                />
                                                <br style={{ clear: 'both' }} />
                                            </div>
                                        );
                                    }
                                })()}
                                <Button
                                    className={s.meetingCreateButton}
                                    onClick={e => this.handleMeetingCreate(e)}
                                    tooltip={{
                                        text: this.state.meetings.create.adding === true
                                            ? 'Cancel defining new meeting'
                                            : 'Define new meeting',
                                        on: 'top'
                                    }}
                                    icon={{
                                        element:
                                            <IconPlusBlue
                                                width={12}
                                                marginLeft={-6}
                                                height={12}
                                                marginTop={-6}
                                            />,
                                        size: 'small',
                                        background: 'white'
                                    }}
                                />
                            </Section>
                            */}

                            {/*
                            <Section title="Meetings">
                                {(() => {
                                    if (this.state.meetings.list.length > 0) {
                                        return (
                                            <div className={s.meetingsList}>
                                                {this.state.meetings.list.map((meeting, meetingIndex) => {
                                                    return (
                                                        <div key={meeting.id}>
                                                            <Row className={s.meetingInfo} removeGutter={true} doWrap={true}>
                                                                <Col size={5}>
                                                                    <p>
                                                                        <span>Coordinator:</span>
                                                                        <br />
                                                                        <strong>{meeting.creativeCoordinator.name}</strong>
                                                                    </p>
                                                                </Col>
                                                                <Col size={7}>
                                                                    <p>
                                                                        <span>Date:</span>
                                                                        <br />
                                                                        <strong>{printDateAsYeardMonthDateTime(meeting.date)}</strong>
                                                                    </p>
                                                                </Col>
                                                            </Row>
                                                            {(() => {
                                                                if (meeting.notes !== null && meeting.notes !== '') {
                                                                    return (
                                                                        <p className={s.meetingNotes}>
                                                                            <span>Notes:</span>
                                                                            <br />
                                                                            <strong>{meeting.notes}</strong>
                                                                        </p>
                                                                    );
                                                                }
                                                            })()}
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        );
                                    } else {
                                        return (
                                            <p className={s.noMeetings}>No meetings have been scheduled for the project.</p>
                                        );
                                    }
                                })()}
                            </Section>

                        </Col>
                    </Row>
                </Section>
                */}

                {this.state.projectId && (
                    <Section title="Notes">
                        <Comments
                            label="Notes regarding requested work..."
                            noCommentsLabel="No notes have been shared yet."
                            parentId={this.state.projectId}
                            typeId={3}
                        />
                    </Section>
                )}

            </Layout>
        );
    }
}

function mapStateToProps(state) {
    return {
        header: state.header,
        notifications: state.notifications
    };
}

export default connect(mapStateToProps)(PageProjectBoard);
