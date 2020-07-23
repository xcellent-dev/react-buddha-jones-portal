import React, { PropTypes } from 'react';
import accounting from 'accounting';
import s from './Money.css';

const propTypes = {
    value: PropTypes.number.isRequired,
    valueBold: PropTypes.bool,
    currency: PropTypes.oneOf(['USD'])
};

const defaultProps = {
    value: 0,
    valueBold: true,
    currency: 'USD'
};

class Money extends React.Component {
    constructor(props, context) {
        super(props, context);
    }

    render() {
        // Prepare symbol
        let currencySymbol = '$';

        // Prepare number
        const formattedNumber = accounting.formatNumber(this.props.value, 2, ',', '.');

        // Prepare class name
        let moneyClassName = s.money;
        moneyClassName += this.props.valueBold === false ? ' ' + s.notBold : '';

        return (
            <p className={moneyClassName}>
                {currencySymbol}
                <strong>{formattedNumber}</strong>
            </p>
        );
    }
}

Money.propTypes = propTypes;
Money.defaultProps = defaultProps;

export default Money;
