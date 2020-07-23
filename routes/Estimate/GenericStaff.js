import React from 'react';
import Table from './../../components/Table/Table';
import TableRow from './../../components/Table/TableRow';
import TableCell from './../../components/Table/TableCell';
import Input from './../../components/Form/Input';
import Paragraph from './../../components/Content/Paragraph';
import Money from './../../components/Content/Money';
import Counter from './../../components/Form/Counter';
import IconCheckmarkGreen from './../../components/Icons/IconCheckmarkGreen';
import DropdownContainer from './../../components/Form/DropdownContainer';
import OptionsList from './../../components/Form/OptionsList';
import Toggle from './../../components/Form/Toggle';
import GenericStaffPicker from './GenericStaffPicker';
import Button from './../../components/Button/Button';

/**
 * GenericStaff
 */
class GenericStaff extends React.Component {

    /**
    * GenericStaff Constructor
    * @param {props} props from parent component
    * @return {void}
    */
    constructor(props, context) {
        super(props, context);
    }
    
    /**
    * handle expense value
    * @return {json} value of onChange event in ExpensePicker
    * @return {void}
    */
    handleStaffPicked(index, e) {
        //return;
        if (typeof e !== 'undefined' && typeof e.value !== 'undefined' && typeof e.label !== 'undefined') {
            // Staff
            const staffId = e.value;
            const staffRate = e.rate;            
            this.props.onHandleStaffPicked(index, staffId, staffRate);
        }
    }

    /**
    * Render GenericStaff component
    * @return {jsxresult} result in jsx format
    */
    render() {
        let props = this.props.info;

        const isNotDraftEstimate =
            this.props.estimateId &&
            typeof props.estimateStatus !== 'undefined' && props.estimateStatus !== 'Draft'
                ? true
                : false;

        let genericStaffTableHeader = [
            { title: 'Staff', align: 'left' },
            { title: 'Rate', align: 'left' },
            { title: props.showEstimateDays ? 'Regular Days' : 'Regular Hours', align: 'center' },
            { title: props.showEstimateDays ? 'Overtime Days' : 'Overtime Hours', align: 'center' }            
        ];

        if (props.showEstimateDays === false) {
            genericStaffTableHeader.push(
                { title: 'Double time hours', align: 'center' }
            );
        }

        genericStaffTableHeader.push(
            { title: 'Total', align: 'right' },
            { title: '', align: 'right' }
        );

     
        let genericStaffTableColumnsWidth = [
            '25%',
            '25%',
            '20%',
            '20%',
            '10%'
        ];

        if (props.showEstimateDays === false) {
            genericStaffTableColumnsWidth = [
                '23%',
                '20%',
                '12%',
                '12%',
                '12%',
                '21%',                
            ];
        }

        // Render workers table
        return (
            <Table
                ref="outCostsTable"
                header={genericStaffTableHeader}
                columnsWidths={genericStaffTableColumnsWidth}
            >
                {(() => {
                        let dataArr = this.props.genericStaffArr;
                        let showEstimateDays = props.showEstimateDays;

                        let itemRows;
                        if (dataArr.length > 0) {
                            itemRows = dataArr.map((item, index) => {
                                // Worker hours
                                let workerRegularHours = typeof item === 'undefined' ? 0 : item.regular;
                                let workerOvertimeHours = typeof item === 'undefined' ? 0 : item.overtime;
                                let workerDoubletimeHours =
                                    typeof item === 'undefined' ? 0 : item.doubletime;

                                return (
                                    <TableRow key={`genericstaff-${index}`}>
                                        <TableCell>
                                            <GenericStaffPicker
                                                ref="GenericStaffPicker"
                                                align="left"
                                                label="Generic Staff"
                                                selectedId={item.id}                                                
                                                onChange={(e) => this.handleStaffPicked(index, e)}
                                                excludeIds={this.props.excludeIds}
                                            />
                                        </TableCell>
                                        <TableCell>
                                           <Money value={item.rate} />
                                        </TableCell>
                                        
                                        <TableCell align="center">
                                            <Counter
                                                onChange={count => this.props.onHandleStaffChange(index, item.rate, 'regular', count)}
                                                min={0}
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
                                                onChange={count => this.props.onHandleStaffChange(index, item.rate, 'overtime', count)}
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
                                                        onChange={count => this.props.onHandleStaffChange(index, item.rate, 'doubletime', count)}
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


                                        <TableCell align="center">
                                            <Money value={item.totalCost} />
                                        </TableCell>
                                        <TableCell>
                                            <Button
                                                onClick={e => this.props.onHandleRemoveStaff(index)}
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
                            itemRows = [
                                <TableRow key="no-genericstaff-selected">
                                    <TableCell align="center" colSpan={8}>
                                        <Paragraph>No generic staff</Paragraph>
                                    </TableCell>
                                </TableRow>
                            ];
                        }

                        itemRows.push(
                            <TableRow key="btn-genericstaff">
                                <TableCell align="right" colSpan={8}>
                                    <Button
                                        onClick={e => this.props.onHandleAddStaff()}
                                        float="right"
                                        label={{
                                            size: 'small',
                                            color: 'blue',
                                            text: 'Add generic staff'
                                        }}
                                    />
                                </TableCell>
                            </TableRow>
                        );
                        return itemRows;
                })()}
            </Table>
        );
    }
}

export default GenericStaff;
