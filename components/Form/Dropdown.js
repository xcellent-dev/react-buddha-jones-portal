import React from 'react';
import { debounce } from 'lodash';
import s from './Dropdown.css';
import { searchPhraseInString } from './../../helpers/search';
import { truncuateString } from './../../helpers/text';
import Input from './Input';
import IconDropdownArrow from './../../components/Icons/IconDropdownArrow';
import IconDropdownArrowYellow from './../../components/Icons/IconDropdownArrowYellow';

class Dropdown extends React.Component {
    constructor(props, context) {
        super(props, context);

        this.delayedWindowResize = debounce(function(e) {
            this.windowResizeDebounced(e);
        }, 256);

        this.state = {
            open: false,
            highlighted: null,
            positionOnTop: false,
            positionMarginLeft: 0,
            positionMarginTop: 0,
            maxHeight: 440,
            filteredOptions: []
        };

        this.openEvents = {
            window: []
        };
    }

    componentWillUnmount() {
        this.removeOpenEvents();
    }

    addOpenEvents() {
        // Create window click event
        const windowClick = this.windowClicked.bind(this);
        this.openEvents.window.push({ type: 'click', handler: windowClick });
        window.addEventListener('click', windowClick, false);

        // Create window key up event
        const windowKeyUp = this.windowKeyedUp.bind(this);
        this.openEvents.window.push({ type: 'keyup', handler: windowKeyUp });
        window.addEventListener('keyup', windowKeyUp, false);

        // Create window key down event
        const windowKeyDown = this.windowKeyedDown.bind(this);
        this.openEvents.window.push({ type: 'keydown', handler: windowKeyDown });
        window.addEventListener('keydown', windowKeyDown, false);

        // Create window resize event
        const windowResize = this.windowResize.bind(this);
        this.openEvents.window.push({ type: 'resize', handler: windowResize });
        window.addEventListener('resize', windowResize, false);

        // Focus on search field if it exists
        if (typeof this.refs.searchField !== 'undefined') {
            const searchField = this.refs.searchField;
            if (typeof searchField.refs.input !== 'undefined') {
                const input = searchField.refs.input;
                if (input) {
                    input.focus();
                }
            }
        }

        // Get currently selected index
        let activeResultIndex = null;
        if (typeof this.props.selected !== 'undefined' && typeof this.props.options !== 'undefined' && this.props.options.length > 0) {
            for (let i = 0; i < this.props.options.length; i++) {
                const option = this.props.options[i];
                if (typeof this.props.selected.value !== 'undefined' && this.props.selected.value === option.value) {
                    activeResultIndex = i;
                    break;
                } else {
                    activeResultIndex = 0;
                    break;
                }
            }
        }

        // Get currently selected element
        if (activeResultIndex !== null && typeof this.refs.dropdownResults !== 'undefined') {
            // Highlight active result for key navigation
            this.updateHighlightPosition(activeResultIndex);

            // Get dropdown results list
            const ul = this.refs.dropdownResults.querySelector('ul');
            if (ul) {
                if (typeof ul.children[activeResultIndex]) {
                    // Select and get position
                    const activeLi = ul.children[activeResultIndex];
                    const activeLiOffset = activeLi.offsetTop;

                    // Scroll results
                    this.refs.dropdownResults.scrollTop = activeLiOffset;
                }
            }
        }
    }

    removeOpenEvents() {
        // Remove window events
        this.openEvents.window.map(evt => {
            window.removeEventListener(evt.type, evt.handler);
        });
    }

    windowClicked(e) {
        this.closeDropdown();
    }

