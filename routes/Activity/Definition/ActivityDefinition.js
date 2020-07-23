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
import s from './ActivityDefinition.css';

import { actionAlertNotify } from './../../../actions/Notifications';
import * as API from './../../../actions/api';

class PageActivityDefinition extends React.Component {
    constructor(props, context) {
        super(props, context);

        // Set header
        this.props.dispatch({
            type: actions.HEADER_SET_ALL,
            payload: {
                title: 'Define activity',
                elements: [
                    <Button
                        onClick={e => history.push('/activity')}
                        label={{
                            text: 'Back to activities list',
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
            activityTypeId: '1',
            activityName: '',
            detailsRequired: true,
            activityTypeLoading: false,
            activityTypeOptions: [],
            activityTypeSaveLoading: false
        };
    }

    componentDidMount() {
        this.setState({
            activityTypeLoading: true
        }, () => {
            API.get(API.ACTIVITY_LEVEL, {})
            .then(response => {
                this.setState({
                    activityTypeLoading: false,
                    activityTypeOptions: response.map((item, index)=>{
                        return {
                            value: item.id,
                            label: item.activityType
                        };
                    })
                });
            }).catch(error => {
                this.setState({
                    activityTypeLoading: false
                });

                this.props.dispatch(
                    actionAlertNotify(
                        'Something went wrong with fetching Activity Type',
                        'Please try again',
                        'error',
                        false,
                        true,
                        false,
                        15
                    )
                );
            });
        });
    }

    handleActivityTypeChange(e) {
        if (typeof e !== 'undefined' && typeof e.target !== 'undefined' && typeof e.target.value !== 'undefined') {
            this.setState({
                activityTypeId: e.target.value
            });
        }
    }

    handleActivityNameChange(e) {
        if (typeof e !== 'undefined' && typeof e.target !== 'undefined' && typeof e.target.value !== 'undefined') {
            this.setState({
                activityName: e.target.value
            });
        }
    }

    handleDetailsRequiredToggle(e) {
        e.preventDefault();
        this.setState({
            detailsRequired: !this.state.detailsRequired
        });
    }

    handleSave(e) {
        if (this.state.activityTypeLoading || this.state.activityTypeOptions.length <= 0) {
            this.props.dispatch(
                actionAlertNotify(
                    'Activity type is required',
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

        if (this.state.activityName.trim() === '') {
            this.props.dispatch(
                actionAlertNotify(
                    'Activity name is required',
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
            activityTypeSaveLoading: true
        });

        // TODO: Save to database and redirect to activites list
        API.post(API.ACTIVITY, API.makePostData({
            type_id: this.state.activityTypeId,
            name: this.state.activityName
        }))
        .then(response => {
            this.setState({
                activityTypeSaveLoading: false
            });
            history.push('/activity');
        }).catch(error => {
            this.setState({
                activityTypeSaveLoading: false
            });
            this.props.dispatch(
                actionAlertNotify(
                    'Something went wrong with saving activity',
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
                        <Col>
                            <Select
                                onChange={e => this.handleActivityTypeChange(e)}
                                value={this.state.activityTypeId}
                                options={
                                    this.state.activityTypeLoading || this.state.activityTypeOptions.length <= 0
                                        ? [{ value: 1, label: 'Loading...' }]
                                        : this.state.activityTypeOptions
                                }
                            />
                            <br /><br />
                            <Input
                                onChange={e =>this.handleActivityNameChange(e)}
                                value={this.state.activityName}
                                label="Activity name..."
                            />
                        </Col>
                    </Row>

                </Section>

                <Section noSeparator={true}>

                    <Row>
                        <Col size={9}>
                            {this.state.activityTypeId === '2' && (
                                <Radio
                                    className={s.requiredDescription}
                                    onClick={e => this.handleDetailsRequiredToggle(e)}
                                    value="required"
                                    checked={this.state.detailsRequired}
                                    label="Worker is required to provide activity description"
                                />
                            )}
                        </Col>
                        <Col size={3}>

                            {
                                (this.state.activityTypeSaveLoading) ?
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
                                        text: 'Define new activity',
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

export default connect(mapStateToProps)(PageActivityDefinition);
