// Libraries
import React, { PropTypes } from 'react';

// Actions
import * as API from './../../../actions/api';

// Components
import Row from './../../../components/Section/Row';
import Col from './../../../components/Section/Col';
import Input from './../../../components/Form/Input';
import TextArea from './../../../components/Form/TextArea';
import Toggle from './../../../components/Form/Toggle';
import Counter from './../../../components/Form/Counter';
import DropdownContainer from './../../../components/Form/DropdownContainer';
import OptionsList from './../../../components/Form/OptionsList';
import Button from './../../../components/Button/Button';

// Styles
import IconCheckmarkGreen from './../../../components/Icons/IconCheckmarkGreen';
import s from './ProjectBoard.css';

// Props
const spotFormProps = {
    onSpotSaved: PropTypes.func,
    onSpotFormCancel: PropTypes.func,
    projectId: PropTypes.number.isRequired,
    campaignId: PropTypes.number.isRequired,
    spotId: PropTypes.number,
    versions: PropTypes.arrayOf(PropTypes.number),
    name: PropTypes.string,
    numberOfRevisions: PropTypes.number,
    firstRevisionCost: PropTypes.number,
    graphicsIncluded: PropTypes.bool,
    notes: PropTypes.string,
    removeGutter: PropTypes.bool
};

const spotFormDefaultProps = {
    onSpotSaved: null,
    onSpotFormCancel: null,
    projectId: null,
    campaignId: null,
    spotId: null,
    versions: [],
    name: null,
    numberOfRevisions: null,
    firstRevisionCost: null,
    graphicsIncluded: false,
    notes: null,
    removeGutter: false
};

// Component
class SpotForm extends React.Component {
    constructor(props) {
        super(props);

        const revisionsOptions = [
            { value: null, label: 'Not included' },
            { value: 0, label: 'Unlimited' },
            { value: 1, label: '1' },
            { value: 2, label: '2' },
            { value: 3, label: '3' },
            { value: 4, label: '4' },
            { value: 5, label: '5' },
            { value: 6, label: '6' },
            { value: 7, label: '7' },
            { value: 8, label: '8' },
            { value: 9, label: '9' },
            { value: 10, label: '10' }
        ];

        const numberOfRevisionsValue = props.numberOfRevisions !== null ? props.numberOfRevisions : null;
        let numberOfRevisionsOption = revisionsOptions[0];
        revisionsOptions.some((revision) => {
            if (revision.value === numberOfRevisionsValue) {
                numberOfRevisionsOption = revision;
                return true;
            } else {
                return false;
            }
        });

        this.state = {
            saving: false,
            error: false,
            errorName: false,
            name: props.name ? props.name : '',
            revisionsOptions: revisionsOptions.filter((option, optionIndex) => {
                if (
                    (option.value === numberOfRevisionsValue) ||
                    (this.props.versions.length === 0) ||
                    (option.value === 0) ||
                    (option.value >= this.props.versions.length)
                ) {
                    return true;
                } else {
                    return false;
                }
            }),
            numberOfRevisions: numberOfRevisionsOption.value,
            numberOfRevisionsText: numberOfRevisionsOption.label,
            firstRevisionCost: props.firstRevisionCost !== null ? props.firstRevisionCost : null,
            graphicsIncluded: props.graphicsIncluded ? props.graphicsIncluded : false,
            notes: props.notes && props.notes !== null && props.notes !== 'null' ? props.notes : ''
        };

        this.revisionsDropdown = null;
        this.referenceRevisionsDropdown = (ref) => this.revisionsDropdown = ref;
    }

    handleSpotNameChange(e) {
        this.setState({
            name: e.target.value
        });
    }

    handleSpotNotesChange(e) {
        this.setState({
            notes: e.target.value
        });
    }

    handleRevisionsCountChange(e) {
        this.setState({
            numberOfRevisions: e.value,
            numberOfRevisionsText: e.label
        });

        if (this.revisionsDropdown) {
            if (typeof this.revisionsDropdown.closeDropdown !== 'undefined') {
                this.revisionsDropdown.closeDropdown();
            }
        }
    }

    handleGraphicsIncludeToggle(e) {
        this.setState({
            graphicsIncluded: e
        });
    }

    handleFirstStageCostChange(e) {
        this.setState({
            firstRevisionCost: e
        });
    }

    handleSpotFormCancel(e) {
        if (this.props.onSpotFormCancel) {
            this.props.onSpotFormCancel(e);
        }
    }

    handleSpotSave(e) {
        e.preventDefault();

        // Indicate it's saving
        this.setState({
            saving: true,
            error: false,
            errorName: false,
            name: this.state.name.trim(),
            notes: this.state.notes.trim()
        }, () => {
            // Check if name is defined
            if (this.state.name === '') {
                this.setState({
                    saving: false,
                    error: false,
                    errorName: true
                });
            } else {
                // Format data
                const dataObject = {
                    name: this.state.name,
                    notes: this.state.notes ? this.state.notes : null,
                    project_id: this.props.projectId,
                    campaign_id: this.props.campaignId,
                    revisions: this.state.numberOfRevisions,
                    graphics_revisions: this.state.graphicsIncluded ? 1 : 0,
                    first_revision_cost: this.state.firstRevisionCost !== null ? this.state.firstRevisionCost : null
                };

                // Check if new spot is being created or existing one is being updated
                if (this.props.spotId || this.props.versions.length > 0) {
                    this.updateExistingSpot(dataObject);
                } else {
                    this.createNewSpot(dataObject);
                }
            }
        });
    }

