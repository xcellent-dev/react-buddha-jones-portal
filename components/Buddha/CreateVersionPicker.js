import React, { PropTypes } from 'react';
import DropdownContainer from './../Form/DropdownContainer';
import OptionsList from './../Form/OptionsList';
import Paragraph from './../Content/Paragraph';
import * as API from './../../actions/api';

/**
 * CreateVersionPicker
 */
class CreateVersionPicker extends React.Component {

    /**
    * CreateVersionPicker Constructor
    * @param {props} props from parent component
    * @return {void}
    */
    constructor(props) {
        super(props);

        this.state = {
            versions: [],
            filteredAllVersions: [],
            addingNewVersionNotice: false
        };
    }

    /**
    * React lifecycle function - invoked before mounting occurs
    * Get version id's exclusion list of the spot id
    * @return {void}
    */
    componentWillMount() {
        let versions = [];
        versions = this.props.excludeVersionIds.map((item, index)=>{
            return item.id;
        });
        this.setState({
            versions: versions
        });
        this.filterAllVersions(this.props.spotId, '');
    }

    /**
    * Get all versions except the exclusion list for spotId
    * @return {int} spotId
    * @return {str} query
    * @return {void}
    */
    filterAllVersions(spotId, query) {
        let send = {
            offset: 0,
            length: 999999
        };

        API.getRaw(API.VERSION, send)
        .then(response => {
            const entries = response.data.map(version => {
                return {
                    value: version.id,
                    label: version.versionName
                };
            });

            this.setState({
                filteredAllVersions: entries.filter((version, versionIndex) => {
                    return this.state.versions.indexOf(version.value) !== -1 ? false : true;
                })
            });
        })
        .catch(response => {
        });
    }

    /**
    * Assign a version to the spotId
    * @return {event} onChange event in VersionList component
    * @return {void}
    */
    handleVersionAdd(e) {
        this.setState({
            addingNewVersionNotice: true
        });

        API.post(API.ASSIGN_VERSION_TO_SPOT, API.makePostData({
            spot_id: this.props.spotId,
            version_id: e.value
        })).then((response) => {
            // Update state
            this.setState({
                addingNewVersionNotice: false
            });

            // Pass callback further
            this.props.reloadVersion();
        }).catch((error) => {
            // Update state
            this.setState({
                addingNewVersionNotice: false
            });
        });


        if (this.versionDropdown) {
            if (typeof this.versionDropdown.closeDropdown !== 'undefined') {
                this.versionDropdown.closeDropdown();
            }
        }
    }

    /**
    * Render CreateVersionPicker component
    * @return {jsxresult} result in jsx format
    */
    render() {
        if (this.state.addingNewVersionNotice) {
            return (<Paragraph>Adding version to the spot...</Paragraph>);
        }

        if (this.state.addingNewVersionNotice === false) {
            return (
                <div>
                    <DropdownContainer
                        ref={this.referenceVersionDropdown}
                        label={this.props.label}
                    >
                        <OptionsList
                            onChange={e => this.handleVersionAdd(e)}
                            label={`Add version for spot ${this.props.spotName}`}
                            options={this.state.filteredAllVersions}
                        />
                    </DropdownContainer>
                </div>
            );
        }
    }
}

export default CreateVersionPicker;
