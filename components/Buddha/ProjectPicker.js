import React, { PropTypes } from 'react';
import * as API from './../../actions/api';
import { debounce, isEqual } from 'lodash';
import s from './ProjectPicker.css';
import Row from './../Section/Row';
import Col from './../Section/Col';
import Section from './../Section/Section';
import Input from './../Form/Input';
import Button from './../Button/Button';
import Paragraph from './../Content/Paragraph';
import Pagination from './../Pagination/Pagination';
import LoadingShade from './../Loaders/LoadingShade';
import LoadingSpinner from './../Loaders/LoadingSpinner';
import IconSearchLoupe from './../../components/Icons/IconSearchLoupe';
import IconClose from './../../components/Icons/IconClose';
import CreateProjectPicker from './../../components/Buddha/CreateProjectPicker';
import CreateCampaignPicker from './../../components/Buddha/CreateCampaignPicker';
import CreateSpotPicker from './../../components/Buddha/CreateSpotPicker';
import CreateVersionPicker from './../../components/Buddha/CreateVersionPicker';

const PICKER_PER_PAGE = 16;

const propTypes = {
    onChange: React.PropTypes.func,
    noSeparator: React.PropTypes.bool,
    forceClear: PropTypes.number,
    showProject: PropTypes.bool,
    showCampaign: PropTypes.bool,
    showSpot: PropTypes.bool,
    showVersion: PropTypes.bool,
    defaultToOpenProjects: PropTypes.bool,
    defaultToOpenCampaigns: PropTypes.bool,
    defaultToOpenSpots: PropTypes.bool,
    defaultToOpenVersions: PropTypes.bool,
    projectHeaderElements: PropTypes.arrayOf(
        PropTypes.shape({
            element: PropTypes.element.isRequired,
            minWidth: PropTypes.number,
            maxWidth: PropTypes.number
        })
    ),
    title: PropTypes.string,
    subTitle: PropTypes.string,
    levelRequired: PropTypes.oneOf([1, 2, 3, 4, 5]),
    userCanCreateNew: PropTypes.bool,
    readOnly: PropTypes.bool,
    defaultValue: PropTypes.shape({
        project: PropTypes.shape({
            value: PropTypes.string,
            selectedId: PropTypes.number
        }),
        campaign: PropTypes.shape({
            value: PropTypes.string,
            selectedId: PropTypes.number
        }),
        spot: PropTypes.shape({
            value: PropTypes.string,
            selectedId: PropTypes.number
        }),
        version: PropTypes.shape({
            value: PropTypes.string,
            selectedId: PropTypes.number
        })
    })
};

const defaultProps = {
    onChange: null,
    noSeparator: false,
    showProject: true,
    showCampaign: true,
    showSpot: true,
    showVersion: true,
    defaultToOpenProjects: true,
    defaultToOpenCampaigns: false,
    defaultToOpenSpots: false,
    defaultToOpenVersions: false,
    projectHeaderElements: [],
    title: 'Project',
    subTitle: null,
    levelRequired: 1,
    forceClear: 0,
    userCanCreateNew: false,
    readOnly: false,
    defaultValue: null
};

class ProjectPicker extends React.Component {
    constructor(props, context) {
        super(props, context);

        let currentLevel = '';
        if (this.props.defaultToOpenProjects) {
            currentLevel = 'project';
        }
        if (this.props.defaultToOpenCampaigns && this.props.defaultValue !== null && typeof this.props.defaultValue.project !== 'undefined') {
            currentLevel = 'campaign';
        }
        if (this.props.defaultToOpenSpots && this.props.defaultValue !== null && typeof this.props.defaultValue.campaign !== 'undefined') {
            currentLevel = 'spot';
        }
        if (this.props.defaultToOpenVersions && this.props.defaultValue !== null && typeof this.props.defaultValue.version !== 'undefined') {
            currentLevel = 'version';
        }

        this.state = {
            current: currentLevel,
            project: {
                value: '',
                selectedId: null,
                customerId: null,
                customerName: null
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
            },
            showResults: false,
            results: {
                type: null,
                entries: [],
                currentPage: 1,
                totalCount: 0
            },
            lastApiParam: {},
            isProjectsLoading: false,
            isCampaignsLoading: false,
            isSpotsLoading: false,
            isVersionsLoading: false
        };

        // Debouncing
        this.loadResultsFromServerDebounced = debounce(this.loadResultsFromServerDebounced, 300);

        // Binding
        this.handleResultsPageChange = this.handleResultsPageChange.bind(this);
    }