    updateExistingSpot(dataObject) {
        API.put(API.SPOT + '/' + this.props.spotId, API.makePutData(dataObject)).then((response) => {
            if (this.props.onSpotSaved) {
                this.props.onSpotSaved(Object.assign({}, dataObject, {
                    new: false,
                    spot_id: this.props.spotId
                }));
            }
        }).catch((error) => {
            this.setState({
                saving: false,
                error: true
            });
        });
    }

    createNewSpot(dataObject) {
        API.post(API.SPOT, API.makePostData(dataObject)).then((response) => {
            if (this.props.onSpotSaved) {
                this.props.onSpotSaved(Object.assign({}, dataObject, {
                    new: true,
                    spot_id: parseInt(response.data.spot_id, 10)
                }));
            }
        }).catch((error) => {
            this.setState({
                saving: false,
                error: true
            });
        });
    }

    render() {
        // Button label and style
        let newSpotButton = {
            label: this.props.spotId ? 'Save spot changes' : 'Create new spot',
            color: 'blue'
        };

        if (this.state.saving) {
            newSpotButton = {
                label: this.props.spotId ? 'Saving spot changes...' : 'Saving new spot...',
                color: 'black'
            };
        }

        if (this.state.errorName) {
            newSpotButton = {
                label: 'Spot name is required',
                color: 'orange'
            };
        }

        if (this.state.error) {
            newSpotButton = {
                label: 'We\'ve encountered an issue, try again',
                color: 'orange'
            };
        }

        // Render
        return (
            <Row
                key={'new-spot-fields-' + this.props.campaignId}
                className={s.newSpotFields}
                removeMargins={true}
            >
                <Col removeGutter={this.props.removeGutter}>
                    <hr />

                    {(typeof this.props.spotId === 'undefined' || this.props.spotId === null) && (
                        <p>Creating new spot:</p>
                    )}

                    <Input
                        onChange={e => this.handleSpotNameChange(e)}
                        value={this.state.name}
                        label="Spot name..."
                        autoFocus={true}
                    />
                    <br />

                    <TextArea
                        onChange={e => this.handleSpotNotesChange(e)}
                        value={this.state.notes}
                        label="Notes..."
                        height={64}
                        width={512}
                    />
                    <br />

                    <Row>
                        <Col>
                            <DropdownContainer
                                ref={this.referenceRevisionsDropdown}
                                label="Revisions"
                                value={this.state.numberOfRevisionsText}
                            >
                                <OptionsList
                                    onChange={e => this.handleRevisionsCountChange(e)}
                                    value={this.state.numberOfRevisions}
                                    options={this.state.revisionsOptions}
                                />
                            </DropdownContainer>
                        </Col>
                        <Col>
                            {(this.state.numberOfRevisions !== null && this.state.numberOfRevisions >= 0) && (
                                <Toggle
                                    align="right"
                                    label="Graphics included:"
                                    labelOnLeft={true}
                                    onChange={e => this.handleGraphicsIncludeToggle(e)}
                                    isRight={this.state.graphicsIncluded}
                                    left={{
                                        value: false,
                                        label: 'No'
                                    }}
                                    right={{
                                        value: true,
                                        label: 'Yes'
                                    }}
                                />
                            )}
                        </Col>
                    </Row>
                    <br />

                    {(this.state.numberOfRevisions !== null && this.state.numberOfRevisions >= 0) && (
                        <Counter
                            onChange={e => this.handleFirstStageCostChange(e)}
                            value={this.state.firstRevisionCost}
                            label="First stage cost"
                            fieldMaxWidth={512}
                            multipleOf={0.01}
                            increment={100}
                            decimals={2}
                            showPlusMinus={true}
                            defaultValue={1000}
                            min={0}
                        />
                    )}

                    {(this.state.numberOfRevisions !== null && this.state.numberOfRevisions >= 0) && (
                        <br />
                    )}

                    <Row>
                        <Col>
                            <Button
                                className={s.cancelSpotFormButton}
                                onClick={e => this.handleSpotFormCancel(e)}
                                label={{
                                    text: 'Cancel',
                                    color: 'orange',
                                    size: 'small'
                                }}
                            />
                        </Col>
                        <Col>
                            <Button
                                onClick={this.state.saving === false ? e => this.handleSpotSave(e) : undefined}
                                float="right"
                                label={{
                                    text: newSpotButton.label,
                                    color: newSpotButton.color,
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

                </Col>
            </Row>
        );
    }
}

SpotForm.propTypes = spotFormProps;
SpotForm.defaultProps = spotFormDefaultProps;

export default SpotForm;
