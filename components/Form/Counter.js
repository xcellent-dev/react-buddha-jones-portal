import React, { PropTypes } from 'react';
import accounting from 'accounting';
import s from './Counter.css';
import Input from './Input';
import Row from './../Section/Row';
import Col from './../Section/Col';
import IconPlusWhite from './../../components/Icons/IconPlusWhite';
import IconMinusWhite from './../../components/Icons/IconMinusWhite';
import Paragraph from './../Content/Paragraph';

const propTypes = {
    onChange: PropTypes.func,
    label: PropTypes.string,
    fieldMaxWidth: PropTypes.number,
    multipleOf: PropTypes.number,
    increment: PropTypes.number,
    decimals: PropTypes.number,
    showPlusMinus: PropTypes.bool,
    value: PropTypes.number,
    defaultValue: PropTypes.number,
    readOnly: PropTypes.bool,
    readOnlyTextAfter: PropTypes.string,
    readOnlyTextBefore: PropTypes.string,
    min: PropTypes.number,
    max: PropTypes.number
};

const defaultProps = {
    onChange: null,
    label: null,
    fieldMaxWidth: 64,
    multipleOf: null,
    decimals: 0,
    showPlusMinus: true,
    increment: 1,
    value: null,
    defaultValue: 1,
    readOnly: false,
    readOnlyTextAfter: null,
    readOnlyTextBefore: null
};

class Counter extends React.Component {
    constructor(props, context) {
        // Super
        super(props, context);

        // Default value
        const defaultValue = this.alignValueToLimits(
            typeof this.props.defaultValue !== 'undefined'
                ? this.props.defaultValue
                : undefined
        );

        // Controlled value
        const value = typeof this.props.value !== 'undefined'
            ? this.alignValueToLimits(this.props.value)
            : defaultValue;

        // Initial state
        this.state = {
            defaultValue: defaultValue,
            value: value
        };
    }

    componentWillReceiveProps(nextProps) {
        if (typeof nextProps.defaultValue !== 'undefined' && this.props.defaultValue !== nextProps.defaultValue) {
            this.setState({
                defaultValue: this.alignValueToLimits(nextProps.defaultValue)
            });
        }

        if (typeof nextProps.value !== 'undefined' && this.state.value !== nextProps.value) {
            this.setState({
                value: this.alignValueToLimits(nextProps.value)
            });
        }
    }


    alignValueToLimits(value) {
        // Parse value is if's not a number
        const parsedValue = typeof value !== 'undefined'
            ? typeof value === 'number'
                ? value
                : accounting.unformat(value)
            : typeof this.state.defaultValue !== 'undefined'
                ? this.state.defaultValue
                : this.props.increment;

        // Prepare new number
        let newNumber = isNaN(parsedValue) ? this.state.defaultValue : parsedValue;

        // If number is too big
        if (newNumber > this.props.max) {
            newNumber = this.props.max;
        }

        // If number is too small
        if (newNumber < this.props.min) {
            newNumber = this.props.min;
        }

        // If number is not incremental
        if (this.props.multipleOf) {
            const mod = newNumber % this.props.multipleOf;
            if (mod !== 0) {
                const roundTo = 1 / this.props.multipleOf;
                newNumber = Math.round(newNumber * roundTo) / roundTo;
            }
        }

        return newNumber;
    }

    handleIncrement(e, isIncrease) {
        // Defaults
        isIncrease = typeof isIncrease !== 'undefined' && isIncrease !== null ? isIncrease : true;

        // Get current value
        const increment = typeof this.props.increment !== 'undefined' ? this.props.increment : 1;
        const currentValue = this.state.value;
        let newNumber = currentValue;

        // Add or remove
        newNumber = isIncrease ? newNumber + increment : newNumber - increment;
        newNumber = this.alignValueToLimits(newNumber);

        // Update number in input
        this.setState({
            value: newNumber
        });

        // Pass the value to prop
        if (this.props.onChange) {
            this.props.onChange(newNumber);
        }
    }

    handleChange(e) {
        // Value
        const value = e.target.value;

        // Update controlled input
        this.setState({
            value: value
        });
    }

    handleFocus(e) {
        // Select whole field
        e.target.setSelectionRange(0, e.target.value.length);
    }

    handleBlur(e) {
        // Parse value
        const newNumber = this.alignValueToLimits(this.state.value);

        // Update input
        this.setState({
            value: newNumber
        });

        // Pass the value to prop
        if (this.props.onChange) {
            this.props.onChange(newNumber);
        }
    }

    render() {
        // Input value
        let inputValue = this.state.value;
        if (typeof this.state.value === 'number') {
            inputValue = this.props.decimals
                ? accounting.toFixed(this.state.value, this.props.decimals)
                : this.state.value.toString();
        }

        // Prepare minus button
        let minusButtonClassName = s.incrementButton;
        minusButtonClassName += ' ' + s.incrementMinusButton;
        if (typeof this.props.min !== 'undefined') {
            if (this.state.value <= this.props.min) {
                minusButtonClassName += ' ' + s.incrementButtonDisabled;
            }
        }

        // Prepare plus button
        let plusButtonClassName = s.incrementButton;
        plusButtonClassName += ' ' + s.incrementPlusButton;
        if (typeof this.props.max !== 'undefined') {
            if (this.state.value >= this.props.max) {
                plusButtonClassName += ' ' + s.incrementButtonDisabled;
            }
        }

        // Render
        return (
            <Row className={s.counterField} removeGutter={true}>

                {this.props.label && (
                    <Col className={s.counterLabelCol} removeGutter={true}>
                        <p className={s.counterLabel}>
                            {this.props.label}
                        </p>
                    </Col>
                )}

                {this.props.showPlusMinus && (
                    <Col removeGutter={true}>
                        <button
                            className={minusButtonClassName}
                            onClick={e => this.handleIncrement(e, false)}
                            data={{ 'value': this.state.value }}
                        >
                            <IconMinusWhite />
                        </button>
                    </Col>
                )}

                {(() => {
                    if (this.props.readOnly === false) {
                        return (
                            <Col className={s.fieldCol} removeGutter={true}>
                                <Input
                                    onChange={e => this.handleChange(e)}
                                    onFocus={e => this.handleFocus(e)}
                                    onBlur={e => this.handleBlur(e)}
                                    value={isNaN(inputValue) ? '' : inputValue}
                                    maxWidth={this.props.fieldMaxWidth}
                                    label={this.props.label ? this.props.label : ''}
                                    align="center"
                                />
                            </Col>
                        );
                    } else {
                        // Prepare value and additional text
                        let inputValueText = '';
                        inputValueText += this.props.readOnlyTextBefore ? this.props.readOnlyTextBefore : '';
                        inputValueText += inputValue;
                        inputValueText += this.props.readOnlyTextAfter ? this.props.readOnlyTextAfter : '';

                        // Return value
                        return (
                            <Col removeGutter={true}>
                                <Paragraph>
                                    {inputValueText}
                                </Paragraph>
                            </Col>
                        );
                    }
                })()}

                {this.props.showPlusMinus && (
                    <Col removeGutter={true}>
                        <button
                            className={plusButtonClassName}
                            onClick={e => this.handleIncrement(e, true)}
                            data={{ 'value': this.state.value }}
                        >
                            <IconPlusWhite />
                        </button>
                    </Col>
                )}

            </Row>
        );
    }
}

Counter.propTypes = propTypes;
Counter.defaultProps = defaultProps;

export default Counter;
