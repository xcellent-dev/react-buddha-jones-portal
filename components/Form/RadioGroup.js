import React, { PropTypes } from 'react';
import s from './RadioGroup.css';
import Row from './../Section/Row';
import Col from './../Section/Col';
import Radio from './Radio';

const propTypes = {
    className: PropTypes.string,
    onChange: PropTypes.func,
    oneLine: PropTypes.bool,
    options: PropTypes.arrayOf(
        PropTypes.shape({
            key: PropTypes.any.isRequired,
            value: PropTypes.any.isRequired,
            label: PropTypes.string,
            dropdown: PropTypes.shape({
                label: PropTypes.string.isRequired,
                selected: PropTypes.shape({
                    value: PropTypes.any.isRequired,
                    label: PropTypes.string.isRequired,
                    truncuateLabelTo: PropTypes.number
                }),
                options: PropTypes.arrayOf(
                    PropTypes.shape({
                        value: PropTypes.any.isRequired,
                        label: PropTypes.string.isRequired
                    })
                )
            })
        }).isRequired
    ).isRequired,
    value: PropTypes.string
};

const defaultProps = {
    className: null,
    onChange: null,
    oneLine: true,
    options: [],
    value: null
};

class RadioGroup extends React.Component {
    constructor(props, context) {
        // Super
        super(props, context);

        // Iterate options and prepare values
        let state = {
            value: '',
            dropdown: null,
            options: []
        };

        if (this.props.options && this.props.options.length > 0) {
            state = this.mapOptionsFromPropsToStateOptions(this.props.options, false);
        }

        // Initial state
        this.state = state;
    }

    componentWillReceiveProps(nextProps) {
        // Check if value has changed
        if (this.props.value !== nextProps.value && (this.props.value === null || nextProps.value === null)) {
            this.mapOptionsFromPropsToStateOptions(nextProps.options && nextProps.options.length > 0 ? nextProps.options : [], true);
        } else {
            // Check if options have changed
            if (this.props.options.length === 0 && nextProps.options.length > 0) {
                this.mapOptionsFromPropsToStateOptions(nextProps.options, true);
            } else if (this.props.options.length !== nextProps.options.length) {
                // Iterate next options
                for (let i = 0; i < nextProps.options.length; i++) {
                    // Get old and next option
                    const nextOption = nextProps.options[i];
                    const oldOption = this.props.options[i];

                    // Compare values
                    if (oldOption.value === nextOption.value) {
                        // Compare dropdowns
                        if (typeof oldOption.dropdown === 'undefined' && typeof nextOption.dropdown !== 'undefined') {
                            this.mapOptionsFromPropsToStateOptions(nextProps.options, true);
                            break;
                        } else if (typeof oldOption.dropdown !== 'undefined' && typeof nextOption.dropdown !== 'undefined') {
                            // Compare selected
                            if (oldOption.dropdown.label === nextOption.dropdown.label) {
                                // Compare selected values
                                if (oldOption.dropdown.selected.value === nextOption.dropdown.selected.value) {
                                    // Compare truncuatation
                                    if (oldOption.dropdown.selected.truncuateLabelTo !== nextOption.dropdown.selected.truncuateLabelTo) {
                                        this.mapOptionsFromPropsToStateOptions(nextProps.options, true);
                                        break;
                                    }
                                } else {
                                    this.mapOptionsFromPropsToStateOptions(nextProps.options, true);
                                    break;
                                }
                            } else {
                                this.mapOptionsFromPropsToStateOptions(nextProps.options, true);
                                break;
                            }
                        }
                    } else {
                        this.mapOptionsFromPropsToStateOptions(nextProps.options, true);
                        break;
                    }
                }
            }
        }
    }