    componentDidMount() {
        if (this.props.defaultValue !== null) {
            this.initResults(this.props.defaultValue);
        } else if (this.props.defaultToOpenProjects === true) {
            this.initResults();
        }
    }

    componentWillReceiveProps(nextProps) {
        if (this.props.forceClear !== nextProps.forceClear) {
            this.resetProjectPicker();
        }
    }

    initResults(defaultValue) {
        if (typeof defaultValue === 'undefined' && this.props.defaultToOpenProjects) {
            this.loadResultsFromServer('project', 1);
        } else {
            this.setState({
                project: typeof defaultValue.project !== 'undefined' ? defaultValue.project : undefined,
                campaign: typeof defaultValue.campaign !== 'undefined' ? defaultValue.campaign : undefined,
                spot: typeof defaultValue.spot !== 'undefined' ? defaultValue.spot : undefined,
                version: typeof defaultValue.version !== 'undefined' ? defaultValue.version : undefined,
                current: ''
            }, () => {
                let current;

                for (let picker of ['version', 'spot', 'campaign', 'project']) {
                    if (defaultValue[picker].selectedId === null) {
                        current = picker;
                    }
                }

                // If unselected one exists and readOnly is false, then load version
                if (typeof current !== 'undefined' && this.props.readOnly === false && this.props.defaultToOpenProjects) {
                    this.loadResultsFromServer(current, 1);
                }
            });
        }
    }

    resetProjectPicker() {
        this.setState({
            current: '',
            project: this.props.showProject ? Object.assign({}, this.state.project, {
                value: '',
                selectedId: null
            }) : undefined,
            campaign: this.props.showCampaign ? Object.assign({}, this.state.campaign, {
                value: '',
                selectedId: null
            }) : undefined,
            spot: this.props.showSpot ? Object.assign({}, this.state.spot, {
                value: '',
                selectedId: null
            }) : undefined,
            version: this.props.showVersion ? Object.assign({}, this.state.version, {
                value: '',
                selectedId: null
            }) : undefined,
            showResults: false
        }, () => {
            this.passPickedToOnChangeProp();
        });
    }

    updateResults(type, results) {
        // Update results state
        this.setState({
            current: type,
            showResults: true,
            results: Object.assign({}, this.state.results, {
                type: results.type,
                entries: results.entries,
                currentPage: results.currentPage,
                totalCount: results.totalCount
            })
        });
    }

    loadProjects(query, currentPage, length) {
        length = typeof length !== 'undefined' ? length : PICKER_PER_PAGE;
        const offset = (currentPage - 1) * length;

        let send = {
            search: query,
            offset,
            length
        };

        // Not load if it is same as last call
        if (isEqual(send, this.state.lastApiParam)) {
            return;
        }

        this.setState({
            isProjectsLoading: true
        });

        API.getRaw(API.PROJECT, send)
            .then(response => {
                const entries = response.data.map(project => {
                    return {
                        name: project.projectName,
                        id: project.id,
                        customerId: project.customerId,
                        customerName: project.customerName
                    };
                });

                this.setState({
                    lastApiParam: {
                        ...send,
                        type: 'project'
                    },
                    isProjectsLoading: false
                });

                this.updateResults('project', {
                    type: 'project',
                    entries,
                    currentPage,
                    totalCount: response.total_count
                });
            })
            .catch(response => {
                this.setState({
                    isProjectsLoading: false
                });
            });
    }

    loadCampaigns(projectId, query, currentPage, length) {
        length = typeof length !== 'undefined' ? length : PICKER_PER_PAGE;
        const offset = (currentPage - 1) * length;

        let send = {
            project_id: projectId,
            search: query,
            offset,
            length
        };

        // Not load if it is same as last call
        if (isEqual(send, this.state.lastApiParam)) {
            return;
        }

        this.setState({
            isCampaignsLoading: true
        });

        API.getRaw(API.CAMPAIGN, send)
            .then(response => {
                const entries = response.data.map(campaign => {
                    return {
                        name: campaign.campaignName,
                        id: campaign.id
                    };
                });

                this.setState({
                    lastApiParam: send,
                    isCampaignsLoading: false
                });

                this.updateResults('campaign', {
                    type: 'campaign',
                    entries,
                    currentPage,
                    totalCount: response.total_count
                });
            })
            .catch(response => {
                this.setState({
                    isCampaignsLoading: false
                });
            });
    }

