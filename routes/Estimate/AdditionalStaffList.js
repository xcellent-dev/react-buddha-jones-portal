import React from 'react';
import Table from './../../components/Table/Table';
import TableRow from './../../components/Table/TableRow';
import TableCell from './../../components/Table/TableCell';
import Input from './../../components/Form/Input';
import Paragraph from './../../components/Content/Paragraph';
import Money from './../../components/Content/Money';
import Counter from './../../components/Form/Counter';
import Button from './../../components/Button/Button';

/**
 * AdditionalStaffList
 */
class AdditionalStaffList extends React.Component {

    /**
    * AdditionalStaffList Constructor
    * @param {props} props from parent component
    * @return {void}
    */
    constructor(props, context) {
        super(props, context);
    }

    /**
    * Render AdditionalStaffList component
    * @return {jsxresult} result in jsx format
    */
    render() {
        let props = this.props.info;

        const isNotDraftEstimate =
            this.props.estimateId &&
            typeof props.estimateStatus !== 'undefined' && props.estimateStatus !== 'Draft'
                ? true
                : false;

        let workersTableHeader = [
            { title: 'Role or name', align: 'left' },
            { title: 'Rate', align: 'center' },
            { title: props.showEstimateDays ? 'Regular Days' : 'Regular Hours', align: 'center' },
            { title: props.showEstimateDays ? 'Overtime Days' : 'Overtime Hours', align: 'center' },
        ];

        if (props.showEstimateDays === false) {
            workersTableHeader.push(
                { title: 'Double time hours', align: 'center' }
            );
        }

        workersTableHeader.push(
            { title: 'Total', align: 'right' },
            { title: '', align: 'right' }
        );

        // Set additionalstaff table columns widths
        let workersTableColumnsWidth = [
            '24%',
            '20%',
            '14%',
            '14%',
            '14%',
            '14%'
        ];

        if (props.showEstimateDays === false) {
            workersTableColumnsWidth = [
                '23%',
                '20%',
                '12%',
                '12%',
                '12%',
                '11%',
                '10%'
            ];
        }

        // Render workers table
        return (
            <Table
                ref="workersTable"
                header={workersTableHeader}
                columnsWidths={workersTableColumnsWidth}
            >
                {(() => {
                        let {
                            additionalWorkers,
                            loadedWorkers,
                            workersFilter,
                            showEstimateDays
                        } = props;

                        let workerRows;
                        if (additionalWorkers.length > 0) {
                            workerRows = additionalWorkers.map((worker, index) => {
                                // Prepare values
                                let estimatedTotal = 0;
                                const selectedWorker = worker;

                                // Check if worker is selected
                                if (typeof selectedWorker !== 'undefined') {
                                    // Get estimated total
                                    estimatedTotal = selectedWorker.totalCost;
                                }

                                // Worker hours
                                let workerRegularHours = typeof selectedWorker === 'undefined' ? 0 : selectedWorker.regular;
                                let workerOvertimeHours = typeof selectedWorker === 'undefined' ? 0 : selectedWorker.overtime;
                                let workerDoubletimeHours =
                                    typeof selectedWorker === 'undefined' ? 0 : selectedWorker.doubletime;

                                // Render
                                return (
                                    <TableRow key={`worker-${index}`}>

                                        <TableCell>
                                            <Input
                                                value={worker.role}
                                                onChange={e => this.props.onHandleAdditionalRoleChange(index, e)}
                                            />
                                        </TableCell>

                                        <TableCell align="right">
                                            <Counter
                                                onChange={rate => this.props.onHandleAdditionalRateChange(index, rate)}
                                                min={1}
                                                multipleOf={0.01}
                                                increment={5}
                                                decimals={2}
                                                showPlusMinus={true}
                                                value={worker.rate}
                                                fieldMaxWidth={106}
                                            />
                                        </TableCell>

                                        <TableCell align="center">
                                            <Counter
                                                onChange={count => this.props.onHandleAdditionalHoursChange(index, worker.rate, 'regular', count)}
                                                min={0}
                                                multipleOf={0.25}
                                                increment={1}
                                                showPlusMinus={false}
                                                value={workerRegularHours}
                                                readOnly={isNotDraftEstimate}
                                                readOnlyTextAfter={
                                                    showEstimateDays?' day':' hour' + (workerRegularHours > 1 ? 's' : '')
                                                }
                                            />
                                        </TableCell>

                                        <TableCell align="center">
                                            <Counter
                                                onChange={count => this.props.onHandleAdditionalHoursChange(index, worker.rate, 'overtime', count)}
                                                min={0}
                                                multipleOf={0.25}
                                                increment={1}
                                                showPlusMinus={false}
                                                value={workerOvertimeHours}
                                                readOnly={isNotDraftEstimate}
                                                readOnlyTextAfter={
                                                    showEstimateDays?' day':' hour' + (workerOvertimeHours > 1 ? 's' : '')
                                                }
                                            />
                                        </TableCell>

                                        {
                                            (showEstimateDays === false) &&
                                                <TableCell align="center">
                                                    <Counter
                                                        onChange={count => this.props.onHandleAdditionalHoursChange(index, worker.rate, 'doubletime', count)}
                                                        min={0}
                                                        multipleOf={0.25}
                                                        increment={1}
                                                        showPlusMinus={false}
                                                        value={workerDoubletimeHours}
                                                        readOnly={isNotDraftEstimate}
                                                        readOnlyTextAfter={
                                                            showEstimateDays?' day':' hour' + (workerDoubletimeHours > 1 ? 's' : '')
                                                        }
                                                    />
                                                </TableCell>
                                        }

                                        <TableCell align="right">
                                            <Money value={estimatedTotal} />
                                        </TableCell>

                                        <TableCell align="right">
                                            <Button
                                                onClick={e => this.props.onHandleRemoveAdditionalStaff(index)}
                                                label={{
                                                    text: 'Delete',
                                                    color: 'blue',
                                                    size: 'small',
                                                    onLeft: true
                                                }}
                                            />
                                        </TableCell>

                                    </TableRow>
                                );
                            });
                        } else {
                            workerRows = [
                                <TableRow key="no-additional-staff-selected">
                                    <TableCell align="center" colSpan={8}>
                                        <Paragraph>No additional staff added</Paragraph>
                                    </TableCell>
                                </TableRow>
                            ];
                        }

                        workerRows.push(
                            <TableRow key="btn-staff">
                                <TableCell align="right" colSpan={8}>
                                    <Button
                                        onClick={e => this.props.onHandleAddAdditionalStaff()}
                                        float="right"
                                        label={{
                                            size: 'small',
                                            color: 'blue',
                                            text: 'Add additional resource'
                                        }}
                                    />
                                </TableCell>
                            </TableRow>
                        );
                        return workerRows;
                })()}
            </Table>
        );
    }
}

export default AdditionalStaffList;
