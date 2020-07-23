import React, { PropTypes } from 'react';
import s from './OptionsList.css';
import { debounce, isEqual } from 'lodash';
import { truncuateString, capitalizePhraseOrWord } from './../../helpers/text';
import { searchPhraseInString } from './../../helpers/search';
import Input from './Input';

const propTypes = {
    className: PropTypes.string,
    onChange: PropTypes.func,
    search: PropTypes.shape({
        autoFocus: PropTypes.bool,
        label: PropTypes.string,
        onChange: PropTypes.func,
        searchViaApi: PropTypes.bool,
        value: PropTypes.any
    }),
    height: PropTypes.number,
    align: PropTypes.oneOf(['left', 'center', 'right']),
    label: PropTypes.string,
    value: PropTypes.any,
    options: PropTypes.arrayOf(
        PropTypes.shape({
            key: PropTypes.any,
            value: PropTypes.oneOfType([
                PropTypes.string,
                PropTypes.number,
                PropTypes.bool,
                PropTypes.object,
                PropTypes.array
            ]).isRequired,
            label: PropTypes.string.isRequired
        })
    ),
    loadingOptions: PropTypes.bool,
    highlightFirstOption: PropTypes.bool,
    directHint: PropTypes.shape({
        value: PropTypes.any.isRequired,
        label: PropTypes.string.isRequired
    })
};

const defaultProps = {
    className: '',
    onChange: null,
    search: null,
    height: 0,
    align: 'left',
    label: null,
    value: null,
    options: [],
    loadingOptions: false,
    highlightFirstOption: false,
    directHint: null
};

class OptionsList extends React.Component {
    constructor(props, context) {
        super(props, context);

        this.state = {
            highlighted: null,
            filteredOptions: [],
            height: 0
        };

        this.listEvents = {
            window: []
        };

        this.searchField = null;
    }

    componentDidMount() {
        if (typeof this.refs !== 'undefined' && typeof this.refs.container !== 'undefined') {
            // Get elements
            const container = this.refs.container;
            const parent = container.parentElement;

            // Check if parent is dropdown group
            if (parent.className.indexOf('dropdownGroup') !== -1) {
                parent.style.overflow = 'hidden';
                const height = parent.offsetHeight;
                this.setState({
                    height: this.props.height && this.props.height < height ? this.props.height : height
                });
            }
        }
    }

    componentWillUnmount() {
        this.removeListEvents();
    }

    removeListEvents() {
        // Remove window events
        this.listEvents.window.map(evt => {
            window.removeEventListener(evt.type, evt.handler);
        });
    }

    searchOptionsLocally(query) {
        // Check if value is defined
        if (typeof query !== 'undefined') {
            // Prepare filtered options
            let filteredOptions = [];

            // Check if value is not empty
            if (query !== '') {
                if (this.props.options.length > 0) {
                    this.props.options.map((option, index) => {
                        const valueSearch = typeof option.value !== 'undefined'
                            ? searchPhraseInString(option.value, query, true, true)
                            : false;
                        const labelSearch = typeof option.label !== 'undefined'
                            ? searchPhraseInString(option.label, query, true, true)
                            : false;
                        if (valueSearch === true || labelSearch === true) {
                            filteredOptions.push(option);
                        }
                    });
                }
            }

            // Update state
            this.setState({
                filteredOptions: filteredOptions
            });
        }
    }

    handleOptionsSearch(e) {
        // Check if search exists
        if (this.props.search !== null) {
            // Check if API should handle search
            if (typeof this.props.search.searchViaApi === 'undefined' || this.props.search.searchViaApi !== true) {
                this.searchOptionsLocally(e.target.value);
            }

            if (typeof this.props.search.onChange !== 'undefined') {
                this.props.search.onChange(e.target.value);
            }
        }
    }

    handleSelectionChange(e, value, label) {
        // Check if values are provided
       if (typeof value !== 'undefined' && typeof label !== 'undefined') {
            // Forward function if it's passed as a prop
            if (this.props.onChange !== null) {
                this.props.onChange({ value: value, label: label });
            }
        }
    }

