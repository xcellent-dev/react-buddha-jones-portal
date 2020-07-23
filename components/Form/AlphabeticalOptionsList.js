import React, { PropTypes } from 'react';
import { debounce } from 'lodash';
import Row from './../Section/Row';
import Col from './../Section/Col';
import Input from './Input';
import Button from './../Button/Button';
import OptionsList from './OptionsList';
import LoadingSpinner from './../Loaders/LoadingSpinner';
import LoadingShade from './../Loaders/LoadingShade';
import s from './AlphabeticalOptionsList.css';
import so from './OptionsList';

const propTypes = {
    className: PropTypes.string,
    onChange: PropTypes.func,
    onLetterChange: PropTypes.func,
    search: PropTypes.shape({
        label: PropTypes.string,
        onChange: PropTypes.func,
        autoFocus: PropTypes.bool
    }),
    label: PropTypes.string,
    value: PropTypes.any,
    showSelectAllButton: PropTypes.bool,
    noOptionsLabel: PropTypes.string,
    options: PropTypes.arrayOf(
        PropTypes.shape({
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
    letters: PropTypes.arrayOf(
        PropTypes.string
    ),
    loadingLetters: PropTypes.bool
};

const defaultProps = {
    className: '',
    onChange: null,
    onLetterChange: null,
    search: null,
    label: null,
    value: null,
    showSelectAllButton: false,
    noOptionsLabel: 'No results available',
    options: [],
    loadingOptions: false,
    letters: [],
    lettersLoading: true
};

class AlphabeticalOptionsList extends React.Component {
    constructor(props, context) {
        super(props, context);

        this.debounceOptionsSearch = this.debounceOptionsSearch.bind(this);
        this.handleOptionsSearch = debounce(this.handleOptionsSearch, 300);

        this.state = {
            containerHeight: 0,
            optionsListHeight: 0,
            showLetters: true
        };
    }

    componentDidMount() {
        // Set fixed height of the component
        if (typeof this.refs.container !== 'undefined') {
            // Get references
            const container = this.refs.container;
            const searchContainer = typeof this.refs.searchContainer !== 'undefined' ? this.refs.searchContainer : null;
            const labelContainer = typeof this.refs.labelContainer !== 'undefined' ? this.refs.labelContainer : null;

            // Get heights
            const containerHeight = container.offsetHeight;
            const searchContainerHeight = searchContainer ? searchContainer.offsetHeight : 0;
            const labelContainerHeight = labelContainer ? labelContainer.offsetHeight : 0;

            // Update heights
            this.setState({
                containerHeight: containerHeight,
                optionsListHeight: containerHeight - searchContainerHeight - labelContainerHeight
            });
        }
    }

    debounceOptionsSearch(e) {
        if (typeof e !== 'undefined' && typeof e.target !== 'undefined' && typeof e.target.value !== 'undefined') {
            this.handleOptionsSearch(e.target.value);
        }
    }

    toggleBetweenLettersAndOptions(showLetters) {
        if (this.state.showLetters !== showLetters) {
            // Change state
            this.setState({
                showLetters: showLetters
            });

            // Remove search query from search field
            if (showLetters === true) {
                if (this.props.onLetterChange !== undefined) {
                    // Clear selected letter
                    this.props.onLetterChange('');
                }

                if (typeof this.refs.searchField !== 'undefined') {
                    if (typeof this.refs.searchField.refs.input !== 'undefined') {
                        this.refs.searchField.refs.input.value === '';
                    }
                }
            }
        }
    }

    handleOptionsSearch(query) {
        if (typeof query !== 'undefined') {
            // Change between letters and options list
            if (query === '') {
                this.toggleBetweenLettersAndOptions(true);
            } else {
                this.toggleBetweenLettersAndOptions(false);
                if (typeof this.props.search.onChange !== 'undefined' && this.props.search.onChange) {
                    this.props.search.onChange(query.trim());
                }
            }
        }
    }

    handleLetterClick(character) {
        if (typeof character !== 'undefined') {
            // Change state
            this.setState({
                showLetters: false
            });

            // Pass further
            if (this.props.onLetterChange) {
                this.props.onLetterChange(character);
            }
        }
    }

    handleOptionClick(e) {
        if (typeof e !== 'undefined') {
            // Check if back button has been pressed
            if (e.value === 'goBackToLetters' || e.value === 'goBackToLettersAlt') {
                // Go back to letters
                this.toggleBetweenLettersAndOptions(true);

                // Clear search form
                if (typeof this.refs.searchField !== 'undefined') {
                    if (typeof this.refs.searchField.clear !== 'undefined') {
                        this.refs.searchField.clear();
                    }
                }
            } else {
                // Pass further
                if (this.props.onChange) {
                    this.props.onChange(e);
                }
            }
        }
    }

    render() {
        return (
            <div
                ref="container"
                className={s.alphabeticalList}
                style={
                    this.state.containerHeight > 0
                        ? { height: this.state.containerHeight + 'px' }
                        : { height: 'auto' }
                }
            >
                {(() => {
                    if (this.props.search !== null) {
                        return (
                            <div ref="searchContainer" className="optionsListSearch">
                                <Input
                                    ref="searchField"
                                    onChange={this.debounceOptionsSearch}
                                    label={typeof this.props.search.label !== 'undefined' ? this.props.search.label : 'Search...'}
                                    autoFocus={typeof this.props.search.autoFocus !== 'undefined' && this.props.search.autoFocus
                                        ? this.props.search.autoFocus : false}
                                />
                            </div>
                        );
                    }
                })()}
                {(() => {
                    if (this.props.label !== null) {
                        return (
                            <div ref="labelContainer" className="optionsListLabel">
                                <p>{this.props.label}</p>
                            </div>
                        );
                    }
                })()}
                {(() => {
                    if (this.state.showLetters) {
                        return this.renderLettersGrid();
                    } else {
                        return this.renderOptionsList();
                    }
                })()}
            </div>
        );
    }

    renderLettersGrid() {
        // Letters
        const letterGroups = [
            { id: 'l1', letters: ['0-9', 'A', 'B', 'C'] },
            { id: 'l2', letters: ['D', 'E', 'F', 'G'] },
            { id: 'l3', letters: ['H', 'I', 'J', 'K'] },
            { id: 'l4', letters: ['L', 'M', 'N', 'O'] },
            { id: 'l5', letters: ['P', 'Q', 'R', 'S'] },
            { id: 'l6', letters: ['T', 'U', 'V', 'W'] },
            { id: 'l7', letters: ['X', 'Y', 'Z', '?'] }
        ];

        // Render
        return (
            <div className={s.lettersGrid}>
                {letterGroups.map(lettersGroup => {
                    return (
                        <Row key={lettersGroup.id} removeGutter={true} removeMargins={true}>
                            {lettersGroup.letters.map((letter, letterIndex) => {
                                // Letter is available
                                const letterAvailable = this.props.letters.indexOf(letter) !== -1 ? true : false;

                                // Letter class name
                                let letterClassName = '';
                                letterClassName += letterAvailable ? ' ' + s.available : '';

                                // Render individual letter
                                return (
                                    <Col key={letterIndex}>
                                        <button
                                            className={letterClassName !== '' ? letterClassName : null}
                                            onClick={
                                                letterAvailable
                                                    ? e => this.handleLetterClick(letter)
                                                    : e => this.handleLetterClick()
                                            }
                                        >{letter}</button>
                                    </Col>
                                );
                            })}
                        </Row>
                    );
                })}
                {this.props.loadingLetters && (
                    <LoadingShade>
                        <LoadingSpinner size="48" />
                    </LoadingShade>
                )}
            </div>
        );
    }

    renderOptionsList() {
        let optionsValues = [];
        const backOption = [{ value: 'goBackToLetters', label: '←' }];
        if (this.props.options.length > 0) {
            optionsValues = backOption.concat(this.props.options);
        } else if (!this.props.loadingOptions) {
            optionsValues = backOption.concat([{ value: 'goBackToLettersAlt', label: this.props.noOptionsLabel }]);
        }

        return (
            <div
                className={s.optionsList}
                style={
                    this.state.optionsListHeight > 0
                        ? { height: this.state.optionsListHeight + 'px' }
                        : { height: 'auto' }
                }
            >

                {optionsValues.length > 0 && (
                    <OptionsList
                        onChange={e => this.handleOptionClick(e)}
                        value={this.props.value !== null ? this.props.value : undefined}
                        options={optionsValues}
                    />
                )}

                {this.props.loadingOptions && (
                    <LoadingShade>
                        <LoadingSpinner size={48} />
                    </LoadingShade>
                )}

            </div>
        );
    }
}

AlphabeticalOptionsList.propTypes = propTypes;
AlphabeticalOptionsList.defaultProps = defaultProps;

export default AlphabeticalOptionsList;