    windowKeyedUp(e) {
        // Log key
        const keyCode = e.keyCode;
        let highlightPosition = 0;

        // Base behavior on the key
        switch (keyCode) {
            // ESC key
            case 27:
                this.closeDropdown();
                break;

            // ENTER key
            case 13:
                if (this.state.highlighted !== null) {
                    if (typeof this.props.onChange !== 'undefined') {
                        let option = null;
                        if (this.state.filteredOptions.length > 0) {
                            option = this.state.filteredOptions[this.state.highlighted];
                        } else if (typeof this.props.options !== 'undefined' && this.props.options.length > 0) {
                            option = this.props.options[this.state.highlighted];
                        }
                        if (typeof option !== 'undefined' && option !== null) {
                            this.props.onChange({
                                value: option.value,
                                label: option.label
                            });
                        }
                    }
                    this.closeDropdown();
                }
                e.stopPropagation();
                e.preventDefault();
                break;

            // Arrow down
            case 40:
                // Highlight position
                highlightPosition = this.state.highlighted;
                if (highlightPosition !== null) {
                    if (this.state.filteredOptions.length > 0) {
                        if (highlightPosition >= this.state.filteredOptions.length - 1) {
                            highlightPosition = 0;
                        } else {
                            highlightPosition = highlightPosition + 1;
                        }
                    } else if (typeof this.props.options !== 'undefined' && this.props.options.length > 0) {
                        if (highlightPosition >= this.props.options.length - 1) {
                            highlightPosition = 0;
                        } else {
                            highlightPosition = highlightPosition + 1;
                        }
                    }
                } else {
                    if (typeof this.refs.searchField !== 'undefined' && typeof this.refs.searchField.refs.input !== 'undefined') {
                        this.refs.searchField.refs.input.focus();
                        highlightPosition = null;
                    } else {
                        highlightPosition = 0;
                    }
                }

                // Update highlight position
                this.updateHighlightPosition(highlightPosition);

                e.stopPropagation();
                e.preventDefault();
                break;

            // Arrow up
            case 38:
                // Highlight position
                highlightPosition = this.state.highlighted;
                if (highlightPosition !== null) {
                    if (highlightPosition <= 0) {
                        if (typeof this.refs.searchField !== 'undefined' && typeof this.refs.searchField.refs.input !== 'undefined') {
                            this.refs.searchField.refs.input.focus();
                            highlightPosition = null;
                        } else {
                            if (this.state.filteredOptions.length > 0) {
                                highlightPosition = this.state.filteredOptions.length - 1;
                            } else if (typeof this.props.options !== 'undefined' && this.props.options.length > 0) {
                                highlightPosition = this.props.options.length - 1;
                            }
                        }
                    } else {
                        highlightPosition = highlightPosition - 1;
                    }
                } else {
                    if (this.state.filteredOptions.length > 0) {
                        highlightPosition = this.state.filteredOptions.length - 1;
                    } else if (typeof this.props.options !== 'undefined' && this.props.options.length > 0) {
                        highlightPosition = this.props.options.length - 1;
                    }
                }

                // Update highlight position
                this.updateHighlightPosition(highlightPosition);

                e.stopPropagation();
                e.preventDefault();
                break;

            default:
                break;
        }
    }

    windowKeyedDown(e) {
        // Disable scrolling with up and down arrows
        if ([38, 40].indexOf(e.keyCode) > -1) {
            e.preventDefault();
        }
    }

    windowResize(e) {
        this.delayedWindowResize(e);
    }

    windowResizeDebounced(e) {
        this.positionAndResizeDropdown();
    }

    updateHighlightPosition(position) {
        if (typeof position !== 'undefined') {
            this.setState(
                Object.assign({}, this.state, {
                    highlighted: position
                })
            );
        }
    }

    closeDropdown() {
        // Change state to closed
        this.setState(
            Object.assign({}, this.state, {
                open: false,
                positionMarginLeft: 0,
                positionMarginTop: 0
            })
        );

        // Remove events associated with open dropdown
        this.removeOpenEvents();
    }

    searchDropdown(query) {
        // Check if value is defined
        if (typeof query !== 'undefined') {
            // Prepare filtered options
            let filteredOptions = [];

            // Check if value is not empty
            if (query !== '') {
                if (typeof this.props.options !== 'undefined' && this.props.options.length > 0) {
                    this.props.options.map((option, index) => {
                        const valueSearch = typeof option.value !== 'undefined' ? searchPhraseInString(option.value, query, true, false) : false;
                        const labelSearch = typeof option.label !== 'undefined' ? searchPhraseInString(option.label, query, true, true) : false;
                        if (valueSearch === true || labelSearch === true) {
                            filteredOptions.push(option);
                        }
                    });
                }
            }

            // Update state
            this.setState(
                Object.assign({}, this.state, {
                    filteredOptions: filteredOptions
                })
            );
        }
    }

    handleDropdownSearch(e) {
        // Check if search exists
        if (typeof this.props.search !== 'undefined') {
            // Check if API should handle search
            if (typeof this.props.search.searchViaApi !== 'undefined' && this.props.search.searchViaApi === true) {
                if (typeof this.props.search.onChange !== 'undefined') {
                    this.props.search.onChange(e.target.value);
                }
            } else {
                this.searchDropdown(e.target.value);
            }
        }
    }

