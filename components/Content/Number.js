import React, { PropTypes } from 'react';
import accounting from 'accounting';

const propTypes = {
    className: PropTypes.string,
    value: PropTypes.number.isRequired,
    precision: PropTypes.number,
    thousandsSeparator: PropTypes.string,
    decimalSeparator: PropTypes.string
};

const defaultProps = {
    className: '',
    value: 0,
    precsion: 2,
    thousandsSeparator: ' ',
    decimalSeparator: '.'
};

class Number extends React.Component {
    constructor(props, context) {
        super(props, context);
    }

    render() {
        // Props
        const { className, value, precision, thousandsSeparator, decimalSeparator } = this.props;

        // Prepare number
        const floatNumber = typeof value === 'number' ? value : accounting.unformat(value);
        const formattedNumber = accounting.formatNumber(floatNumber, precision, thousandsSeparator, decimalSeparator);

        // Prepare class name
        let numberClassName = '';
        numberClassName += className !== '' ? ' ' + className : '';

        return (
            <p className={numberClassName}>
                {formattedNumber}
            </p>
        );
    }
}

Number.propTypes = propTypes;
Number.defaultProps = defaultProps;

export default Number;
