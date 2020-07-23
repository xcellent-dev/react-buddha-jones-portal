import React from 'react';
import s from './Radio.css';
import Row from './../Section/Row';
import Col from './../Section/Col';
import Dropdown from './Dropdown';

const propTypes = {
    className: React.PropTypes.string,
    onClick: React.PropTypes.func,
    value: React.PropTypes.any.isRequired,
    checked: React.PropTypes.bool,
    label: React.PropTypes.string,
    dropdown: React.PropTypes.shape({
        onChange: React.PropTypes.func.isRequired,
        label: React.PropTypes.string.isRequired,
        selected: React.PropTypes.shape({
            value: React.PropTypes.any.isRequired,
            label: React.PropTypes.string.isRequired,
            truncuateLabelTo: React.PropTypes.number
        }),
        options: React.PropTypes.arrayOf(
            React.PropTypes.shape({
                value: React.PropTypes.any.isRequired,
                label: React.PropTypes.string.isRequired
            })
        )
    })
};

const defaultProps = {
    className: null,
    checked: false,
    label: ''
};

class Radio extends React.Component {
    constructor(props, context) {
        super(props, context);
    }

    handleLabelClick(e) {
        // Forward
        if (typeof this.props.onClick !== 'undefined') {
            this.props.onClick(e);
        }

        // Stop propagation
        e.stopPropagation();
    }

    render() {
        // Label class name
        let labelClassName = 'radio ' + s.label;
        labelClassName += this.props.checked === true ? ' ' + s.checked : '';
        labelClassName += typeof this.props.dropdown !== 'undefined' && this.props.dropdown.options.length > 0 ? ' ' + s.hasDropdown : '';
        labelClassName += this.props.className ? ' ' + this.props.className : '';

        // With dropdown
        if (typeof this.props.dropdown !== 'undefined' && this.props.dropdown.options.length > 0) {
            return (
                <label className={labelClassName} onClick={e => this.handleLabelClick(e)}>
                    <button className={s.icon}>
                        <i></i>
                    </button>
                    <Dropdown
                        onChange={this.props.dropdown.onChange}
                        align="left"
                        type="twolines"
                        label={this.props.dropdown.label}
                        selected={typeof this.props.dropdown.selected !== 'undefined' ? this.props.dropdown.selected : undefined}
                        options={typeof this.props.dropdown.options !== 'undefined' ? this.props.dropdown.options : undefined}
                    />
                </label>
            );
        // Only text label
        } else {
            return (
                <label className={labelClassName} onClick={e => this.handleLabelClick(e)}>
                    <button className={s.icon}>
                        <i></i>
                    </button>
                    <p className={s.text}>{this.props.label}</p>
                </label>
            );
        }
    };
}

Radio.propTypes = propTypes;
Radio.defaultProps = defaultProps;

export default Radio;