    loadSpots(projectId, campaignId, query, currentPage, length) {
        length = typeof length !== 'undefined' ? length : PICKER_PER_PAGE;
        const offset = (currentPage - 1) * length;

        let send = {
            project_id: projectId,
            campaign_id: campaignId,
            search: query,
            offset,
            length
        };

        // Not load if it is same as last call
        if (isEqual(send, this.state.lastApiParam)) {
            return;
        }

        this.setState({
            isSpotsLoading: true
        });

        API.getRaw(API.SPOT, send)
            .then(response => {
                const entries = response.data.map(spot => {
                    return {
                        name: spot.spotName,
                        id: spot.id
                    };
                });

                this.setState({
                    lastApiParam: send,
                    isSpotsLoading: false
                });

                this.updateResults('spot', {
                    type: 'spot',
                    entries,
                    currentPage,
                    totalCount: response.total_count
                });
            })
            .catch(response => {
                this.setState({
                    isSpotsLoading: false
                });
            });
    }

    loadVersions(spotId, query, currentPage, length) {
        length = typeof length !== 'undefined' ? length : PICKER_PER_PAGE;
        const offset = (currentPage - 1) * length;

        let send = {
            spot_id: spotId,
            search: query,
            offset,
            length
        };

        // Not load if it is same as last call
        if (isEqual(send, this.state.lastApiParam)) {
            return;
        }

        this.setState({
            isVersionsLoading: true
        });

        API.getRaw(API.VERSION, send)
            .then(response => {
                const entries = response.data.map(version => {
                    return {
                        name: version.versionName,
                        id: version.id
                    };
                });

                this.setState({
                    lastApiParam: {
                        ...send,
                        type: 'version'
                    },
                    isVersionsLoading: false
                });

                this.updateResults('version', {
                    type: 'version',
                    entries,
                    currentPage,
                    totalCount: response.total_count
                });
            })
            .catch(response => {
                this.setState({
                    isVersionsLoading: false
                });
            });
    }

    passPickedToOnChangeProp() {
        if (this.props.onChange) {
            this.props.onChange({
                project: this.state.project,
                campaign: this.state.campaign,
                spot: this.state.spot,
                version: this.state.version
            });
        }
    }

    handlePickerCollapse(e) {
        // Hide results
        this.setState(
            Object.assign({}, this.state, {
                showResults: false
            })
        );
    }

    handleValuesChange(e, type) {
        // Load data for particular field value change
        this.loadResultsFromServerDebounced(type, 1, this.refs[type].input.value);

        // Set new state for all
        if (typeof this.refs.version !== 'undefined') {
            this.setState({
                project: Object.assign({}, this.state.project, {
                    value: typeof this.refs.project !== 'undefined' ? this.refs.project.input.value : undefined,
                    selectedId: type === 'project' ? null : this.state.project.selectedId
                }),
                campaign: Object.assign({}, this.state.campaign, {
                    value: typeof this.refs.campaign !== 'undefined' ? this.refs.campaign.input.value : undefined,
                    selectedId: type === 'campaign' || type === 'project' ? null : this.state.campaign.selectedId
                }),
                spot: Object.assign({}, this.state.spot, {
                    value: typeof this.refs.spot !== 'undefined' ? this.refs.spot.input.value : undefined,
                    selectedId: type === 'spot' || type === 'campaign' || type === 'project' ? null : this.state.spot.selectedId
                }),
                version: Object.assign({}, this.state.version, {
                    value: typeof this.refs.version !== 'undefined' ? this.refs.version.input.value : undefined,
                    selectedId: null
                })
            });
        } else {
            this.setState({
                project: Object.assign({}, this.state.project, {
                    value: typeof this.refs.project !== 'undefined' ? this.refs.project.input.value : undefined
                }),
                campaign: Object.assign({}, this.state.campaign, {
                    value: typeof this.refs.campaign !== 'undefined' ? this.refs.campaign.input.value : undefined
                }),
                spot: Object.assign({}, this.state.spot, {
                    value: typeof this.refs.spot !== 'undefined' ? this.refs.spot.refs.value : undefined
                })
            });
        }
    }

