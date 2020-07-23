// Libraries
import React, { PropTypes } from 'react';
import accounting from 'accounting';

// Actions
import * as API from './../../../actions/api';

// Components
import Row from './../../../components/Section/Row';
import Col from './../../../components/Section/Col';
import Button from './../../../components/Button/Button';
import Paragraph from './../../../components/Content/Paragraph';
import DropdownContainer from './../../../components/Form/DropdownContainer';
import OptionsList from './../../../components/Form/OptionsList';

// Related components
import SpotForm from './SpotForm';

// Styles
import IconPlusBlue from './../../../components/Icons/IconPlusBlue';
import IconPlusWhite from './../../../components/Icons/IconPlusWhite';
import IconCheckmarkGreen from './../../../components/Icons/IconCheckmarkGreen';
import s from './ProjectBoard.css';

// Props
const spotPropTypes = {
    onSpotUpdated: PropTypes.func,
    onSpotRemoved: PropTypes.func,
    onVersionAddedToSpot: PropTypes.func,
    onVersionRemovedFromSpot: PropTypes.func,
    editing: PropTypes.bool,
    projectId: PropTypes.number,
    campaignId: PropTypes.number,
    spotId: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired,
    versions: PropTypes.arrayOf(PropTypes.shape({
        id: PropTypes.number.isRequired,
        name: PropTypes.string.isRequired
    })),
    allVersions: PropTypes.arrayOf(PropTypes.shape({
        value: PropTypes.any,
        label: PropTypes.string
    })),
    numberOfRevisions: PropTypes.number,
    firstRevisionCost: PropTypes.number,
    graphicsIncluded: PropTypes.bool,
    notes: PropTypes.string,
    justAdded: PropTypes.bool
};

const defaultSpotPropTypes = {
    onSpotUpdated: null,
    onSpotRemoved: null,
    onVersionAddedToSpot: null,
    onVersionRemovedFromSpot: null,
    editing: false,
    spotId: null,
    name: null,
    versions: [],
    allVersions: [],
    numberOfRevisions: null,
    firstRevisionCost: null,
    graphicsIncluded: false,
    notes: null,
    justAdded: false
};