    mapOptionsFromPropsToStateOptions(newOptions, updateState) {
        // Get state
        let state;
        let options = [];
        let checkedOption;
        if (typeof this.state !== 'undefined') {
            state = this.state;
        } else {
            state = { value: '', dropdown: null, options: [] };
        }

        // Get previously selected option
        let oldCheckedOptionKey;
        if (typeof this.state !== 'undefined' && typeof this.state.options !== 'undefined' && this.state.options.length > 0) {
            for (let index = 0; index < this.state.options.length; index++) {
                const option = this.state.options[index];
                if (option.checked === true) {
                    oldCheckedOptionKey = option.key;
                    break;
                }
            }
        }

        // Check if options are passed to the function
        if (typeof newOptions !== 'undefined' && newOptions.length > 0) {
            // Count if any option is checked
            let checkedCount = 0;

            // Iterate new options
            newOptions.map((option, index) => {
                // Check if option matches previous checked option or, when controlled - if it matches value prop
                let checked = false;
                if (this.props.value !== null) {
                    if (this.props.value === option.value) {
                        checkedOption = option;
                        checked = true;
                        checkedCount++;
                    }
                } else if (typeof oldCheckedOptionKey !== 'undefined') {
                    if (oldCheckedOptionKey === option.key) {
                        checkedOption = option;
                        checked = true;
                        checkedCount++;
                    }
                }

                // Prepare remaining properties
                const label = typeof option.label !== 'undefined' ? option.label : '';
                const dropdown = typeof option.dropdown !== 'undefined' ? option.dropdown : undefined;

                // Push to options array
                options.push({
                    key: option.key,
                    value: option.value,
                    checked: checked,
                    label: label,
                    dropdown: dropdown
                });
            });

            // If none is checked, check first one
            if (checkedCount === 0) {
                checkedOption = options[0];
                options[0].checked = true;
            }
        }

        // Pass options to state
        state.value = checkedOption.value;
        state.dropdown = typeof checkedOption.dropdown !== 'undefined' ? checkedOption.dropdown.selected : null;
        state.options = options;

        // Update state
        if (typeof updateState !== 'undefined' && updateState === true) {
            // Pass state change
            if (this.props.onChange !== 'undefined') {
                this.props.onChange(state);
            }

            // Set state
            this.setState(
                Object.assign({}, this.state, {
                    value: state.value,
                    dropdown: state.dropdown,
                    options: state.options
                })
            );
        } else {
            return state;
        }
    }

    handleRadioClick(e, selected, index) {
        // Get current state
        let state = this.state;

        // Look for checked options and remove them
        state.options.map((option, i) => {
            if (option.checked === true) {
                state.options[i].checked = false;
            }
        });

        // Active
        const checkedOption = state.options[index];

        // Check selected option
        checkedOption.checked = true;

        // Get value
        state.value = checkedOption.value;
        state.dropdown = typeof checkedOption.dropdown !== 'undefined' ? checkedOption.dropdown.selected : null;

        // Set new state
        this.setState(
            Object.assign({}, this.state, {
                value: state.value,
                dropdown: state.dropdown,
                options: state.options
            })
        );

        // Pass state to handler
        if (typeof this.props.onChange) {
            this.props.onChange(state);
        }
    }

    handleDropdownChange(dropdown, selected, index) {
        // Get state
        let state = this.state;

        // Prepare selected dropdown object
        const selectedDropdown = {
            value: dropdown.value,
            label: dropdown.label,
            truncuateLabelTo: typeof state.options[index].dropdown.selected.truncuateLabelTo !== 'undefined'
                ? state.options[index].dropdown.selected.truncuateLabelTo
                : undefined
        };

        // Set new dropdown selected
        state.options[index].dropdown.selected = selectedDropdown;

        // Value and dropdown
        state.dropdown = selectedDropdown;

        // Update dropdown selected
        this.setState(
            Object.assign({}, this.state, {
                dropdown: state.dropdown,
                options: state.options
            })
        );

        // Pass state to handler
        if (this.props.onChange) {
            this.props.onChange(state);
        }
    }

    render() {
        // Row class name
        let rowClassName = s.radioGroup;
        rowClassName += this.props.className ? ' ' + this.props.className : '';

        // Render
        return (
            <Row className={rowClassName} removeGutter={true}>
                {this.state.options.map((option, index) => {
                    return (
                        <Col key={option.key} flex={this.props.oneLine && index + 1 >= this.state.options.length ? '0 1 auto' : undefined}>
                            <Radio
                                onClick={e => this.handleRadioClick(e, option.key, index)}
                                value={option.value}
                                checked={option.checked}
                                label={typeof option.label !== 'undefined' && option.label !== '' ? option.label : undefined}
                                dropdown={typeof option.dropdown !== 'undefined' ? {
                                    onChange: e => this.handleDropdownChange(e, option.key, index),
                                    label: option.dropdown.label,
                                    selected: typeof option.dropdown.selected !== 'undefined' ? option.dropdown.selected : undefined,
                                    options: typeof option.dropdown.options !== 'undefined' ? option.dropdown.options : undefined
                                } : undefined}
                            />
                        </Col>
                    );
                })}
            </Row>
        );
    }
}

RadioGroup.propTypes = propTypes;
RadioGroup.defaultProps = defaultProps;

export default RadioGroup;