    handleLabelClick(e) {
        // Close
        if (this.state.open === true) {
            // Set closed state
            this.closeDropdown();
        // Open
        } else {
            // Add events related to open dropdown
            this.addOpenEvents();

            // Position dropdown
            this.positionAndResizeDropdown();
        }

        // Stop propagation
        e.stopPropagation();
    }

    positionAndResizeDropdown() {
        // Get dimensions needed for calculations
        const windowHeight = window.innerHeight;
        const windowWidth = window.innerWidth;
        const label = this.refs.label;
        const labelPosition = label.getBoundingClientRect();
        const labelWidth = label.offsetWidth;
        const labelHeight = label.offsetHeight;
        const dropdownWidth = labelWidth > 192 ? labelWidth : 192;
        const searchHeight = typeof this.props.search !== 'undefined' ? 40 : 0;

        // Determine top or bottom position
        const positionOnTop = windowHeight * 0.8 < labelPosition.top ? true : false;

        // Determine left margin
        let positionMarginLeft = 0;
        if (labelWidth < dropdownWidth) {
            switch (this.props.align) {
                case 'right':
                    positionMarginLeft = -(dropdownWidth - labelWidth);
                    break;

                case 'center':
                    positionMarginLeft = -((dropdownWidth - labelWidth) / 2);
                    break;

                default:
                    break;
            }
        }
        const rightDropdownEdgePosition = labelPosition.left + dropdownWidth + positionMarginLeft;
        if (windowWidth < rightDropdownEdgePosition) {
            positionMarginLeft = positionMarginLeft - (rightDropdownEdgePosition - windowWidth);
        }

        // Determine top margin
        let positionMarginTop = 0;
        if (positionOnTop === true) {
            positionMarginTop = -labelHeight - 8;
        } else {
            positionMarginTop = labelHeight + 8;
        }

        // Calculate max height
        let maxHeight = 440;
        if (positionOnTop === true) {
            const maxHeightOnTop = labelPosition.top + positionMarginTop - searchHeight - 12;
            if (maxHeightOnTop < maxHeight) {
                maxHeight = maxHeightOnTop;
            }
        } else {
            const maxHeightOnBottom = windowHeight - (labelPosition.top + positionMarginTop + searchHeight + 12);
            if (maxHeightOnBottom < maxHeight) {
                maxHeight = maxHeightOnBottom;
            }
        }

        // Set open state
        this.setState(
            Object.assign({}, this.state, {
                open: true,
                positionOnTop: positionOnTop,
                positionMarginLeft: positionMarginLeft,
                positionMarginTop: positionMarginTop,
                maxHeight: maxHeight
            })
        );
    }

    handleSelectionChange(e, value, label) {
        // Check if values are provided
       if (typeof value !== 'undefined' && typeof label !== 'undefined') {
            // Forward function if it's passed as a prop
            if (typeof this.props.onChange !== 'undefined') {
                this.props.onChange({ value: value, label: label });
            }

            // Close dropdown
            this.closeDropdown();
        }
    }

    handleDropdownGroupClick(e) {
        e.stopPropagation();
    }

