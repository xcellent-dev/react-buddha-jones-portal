import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import * as actions from './../../../actions/ActionTypes';
import history from './../../../core/history';

import Layout from './../../../components/Layout/Layout';
import Section from './../../../components/Section/Section';
import Row from './../../../components/Section/Row';
import Col from './../../../components/Section/Col';
import Input from './../../../components/Form/Input';
import Button from './../../../components/Button/Button';
import Table from './../../../components/Table/Table';
import TableRow from './../../../components/Table/TableRow';
import TableCell from './../../../components/Table/TableCell';
import Paragraph from './../../../components/Content/Paragraph';

import s from './ActivityList.css';
import IconTickGreen from './../../../components/Icons/IconTickGreen';
import IconClose from './../../../components/Icons/IconClose';
import IconPlusWhite from './../../../components/Icons/IconPlusWhite';

import * as API from './../../../actions/api';

import LoadingSpinner from './../../../components/Loaders/LoadingSpinner';
import IconEdit from './../../../components/Icons/IconEditPencilBlue';
import IconTick from './../../../components/Icons/IconTickGreen';
import IconCancel from './../../../components/Icons/IconClose';

class PageActivityList extends React.Component {
    constructor(props, context) {
        super(props, context);

        // Set header
        this.props.dispatch({
            type: actions.HEADER_SET_ALL,
            payload: {
                title: 'Activities list',
                elements: [
                    <Button
                        onClick={e => this.handleDefineNewActivity(e)}
                        label={{
                            text: 'Define new activity',
                            color: 'white',
                            size: 'large',
                            onLeft: true
                        }}
                        icon={{
                            size: 'small',
                            background: 'yellow',
                            element:
                                <IconPlusWhite
                                    width={12}
                                    height={12}
                                    marginTop={-6}
                                    marginLeft={-6}
                                />
                        }}
                    />
                ]
            }
        });

        // Set initial state
        this.state = {
            activityTypes: [],
            activities: [
            ],
            filteredActivitesIndex: [],
            activitySearch: '',
            activityLoading: false,
            statusLoadingId: null,
            modifyingActivityId: null,
            modifyingActivityName: '',
            modifyingActivityLoading: false
        };
    }

    componentDidMount() {
        this.setState({
            activityLoading: true
        }, () => {
            API.get(API.ACTIVITY, {})
            .then(response => {
                this.setState({
                    activities: response.map((item, index)=>{
                        return {
                            id: item.id,
                            typeId: item.typeId,
                            enabled: (item.status === 1) ? true : false,
                            name: item.name,
                            userTypeId: item.userTypeId
                        };
                    }),
                    filteredActivitesIndex: response.map((item, index)=>{
                        return index;
                    })
                }, ()=>{
                    API.get(API.ACTIVITY_LEVEL, {})
                        .then(response => {
                            this.setState({
                                activityLoading: false,
                                activityTypes: response.map((item, index)=>{
                                    return {
                                        id: item.id,
                                        name: item.activityType
                                    };
                                })
                            });
                        }).catch(error => {
                            this.setState({
                                activityTypeLoading: false
                            });
                        });
                });
            }).catch(error => {
                this.setState({
                    activityLoading: false
                });
            });
        });
    }

    handleDefineNewActivity(e) {
        history.push('/activity/define');
    }

    handleActivitySearchChange(e) {
        if (typeof e !== 'undefined' && typeof e.target !== 'undefined' && typeof e.target.value !== 'undefined') {
            const fullValue = e.target.value;

            this.setState({
                activitySearch: fullValue
            }, () => {
                if (fullValue.trim() === '') {
                    this.setState({
                        filteredActivitesIndex: this.state.activities.map((activity, activityIndex) => {
                            return activityIndex;
                        })
                    });
                } else {
                    const value = fullValue.toLowerCase().trim();
                    const valueWords = value.split(' ');

                    let filteredIndexes = [];
                    this.state.activities.filter((activity, activityIndex) => {
                        const name = activity.name.toLocaleLowerCase();
                        const nameWords = name.split(' ');

                        const matches = nameWords.filter((word, wordIndex) => {
                            const subMatches = valueWords.filter((subWord, subWordIndex) => {
                                if (word.indexOf(subWord) !== -1) {
                                    return true;
                                } else {
                                    return false;
                                }
                            });

                            return (subMatches.length > 0) ? true : false;
                        });

                        if (matches.length > 0 || this.getActivityType(activity.typeId).toLowerCase().indexOf(value) !== -1) {
                            filteredIndexes.push(activityIndex);
                            return true;
                        } else {
                            return false;
                        }
                    });

                    this.setState({
                        filteredActivitesIndex: filteredIndexes
                    });
                }
            });
        }
    }

