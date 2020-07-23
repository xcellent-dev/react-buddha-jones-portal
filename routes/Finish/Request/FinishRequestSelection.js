import React, { PropTypes } from 'react';
import Section from './../../../components/Section/Section';
import Row from './../../../components/Section/Row';
import Col from './../../../components/Section/Col';
import Select from './../../../components/Form/Select';

const propTypes = {
};

const defaultProps = {
};

class FinishRequestSelection extends React.Component {
    constructor(props, context) {
        super(props, context);
    }

    render() {
        return (
            <div>

                <Section title="AE" subTitle="request">
                </Section>

                <Section title="Cue sheet" subTitle="request">
                </Section>

                <Section title="Continuity" subTitle="request">
                </Section>

                <Section title="Graphics" subTitle="request">
                </Section>

                <Section title="Name of narrator">
                </Section>

                <Section title="Finished file received">
                </Section>

            </div>
        );
    }
}

FinishRequestSelection.propTypes = propTypes;
FinishRequestSelection.defaultProps = defaultProps;

export default FinishRequestSelection;
