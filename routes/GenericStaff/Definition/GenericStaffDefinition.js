import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import * as actions from './../../../actions/ActionTypes';
import history from './../../../core/history';

import Layout from './../../../components/Layout/Layout';
import Section from './../../../components/Section/Section';
import Row from './../../../components/Section/Row';
import Col from './../../../components/Section/Col';
import Input from './../../../components/Form/Input';
import Radio from './../../../components/Form/Radio';
import Button from './../../../components/Button/Button';
import Select from './../../../components/Form/Select';

import IconArrowLeftYellow from './../../../components/Icons/IconArrowLeftYellow';
import IconSendSubmit from './../../../components/Icons/IconSendSubmit';

import { actionAlertNotify } from './../../../actions/Notifications';
import * as API from './../../../actions/api';
import Counter from './../../../components/Form/Counter';
import Paragraph from './../../../components/Content/Paragraph';

class PageGenericStaffDefinition extends React.Component {
    constructor(props, context) {
        super(props, context);

        // Set header
        this.props.dispatch({
            type: actions.HEADER_SET_ALL,
            payload: {
                title: 'Define Generic Staff',
                elements: [
                    <Button
                        onClick={e => history.push('/generic-staff')}
                        label={{
                            text: 'Back to generic staff list',
                            color: 'white',
                            size: 'large',
                            onLeft: false
                        }}
                        icon={{
                            size: 'small',
                            background: 'none-alt',
                            element:
                                <IconArrowLeftYellow
                                    width={15}
                                    marginLeft={-7}
                                    height={11}
                                    marginTop={-5}
                                />
                        }}
                    />
                ]
            }
        });

        // Set state
        this.state = {
            staffName: '',
            rate: 30,
            detailsRequired: true,
            staffSaveLoading: false
        };
    }

    componentDidMount() {        
    }    

    handleStaffNameChange(e) {
        if (typeof e !== 'undefined' && typeof e.target !== 'undefined' && typeof e.target.value !== 'undefined') {
            this.setState({
                staffName: e.target.value
            });
        }
    }

    handleRateChange(count) {
        this.setState({
            rate: count
        });
    }

    handleSave(e) {        

        if (this.state.staffName.trim() === '') {
            this.props.dispatch(
                actionAlertNotify(
                    'Staff name is required',
                    null,
                    'error',
                    false,
                    true,
                    false,
                    15
                )
            );
            return;
        }

        this.setState({
            staffSaveLoading: true
        });

        API.post(API.STAFF, API.makePostData({            
            name: this.state.staffName,
            rate: this.state.rate
        }))
        .then(response => {
            this.setState({
                staffSaveLoading: false
            });
            history.push('/generic-staff');
        }).catch(error => {
            this.setState({
                staffSaveLoading: false
            });
            this.props.dispatch(
                actionAlertNotify(
                    'Something went wrong with saving staff',
                    'Please try again',
                    'error',
                    false,
                    true,
                    false,
                    15
                )
            );
        });        
    }

    render() {
        return (
            <Layout>

                <Section noSeparator={true}>

                    <Row>                        
                        <Col size={2}>
                            <Paragraph align='right'>Generic Staff Name</Paragraph>
                        </Col>
                        <Col size={6}>
                            <Input
                                onChange={e =>this.handleStaffNameChange(e)}
                                value={this.state.staffName}
                                label="Generic staff name..."
                            />
                        </Col>
                    </Row>
                    <br/>
                    <Row>
                        <Col size={2}>
                            <Paragraph align='right'>Rate</Paragraph>
                        </Col>
                        <Col size={6}>
                            <Counter
                                onChange={count => this.handleRateChange(count)}
                                min={0}
                                increment={10}
                                showPlusMinus={false}
                                value={this.state.rate}
                            />
                        </Col>
                    </Row>

                </Section>

                <Section noSeparator={true}>

                    <Row>                        
                        <Col>

                            {
                                (this.state.staffSaveLoading) ?
                                <Button
                                    onClick={()=>{}}
                                    float="right"
                                    label={{
                                        text: 'Defining...',
                                        color: 'orange'
                                    }}
                                    icon={{
                                        background: 'orange',
                                        size: 'large',
                                        element:
                                            <IconSendSubmit
                                                width={25}
                                                height={26}
                                                marginLeft={-13}
                                                marginTop={-13}
                                            />
                                    }}
                                />
                                :
                                <Button
                                    onClick={e => this.handleSave(e)}
                                    float="right"
                                    label={{
                                        text: 'Define new generic staff',
                                        color: 'orange'
                                    }}
                                    icon={{
                                        background: 'orange',
                                        size: 'large',
                                        element:
                                            <IconSendSubmit
                                                width={25}
                                                height={26}
                                                marginLeft={-13}
                                                marginTop={-13}
                                            />
                                    }}
                                />
                            }
                        </Col>
                    </Row>

                </Section>

            </Layout>
        );
    }
}

function mapStateToProps(state) {
    return {
        header: state.header,
        notifications: state.notifications
    };
}

export default connect(mapStateToProps)(PageGenericStaffDefinition);