    render() {
        // Prepare class name
        let dropdownClassName = 'dropdown';
        dropdownClassName += typeof this.props.className !== 'undefined' && this.props.className !== null ? ' ' + this.props.className : '';
        dropdownClassName += typeof this.props.type !== 'undefined' ? ' ' + this.props.type : '';
        dropdownClassName += this.state.open === true ? ' ' + s.open : '';
        dropdownClassName += this.props.isWhite === true ? ' ' + s.white : '';

        // Label class name
        let labelClassName = 'dropdownLabel';
        labelClassName += ' ' + this.props.align;

        // Dropdown group class name
        let dropdownGroupClassName = 'dropdownGroup';
        dropdownGroupClassName += this.state.positionOnTop === true ? ' top' : '';

        // Dropdown group style
        let dropdownGroupStyle = {
            marginLeft: this.state.positionMarginLeft !== 0 ? this.state.positionMarginLeft + 'px' : null,
            marginTop: this.state.positionMarginTop > 0 ? this.state.positionMarginTop + 'px' : null,
            marginBottom: this.state.positionMarginTop < 0 ? -(this.state.positionMarginTop) + 'px' : null,
            maxWidth: typeof this.props.maxWidth !== 'undefined' && this.props.maxWidth > 0 ? this.props.maxWidth + 'px' : null
        };

        // Dropdown results style
        let dropdownResultsStyle = {
            maxHeight: this.state.maxHeight + 'px'
        };

        // Selection
        let selectionText = 'None';
        if (typeof this.props.selected !== 'undefined') {
            if (typeof this.props.selected.label !== 'undefined') {
                selectionText = this.props.selected.label;
            } else if (typeof this.props.selected.value !== 'undefined') {
                selectionText = this.props.selected.value;
            }
            if (typeof this.props.selected.truncuateLabelTo !== 'undefined') {
                selectionText = truncuateString(selectionText, this.props.selected.truncuateLabelTo, '...');
            }
        }

        // Render
        return (
            <div className={dropdownClassName}>
                <div ref="label" className={labelClassName} onClick={e => this.handleLabelClick(e)}>
                    <p>
                        <span>{this.props.label}</span>
                        <strong>{selectionText}</strong>
                    </p>
                    {(() => {
                        if (this.props.isWhite === true) {
                            return (
                                <IconDropdownArrowYellow
                                    width={11}
                                    height={8}
                                    marginTop={-4}
                                />
                            );
                        } else {
                            return (
                                <IconDropdownArrow
                                    width={11}
                                    height={8}
                                    marginTop={-4}
                                />
                            );
                        }
                    })()}
                </div>
                <div
                    style={dropdownGroupStyle}
                    className={dropdownGroupClassName}
                    onClick={e => this.handleDropdownGroupClick(e)}
                >
                    {(() => {
                        if (typeof this.props.search !== 'undefined') {
                            return (
                                <div className={s.dropdownSearch}>
                                    <Input
                                        ref="searchField"
                                        onChange={e => this.handleDropdownSearch(e)}
                                        value={typeof this.props.search.value !== 'undefined' ? this.props.search.value : undefined}
                                        label={typeof this.props.search.label !== 'undefined' ? this.props.search.label : 'Search...'}
                                    />
                                </div>
                            );
                        }
                    })()}
                    <div ref="dropdownResults" style={dropdownResultsStyle} className={s.dropdownResults}>
                        {(() => {
                            if (typeof this.props.options !== 'undefined' && this.props.options.length > 0) {
                                const options = this.state.filteredOptions.length > 0 ? this.state.filteredOptions : this.props.options;
                                return (
                                    <ul>
                                        {options.map((option, index) => {
                                            // Option class name
                                            let optionClassName = '';
                                            if (typeof this.props.selected !== 'undefined' && typeof this.props.selected.value !== 'undefined') {
                                                optionClassName += option.value === this.props.selected.value ? ' ' + s.activeResult : '';
                                            } else {
                                                optionClassName += index === 0 ? ' ' + s.activeResult : '';
                                            }
                                            if (this.state.highlighted !== null) {
                                                optionClassName += this.state.highlighted === index ? ' ' + s.highlightedResult : '';
                                            }

                                            // Render option
                                            return (
                                                <li key={option.value} className={optionClassName !== '' ? optionClassName : null}>
                                                    <button onClick={e => this.handleSelectionChange(e, option.value, option.label) }>
                                                        {typeof option.label !== 'undefined' ? option.label : option.value}
                                                    </button>
                                                </li>
                                            );
                                        }) }
                                    </ul>
                                );
                            } else if (typeof this.props.search === 'undefined') {
                                return (
                                    <ul>
                                        <li className={s.loadingResults}>Loading...</li>
                                    </ul>
                                );
                            }
                        })()}
                    </div>
                </div>
            </div>
        );
    }
}

Dropdown.propTypes = {
    className: React.PropTypes.string,
    onChange: React.PropTypes.func,
    search: React.PropTypes.shape({
        label: React.PropTypes.string,
        onChange: React.PropTypes.func,
        searchViaApi: React.PropTypes.bool,
        value: React.PropTypes.any
    }),
    maxWidth: React.PropTypes.number,
    align: React.PropTypes.oneOf(['left', 'center', 'right']),
    type: React.PropTypes.oneOf(['oneline', 'twolines', 'field']),
    isWhite: React.PropTypes.bool,
    label: React.PropTypes.string.isRequired,
    selected: React.PropTypes.shape({
        value: React.PropTypes.any,
        label: React.PropTypes.string,
        truncuateLabelTo: React.PropTypes.number
    }),
    options: React.PropTypes.arrayOf(
        React.PropTypes.shape({
            value: React.PropTypes.any.isRequired,
            label: React.PropTypes.string.isRequired
        })
    )
};

Dropdown.defaultProps = {
    align: 'left',
    type: 'oneline',
    isWhite: false
};

export default Dropdown;
