import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { actionAlertNotify } from './../../actions/Notifications';
import DropdownContainer from './../Form/DropdownContainer';
import Input from './../Form/Input';
import TextArea from './../Form/TextArea';
import Button from './../Button/Button';
import Paragraph from './../Content/Paragraph';
import * as API from './../../actions/api';

/**
 * CreateSpotPicker
 */
class CreateSpotPicker extends React.Component {

    /**
    * CreateProjectPicker Constructor
    * @param {props} props from parent component
    * @return {void}
    */
    constructor(props) {
        super(props);

        this.spotName = '';
        this.notes = '';

        this.state = {
            isUploading: false
        };
    }

    /**
    * Get spot name
    * @return {event} event of onChange in spot name input obj
    * @return {void}
    */
    handleSpotNameChange(e) {
        this.spotName = e.target.value;
    }

    /**
    * Get spot note
    * @return {event} event of onChange in spot note input obj
    * @return {void}
    */
    handleSpotNoteChange(e) {
        this.notes = e.target.value;
    }

    /**
    * Create a spot for the campaign
    * @return {event} onClick event of CreateNewSpot button
    * @return {void}
    */
    handleSubmit(e) {
        if (this.spotName === '') {
            this.props.dispatch(
                actionAlertNotify(
                    'Spot name is required',
                    null,
                    'error',
                    false,
                    true,
                    false,
                    15
                )
            );
        } else {
            this.setState({
                isUploading: true
            });

            API.post(API.SPOT, API.makePostData({
                project_id: this.props.projectId,
                campaign_id: this.props.campaignId,
                name: this.spotName,
                notes: this.notes
            })).then(response => {
                if (response.status === 1) {
                    //ok
                    this.setState({
                        isUploading: false
                    });
                } else {
                    this.setState({
                        isUploading: false
                    });
                }

                this.props.reloadSpot(this.spotName, response.data.spot_id);
            }).catch(error => {
                this.setState({
                    isUploading: false
                });
                this.props.reloadSpot();
            });

            this.spotName = '';
            this.notes = '';
        }
    }

    /**
    * Render CreateSpotPicker component
    * @return {jsxresult} result in jsx format
    */
    render() {
        if (this.state.isUploading) {
            return (
                <Paragraph>Creating spot...</Paragraph>
            );
        } else {
            let projectName = this.props.projectName;
            let campaignName = this.props.campaignName;

            return (
                <div>
                    <DropdownContainer
                        ref="spotPickerDropdown"
                        minWidth={210}
                        overflowAuto={true}
                        label={this.props.label}
                    >
                        <Paragraph>{`Create spot for campaign ${campaignName} of project ${projectName}`}</Paragraph>
                        <br />
                        <Input
                            onChange={e => this.handleSpotNameChange(e)}
                            label="Spot name..."
                            autoFocus={true}
                        />
                        <br />
                        <TextArea
                            onChange={e => this.handleSpotNoteChange(e)}
                            label="Notes..."
                            height={100}
                            width={260}
                        />
                        <br />
                        <Button
                            onClick={e => this.handleSubmit(e)}
                            float="right"
                            label={{
                                text: this.state.isUploading ? 'Creating...' : 'Create new spot',
                                color: 'orange',
                                onLeft: true
                            }}
                        />
                        <br />
                    </DropdownContainer>
                </div>
            );
        }
    }
}

/**
 * Map Redux store state to this component props
 * @param {state} state Redux store state
 * @return {json} state json State from redux store state
 */
function mapStateToProps(state) {
    return {
        notifications: state.notifications
    };
}

export default connect(mapStateToProps)(CreateSpotPicker);