    render() {
        // Class name and style of the options list
        let optionsListClassName = 'optionsList';
        let optionsListStyle = {};

        if (this.props.height > 0) {
            optionsListClassName += ' fixedHeightList';
            optionsListStyle.height = this.props.height + 'px';
        }

        if (this.state.height > 0) {
            optionsListStyle.height = this.state.height + 'px';
        }

        if (this.props.search !== null) {
            optionsListClassName += ' optionsListWithSearch';
        }

        // Render
        return (
            <div ref="container" className={optionsListClassName} style={optionsListStyle}>

                {this.props.search !== null && (
                    <div className="optionsListSearch">
                        <Input
                            ref={ref => this.searchField = ref}
                            onChange={e => this.handleOptionsSearch(e)}
                            autoFocus={typeof this.props.search.autoFocus !== 'undefined' ? this.props.search.autoFocus : false}
                            value={typeof this.props.search.value !== 'undefined' ? this.props.search.value : undefined}
                            label={typeof this.props.search.label !== 'undefined' ? this.props.search.label : 'Search...'}
                        />
                    </div>
                )}

                <div ref="optionsListResults" className="optionsListResults">
                    {(() => {
                        if (this.props.options.length > 0) {
                            // List class name
                            let listClassName = '';
                            if (this.props.align !== 'left') {
                                listClassName += ' ' + s['align' + capitalizePhraseOrWord(this.props.align)];
                            }

                            // Options list
                            const options = this.state.filteredOptions.length || this.props.search && this.props.search.value
                                ? this.state.filteredOptions
                                : this.props.options;

                            // Current value
                            const selectedValue = this.props.value;

                            // Render
                            return (
                                <ul className={listClassName !== '' ? listClassName : null}>
                                    {this.props.label !== null && (
                                        <li className="optionsListLabel">
                                            <p>{this.props.label}</p>
                                        </li>
                                    )}
                                    {(this.props.directHint) && (
                                        <li className="optionsListCreate" key={this.props.directHint.value}>
                                            <button onClick={e => this.handleSelectionChange(e, this.props.directHint.value, this.props.directHint.label)}>
                                                {this.props.directHint.label}
                                            </button>
                                        </li>
                                    )}
                                    {(options.length === 0) && (
                                        <li className="optionsListNoResults">
                                            <p>No results found</p>
                                        </li>
                                    )}
                                    {options.map((option, index) => {
                                        // Option class name
                                        let optionClassName = '';

                                        // Check if result is active
                                        let resultIsActive = false;
                                        if (typeof option.value !== 'undefined') {
                                            if (option.value === null) {
                                                resultIsActive = (selectedValue === null) ? true : false;
                                            } else if (
                                                typeof option.value !== 'undefined' &&
                                                typeof option.value === 'object' &&
                                                option.value !== null &&
                                                typeof option.value.length !== 'undefined'
                                            ) {
                                                resultIsActive = option.value.some(val => {
                                                    return selectedValue === val ? true : false;
                                                });
                                            } else {
                                                resultIsActive = isEqual(option.value, selectedValue);
                                            }
                                        }

                                        if (resultIsActive === true) {
                                            optionClassName += ' activeResult';
                                        }

                                        if (this.state.highlighted !== null) {
                                            optionClassName += this.state.highlighted === index
                                                ? ' highlightedResult'
                                                : '';
                                        }

                                        const optionKey = typeof option.key !== 'undefined'
                                            ? option.key
                                            : typeof option.value === 'object'
                                                ? JSON.stringify(option.value)
                                                : option.value;

                                        return (
                                            <li key={optionKey} className={optionClassName !== '' ? optionClassName : null}>
                                                <button onClick={e => this.handleSelectionChange(e, option.value, option.label)}>
                                                    {
                                                        typeof option.label !== 'undefined'
                                                            ? option.label
                                                            : option.value
                                                    }
                                                </button>
                                            </li>
                                        );
                                    })}
                                </ul>
                            );
                        } else if (this.props.loadingOptions === true) {
                            return (
                                <ul>
                                    <li className="optionsListLoadingResults">
                                        <p>Loading...</p>
                                    </li>
                                </ul>
                            );
                        } else {
                            return (
                                <ul>
                                    {(this.props.directHint) && (
                                        <li>
                                            <button onClick={e => this.handleSelectionChange(e, this.props.directHint.value, this.props.directHint.label)}>
                                                {this.props.directHint.label}
                                            </button>
                                        </li>
                                    )}
                                    <li className={s.noResults}>
                                        <p>No options</p>
                                    </li>
                                </ul>
                            );
                        }
                    })()}
                </div>
            </div>
        );
    }
}

OptionsList.propTypes = propTypes;
OptionsList.defaultProps = defaultProps;

export default OptionsList;
