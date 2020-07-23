import React from 'react';
import { connect } from 'react-redux';
import * as actions from './../../../../actions/ActionTypes';
import Layout from './../../../../components/Layout/Layout';
import Section from './../../../../components/Section/Section';
import Paragraph from './../../../../components/Content/Paragraph';

class PageSpotSentFinalize extends React.Component {
    constructor(props, context) {
        super(props, context);
    }

    componentDidMount() {
        // Scroll to top
        window.scrollTo(0, 0);

        // Dispatch header
        this.props.dispatch({
            type: actions.HEADER_SET_ALL,
            payload: {
                title: 'Finalize spot sent',
                elements: [
                    <Paragraph>Audio/visual</Paragraph>
                ]
            }
        });
    }

    render() {
        return (
            <Layout>

                <Section title="Post team" noSeparator>
                    <div />
                </Section>

            </Layout>
        );
    }
}

function mapStateToProps(state) {
    return {
        header: state.header
    };
}

export default connect(mapStateToProps)(PageSpotSentFinalize);