    handleActivityStatusToggle(activityIndex, activityId) {
        if (typeof activityIndex !== 'undefined' && typeof activityId !== 'undefined') {
            if (typeof this.state.activities[activityIndex] !== 'undefined') {
                if (this.state.activities[activityIndex].id === activityId) {
                    this.setState({
                        statusLoadingId: activityId
                    });

                    API.put(API.ACTIVITY+'/'+activityId, API.makePutData({
                        type_id: this.state.activities[activityIndex].typeId,
                        name: this.state.activities[activityIndex].name,
                        user_type_id: this.state.activities[activityIndex].userTypeId,
                        status: (this.state.activities[activityIndex].enabled === true) ? 0 : 1
                    }))
                    .then(response => {
                        this.setState({
                            statusLoadingId: null,
                            activities: this.state.activities.slice(0, activityIndex)
                                .concat([
                                    Object.assign({}, this.state.activities[activityIndex], {
                                        enabled: !this.state.activities[activityIndex].enabled
                                    })
                                ])
                                .concat(this.state.activities.slice(activityIndex + 1))
                        });
                    }).catch(error => {
                        this.setState({
                            statusLoadingId: null
                        });
                    });
                }
            }
        }
    }

    getActivityType(activityId) {
        let typeName = '';
        this.state.activityTypes.map((item, index)=>{
            if (item.id === activityId) {
                typeName = item.name;
            }
        });
        return typeName;
    }

    onModifyingActivityEdit(activityIndex, activityId) {
        this.setState({
            modifyingActivityId: activityId,
            modifyingActivityName: this.state.activities[activityIndex].name
        });
    }

    onModifyingActivityCancel() {
        this.setState({
            modifyingActivityId: null
        });
    }

    onModifyingActivitySave(activityIndex, activityId) {
        this.setState({
            modifyingActivityLoading: true
        });
        API.put(API.ACTIVITY+'/'+activityId, API.makePutData({
            type_id: this.state.activities[activityIndex].typeId,
            name: this.state.modifyingActivityName,
            user_type_id: this.state.activities[activityIndex].userTypeId
        }))
        .then(response => {
            this.setState({
                modifyingActivityLoading: false,
                modifyingActivityId: null,
                activities: this.state.activities.slice(0, activityIndex)
                    .concat([
                        Object.assign({}, this.state.activities[activityIndex], {
                            name: this.state.modifyingActivityName
                        })
                    ])
                    .concat(this.state.activities.slice(activityIndex + 1))
            });
        }).catch(error => {
            this.setState({
                modifyingActivityLoading: false,
                modifyingActivityId: null
            });
        });
    }

    onModifyingActivityName(e) {
        this.setState({
            modifyingActivityName: e.target.value
        });
    }

