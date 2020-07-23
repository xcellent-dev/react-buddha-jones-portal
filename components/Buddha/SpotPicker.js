import React, { PropTypes } from 'react';
import * as API from './../../actions/api';
import DropdownContainer from './../Form/DropdownContainer';
import OptionsList from './../Form/OptionsList';

const propTypes = {
    onChange: PropTypes.func,
    onNewCreated: PropTypes.func,
    onNewCreating: PropTypes.func,
    label: PropTypes.string,
    truncuateLabelTo: PropTypes.number,
    projectId: PropTypes.number,
    campaignId: PropTypes.number,
    disabledCreating: PropTypes.bool,
    closeWhenPicked: PropTypes.bool
};

const defaultProps = {
    onChange: null,
    onNewCreated: null,
    onNewCreating: null,
    label: 'Spots',
    truncuateLabelTo: 32,
    disabledCreating: false,
    closeWhenPicked: true
};

class SpotPicker extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            selected: {
                value: '',
                label: ''
            },
            options: [],
            query: '',
            loadingOptions: false,
            saving: false,
            directHint: null
        };
    }

    componentDidMount() {
        this.fetchSpots({
            // project_id: this.props.projectId,
            // campaign_id: this.props.campaignId, // Commented to get all spots, but also spots of current campaign
            length: 9999,
            offset: 0
        });
    }

    fetchSpots(params) {
        this.setState({
            loadingOptions: true
        });

        API.get(API.SPOT, params)
            .then(response => {
                const options = response.map(spot => {
                    return {
                        value: spot.id,
                        label: spot.spotName
                    };
                });

                this.setState({
                    loadingOptions: false,
                    options
                });
            }).catch(error => {
                this.setState({
                    loadingOptions: false
                });
            });
    }

    uploadSpot(params) {
        this.setState({
            saving: true
        });

        if (this.props.onNewCreating) {
            this.props.onNewCreating(params.name);
        }

        API.post(API.SPOT, API.makePostData(params))
            .then(response => {
                this.setState({
                    saving: false,
                    directHint: null,
                    query: ''
                });

                if (this.props.onNewCreated) {
                    this.props.onNewCreated({
                        id: response.data.spot_id,
                        name: params.name
                    });
                }
            })
            .catch(error => {
                this.setState({
                    saving: false
                });
            });
    }

    componentWillReceiveProps(nextProps) {}

    handleSelectOrCreate(e) {
        if (e.value === 'createSpot') {
            // Create spot
            this.uploadSpot({
                project_id: this.props.projectId,
                campaign_id: this.props.campaignId,
                name: this.state.query
            });
        } else {
            // Select the spot
            this.setState({
                selected: e
            });

            if (this.props.onChange) {
                this.props.onChange(e);
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
            } else if (this.props.disabledCreating === false && this.props.projectId && this.props.campaignId) {
                // Set direct hint
                this.setState({
                    directHint: {
                        value: 'createSpot',
                        label: 'Create sport: ' + this.state.query
                    }
                });
            }
        });
    }

    isExactlyMatch(query) {
        return !!this.state.options.find(option => option.label.toLowerCase() === query.trim().toLowerCase());
    }

    render() {
        return (
            <div className="spotPicker">
                {(this.state.saving === true) && (
                    <p>Saving new spot...</p>
                )}
                {(this.state.saving === false) && (
                    <DropdownContainer
                        ref="spotPickerDropdown"
                        align="right"
                        minWidth={210}
                        overflowAuto={true}
                        label={this.props.label}
                        value={this.state.selected.label}
                        truncuateLabelTo={this.props.truncuateLabelTo}
                    >
                        <OptionsList
                            onChange={e => this.handleSelectOrCreate(e)}
                            search={{
                                label: 'Spot Name...',
                                autoFocus: true,
                                onChange: (e) => this.handleSearchQuery(e),
                                value: this.state.query
                            }}
                            value={this.state.selected.value}
                            options={this.state.options}
                            loadingOptions={this.state.loadingOptions}
                            directHint={this.state.directHint}
                        />
                    </DropdownContainer>
                )}
            </div>
        );
    }
}

SpotPicker.propTypes = propTypes;
SpotPicker.defaultProps = defaultProps;

export default SpotPicker;
