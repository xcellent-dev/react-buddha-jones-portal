import React, { PropTypes } from 'react';
import { isEqual } from 'lodash';
import * as API from './../../actions/api';
import DropdownContainer from './../Form/DropdownContainer';
import OptionsList from './../Form/OptionsList';

const propTypes = {
    onChange: PropTypes.func,
    onNewCreated: PropTypes.func,
    onNewCreating: PropTypes.func,
    align: PropTypes.oneOf(['left', 'center', 'right']),
    label: PropTypes.string,
    valueLabel: PropTypes.string,
    truncuateLabelTo: PropTypes.number,
    excludeIds: PropTypes.arrayOf(PropTypes.number),
    projectId: PropTypes.number,
    disabledCreating: PropTypes.bool,
    closeWhenPicked: PropTypes.bool
};

const defaultProps = {
    onChange: null,
    onNewCreated: null,
    onNewCreating: null,
    align: 'right',
    excludeIds: [],
    label: 'Pick campaign',
    truncuateLabelTo: 32,
    disabledCreating: false,
    closeWhenPicked: true
};

class CampaignPicker extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            selected: {
                value: '',
                label: ''
            },
            campaigns: [],
            options: [],
            query: '',
            loadingOptions: false,
            saving: false,
            directHint: null
        };
    }

    componentDidMount() {
        this.fetchCampaigns({
            length: 9999,
            offset: 0
        });
    }

    componentWillReceiveProps(nextProps) {
        if (this.state.campaigns.length > 0 && isEqual(this.props.excludeIds, nextProps.excludeIds) === false) {
            this.filterCampaignsToOptions(nextProps.excludeIds);
        }
    }

    closeDropdown() {
        if (typeof this.refs !== 'undefined' && typeof this.refs.campaignPickerDropdown !== 'undefined') {
            const dropdown = this.refs.campaignPickerDropdown;
            if (typeof dropdown.closeDropdown !== 'undefined') {
                dropdown.closeDropdown();
            }
        }
    }

    fetchCampaigns(params) {
        this.setState({
            loadingOptions: true
        });

        API.get(API.CAMPAIGN, params)
            .then(response => {
                this.setState({
                    loadingOptions: false,
                    campaigns: response
                }, () => {
                    this.filterCampaignsToOptions();
                });
            }).catch(error => {
                this.setState({
                    loadingOptions: false
                });
            });
    }

    filterCampaignsToOptions(excludeIds) {
        excludeIds = typeof excludeIds !== 'undefined' ? excludeIds : this.props.excludeIds;

        const filteredCampaigns = excludeIds.length > 0
            ? this.state.campaigns.filter(c => excludeIds.indexOf(c.id) === -1)
            : this.state.campaigns;

        this.setState({
            options: filteredCampaigns.length > 0
                ? filteredCampaigns.map(c => {
                    return {
                        value: c.id,
                        label: c.campaignName
                    };
                })
                : []
        });
    }

    uploadCampaign(params) {
        this.setState({
            saving: true
        });

        if (this.props.onNewCreating) {
            this.props.onNewCreating(params.name);
        }

        API.post(API.CAMPAIGN, API.makePostData(params))
            .then(response => {
                this.setState({
                    saving: false,
                    directHint: null,
                    query: ''
                });

                if (this.props.onNewCreated) {
                    this.props.onNewCreated({
                        value: parseInt(response.data.campaign_id, 10),
                        label: params.name,
                        project: typeof params.project !== 'undefined' ? JSON.parse(params.project) : undefined
                    });

                    if (this.props.closeWhenPicked) {
                        this.closeDropdown();
                    }
                }
            })
            .catch(error => {
                this.setState({
                    saving: false
                });

                if (this.props.closeWhenPicked) {
                    this.closeDropdown();
                }
            });
    }

    handleSelectOrCreate(e) {
        if (e.value === 'createCampaign') {
            // Create campaign
            this.uploadCampaign({
                project: JSON.stringify([{ project_id: this.props.projectId }]),
                name: this.state.query
            });
        } else {
            // Select the campaign
            this.setState({
                selected: e
            });

            if (this.props.onChange) {
                this.props.onChange(e);
            }

            if (this.props.closeWhenPicked) {
                this.closeDropdown();
            }
        }
    }

    handleSearchQuery(e) {
        this.setState({
            query: e.replace(/\b\w/g, l => l.toUpperCase())  // Capitalize
        }, () => {
            if (this.state.query === '' || this.isExactlyMatch(this.state.query)) {
                // Remove direct hint
                this.setState({
                    directHint: null
                });
            } else if (this.props.disabledCreating === false) {
                // Set direct hint
                this.setState({
                    directHint: {
                        value: 'createCampaign',
                        label: 'Create new campaign: ' + this.state.query
                    }
                });
            }
        });
    }

    isExactlyMatch(query) {
        return !!this.state.options.find(option => option.label.toLowerCase() === query.trim().toLowerCase());
    }

    render() {
        if (this.state.saving) {
            return (
                <div className="campaignPicker">
                    <p>Saving new campaign...</p>
                </div>
            );
        } else {
            return (
                <div className="campaignPicker">
                    <DropdownContainer
                        ref="campaignPickerDropdown"
                        align={this.props.align}
                        minWidth={210}
                        overflowAuto={true}
                        label={this.props.label}
                        value={this.state.selected.label}
                        truncuateLabelTo={this.props.truncuateLabelTo}
                    >
                        <OptionsList
                            onChange={e => this.handleSelectOrCreate(e)}
                            search={{
                                autoFocus: true,
                                label: 'Search or create campaign by name...',
                                onChange: (e) => this.handleSearchQuery(e),
                                value: this.state.query
                            }}
                            value={this.state.selected.value}
                            options={this.state.options}
                            loadingOptions={this.state.loadingOptions}
                            directHint={this.state.directHint}
                        />
                    </DropdownContainer>
                </div>
            );
        }
    }
}

CampaignPicker.propTypes = propTypes;
CampaignPicker.defaultProps = defaultProps;

export default CampaignPicker;
