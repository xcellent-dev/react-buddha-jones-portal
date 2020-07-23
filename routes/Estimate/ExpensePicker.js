import React, { PropTypes } from 'react';
import { isEqual } from 'lodash';
import * as API from './../../actions/api';
import DropdownContainer from './../../components/Form/DropdownContainer';
import OptionsList from './../../components/Form/OptionsList';

const propTypes = {
    onChange: PropTypes.func,
    onNewCreated: PropTypes.func,
    onNewCreating: PropTypes.func,
    align: PropTypes.oneOf(['left', 'center', 'right']),
    label: PropTypes.string,
    valueLabel: PropTypes.string,
    truncuateLabelTo: PropTypes.number,
    excludeIds: PropTypes.arrayOf(PropTypes.number),
    projectId: PropTypes.number,
    disabledCreating: PropTypes.bool,
    closeWhenPicked: PropTypes.bool
};

const defaultProps = {
    onChange: null,
    onNewCreated: null,
    onNewCreating: null,
    align: 'right',
    excludeIds: [],
    label: 'Pick campaign',
    truncuateLabelTo: 32,
    disabledCreating: false,
    closeWhenPicked: true
};

/**
 * ExpensePicker
 */
class ExpensePicker extends React.Component {

    /**
    * ExpensePicker Constructor
    * @param {props} props from parent component
    * @return {void}
    */
    constructor(props) {
        super(props);

        this.state = {
            selected: {
                value: '',
                label: ''
            },
            expenses: [],
            options: [],
            query: '',
            loadingOptions: false,
            saving: false,
            directHint: null
        };
    }

    /**
    * React lifecycle function -
    * - invoked immediately after a component is mounted
    * @return {void}
    */
    componentDidMount() {
        this.fetchExpense({
            length: 9999,
            offset: 0
        });
    }

    /**
    * React lifecycle function -
    * - invoked before a mounted component receives new props
    * set options of ExpensePicker after receiving new props
    * @return {void}
    */
    componentWillReceiveProps(nextProps) {
        if (this.state.expenses.length > 0) {
            this.filterExpensesToOptions(()=>{});
        }
    }

    /**
    * Close picker dropdown
    * @return {void}
    */
    closeDropdown() {
        if (typeof this.refs !== 'undefined' && typeof this.refs.expensePickerDropdown !== 'undefined') {
            const dropdown = this.refs.expensePickerDropdown;
            if (typeof dropdown.closeDropdown !== 'undefined') {
                dropdown.closeDropdown();
            }
        }
    }

    /**
    * Fetch expense data
    * @param {json} fetch options
    * @return {void}
    */
    fetchExpense(params) {
        this.setState({
            loadingOptions: true
        });
        API.get(API.OUTSIDE_COST, params)
            .then(response => {
                this.setState({
                    loadingOptions: false,
                    expenses: response
                }, () => {
                    this.filterExpensesToOptions(this.setSelectedExpenseItem(this.props.selectedId));
                });
            }).catch(error => {
                this.setState({
                    loadingOptions: false
                });
            });
    }

    /**
    * Displays the selected option
    * @param {int} selectedId The ID of the selected option
    * @return {void}
    */
    setSelectedExpenseItem(selectedId) {
        if (selectedId !== null) {
            let selectedLabel = null;
            this.state.expenses.map((item, index)=>{
                if (item.id === selectedId) {
                    selectedLabel = item.name;
                }
            });
            if (selectedLabel !== null) {
                this.handleSelectOrCreate({
                    value: selectedId,
                    label: selectedLabel
                });
            }
        }
    }

    /**
    * Set options of ExpensePicker
    * @return {void}
    */
    filterExpensesToOptions(cb) {
        const filteredExpenses = this.state.expenses;
        this.setState({
            options: filteredExpenses.length > 0
                ? filteredExpenses.map(c => {
                    return {
                        value: c.id,
                        label: c.name
                    };
                })
                : []
        }, ()=>{cb()});
    }

