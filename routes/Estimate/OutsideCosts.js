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
import ExpensePicker from './ExpensePicker';
import Button from './../../components/Button/Button';

/**
 * OutsideCosts
 */
class OutsideCosts extends React.Component {

    /**
    * OutsideCosts Constructor
    * @param {props} props from parent component
    * @return {void}
    */
    constructor(props, context) {
        super(props, context);

        this.state = {
            savingExpense: false
        };
    }

    handleCreateExpensePicked(index, e) {
        this.props.onHandleCreateExpensePicked(index, e);
    }
    /**
    * handle expense value
    * @return {json} value of onNewCreated/Change event in ExpensePicker
    * @return {void}
    */
    handleExpensePicked(index, e) {
        //return;
        if (typeof e !== 'undefined' && typeof e.value !== 'undefined' && typeof e.label !== 'undefined') {
            // Indicate campaign is being saved
            this.setState({
                savingExpense: true
            });

            // Expense
            const expenseId = e.value;
            this.props.onHandleExpensePicked(index, expenseId);
        }
    }

    /**
    * Render OutsideCosts component
    * @return {jsxresult} result in jsx format
    */
    render() {
        let outsideCostsTableHeader = [
            { title: 'Expense', align: 'left' },
            { title: 'Amount', align: 'center' },
            { title: 'Budget', align: 'center' },
            { title: '', align: 'right' }
        ];

        let outsideCostsTableColumnsWidth = [
            '25%',
            '25%',
            '40%',
            '10%'
        ];

        // Render workers table
        return (
            <Table
                ref="outCostsTable"
                header={outsideCostsTableHeader}
                columnsWidths={outsideCostsTableColumnsWidth}
            >
                {(() => {
                        let dataArr = this.props.outCostArr;


                        let itemRows;
                        if (dataArr.length > 0) {
                            itemRows = dataArr.map((item, index) => {
                                return (
                                    <TableRow key={`outcost-${index}`}>
                                        <TableCell>
                                            <ExpensePicker
                                                ref="ExpensePicker"
                                                align="left"
                                                label="Expense"
                                                selectedId={item.expenseId}
                                                onNewCreated={(e) => this.handleCreateExpensePicked(index, e)}
                                                onChange={(e) => this.handleExpensePicked(index, e)}
                                            />
                                        </TableCell>
                                        <TableCell align="center">
                                            <Counter
                                                onChange={count => this.props.onHandleOutsideCostsChange(index, 'amount', count)}
                                                min={0}
                                                increment={10}
                                                showPlusMinus={true}
                                                fieldMaxWidth={106}
                                                value={item.amount}
                                            />
                                        </TableCell>
                                        <TableCell>
                                            <Toggle
                                                onChange={e => this.props.onHandleOutsideCostsChange(index, 'budgetType', e)}
                                                isRight={item.budgetType}
                                                left={{
                                                    label: 'Part of budget',
                                                    value: false
                                                }}
                                                right={{
                                                    label: 'Bill back to client',
                                                    value: true
                                                }}
                                                align='center'
                                            />
                                        </TableCell>
                                        <TableCell>
                                            <Button
                                                onClick={e => this.props.onHandleRemoveOutsideCosts(index)}
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
                                <TableRow key="no-outsidecosts-selected">
                                    <TableCell align="center" colSpan={8}>
                                        <Paragraph>No outside costs</Paragraph>
                                    </TableCell>
                                </TableRow>
                            ];
                        }

                        itemRows.push(
                            <TableRow key="btn-outsidecosts">
                                <TableCell align="right" colSpan={8}>
                                    <Button
                                        onClick={e => this.props.onHandleAddOutsideCosts()}
                                        float="right"
                                        label={{
                                            size: 'small',
                                            color: 'blue',
                                            text: 'Add outside cost'
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

export default OutsideCosts;
