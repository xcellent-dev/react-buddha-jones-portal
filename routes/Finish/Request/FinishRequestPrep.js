import React, { PropTypes } from 'react';
import Section from './../../../components/Section/Section';
import Button from './../../../components/Button/Button';

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
    })
};

const defaultProps = {
    onRequestTypeSwitch: null,
    project: null
};

class FinishRequestPrep extends React.Component {
    constructor(props, context) {
        super(props, context);
    }

    handleRequestTypeSwitch(value) {
        if (this.props.onRequestTypeSwitch) {
            this.props.onRequestTypeSwitch(value);
        }
    }

    render() {
        return (
            <Section
                title="Prep for finish" subTitle="out of house"
                headerElements={[
                    { element:
                        <Button
                            onClick={e => this.handleRequestTypeSwitch(true)}
                            float="right"
                            label={{
                                text: 'Switch to in house - full finish',
                                size: 'small',
                                color: 'blue'
                            }}
                        />
                    }
                ]}
            >
            </Section>
        );
    }
}

FinishRequestPrep.propTypes = propTypes;
FinishRequestPrep.defaultProps = defaultProps;

export default FinishRequestPrep;
