// Libraries
import React, { PropTypes } from 'react';
import * as API from './../../../actions/api';

// Common components
import Row from './../../../components/Section/Row';
import Col from './../../../components/Section/Col';
import Button from './../../../components/Button/Button';
import DropdownPeoplePicker from './../../../components/Buddha/DropdownPeoplePicker';

// Page specific components
import Person from './../../../components/Buddha/Person';

// Styles
import IconPlusBlue from './../../../components/Icons/IconPlusBlue';
import s from './ProjectBoard.css';

// Props
const CampaignManagementProps = {
    onUserPicked: PropTypes.func,
    onUserRemoved: PropTypes.func,
    projectId: PropTypes.number.isRequired,
    campaignId: PropTypes.number.isRequired,
    type: PropTypes.oneOf(['manager', 'producer']),
    title: PropTypes.string.isRequired,
    titleEmpty: PropTypes.string.isRequired,
    users: PropTypes.arrayOf(PropTypes.object)
};

const CampaignManagementDefaultProps = {
    onUserPicked: null,
    onUserRemoved: null,
    projectId: null,
    campaignId: null,
    type: null,
    title: '',
    titleEmpty: '',
    users: []
};

// Component
class CampaignManagement extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            editUsersFormVisible: false
        };
    }

    handleAddingNewUser(e) {
        if (typeof e !== 'undefined' && typeof e.value !== 'undefined' && typeof e.value.id !== 'undefined') {
            const { value } = e;

            API.post(API.ASSIGN_MANAGEMENT_TO_CAMPAIGN, API.makePostData({
                project_id: this.props.projectId,
                campaign_id: this.props.campaignId,
                user_id: value.id,
                user_type_id: value.typeId
            })).then((response) => {
                if (this.props.onUserPicked) {
                    this.props.onUserPicked(Object.assign({}, e, {
                        campaignId: this.props.campaignId
                    }));
                }

                this.handleEditUsersToggle(e);
            }).catch((error) => {
                // TODO: Error handling
            });
        }
    }

    handleRemovingUser(e) {
        if (typeof e !== 'undefined' && typeof e.id !== 'undefined' && typeof e.typeId !== 'undefined') {
            const { id, typeId } = e;
            const path = '/user_id/user_type_id/campaign_id/project_id';

            API.del(API.ASSIGN_MANAGEMENT_TO_CAMPAIGN + '/' + id + '/' + typeId + '/' + this.props.campaignId + '/' + this.props.projectId).then((response) => {
                if (this.props.onUserRemoved) {
                    this.props.onUserRemoved({
                        projectId: this.props.projectId,
                        campaignId: this.props.campaignId,
                        type: this.props.type,
                        typeId: typeId,
                        userId: id
                    });
                }

                this.handleEditUsersToggle(e);
            }).catch((error) => {
                // TODO
            });
        }
    }

    handleEditUsersToggle(e) {
        this.setState({
            editUsersFormVisible: !this.state.editUsersFormVisible
        });
    }

    render() {
        return (
            <div className={s.campaignManagement}>

                <Row removeMargins={true}>
                    <Col className={s.managementSectionTitle}>
                        {(this.props.users && this.props.users.length > 0) && (
                            <h3>{this.props.title}</h3>
                        ) || (
                            <p><span>{this.props.titleEmpty}</span></p>
                        )}
                    </Col>
                    <Col>
                        <Button
                            className={this.state.editUsersFormVisible ? s.rotate45 : undefined}
                            onClick={e => this.handleEditUsersToggle(e)}
                            float="right"
                            tooltip={{
                                on: 'top',
                                text: this.state.editUsersFormVisible ? 'Cancel editing' : 'Edit people'
                            }}
                            icon={{
                                size: 'small',
                                background: 'none',
                                element:
                                    <IconPlusBlue
                                        width={12}
                                        marginLeft={-6}
                                        height={12}
                                        marginTop={-6}
                                    />
                            }}
                        />
                    </Col>
                </Row>

                <Row removeMargins={true} doWrap={true}>
                    <Col flex="0 1 auto">
                        <DropdownPeoplePicker
                            onPersonPicked={e => this.handleAddingNewUser(e)}
                            onPersonRemoved={e => this.handleRemovingUser(e)}
                            editable={this.state.editUsersFormVisible}
                            pickedPeopleLimit={2}
                            pickedPeopleIds={this.props.users.map((user, userIndex) => {
                                return user.id;
                            })}
                            align="left"
                            label="Select person to add"
                            valueLabel=""
                            type={this.props.type}
                        />
                    </Col>
                </Row>

                <hr />

            </div>
        );
    }
}

CampaignManagement.propTypes = CampaignManagementProps;
CampaignManagement.defaultProps = CampaignManagementDefaultProps;

export default CampaignManagement;