// Component
class Spot extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            addingNewVersionFormVisible: false,
            addingNewVersionNotice: false,
            addingNewVersionError: false,
            removingVersion: {
                id: null,
                error: false
            },
            removingSpot: false,
            removingSpotError: false,
            detailsVisible: false,
            editFormVisible: false,
            savingNewVersion: false,
            savingVersionError: false,
            flatVersionIds: this.props.versions.map((version) => {
                return version.id;
            }),
            filteredAllVersions: []
        };

        this.versionDropdown = null;
        this.referenceVersionDropdown = (ref) => this.versionDropdown = ref;
    }

    componentDidMount() {
        this.filterAllVersions();
    }

    componentWillReceiveProps(nextProps) {
        if (this.props.versions.length !== nextProps.versions.length) {
            const newFlatVersionIds = nextProps.versions.map((version) => { return version.id });
            this.setState({
                flatVersionIds: newFlatVersionIds
            }, () => {
                this.filterAllVersions(newFlatVersionIds);
            });
        }
    }

    filterAllVersions(flatVersionIds) {
        flatVersionIds = typeof flatVersionIds !== 'undefined' ? flatVersionIds : this.state.flatVersionIds;

        this.setState({
            filteredAllVersions: this.props.allVersions.filter((version, versionIndex) => {
                return flatVersionIds.indexOf(version.value) !== -1 ? false : true;
            })
        });
    }

    handleSpotInfoToggle(e) {
        this.setState({
            detailsVisible: !this.state.detailsVisible
        });
    }

    handleSpotEdit(e) {
        this.setState({
            detailsVisible: false,
            editFormVisible: true
        });
    }

    handleEditCancel(e) {
        this.setState({
            detailsVisible: false,
            editFormVisible: false,
            removingVersion: Object.assign({}, this.state.removingVersion, {
                id: null,
                error: false
            })
        });
    }

    handleSpotUpdate(e) {
        if (this.props.onSpotUpdated) {
            this.props.onSpotUpdated(e);
        }

        this.handleEditCancel(e);
    }

    handleSpotRemoval(spotId) {
        this.setState({
            removingSpot: true,
            removingSpotError: false
        });

        API.del(API.SPOT + '/' + spotId).then((response) => {
            if (this.props.onSpotRemoved) {
                this.props.onSpotRemoved({
                    campaignId: this.props.campaignId,
                    spotId: spotId
                });
            }
        }).catch((error) => {
            this.setState({
                removingSpot: false,
                removingSpotError: true
            });
        });
    }

    handleNewVersionFormToggle() {
        this.setState({
            addingNewVersionFormVisible: !this.state.addingNewVersionFormVisible
        });
    }

    handleNewVersionAdd(e) {
        this.setState({
            addingNewVersionNotice: true,
            addingNewVersionError: false
        });

        API.post(API.ASSIGN_VERSION_TO_SPOT, API.makePostData({
            spot_id: this.props.spotId,
            version_id: e.value
        })).then((response) => {
            // Update state
            this.setState({
                addingNewVersionFormVisible: false,
                addingNewVersionNotice: false,
                addingNewVersionError: false
            });

            // Pass callback further
            if (this.props.onVersionAddedToSpot) {
                this.props.onVersionAddedToSpot({
                    campaignId: this.props.campaignId,
                    spotId: this.props.spotId,
                    version: {
                        id: e.value,
                        name: e.label
                    }
                });
            }
        }).catch((error) => {
            // Update state
            this.setState({
                addingNewVersionFormVisible: true,
                addingNewVersionNotice: false,
                addingNewVersionError: true
            });
        });


        if (this.versionDropdown) {
            if (typeof this.versionDropdown.closeDropdown !== 'undefined') {
                this.versionDropdown.closeDropdown();
            }
        }
    }

    handleVersionRemoval(versionId) {
        // Set state
        this.setState({
            removingVersion: Object.assign({}, this.state.removingVersion, {
                id: versionId,
                error: false
            })
        }, () => {
            // Call API to deassign version from the spot
            API.del(API.ASSIGN_VERSION_TO_SPOT + '/' + versionId + '/' + this.props.spotId).then((response) => {
                // Callback
                if (this.props.onVersionRemovedFromSpot) {
                    this.props.onVersionRemovedFromSpot({
                        campaignId: this.props.campaignId,
                        spotId: this.props.spotId,
                        versionId: versionId
                    });
                }

                // Remove removing state
                this.setState({
                    removingVersion: Object.assign({}, this.state.removingVersion, {
                        id: null,
                        error: false
                    })
                });
            }).catch((error) => {
                // Notify user about error
                this.setState({
                    removingVersion: Object.assign({}, this.state.removingVersion, {
                        error: true
                    })
                });
            });
        });
    }

    render() {
        // Destructure
        const { numberOfRevisions, versions } = this.props;
        const { addingNewVersionFormVisible } = this.state;

        // Save version button
        let newVersionButton = {
            label: 'Save new version',
            color: 'blue'
        };
        if (this.state.savingNewVersion) {
            newVersionButton = {
                label: 'Saving new version',
                color: 'black'
            };
        }
        if (this.state.savingVersionError) {
            newVersionButton = {
                label: 'Version needs to be selected',
                color: 'orange'
            };
        }

        // Spot remove button
        let spotRemove = '(Remove)';

        if (this.state.removingSpot) {
            spotRemove = '(Removing...)';
        }

        if (this.state.removingSpotError) {
            spotRemove = '(Issue removing, try again)';
        }

        // Single spot
        return (
            <Row key={`spot-id-${this.props.spotId}`} removeMargins={true} className={s.campaignSpot}>
                <Col>
                    <hr />

                    <Row>
                        <Col>
                            <h5>{this.props.name}</h5>
                            {this.props.justAdded && (
                                <Button
                                    onClick={e => this.handleSpotRemoval(this.props.spotId)}
                                    className={[s.removeSpotButton, s.rotate45].join(' ')}
                                    label={{
                                        text: spotRemove,
                                        color: 'orange',
                                        size: 'small'
                                    }}
                                />
                            )}
                        </Col>
                    </Row>

                    <Row className={s.campaignSpotVersions} justifyContent="flex-start">
                        {this.props.versions.map((version, versionIndex) => {
                            // Check if version is currently being removed
                            const removingThisVersion = this.state.removingVersion.id === version.id;

                            // Version name
                            let versionText = removingThisVersion
                                ? 'Removing... ' + version.name
                                : version.name;

                            // Check if there was error removing
                            if (removingThisVersion) {
                                versionText = this.state.removingVersion.error ? 'Failed to remove ' + version.name + ', try again' : versionText;
                            }

                            // Render version
                            return (
                                <Col
                                    className={removingThisVersion ? s.removingVersion : undefined}
                                    key={`version-${version.id}-from-spot-${this.props.spotId}`}
                                >
                                    <h6>{versionText}</h6>
                                    {this.state.editFormVisible && (
                                        <Button
                                            onClick={e => this.handleVersionRemoval(version.id)}
                                            className={s.rotate45}
                                            icon={{
                                                size: 'small',
                                                background: removingThisVersion === false ? 'orange' : 'none-alt',
                                                element:
                                                    <IconPlusWhite
                                                        width={12}
                                                        marginLeft={-6}
                                                        height={12}
                                                        marginTop={-6}
                                                    />
                                            }}
                                        />
                                    )}
                                </Col>
                            );
                        })}

                        {(this.props.versions === null || this.props.versions.length <= 0) && (
                            <Col key={`spot-${this.props.spotId}-has-no-versions`}>
                                <p>No spot versions added.</p>
                            </Col>
                        )}

                        {(numberOfRevisions === 0 || (numberOfRevisions && versions.length < numberOfRevisions)) && (
                            <Button
                                className={[s.campaignSpotVersionAdd, (addingNewVersionFormVisible ? s.rotate45 : null)].join(' ')}
                                onClick={e => this.handleNewVersionFormToggle()}
                                tooltip={{
                                    on: 'top',
                                    text: addingNewVersionFormVisible ? 'Cancel adding new version' : 'Add new version'
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
                        )}
                    </Row>

                    <Row>
                        <Col>
                            {(this.state.detailsVisible && this.state.editFormVisible === false) && (
                                <div className={s.spotDetails}>
                                    {(this.props.notes !== null && this.props.notes !== '' && this.props.notes !== 'null') && (
                                        <Paragraph><span>Notes: </span>{this.props.notes}</Paragraph>
                                    )}
                                    {this.props.numberOfRevisions !== null && (
                                        <div>
                                            <Row>
                                                <Col>
                                                    <Paragraph>
                                                        <span>Number of revisions: </span>
                                                        <strong>{this.props.numberOfRevisions === 0 ? 'unlimited' : this.props.numberOfRevisions}</strong>
                                                    </Paragraph>
                                                </Col>
                                                <Col>
                                                    <Paragraph align="right">
                                                        {this.props.graphicsIncluded && (
                                                            <strong>Graphics included</strong>
                                                        ) || (
                                                            <span>Graphics not included</span>
                                                        )}
                                                    </Paragraph>
                                                </Col>
                                            </Row>
                                            <Row>
                                                <Col>
                                                    <Paragraph>
                                                        <span>First stage cost: </span>
                                                        <strong>{this.props.firstRevisionCost === null
                                                            ? 'not specified'
                                                            : accounting.formatMoney(this.props.firstRevisionCost)
                                                        }</strong>
                                                    </Paragraph>
                                                </Col>
                                            </Row>
                                        </div>
                                    ) || (
                                        <p><span>No revisions included</span></p>
                                    )}
                                </div>
                            )}

                            {this.state.editFormVisible && (
                                <SpotForm
                                    onSpotSaved={e => this.handleSpotUpdate(e)}
                                    onSpotFormCancel={e => this.handleEditCancel(e)}
                                    projectId={this.props.projectId}
                                    campaignId={this.props.campaignId}
                                    spotId={this.props.spotId}
                                    versions={this.props.versions.map((version) => {
                                        return version.value;
                                    })}
                                    name={this.props.name}
                                    numberOfRevisions={this.props.numberOfRevisions}
                                    firstRevisionCost={this.props.firstRevisionCost}
                                    graphicsIncluded={this.props.graphicsIncluded}
                                    notes={this.props.notes}
                                    removeGutter={true}
                                />
                            ) || (
                                <Row>
                                    <Col>
                                        <Button
                                            onClick={e => this.handleSpotInfoToggle(e)}
                                            label={{
                                                text: (this.state.detailsVisible ? 'Hide' : 'Show') + ' spot details',
                                                color: this.state.detailsVisible ? 'orange' : 'blue',
                                                size: 'small'
                                            }}
                                        />
                                    </Col>
                                    {this.state.detailsVisible && (
                                        <Col>
                                            <Button
                                                onClick={e => this.handleSpotEdit(e)}
                                                float="right"
                                                label={{
                                                    text: 'Edit spot',
                                                    color: 'blue'
                                                }}
                                            />
                                        </Col>
                                    )}
                                </Row>
                            )}
                        </Col>
                    </Row>

                    {(this.state.addingNewVersionFormVisible) && (
                        <Row>
                            <Col>
                                <br />
                                {this.state.addingNewVersionNotice && (
                                    <Paragraph align="right">Adding version to the spot...</Paragraph>
                                )}
                                {this.state.addingNewVersionError && (
                                    <Paragraph align="right" type="alert">Error adding new version, please try again.</Paragraph>
                                )}
                                {this.state.addingNewVersionNotice === false && (
                                    <DropdownContainer
                                        ref={this.referenceVersionDropdown}
                                        align="right"
                                        label="Select version to add"
                                    >
                                        <OptionsList
                                            onChange={e => this.handleNewVersionAdd(e)}
                                            label="Select version"
                                            options={this.state.filteredAllVersions}
                                        />
                                    </DropdownContainer>
                                )}
                                <br />
                            </Col>
                        </Row>
                    )}
                </Col>
            </Row>
        );
    }
}

Spot.propTypes = spotPropTypes;
Spot.defaultProps = defaultSpotPropTypes;

export default Spot;