    render() {
        return (
            <Layout>

                <Section
                    noSeparator={true}
                    title="All activities"
                    headerElements={[
                        {
                            element:
                                <Input
                                    onChange={e => this.handleActivitySearchChange(e)}
                                    value={this.state.activitySearch}
                                    label="Search activity..."
                                />
                        }
                    ]}
                >

                {
                    this.state.activityLoading ?
                    <Table>
                        <TableRow>
                            <TableCell colSpan={8} align="center">
                                <LoadingSpinner />
                            </TableCell>
                        </TableRow>
                    </Table>
                    :
                    <Table
                        header={[
                            { title: 'Activity', align: 'left' },
                            { title: '', align: 'left' },
                            { title: 'Type', align: 'left' },
                            { title: 'Users', align: 'left' },
                            { title: 'Status', align: 'right' }
                        ]}
                        columnsWidths={['30%', '20%', '20%', '10%', '20%']}
                    >
                        {this.state.filteredActivitesIndex.map((activityIndex) => {
                            if (typeof this.state.activities[activityIndex] !== 'undefined') {
                                const activity = this.state.activities[activityIndex];
                                let buttons = null;
                                let activityItem = null;

                                if (this.state.modifyingActivityId === activity.id) {
                                    if (this.state.modifyingActivityLoading) {
                                        buttons = (
                                            <Paragraph type='dim'>
                                                Saving...
                                            </Paragraph>
                                        );
                                    } else {
                                        buttons =
                                            <div key="edit-buttons-container">
                                                <Button
                                                    key="button-save"
                                                    float="right"
                                                    onClick={e => this.onModifyingActivitySave(activityIndex, activity.id)}
                                                    label={{
                                                        text: 'Save changes',
                                                        color: 'green'
                                                    }}
                                                    icon={{
                                                        size: 'small',
                                                        background: 'white',
                                                        element:
                                                            <IconTick
                                                                width={12}
                                                                marginLeft={-6}
                                                                height={9}
                                                                marginTop={-4}
                                                            />
                                                    }}
                                                />
                                                <Button
                                                    key="button-cancel"
                                                    float="right"
                                                    onClick={e => this.onModifyingActivityCancel(e)}
                                                    label={{
                                                        text: 'Cancel',
                                                        color: 'orange'
                                                    }}
                                                    icon={{
                                                        size: 'small',
                                                        background: 'none-alt',
                                                        element:
                                                            <IconCancel
                                                                width={12}
                                                                marginLeft={-6}
                                                                height={12}
                                                                marginTop={-6}
                                                            />
                                                    }}
                                                />
                                            </div>;
                                    }

                                    activityItem =
                                        <Input
                                            onChange={e => this.onModifyingActivityName(e)}
                                            value={this.state.modifyingActivityName}
                                        />;
                                } else {
                                    buttons =
                                        <Button
                                            onClick={e => this.onModifyingActivityEdit(activityIndex, activity.id)}
                                            float="right"
                                            label={{
                                                text: 'Modify',
                                                color: 'black'
                                            }}
                                            icon={{
                                                size: 'small',
                                                background: 'none',
                                                element:
                                                    <IconEdit
                                                        width={12}
                                                        marginLeft={-6}
                                                        height={12}
                                                        marginTop={-6}
                                                    />
                                            }}
                                        />;

                                    activityItem = <Paragraph type={activity.enabled ? 'default' : 'dim'}>{activity.name}</Paragraph>;
                                }

                                return (
                                    <TableRow key={`activity-${activity.id}`}>

                                        <TableCell align="left">
                                            {activityItem}
                                        </TableCell>

                                         <TableCell align="right">
                                            {buttons}
                                        </TableCell>

                                        <TableCell align="left">
                                            <Paragraph type={activity.enabled ? 'default' : 'dim'}>{this.getActivityType(activity.typeId)}</Paragraph>
                                        </TableCell>

                                         <TableCell align="left">
                                            <Paragraph type={activity.enabled ? 'default' : 'dim'}>
                                                {(activity.userTypeId === null) ? 'All' : activity.userTypeId}
                                            </Paragraph>
                                        </TableCell>

                                        <TableCell align="right">
                                            {
                                                (this.state.statusLoadingId && this.state.statusLoadingId===activity.id) ?
                                                <Paragraph type='dim'>Applying...</Paragraph>
                                                :
                                                <Button
                                                    onClick={e => this.handleActivityStatusToggle(activityIndex, activity.id)}
                                                    float="right"
                                                    label={{
                                                        onLeft: true,
                                                        color: activity.enabled ? 'blue' : 'orange',
                                                        text: activity.enabled ? 'Enabled' : 'Disabled'
                                                    }}
                                                    tooltip={{
                                                        text: activity.enabled ? 'Disable activity' : 'Enable activity',
                                                        on: 'left'
                                                    }}
                                                    icon={{
                                                        size: 'small',
                                                        background: activity.enabled ? 'white' : 'none',
                                                        element: activity.enabled ?
                                                            <IconTickGreen
                                                                width={12}
                                                                marginLeft={-6}
                                                                height={9}
                                                                marginTop={-5}
                                                            />
                                                            :
                                                            <IconClose
                                                                width={10}
                                                                marginLeft={-5}
                                                                height={10}
                                                                marginTop={-5}
                                                            />
                                                    }}
                                                />
                                            }
                                        </TableCell>

                                    </TableRow>
                                );
                            } else {
                                return null;
                            }
                        })}
                    </Table>
                }

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

export default connect(mapStateToProps)(PageActivityList);
