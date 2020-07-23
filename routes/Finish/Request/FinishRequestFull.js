import React, { PropTypes } from 'react';
import Section from './../../../components/Section/Section';
import Row from './../../../components/Section/Row';
import Col from './../../../components/Section/Col';
import Button from './../../../components/Button/Button';
import RadioGroup from './../../../components/Form/RadioGroup';
import Input from './../../../components/Form/Input';
import TextArea from './../../../components/Form/TextArea';

const propTypes = {
    onRequestTypeSwitch: PropTypes.func.isRequired,
    project: PropTypes.shape({
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
    }),
    onSoftOrHardLockChange: PropTypes.func.isRequired,
    softOrHardLock: PropTypes.string.isRequired,
    onFilePathOrDeliverablesNotesChange: PropTypes.func.isRequired,
    filePath: PropTypes.string.isRequired,
    deliverablesNotes: PropTypes.string.isRequired
};

const defaultProps = {
    project: null
};

class FinishRequestFull extends React.Component {
    constructor(props, context) {
        super(props, context);
    }

    handleRequestTypeSwitch(value) {
        if (this.props.onRequestTypeSwitch) {
            this.props.onRequestTypeSwitch(value);
        }
    }

    handleHardLockChange(selected) {
        if (selected.value !== this.props.softOrHardLock) {
            this.props.onSoftOrHardLockChange(selected.value);
        }
    }

    handleFilePathOrDeliverablesNotesChange(e, type) {
        this.props.onFilePathOrDeliverablesNotesChange(e.target.value, type);
    }

    render() {
        return (
            <div>

                <Section
                    title="Full finish" subTitle="in house"
                    headerElements={[
                        { element:
                            <Button
                                onClick={e => this.handleRequestTypeSwitch(false)}
                                float="right"
                                label={{
                                    text: 'Switch to out of house - prep for finish',
                                    size: 'small',
                                    color: 'blue'
                                }}
                            />
                        }
                    ]}
                >

                    <Row>
                        <Col maxWidth={320}>
                            <RadioGroup
                                onChange={e => this.handleHardLockChange(e)}
                                value={e => this.props.softOrHardLock(e)}
                                options={[
                                    { key: 'soft', value: 'soft', label: 'Soft Lock' },
                                    { key: 'hard', value: 'hard', label: 'Hard Lock' }
                                ]}
                            />
                        </Col>
                    </Row>

                </Section>

                <Section>

                    <Row>
                        <Col>
                            <Input
                                onChange={e => this.handleFilePathOrDeliverablesNotesChange(e, 'filePath')}
                                value={this.props.filePath}
                                label="Offline file path..."
                            />
                            <br />
                            <TextArea
                                onChange={e => this.handleFilePathOrDeliverablesNotesChange(e, 'deliverablesNotes')}
                                width={1152}
                                height={96}
                                value={this.props.deliverablesNotes}
                                label="Notes regarding deliverables..."
                            />
                        </Col>
                    </Row>

                </Section>

            </div>
        );
    }
}

FinishRequestFull.propTypes = propTypes;
FinishRequestFull.defaultProps = defaultProps;

export default FinishRequestFull;
