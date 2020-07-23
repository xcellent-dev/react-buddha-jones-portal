import React, { PropTypes } from 'react';
import * as API from './../../actions/api';
import AlphabeticalOptionsList from './../Form/AlphabeticalOptionsList';
import Button from './../Button/Button';
import s from './ClientsFilter.css';

const propTypes = {
    className: PropTypes.string,
    onChange: PropTypes.func,
    maxWidth: PropTypes.number,
    value: PropTypes.any,
    valueLabel: PropTypes.string,
    label: PropTypes.string,
    truncuateLabelTo: PropTypes.number,
    allAreAllowed: PropTypes.bool,
    align: PropTypes.oneOf(['left', 'center', 'right'])
};

const defaultProps = {
    className: null,
    onChange: null,
    maxWidth: 360,
    value: null,
    valueLabel: null,
    label: 'Client',
    truncuateLabelTo: 32,
    allAreAllowed: true,
    align: 'right'
};

class ClientsFilterDropdown extends React.Component {
    constructor(props, context) {
        super(props, context);

        this.state = {
            selected: {
                value: '',
                label: this.props.allAreAllowed ? 'All' : 'None'
            },
            selectedLetter: '',
            options: [],
            loadingOptions: false,
            letters: [],
            loadingLetters: false,
            search: ''
        };

        this.alphabeticalCustomersList = null;
    }


    componentDidMount() {
        this.fetchFirstLetters();
    }

    fetchFirstLetters() {
        // Display that loading letters
        this.setState({
            loadingLetters: true
        });

        // Fetch
        API.get(API.CUSTOMER_FIRST_LETTERS)
            .then(response => {
                this.setState({
                    letters: response,
                    loadingLetters: false
                });
            })
            .catch(error => {
                this.setState({
                    loadingLetters: false
                });
            });
    }

    fetchCustomers(query, letter, offset, length) {
        // Request params
        const params = {
            search: query || '',
            first_letter: letter || '',
            offset: offset || 0,
            length: length || 10
        };

        // If no filter, then no API call
        if (params.search === '' && params.first_letter === '') {
            return;
        }

        // Display that loading options
        this.setState({
            loadingOptions: true,
        });

        // Fetch customers
        API.get(API.CUSTOMER, params)
            .then(response => {
                const options = response.map(customer => {
                    return {
                        value: customer.id,
                        label: customer.customerName
                    };
                });

                this.setState({
                    loadingOptions: false,
                    options: options
                });
            })
            .catch(error => {
                this.setState({
                    loadingOptions: false
                });
            });
    }

    handleClientChange(e) {
        this.setState({
            selected: e,
            selectedLetter: ''
        });

        // Pass value further
        if (this.props.onChange) {
            this.props.onChange(e);
        }
    }

    handleLetterChange(letter) {
        this.setState({
            selectedLetter: letter,
        }, () => {
            this.fetchCustomers('', letter);
        });
    }

    handleClientSearch(query) {
        this.setState({
            search: query
        }, () => {
            this.fetchCustomers(query);
        });
    }

    handleReset(e) {
        this.setState({
            selected: Object.assign({}, this.state.selected, {
                value: '',
                label: this.props.allAreAllowed ? 'All' : 'None'
            })
        });

        // Reset to letters
        if (this.alphabeticalCustomersList && typeof this.alphabeticalCustomersList.toggleBetweenLettersAndOptions !== 'undefined') {
            this.alphabeticalCustomersList.toggleBetweenLettersAndOptions(true);
        }

        // Pass value further
        if (this.props.onChange) {
            this.props.onChange({
                value: '',
                label: this.props.allAreAllowed ? 'All' : 'None'
            });
        }
    }

    render() {
        return (
            <div>
                <AlphabeticalOptionsList
                    ref={ref => this.alphabeticalCustomersList = ref}
                    onChange={e => this.handleClientChange(e)}
                    onLetterChange={e => this.handleLetterChange(e)}
                    search={{
                        autoFocus: true,
                        label: 'Client name...',
                        onChange: e => this.handleClientSearch(e)
                    }}
                    value={this.props.value !== null ? this.props.value : this.state.selected.value}
                    showSelectAllButton={true}
                    noOptionsLabel="No client matching criteria"
                    options={this.state.options}
                    loadingOptions={this.state.loadingOptions}
                    letters={this.state.letters}
                    loadingLetters={this.state.loadingLetters}
                />
                {this.state.selected.value && (
                    <Button
                        className={s.resetButton}
                        onClick={e => this.handleReset(e)}
                        label={{
                            text: 'Clear customer selection'
                        }}
                    />
                )}
            </div>
        );
    }
}

ClientsFilterDropdown.propTypes = propTypes;
ClientsFilterDropdown.defaultProps = defaultProps;

export default ClientsFilterDropdown;