    /**
    * Save a new expense value
    * @param {json} Newly created expense value
    * @return {void}
    */
    uploadExpense(params) {
        this.setState({
            saving: true
        });

        if (this.props.onNewCreating) {
            this.props.onNewCreating(params.name);
        }

        API.post(API.OUTSIDE_COST, API.makePostData(params))
            .then(response => {
                this.setState({
                    saving: false,
                    directHint: null,
                    query: ''
                });

                if (this.props.onNewCreated) {
                    let returnId = parseInt(response.data.id, 10);
                    this.props.onNewCreated({
                        //value: parseInt(response.data.expense_id, 10),
                        value: returnId,
                        label: params.name
                    });

                    const updatedExpensesArray = Object.assign([], this.state.expenses);
                    updatedExpensesArray.push({
                        id: returnId,
                        name: params.name
                    });

                    this.setState({
                        expenses: updatedExpensesArray
                    }, ()=>{
                        this.filterExpensesToOptions(()=>this.setSelectedExpenseItem(returnId));
                    });

                    if (this.props.closeWhenPicked) {
                        this.closeDropdown();
                    }
                }
            })
            .catch(error => {
                this.setState({
                    saving: false
                });

                if (this.props.closeWhenPicked) {
                    this.closeDropdown();
                }
            });
    }

    /**
    * Handle select or create expense value
    * @param {json} a expnese data
    * @return {void}
    */
    handleSelectOrCreate(e) {
        if (e.value === 'createExpense') {
            // Create campaign
            this.uploadExpense({
                name: this.state.query
            });
        } else {
            // Select the campaign
            this.setState({
                selected: e
            });

            if (this.props.onChange) {
                this.props.onChange(e);
            }

            if (this.props.closeWhenPicked) {
                this.closeDropdown();
            }
        }
    }

    /**
    * Search expense
    * @param {str} Input value
    * @return {void}
    */
    handleSearchQuery(e) {
        this.setState({
            query: e.replace(/\b\w/g, l => l.toUpperCase())  // Capitalize
        }, () => {
            if (this.state.query === '' || this.isExactlyMatch(this.state.query)) {
                // Remove direct hint
                this.setState({
                    directHint: null
                });
            } else if (this.props.disabledCreating === false) {
                // Set direct hint
                this.setState({
                    directHint: {
                        value: 'createExpense',
                        label: 'Create new expense: ' + this.state.query
                    }
                });
            }
        });
    }

    /**
    * Compare input value
    * @param {str} Input value
    * @return {void}
    */
    isExactlyMatch(query) {
        return !!this.state.options.find(option => option.label.toLowerCase() === query.trim().toLowerCase());
    }

    /**
    * Render ExpensePicker component
    * @return {jsxresult} result in jsx format
    */
    render() {
        if (this.state.saving) {
            return (
                <div className="expensePicker">
                    <p>Saving new expense...</p>
                </div>
            );
        } else {
            return (
                <div className="campaignPicker">
                    <DropdownContainer
                        ref="expensePickerDropdown"
                        align={this.props.align}
                        minWidth={210}
                        overflowAuto={true}
                        label={this.props.label}
                        value={this.state.selected.label}
                    >
                        <OptionsList
                            onChange={e => this.handleSelectOrCreate(e)}
                            search={{
                                autoFocus: true,
                                label: 'Search or create expense by name...',
                                onChange: (e) => this.handleSearchQuery(e),
                                value: this.state.query
                            }}
                            value={this.state.selected.value}
                            options={this.state.options}
                            loadingOptions={this.state.loadingOptions}
                            directHint={this.state.directHint}
                        />
                    </DropdownContainer>
                </div>
            );
        }
    }
}

ExpensePicker.propTypes = propTypes;
ExpensePicker.defaultProps = defaultProps;

export default ExpensePicker;
