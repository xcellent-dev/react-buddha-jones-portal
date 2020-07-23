// Libraries
import React, { PropTypes } from 'react';

// Props
const creativeExecutiveProps = {
    allExecutives: PropTypes.arrayOf(PropTypes.shape({
        id: PropTypes.number,
        email: PropTypes.string,
        name: PropTypes.string,
        mobilePhone: PropTypes.string,
        officePhone: PropTypes.string,
        postalAddress: PropTypes.string
    })),
    executiveId: PropTypes.number
};

const creativeExecutiveDefaultProps = {
    allExecutives: [],
    executiveId: null
};

// Component
class CreativeExecutive extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div>
                <hr />
            </div>
        );

        /*
        {(() => {
            if (campaign.id === this.state.editing.creativeExecutive.campaignId) {
                // Save exec button
                let saveExecButton = {
                    label: this.state.editing.creativeExecutive.id === 0
                        ? 'Create new creative executive'
                        : 'Save creative executive\'s changes',
                    color: 'blue'
                };
                if (this.state.editing.creativeExecutive.saving) {
                    saveExecButton = {
                        label: 'Saving creative executive',
                        color: 'black'
                    };
                }
                if (this.state.editing.creativeExecutive.error) {
                    saveExecButton = {
                        label: 'Executive\'s name is required',
                        color: 'orange'
                    };
                }

                // Render
                return (
                    <Row className={s.campaignCreativeExecutive} removeMargins={true}>
                        <Col>
                            <Dropdown
                                onChange={e => this.handleCreativeExecutiveChange(e)}
                                options={this.state.creativeExecutives.map((exec, execIndex) => {
                                    return {
                                        value: exec.id,
                                        label: exec.name
                                    };
                                })}
                                selected={{
                                    value: this.state.editing.creativeExecutive.id,
                                    label: this.state.editing.creativeExecutive.name
                                }}
                                label="Select creative executive"
                                type="oneline"
                            />
                            <br />
                            <Input
                                width={768}
                                label="Full name"
                                value={this.state.editing.creativeExecutive.name}
                                onChange={e => this.handleCreativeExecutiveInfoEditChange(e, 'name')}
                            />
                            <br />
                            <Input
                                width={768}
                                label="Phone number"
                                value={this.state.editing.creativeExecutive.phone}
                                onChange={e => this.handleCreativeExecutiveInfoEditChange(e, 'phone')}
                            />
                            <br />
                            <Input
                                width={768}
                                type="email"
                                label="Email address"
                                value={this.state.editing.creativeExecutive.email}
                                onChange={e => this.handleCreativeExecutiveInfoEditChange(e, 'email')}
                            />
                            <br />
                            <Input
                                width={768}
                                label="Postal address"
                                value={this.state.editing.creativeExecutive.address}
                                onChange={e => this.handleCreativeExecutiveInfoEditChange(e, 'address')}
                            />
                            <br />
                            <Button
                                onClick={e => this.handleCreativeExecutiveInfoChangesSave(e, campaignIndex)}
                                float="right"
                                label={{
                                    text: saveExecButton.label,
                                    color: saveExecButton.color,
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
                        </Col>
                    </Row>
                );
            } else if (creativeExec !== null) {
                // Info
                let creativeExecInfo = [];

                // Phone
                if (creativeExec.phone !== null && creativeExec.phone !== '') {
                    creativeExecInfo.push(
                        <li key="phone">
                            <IconPhone
                                width={20}
                                height={20}
                                marginTop={-10}
                            />
                            {creativeExec.phone}
                        </li>
                    );
                }

                // Email
                if (creativeExec.email !== null && creativeExec.email !== '') {
                    creativeExecInfo.push(
                        <li key="email">
                            <IconEmail
                                width={21}
                                height={17}
                                marginTop={-9}
                            />
                            <a title={creativeExec.email} href={'mailto:' + creativeExec.email}>{creativeExec.email}</a>
                        </li>
                    );
                }

                // Address
                if (creativeExec.address !== null && creativeExec.address !== '') {
                    creativeExecInfo.push(
                        <li key="address">
                            <IconBriefcase
                                width={23}
                                height={20}
                                marginTop={-10}
                            />
                            {creativeExec.address}
                        </li>
                    );
                }

                // Creative exec row class name
                let creativeExecClassName = s.campaignCreativeExecutive;
                creativeExecClassName += creativeExecInfo.length > 0 ? ' ' + s.expandable : '';
                creativeExecClassName += campaign.showCreativeExecutiveInfo === true ? ' ' + s.showExecutiveInfo : '';

                // Render
                return (
                    <Row className={creativeExecClassName} removeMargins={true}>
                        <Col>
                            <h4
                                onClick={e => this.handleCreativeExecutiveInfoToggle(campaign.id)
                                }
                            >
                                <span>Creative executive: </span>
                                {creativeExec.name}
                            </h4>
                            <Button
                                className={s.execInfoToggleButton}
                                onClick={e => this.handleCreativeExecutiveInfoToggle(campaign.id)}
                                tooltip={{
                                    text: campaign.showCreativeExecutiveInfo === false
                                        ? 'Show contact info'
                                        : 'Hide contact info',
                                    on: 'top'
                                }}
                                icon={{
                                    element:
                                        <IconLightbulb
                                            width={12}
                                            marginLeft={-6}
                                            height={16}
                                            marginTop={-8}
                                        />,
                                    size: 'small',
                                    background: 'white'
                                }}
                            />
                            <ul className={s.creativeExecInfo}>
                                {creativeExecInfo}
                                <li className={s.creativeExecEdit}>
                                    <Button
                                        onClick={e => this.handleCreativeExecutiveInfoEdit(
                                            e, campaign.id, creativeExec
                                        )}
                                        label={{
                                            text: 'Edit creative executive',
                                            size: 'small',
                                            color: 'blue',
                                            onLeft: false
                                        }}
                                        icon={{
                                            element:
                                                <IconTickBlue
                                                    width={12}
                                                    marginLeft={-6}
                                                    height={9}
                                                    marginTop={-5}
                                                />,
                                            size: 'small',
                                            background: 'white'
                                        }}
                                    />
                                </li>
                            </ul>
                        </Col>
                    </Row>
                );
            } else {
                return (
                    <Row className={s.campaignCreativeExecutive} removeMargins={true}>
                        <Col>
                            <p>No creative executive assigned.</p>
                        </Col>
                        <Button
                            className={s.campaignCreativeExecutiveAssignButton}
                            onClick={e => this.handleCreativeExecutiveInfoEdit(
                                e, campaign.id
                            )}
                            tooltip={{
                                text: 'Assign creative executive',
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
                    </Row>
                );
            }
        })()}
        */
    }
}

CreativeExecutive.propTypes = creativeExecutiveProps;
CreativeExecutive.defaultProps = creativeExecutiveDefaultProps;

export default CreativeExecutive;
