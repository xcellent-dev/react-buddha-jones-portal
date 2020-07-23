import React, { PropTypes } from 'react';
import { upperFirst } from 'lodash';
import s from './Input.css';

const propTypes = {
    className: PropTypes.string,
    fieldClassName: PropTypes.string,
    onChange: PropTypes.func,
    onPaste: PropTypes.func,
    onFocus: PropTypes.func,
    onBlur: PropTypes.func,
    disabled: PropTypes.bool,
    readOnly: PropTypes.bool,
    value: PropTypes.string,
    defaultValue: PropTypes.string,
    autoFocus: PropTypes.bool,
    maxWidth: PropTypes.number,
    minWidth: PropTypes.number,
    align: PropTypes.oneOf(['left', 'center', 'right']),
    color: PropTypes.oneOf(['default', 'blue', 'brown', 'blueFill', 'brownFill', 'greenFill', 'red']),
    type: PropTypes.oneOf(['text', 'email', 'password']),
    label: PropTypes.string.isRequired,
    icon: PropTypes.element,
    name: PropTypes.string
};

const defaultProps = {
    className: null,
    fieldClassName: null,
    onChange: null,
    onPaste: null,
    onFocus: null,
    onBlur: null,
    disabled: false,
    readOnly: false,
    value: null,
    defaultValue: '',
    autoFocus: false,
    maxWidth: 0,
    minWidth: 0,
    align: null,
    color: 'default',
    type: 'text',
    label: '',
    icon: null,
    name: null
};

class Input extends React.Component {
    constructor(props, context) {
        super(props, context);

        this.input = null;
    }

    clear() {
        if (typeof this.refs.input !== 'undefined') {
            this.refs.input.value = '';
        }
    }

    handleChange(e) {
        if (this.props.onChange) {
            this.props.onChange(e);
        }
    }

    handlePaste(e) {
        if (this.props.onPaste) {
            this.props.onPaste(e);
        }
    }

    handleFocus(e) {
        if (this.props.onFocus) {
            this.props.onFocus(e);
        }
    }

    handleBlur(e) {
        if (this.props.onBlur) {
            this.props.onBlur(e);
        }
    }

    focus() {
        if (this.input && typeof this.input.focus !== 'undefined') {
            this.input.focus();
            this.handleFocus(this.input);
        }
    }

    render() {
        // Establish class name
        let groupClassName = s.fieldGroup;
        groupClassName += this.props.color !== 'default' ? ' ' + s['fieldGroup' + upperFirst(this.props.color)] : '';
        groupClassName += this.props.className ? ' ' + this.props.className : '';

        // Establish input class name
        let fieldClassName = this.props.fieldClassName ? this.props.fieldClassName : '';

        // Set custom input style
        let inputStyle = {
            maxWidth: this.props.maxWidth > 0 ? this.props.maxWidth + 'px' : null,
            minWidth: this.props.minWidth > 0 ? this.props.minWidth + 'px' : null,
            paddingRight: this.props.icon && typeof this.props.icon.width !== 'undefined' ? (16 + this.props.icon.width) + 'px' : null,
            textAlign: this.props.align ? this.props.align : null
        };

        // Render input field group
        return (
            <div className={groupClassName}>
                <input
                    ref={ref => this.input = ref}
                    type={this.props.type}
                    style={inputStyle}
                    className={fieldClassName ? fieldClassName : undefined}
                    name={this.props.name ? this.props.name : undefined}
                    disabled={this.props.disabled === true ? true : null}
                    readOnly={this.props.readOnly === true ? true : null}
                    placeholder={this.props.label}
                    value={this.props.value !== null ? this.props.value : undefined}
                    defaultValue={this.props.value === null ? this.props.defaultValue : undefined}
                    autoFocus={this.props.autoFocus === true ? true : undefined}
                    onChange={e => this.handleChange(e)}
                    onPaste={e => this.handlePaste(e)}
                    onFocus={e => this.handleFocus(e)}
                    onBlur={e => this.handleBlur(e)}
                />
                {(() => {
                    if (this.props.icon) {
                        return this.props.icon;
                    }
                })()}
            </div>
        );
    }
}

Input.propTypes = propTypes;
Input.defaultProps = defaultProps;

export default Input;
