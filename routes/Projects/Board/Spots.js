// Libraries
import React, { PropTypes } from 'react';

// Common components
import Row from './../../../components/Section/Row';
import Col from './../../../components/Section/Col';
import Button from './../../../components/Button/Button';

// Related components
import Spot from './Spot';
import SpotForm from './SpotForm';

// Styles
import IconPlusBlue from './../../../components/Icons/IconPlusBlue';
import s from './ProjectBoard.css';

// Props
const propTypes = {
    onSpotSaved: PropTypes.func,
    onSpotRemoved: PropTypes.func,
    onVersionAddedToSpot: PropTypes.func,
    onVersionRemovedFromSpot: PropTypes.func,
    projectId: PropTypes.number.isRequired,
    campaignId: PropTypes.number.isRequired,
    spots: PropTypes.arrayOf(PropTypes.shape({
        editing: PropTypes.bool,
        id: PropTypes.number.isRequired,
        name: PropTypes.string.isRequired,
        versions: PropTypes.arrayOf(PropTypes.shape({
            id: PropTypes.number.isRequired,
            name: PropTypes.string.isRequired
        })),
        numberOfRevisions: PropTypes.number,
        firstRevisionCost: PropTypes.number,
        graphicsIncluded: PropTypes.bool,
        notes: PropTypes.string
    })),
    allVersions: PropTypes.arrayOf(PropTypes.shape({
        value: PropTypes.any,
        label: PropTypes.string
    }))
};

const defaultProps = {
    onSpotSaved: null,
    onSpotRemoved: null,
    onVersionAddedToSpot: null,
    onVersionRemovedFromSpot: null,
    projectId: null,
    campaignId: null,
    spots: [],
    allVersions: []
};

// Component
class Spots extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            addingNewSpotFormVisible: false
        };
    }

    handleNewSpotFormToggle() {
        this.setState({
            addingNewSpotFormVisible: !this.state.addingNewSpotFormVisible
        });
    }

    handleSpotSaved(e) {
        if (this.props.onSpotSaved) {
            this.props.onSpotSaved(e);

            if (e.new) {
                if (this.state.addingNewSpotFormVisible) {
                    this.handleNewSpotFormToggle();
                }
            }
        }
    }

    handleNewSpotCancel(e) {
        this.setState({
            addingNewSpotFormVisible: false
        });
    }

    handleSpotRemoved(e) {
        if (this.props.onSpotRemoved) {
            this.props.onSpotRemoved(e);
        }
    }

    render() {
        // Prepare individual spots return
        let spots = [];
        let spotsHeadline = null;
        if (this.props.spots && this.props.spots.length > 0) {
            spotsHeadline = <h4>Spots:</h4>;
        } else {
            spotsHeadline = <p>No spots assigned.</p>;
        }

        // Add spots headline
        spots.push(
            <Row key="spots-headline" removeMargins={true}>
                <Col>
                    {spotsHeadline}
                </Col>
            </Row>
        );

        // Add existing spots and versions
        this.props.spots.map((spot, spotIndex) => {
            spots.push(<Spot
                {...spot}
                onSpotUpdated={e => this.handleSpotSaved(e)}
                onSpotRemoved={e => this.handleSpotRemoved(e)}
                onVersionAddedToSpot={e => this.props.onVersionAddedToSpot(e)}
                onVersionRemovedFromSpot={e => this.props.onVersionRemovedFromSpot(e)}
                projectId={this.props.projectId}
                campaignId={this.props.campaignId}
                spotId={spot.id}
                allVersions={this.props.allVersions}
                key={`spot-${spot.id}-from-campaign-${this.props.campaignId}`}
            />);
        });

        // Add new spot form
        if (this.state.addingNewSpotFormVisible) {
            spots.push(
                <SpotForm
                    onSpotSaved={e => this.handleSpotSaved(e)}
                    onSpotFormCancel={e => this.handleNewSpotCancel(e)}
                    projectId={this.props.projectId}
                    campaignId={this.props.campaignId}
                    key={`campaign-${this.props.campaignId}-new-spot-form`}
                />
            );
        } else {
            // Add new spot button
            spots.push(
                <Row key="adding-spot" removeMargins={true} className={s.campaignAddSpot}>
                    <Col>
                        <hr />
                        <Button
                            onClick={e => this.handleNewSpotFormToggle()}
                            className={
                                this.state.addingNewSpotFormVisible
                                    ? [s.campaignAddSpotButton, s.rotate45].join(' ')
                                    : s.campaignAddSpotButton
                            }
                            float="right"
                            label={{
                                text: this.state.addingNewSpotFormVisible ? 'Cancel adding new spot' : 'Add new spot',
                                color: this.state.addingNewSpotFormVisible ? 'orange' : 'blue',
                                onLeft: true
                            }}
                            icon={{
                                size: 'small',
                                background: 'white',
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
            );
        }


        // Render
        return (
            <Row className={s.campaignSpots} removeGutter={true}>
                <Col>
                    {spots}
                </Col>
            </Row>
        );
    }
}

Spots.propTypes = propTypes;
Spots.defaultProps = defaultProps;

export default Spots;
