import React from 'react';
import s from './Select.css';

const propTypes = {
    onChange: React.PropTypes.func.isRequired,
    label: React.PropTypes.string,
    value: React.PropTypes.any,
    options: React.PropTypes.arrayOf(
        React.PropTypes.shape({
            value: React.PropTypes.any.isRequired,
            label: React.PropTypes.string.isRequired
        })
    )
};

const defaultProps = {
    onChange: null,
    label: '',
    value: null,
    options: []
};

class Select extends React.Component {
    constructor(props, context) {
        super(props, context);
    }

    render() {
        // Check if there are any options provided
        if (typeof this.props.options !== 'undefined' && this.props.options.length > 0) {
            return (
                <select
                    className={s.select}
                    value={this.props.value ? this.props.value : undefined}
                    onChange={this.props.onChange ? e => this.props.onChange(e) : undefined}
                >
                    {(() => {
                        if (this.props.label) {
                            return (
                                <option value="">{this.props.label}</option>
                            );
                        }
                    })()}
                    {this.props.options.map((option, index) => {
                        return (
                            <option key={option.value} value={option.value}>
                                {option.label}
                            </option>
                        );
                    })};
                </select>
            );
        } else {
            return (
                <select className={s.select}>
                    <option value="">{this.props.label}</option>
                    <option value="">Loading...</option>
                </select>
            );
        }
    }
}

Select.propTypes = propTypes;
Select.defaultProps = defaultProps;

export default Select;
