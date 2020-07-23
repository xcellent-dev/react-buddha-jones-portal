import React, { PropTypes } from 'react';
import moment from 'moment';

const propTypes = {
    value: PropTypes.any,
    className: PropTypes.string,
    format: PropTypes.string
};

const defaultProps = {
    value: null,
    className: '',
    format: 'MM/DD/YYYY'
};

class Date extends React.Component {
    constructor(props, context) {
        super(props, context);

        this.state = {
            formatted: this.formatValue(this.props.value, this.props.format)
        };
    }

    componentWillReceiveProps(nextProps) {
        if (this.props.value !== nextProps.value) {
            this.setState({
                formatted: this.formatValue(nextProps.value, nextProps.format)
            });
        }
    }

    formatValue(value, format) {
        let formattedDate = '';
        if (value) {
            const parsedDate = moment(value);
            if (parsedDate.isValid()) {
                formattedDate = parsedDate.format(format);
            } else {
                formattedDate = value;
            }
        }
        return formattedDate;
    }

    render() {
        if (this.state.formatted !== '') {
            let dateClassName = '';
            dateClassName += this.props.className !== '' ? ' ' + this.props.className : '';
            return (
                <p className={dateClassName}>
                    {this.state.formatted}
                </p>
            );
        } else {
            return null;
        }
    }
}

Date.propTypes = propTypes;
Date.defaultProps = defaultProps;

export default Date;