    handleInputFocus(e, type) {
        // Change current
        this.setState({
            current: type,
            showResults: true
        });

        // Get results
        this.loadResultsFromServer(type, 1, '');
    }

    handleInputBlur(e, type) {
    }

    handleClear(e) {
        let current = '';

        if (this.props.showProject && this.props.defaultToOpenProjects) {
            current = 'project';
        }

        if (this.props.showCampaign && this.props.defaultToOpenCampaigns) {
            current = 'campaign';
        }

        if (this.props.showSpot && this.props.defaultToOpenSpots) {
            current = 'spot';
        }

        if (this.props.showVersion && this.props.defaultToOpenVersions) {
            current = 'version';
        }

        this.setState({
            current: current,
            project: this.props.showProject ? Object.assign({}, this.state.project, {
                value: '',
                selectedId: null
            }) : this.state.project,
            campaign: this.props.showCampaign ? Object.assign({}, this.state.campaign, {
                value: '',
                selectedId: null
            }) : this.state.campaign,
            spot: this.props.showSpot ? Object.assign({}, this.state.spot, {
                value: '',
                selectedId: null
            }) : this.state.spot,
            version: this.props.showVersion ? Object.assign({}, this.state.version, {
                value: '',
                selectedId: null
            }) : this.state.version,
            showResults: false,
        }, () => {
            this.passPickedToOnChangeProp();
        });
    }

    handleResultPick(e, result) {
        // Define
        let results;

        // Set new selection values and switch to next field
        switch (result.type) {
            case 'project':
                this.setState({
                    current: this.props.showCampaign ? 'campaign' : '',
                    project: Object.assign({}, this.state.project, {
                        value: result.name,
                        selectedId: result.id,
                        customerId: typeof result.customer !== 'undefined' && typeof result.customer.id !== 'undefined' ? result.customer.id : undefined,
                        customerName: typeof result.customer !== 'undefined' && typeof result.customer.name !== 'undefined' ? result.customer.name : undefined
                    }),
                    campaign: Object.assign({}, this.state.campaign, {
                        value: '',
                        selectedId: null
                    }),
                    spot: Object.assign({}, this.state.spot, {
                        value: '',
                        selectedId: null
                    }),
                    version: Object.assign({}, this.state.version, {
                        value: '',
                        selectedId: null
                    })
                }, () => {
                    // Load next step's results from server
                    if (this.props.showCampaign) {
                        this.loadResultsFromServer('campaign', 1);
                    } else {
                        this.setState({
                            showResults: false
                        });
                    }

                    // Pass props change
                    this.passPickedToOnChangeProp();
                });

                break;

            case 'campaign':
                this.setState({
                    current: this.props.showSpot ? 'spot' : '',
                    campaign: Object.assign({}, this.state.campaign, {
                        value: result.name,
                        selectedId: result.id
                    }),
                    spot: Object.assign({}, this.state.spot, {
                        value: '',
                        selectedId: null
                    }),
                    version: Object.assign({}, this.state.version, {
                        value: '',
                        selectedId: null
                    })
                }, () => {
                    // Load next step's results from server
                    if (this.props.showSpot) {
                        this.loadResultsFromServer('spot', 1);
                    } else {
                        this.setState({
                            showResults: false
                        });
                    }

                    // Pass props change
                    this.passPickedToOnChangeProp();
                });

                break;

            case 'spot':
                this.setState({
                    current: this.props.showVersion ? 'version' : '',
                    spot: Object.assign({}, this.state.spot, {
                        value: result.name,
                        selectedId: result.id
                    }),
                    version: Object.assign({}, this.state.version, {
                        value: '',
                        selectedId: null
                    })
                }, () => {
                    // Load next step's results from server
                    if (this.props.showVersion) {
                        this.loadResultsFromServer('version', 1);
                    } else {
                        this.setState({
                            showResults: false
                        });
                    }

                    // Pass props change
                    this.passPickedToOnChangeProp();
                });

                break;

            case 'version':
                this.setState({
                    current: '',
                    version: Object.assign({}, this.state.version, {
                        value: result.name,
                        selectedId: result.id
                    }),
                    showResults: false,
                    results: Object.assign({}, this.state.results, {
                        type: null,
                        entries: [],
                        currentPage: 1,
                        totalCount: 0
                    })
                }, () => {
                    // Pass props change
                    this.passPickedToOnChangeProp();
                });

                break;

            default:
                this.setState({
                    [result.type]: Object.assign({}, this.state[result.type], {
                        'value': result.name,
                        'selectedId': result.id
                    })
                }, () => {
                    // Pass props change
                    this.passPickedToOnChangeProp();
                });
                break;
        }
    }

