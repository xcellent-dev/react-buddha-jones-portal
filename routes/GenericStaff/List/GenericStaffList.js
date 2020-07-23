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

import IconTickGreen from './../../../components/Icons/IconTickGreen';
import IconClose from './../../../components/Icons/IconClose';
import IconPlusWhite from './../../../components/Icons/IconPlusWhite';

import * as API from './../../../actions/api';

import LoadingSpinner from './../../../components/Loaders/LoadingSpinner';
import IconEdit from './../../../components/Icons/IconEditPencilBlue';
import IconTick from './../../../components/Icons/IconTickGreen';
import IconCancel from './../../../components/Icons/IconClose';
import Counter from './../../../components/Form/Counter';

class PageGenericStaffList extends React.Component {
    constructor(props, context) {
        super(props, context);

        // Set header
        this.props.dispatch({
            type: actions.HEADER_SET_ALL,
            payload: {
                title: 'Generic staff list',
                elements: [
                    <Button
                        onClick={e => this.handleDefineNewStaff(e)}
                        label={{
                            text: 'Define new generic staff',
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
            staff: [
            ],
            filteredStaffIndex: [],
            staffSearch: '',
            staffLoading: false,
            statusLoadingId: null,
            modifyingStaffId: null,
            modifyingStaffName: '',
            modifyingStaffRate: 0,
            modifyingStaffLoading: false
        };
    }

    componentDidMount() {
        this.setState({
            staffLoading: true
        }, () => {
            API.get(API.STAFF, {})
            .then(response => {
                this.setState({
                    staffLoading: false,
                    staff: response.map((item, index)=>{
                        return {
                            id: item.id,                            
                            // enabled: (item.status === 1) ? true : false,
                            enabled: true,
                            name: item.name,
                            rate: item.rate                            
                        };
                    }),
                    filteredStaffIndex: response.map((item, index)=>{
                        return index;
                    })
                }, ()=>{
                });
            }).catch(error => {
                this.setState({
                    staffLoading: false
                });
            });
        });
    }

    handleDefineNewStaff(e) {
        history.push('/generic-staff/define');
    }

    handleStaffSearchChange(e) {
        if (typeof e !== 'undefined' && typeof e.target !== 'undefined' && typeof e.target.value !== 'undefined') {
            const fullValue = e.target.value;

            this.setState({
                staffSearch: fullValue
            }, () => {
                if (fullValue.trim() === '') {
                    this.setState({
                        filteredStaffIndex: this.state.staff.map((staff, staffIndex) => {
                            return staffIndex;
                        })
                    });
                } else {
                    const value = fullValue.toLowerCase().trim();
                    const valueWords = value.split(' ');

                    let filteredIndexes = [];
                    this.state.staff.filter((staff, staffIndex) => {
                        const name = staff.name.toLocaleLowerCase();
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

                        if (matches.length > 0) {
                            filteredIndexes.push(staffIndex);
                            return true;
                        } else {
                            return false;
                        }
                    });

                    this.setState({
                        filteredStaffIndex: filteredIndexes
                    });
                }
            });
        }
    }

    handleStaffStatusToggle(staffIndex, staffId) {
        if (typeof staffIndex !== 'undefined' && typeof staffId !== 'undefined') {
            if (typeof this.state.staff[staffIndex] !== 'undefined') {
                if (this.state.staff[staffIndex].id === staffId) {                    
                    this.setState({
                        statusLoadingId: staffId
                    });

                    API.put(API.STAFF+'/'+staffId, API.makePutData({
                        name: this.state.staff[staffIndex].name,
                        rate: this.state.staff[staffIndex].rate
                    }))
                    .then(response => {
                        this.setState({
                            statusLoadingId: null,
                            staff: this.state.staff.slice(0, staffIndex)
                                .concat([
                                    Object.assign({}, this.state.staff[staffIndex], {
                                        enabled: !this.state.staff[staffIndex].enabled
                                    })
                                ])
                                .concat(this.state.staff.slice(staffIndex + 1))
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

    onModifyingStaffEdit(staffIndex, staffId) {
        this.setState({
            modifyingStaffId: staffId,
            modifyingStaffName: this.state.staff[staffIndex].name,
            modifyingStaffRate: this.state.staff[staffIndex].rate
        });
    }

    onModifyingStaffCancel() {
        this.setState({
            modifyingStaffId: null
        });
    }

    onModifyingStaffSave(staffIndex, staffId) {
        this.setState({
            modifyingStaffLoading: true
        });
        API.put(API.STAFF+'/'+staffId, API.makePutData({
            name: this.state.modifyingStaffName,
            rate: this.state.modifyingStaffRate
        }))
        .then(response => {
            this.setState({
                modifyingStaffLoading: false,
                modifyingStaffId: null,
                staff: this.state.staff.slice(0, staffIndex)
                    .concat([
                        Object.assign({}, this.state.staff[staffIndex], {
                            name: this.state.modifyingStaffName,
                            rate: this.state.modifyingStaffRate
                        })
                    ])
                    .concat(this.state.staff.slice(staffIndex + 1))
            });
        }).catch(error => {
            this.setState({
                modifyingStaffLoading: false,
                modifyingStaffId: null
            });
        });
    }

    onModifyingStaffName(e) {
        this.setState({
            modifyingStaffName: e.target.value
        });
    }

    onModifyingStaffRate(e) {
        this.setState({
            modifyingStaffRate: e.target.value
        });        
    }

    render() {
        return (
            <Layout>

                <Section
                    noSeparator={true}
                    title="All staff"
                    headerElements={[
                        {
                            element:
                                <Input
                                    onChange={e => this.handleStaffSearchChange(e)}
                                    value={this.state.staffSearch}
                                    label="Search staff..."
                                />
                        }
                    ]}
                >

                {
                    this.state.staffLoading ?
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
                            { title: 'Staff', align: 'left' },
                            { title: 'Rate', align: 'left' },
                            { title: '', align: 'left' },
                            { title: 'Status', align: 'right' }
                        ]}
                        columnsWidths={['30%', '20%', '20%', '10%', '20%']}
                    >
                        {this.state.filteredStaffIndex.map((staffIndex) => {
                            if (typeof this.state.staff[staffIndex] !== 'undefined') {
                                const staff = this.state.staff[staffIndex];
                                let buttons = null;
                                let staffItem = null;
                                let rateItem = null;

                                if (this.state.modifyingStaffId === staff.id) {
                                    if (this.state.modifyingStaffLoading) {
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
                                                    onClick={e => this.onModifyingStaffSave(staffIndex, staff.id)}
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
                                                    onClick={e => this.onModifyingStaffCancel(e)}
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

                                    staffItem =
                                        <Input
                                            onChange={e => this.onModifyingStaffName(e)}
                                            value={this.state.modifyingStaffName}
                                        />;
                                    rateItem =
                                        <Counter
                                            onChange={e => this.onModifyingStaffRate(e)}
                                            value={this.state.modifyingStaffRate}
                                            min={0}
                                            increment={10}
                                            showPlusMinus={false}
                                        />;                                    
                                } else {
                                    buttons =
                                        <Button
                                            onClick={e => this.onModifyingStaffEdit(staffIndex, staff.id)}
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

                                    staffItem = <Paragraph type={staff.enabled ? 'default' : 'dim'}>{staff.name}</Paragraph>;
                                    rateItem = <Paragraph type={staff.enabled ? 'default' : 'dim'}>{staff.rate}</Paragraph>;
                                }

                                return (
                                    <TableRow key={`staff-${staff.id}`}>

                                        <TableCell align="left">
                                            {staffItem}
                                        </TableCell>

                                         <TableCell align="left">
                                            {rateItem}
                                        </TableCell>

                                         <TableCell align="right">
                                            {buttons}
                                        </TableCell>                                        

                                        <TableCell align="right">
                                            {
                                                (this.state.statusLoadingId && this.state.statusLoadingId===staff.id) ?
                                                <Paragraph type='dim'>Applying...</Paragraph>
                                                :
                                                <Button
                                                    onClick={e => this.handleStaffStatusToggle(staffIndex, staff.id)}
                                                    float="right"
                                                    label={{
                                                        onLeft: true,
                                                        color: staff.enabled ? 'blue' : 'orange',
                                                        text: staff.enabled ? 'Enabled' : 'Disabled'
                                                    }}
                                                    tooltip={{
                                                        text: staff.enabled ? 'Disable staff' : 'Enable staff',
                                                        on: 'left'
                                                    }}
                                                    icon={{
                                                        size: 'small',
                                                        background: staff.enabled ? 'white' : 'none',
                                                        element: staff.enabled ?
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

export default connect(mapStateToProps)(PageGenericStaffList);
