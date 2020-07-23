import React, { PropTypes } from 'react';
import Table from './../../../components/Table/Table';
import TableRow from './../../../components/Table/TableRow';
import TableCell from './../../../components/Table/TableCell';
import Paragraph from './../../../components/Content/Paragraph';
import Button from './../../../components/Button/Button';
import Money from './../../../components/Content/Money';
import Counter from './../../../components/Form/Counter';
import ClientsFilter from './../../../components/Buddha/ClientsFilter';
import LoadingSpinner from './../../../components/Loaders/LoadingSpinner';
import IconEdit from './../../../components/Icons/IconEditPencilBlue';
import IconTick from './../../../components/Icons/IconTickGreen';
import IconCancel from './../../../components/Icons/IconClose';
import s from './CustomerPricing.css';

const propTypes = {
    onCustomerChange: PropTypes.func,
    activities: PropTypes.arrayOf(
        PropTypes.shape({
            id: PropTypes.number,
            type_id: PropTypes.number,
            name: PropTypes.string,
            status: PropTypes.number,
            price: PropTypes.number
        })
    ),
    activitiesLoading: PropTypes.bool,
    customerIsSelected: PropTypes.bool,
    onModifyingActivityPriceChange: PropTypes.func,
    onModifyingActivityEdit: PropTypes.func,
    onModifyingActivityCancel: PropTypes.func,
    onModifyingActivitySave: PropTypes.func,
    modifyingActivityId: PropTypes.number,
    modifyingActivityPrice: PropTypes.number
};

const defaultProps = {
    onCustomerChange: null,
    activities: [],
    activitiesLoading: false,
    customerIsSelected: false,
    onModifyingActivityPriceChange: null,
    onModifyingActivityEdit: null,
    onModifyingActivityCancel: null,
    onModifyingActivitySave: null,
    modifyingActivityId: null,
    modifyingActivityPrice: null
};

const PricingTable = (props) => {
    let rows = [];
    if (props.activitiesLoading) {
        rows.push(
            <TableRow key="loading-activities">
                <TableCell colSpan={4} align="center">
                    <LoadingSpinner />
                </TableCell>
            </TableRow>
        );
    } else if (props.activities && props.activities.length > 0) {
        const activityRows = props.activities.map((activity, activityIndex) => {
            // Init
            let money = null;
            let buttons = null;

            // If activity is being modified
            if (props.modifyingActivityId && props.modifyingActivityId === activity.id) {
                buttons =
                    <div className={s.editButtonsContainer} key="edit-buttons-container">
                        <Button
                            key="button-save"
                            float="right"
                            onClick={props.onModifyingActivitySave ? e => props.onModifyingActivitySave(e) : null}
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
                            onClick={e => props.onModifyingActivityCancel(e)}
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

                money = <div />;

                money =
                    <Counter
                        onChange={props.onModifyingActivityPriceChange ? props.onModifyingActivityPriceChange : null}
                        decimals={2}
                        showPlusMinus={true}
                        increment={5}
                        defaultValue={props.modifyingActivityPrice ? props.modifyingActivityPrice : 0}
                    />;
            } else {
                buttons =
                    <Button
                        onClick={e => props.onModifyingActivityEdit(activity.id)}
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

                money = activity.price === null
                    ? <Paragraph type="dim">Not defined</Paragraph>
                    : <Money value={activity.price} valueBold={activity.price > 0 ? true : false} />;
            }

            return (
                <TableRow key={'act-' + activity.id}>
                    <TableCell align="left">
                        <Paragraph>{activity.type_id === 2 ? 'Timesheet' : 'Billing'}</Paragraph>
                    </TableCell>
                    <TableCell align="left">
                        <Paragraph>{activity.name}</Paragraph>
                    </TableCell>
                    <TableCell align="right">
                        {buttons}
                    </TableCell>
                    <TableCell align="right">
                        {money}
                    </TableCell>
                </TableRow>
            );
        });

        rows = rows.concat(activityRows);
    } else if (props.customerIsSelected === false) {
        rows.push(
            <TableRow key="no-customer" type="highlight">
                <TableCell colSpan={4} align="center">
                    <ClientsFilter
                        onChange={props.onCustomerChange ? e => props.onCustomerChange(e) : undefined}
                        allAreAllowed={false}
                        align="center"
                        label="Pick customer to view and modify their current pricing"
                        valueLabel=""
                    />
                </TableCell>
            </TableRow>
        );
    } else {
        rows.push(
            <TableRow key="no-pricing" type="highlight">
                <TableCell colSpan={4} align="center">
                    <Paragraph>Customer currently has no pricing defined.</Paragraph>
                </TableCell>
            </TableRow>
        );
    }

    return (
        <Table
            header={[
                { title: 'Type', align: 'left' },
                { title: 'Activity', align: 'left' },
                { title: '', align: 'right' },
                { title: 'Price', align: 'right' }
            ]}
            columnsWidths={['20%', '30%', '30%', '20%']}
        >
            {rows}
        </Table>
    );
};

PricingTable.propTypes = propTypes;
PricingTable.defaultProps = defaultProps;

export default PricingTable;