    handleResultsPageChange(page) {
        const type = this.state.current;

        this.loadResultsFromServer(type, page, this.state[type].value);
    }

    loadResultsFromServerDebounced(type, page, query = '') {
        this.loadResultsFromServer(type, page, query);
    }

    loadResultsFromServer(type, page, query = '') {
        // Show previous results and loadingSpinner while fetching
        this.setState({
            showResults: true
        });

        switch (type) {
            case 'project':
                this.loadProjects(query, page);
                return;
            case 'campaign':
                this.loadCampaigns(this.state.project.selectedId, query, page);
                return;
            case 'spot':
                this.loadSpots(this.state.project.selectedId, this.state.campaign.selectedId, query, page);
                return;
            case 'version':
                this.loadVersions(this.state.spot.selectedId, query, page);
                return;
            default:
                break;
        };
    }

    getColumnColor(type, current) {
        let color = 'brownFill';
        color = this.state[type].selectedId !== null ? 'greenFill' : color;
        color = typeof current !== 'undefined' && current === type ? 'blueFill' : color;
        return color;
    }

    render() {
        // Input colors
        const col1Color = this.getColumnColor('project', this.state.current);
        const col2Color = this.getColumnColor('campaign', this.state.current);
        const col3Color = this.getColumnColor('spot', this.state.current);
        const col4Color = this.getColumnColor('version', this.state.current);

        // Disabled state
        const col1Disabled = false;
        const col2Disabled = this.state.project.selectedId !== null ? false : true;
        const col3Disabled = col2Disabled === false && this.state.campaign.selectedId !== null ? false : true;
        const col4Disabled = col3Disabled === false && this.state.spot.selectedId !== null ? false : true;
        const isLoading = this.state.isProjectsLoading === true ||
                          this.state.isCampaignsLoading === true ||
                          this.state.isSpotsLoading === true ||
                          this.state.isVersionsLoading === true;

        // Level required
        let levelRequiredLabel;
        if (this.props.subTitle !== null) {
            levelRequiredLabel = this.props.subTitle;
        } else {
            switch (this.props.levelRequired) {
                case 2:
                    levelRequiredLabel = 'project has to be selected';
                    break;

                case 3:
                    levelRequiredLabel = 'campaign has to be selected';
                    break;

                case 4:
                    levelRequiredLabel = 'spot has to be selected';
                    break;

                case 5:
                    levelRequiredLabel = this.props.showVersion
                        ? 'spot and version have to be selected'
                        : 'spot has to be selected';
                    break;

                default:
                    levelRequiredLabel = 'optional';
                    break;
            }
        }

        // Header elements
        let headerElements = [];
        if (this.state.showResults || this.state.project.value !== '') {
            headerElements.push({
                element:
                    <Button
                        onClick={e => this.handleClear(e)}
                        className={s.clearButton}
                        label={{
                            text: 'Clear picked',
                            size: 'small',
                            color: 'blue'
                        }}
                    />
            });
        }
        if (this.state.showResults) {
            headerElements.push({
                element:
                    <Button
                        onClick={e => this.handlePickerCollapse(e)}
                        className={s.closeButton}
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
                        label={{
                            text: 'Close',
                            size: 'small',
                            color: 'orange',
                            on: 'left'
                        }}
                    />
            });
        }

        // Render
        return (
            <Section
                ref="sectionContainer"
                title={this.props.title}
                subTitle={levelRequiredLabel ? levelRequiredLabel : undefined}
                noSeparator={this.props.noSeparator}
                headerElements={this.props.projectHeaderElements.concat(headerElements)}
            >
                <Row removeGutter={true}>
                    {this.props.showProject && (
                        <Col className="dots" size={1}>
                            <Input
                                ref="project"
                                onChange={e => this.handleValuesChange(e, 'project')}
                                onFocus={e => this.handleInputFocus(e, 'project')}
                                onBlur={e => this.handleInputBlur(e, 'project')}
                                disabled={col1Disabled || this.props.readOnly}
                                value={this.state.project.value}
                                color={col1Color}
                                label="Project"
                                icon={
                                    <IconSearchLoupe
                                        width={13}
                                        height={13}
                                        marginTop={-6}
                                    />
                                }
                            />
                        </Col>
                    )}
                    {this.props.showCampaign && (
                        <Col className="dots" size={1}>
                            <Input
                                ref="campaign"
                                onChange={e => this.handleValuesChange(e, 'campaign')}
                                onFocus={e => this.handleInputFocus(e, 'campaign')}
                                onBlur={e => this.handleInputBlur(e, 'campaign')}
                                disabled={col2Disabled || this.props.readOnly}
                                value={this.state.campaign.value}
                                color={col2Color}
                                label="Campaign"
                                icon={
                                    <IconSearchLoupe
                                        width={13}
                                        height={13}
                                        marginTop={-6}
                                    />
                                }
                            />
                        </Col>
                    )}
                    {this.props.showSpot && (
                        <Col className="dots" size={1}>
                            <Input
                                ref="spot"
                                onChange={e => this.handleValuesChange(e, 'spot')}
                                onFocus={e => this.handleInputFocus(e, 'spot')}
                                onBlur={e => this.handleInputBlur(e, 'spot')}
                                disabled={col3Disabled || this.props.readOnly}
                                value={this.state.spot.value}
                                color={col3Color}
                                label="Spot"
                                icon={
                                    <IconSearchLoupe
                                        width={13}
                                        height={13}
                                        marginTop={-6}
                                    />
                                }
                            />
                        </Col>
                    )}
                    {this.props.showVersion && (
                        <Col className="dots" size={1}>
                            <Input
                                ref="version"
                                onChange={e => this.handleValuesChange(e, 'version')}
                                onFocus={e => this.handleInputFocus(e, 'version')}
                                onBlur={e => this.handleInputBlur(e, 'version')}
                                disabled={col4Disabled || this.props.readOnly}
                                value={this.state.version.value}
                                color={col4Color}
                                label="Version"
                                icon={
                                    <IconSearchLoupe
                                        width={13}
                                        height={13}
                                        marginTop={-6}
                                    />
                                }
                            />
                        </Col>
                    )}
                </Row>
                {(() => {
                    if (this.state.showResults === true && this.props.readOnly === false) {
                        const resultsStartCount = (this.state.results.currentPage * PICKER_PER_PAGE) - (PICKER_PER_PAGE - 1);
                        return (
                            <Row removeGutter={true}>
                                <Col className={s.searchResults}>
                                    {(() => {
                                        let resultsView = [];

                                        const results = this.state.results.entries.length > 0
                                            ? this.state.results.entries.map(result => {
                                                return (
                                                    <li key={result.id}>
                                                        <Button
                                                            onClick={e => this.handleResultPick(e, {
                                                                id: result.id,
                                                                name: result.name,
                                                                type: this.state.results.type,
                                                                customer: typeof result.customerId !== 'undefined' ? {
                                                                    id: result.customerId,
                                                                    name: typeof result.customerName !== 'undefined' ? result.customerName : undefined
                                                                } : undefined
                                                            })}
                                                            label={{
                                                                text: result.name,
                                                                size: 'small',
                                                                color: 'blue',
                                                                onLeft: true
                                                            }}
                                                            />
                                                    </li>
                                                );
                                            })
                                            : [
                                                <li className={s.noEntries} key="noEntries">
                                                    <p>No available results</p>
                                                </li>
                                            ];

                                        resultsView.push(
                                            <ol
                                                key={1}
                                                ref="resultsList"
                                                className={[s.searchResultsList, `resultsCount${results.length.toString()}`].join(' ')}
                                                start={resultsStartCount > 0 ? resultsStartCount : 1}
                                            >
                                                {results}
                                            </ol>
                                        );

                                        resultsView.push(
                                            <Row removeGutter={true} key="createPicker">
                                                <Col size={3}>
                                                    <div className={s.createPicker}>
                                                    {this.state.current==='project' && (
                                                        <CreateProjectPicker
                                                            label='Create new project'
                                                            reloadProject={(
                                                                    value,
                                                                    selectedId,
                                                                    customerId,
                                                                    customerName
                                                                )=>{
                                                                    this.setState({
                                                                        current: 'campaign',
                                                                        project: Object.assign({}, this.state.project, {
                                                                            value: value,
                                                                            selectedId: selectedId,
                                                                            customerId: customerId,
                                                                            customerName: customerName
                                                                        }),
                                                                        campaign: Object.assign({}, this.state.campaign, {
                                                                            value: '',
                                                                            selectedId: null
                                                                        }),
                                                                        spot: Object.assign({}, this.state.spot, {
                                                                            value: '',
                                                                            selectedId: null
                                                                        }),
                                                                        version: Object.assign({}, this.state.version, {
                                                                            value: '',
                                                                            selectedId: null
                                                                        })
                                                                    }, ()=>{
                                                                        this.loadResultsFromServer('campaign', 1);
                                                                    });
                                                                }
                                                            }
                                                        />
                                                    )}

                                                    {this.state.current==='campaign' && (
                                                        <CreateCampaignPicker
                                                            label='Create new campaign'
                                                            projectId = {this.state.project.selectedId}
                                                            excludeCampaginIds={this.state.results.entries}
                                                            reloadCampaign={(campaignName, campaignId)=>{
                                                                    this.setState({
                                                                        current: 'spot',
                                                                        campaign: Object.assign({}, this.state.campaign, {
                                                                            value: campaignName,
                                                                            selectedId: campaignId
                                                                        }),
                                                                        spot: Object.assign({}, this.state.spot, {
                                                                            value: '',
                                                                            selectedId: null
                                                                        }),
                                                                        version: Object.assign({}, this.state.version, {
                                                                            value: '',
                                                                            selectedId: null
                                                                        })
                                                                    }, ()=>{
                                                                        this.loadResultsFromServer('spot', 1);
                                                                    });
                                                                }
                                                            }
                                                        />
                                                    )}

                                                    {this.state.current==='spot' && (
                                                        <CreateSpotPicker
                                                            label='Create new spot'
                                                            projectId = {this.state.project.selectedId}
                                                            campaignId = {this.state.campaign.selectedId}
                                                            projectName = {this.state.project.value}
                                                            campaignName = {this.state.campaign.value}
                                                            reloadSpot={(spotName, spotId)=>{
                                                                    this.setState({
                                                                        current: 'version',
                                                                        spot: Object.assign({}, this.state.spot, {
                                                                            value: spotName,
                                                                            selectedId: spotId
                                                                        }),
                                                                        version: Object.assign({}, this.state.version, {
                                                                            value: '',
                                                                            selectedId: null
                                                                        })
                                                                    }, ()=>{
                                                                        this.loadResultsFromServer('version', 1);
                                                                    });
                                                                }
                                                            }
                                                        />
                                                    )}

                                                    {(this.state.current==='version' && this.state.results.type==='version') && (
                                                        <CreateVersionPicker
                                                            label='Create new version'
                                                            projectId = {this.state.project.selectedId}
                                                            campaignId = {this.state.campaign.selectedId}
                                                            spotId = {this.state.spot.selectedId}
                                                            spotName = {this.state.spot.value}
                                                            excludeVersionIds = {this.state.results.entries}
                                                            reloadVersion={()=>{
                                                                    this.loadResultsFromServer('version', 1);
                                                                }
                                                            }
                                                        />
                                                    )}
                                                    </div>
                                                </Col>
                                                <Col size={9}>
                                                    <Pagination
                                                        key={2}
                                                        edgesCount={2}
                                                        currentPage={this.state.results.currentPage}
                                                        countPerPage={PICKER_PER_PAGE}
                                                        countTotal={this.state.results.totalCount}
                                                        displayTotals={true}
                                                        onPageChange={this.handleResultsPageChange}
                                                    />
                                                </Col>
                                            </Row>
                                        );

                                        if (isLoading === true) {
                                            resultsView.push(
                                                <LoadingShade
                                                    key={3}
                                                    background="rgba(233, 224, 215, 0.7)"
                                                    border="4px solid rgba(248, 248, 248, 0.9)"
                                                >
                                                    <LoadingSpinner size={48} color="#5A4D3F" />
                                                </LoadingShade>
                                            );
                                        }

                                        return resultsView;
                                    })()}
                                </Col>
                            </Row>
                        );
                    }
                })()}
            </Section>
        );
    }
}

ProjectPicker.propTypes = propTypes;
ProjectPicker.defaultProps = defaultProps;

export default ProjectPicker;
