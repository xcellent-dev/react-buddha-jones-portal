import React, { PropTypes } from 'react';
import s from './TextArea.css';

const propTypes = {
    className: PropTypes.string,
    fieldClassName: PropTypes.string,
    onChange: PropTypes.func,
    onPaste: PropTypes.func,
    onFocus: PropTypes.func,
    onBlur: PropTypes.func,
    disabled: PropTypes.bool,
    value: PropTypes.string,
    defaultValue: PropTypes.string,
    width: PropTypes.number,
    height: PropTypes.number,
    align: PropTypes.oneOf(['left', 'center', 'right']),
    label: PropTypes.string.isRequired
};

const defaultProps = {
    className: null,
    fieldClassName: null,
    onChange: null,
    onPaste: null,
    onFocus: null,
    onBlur: null,
    disabled: false,
    value: null,
    defaultValue: '',
    width: 0,
    height: 0,
    align: null,
    label: ''
};

class TextArea extends React.Component {
    constructor(props, context) {
        super(props, context);
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

    render() {
        // Get text aligment
        let textAlignment = 'left';
        if (this.props.align) {
            textAlignment = this.props.align;
        }

        // Text styles
        let textStyles = {
            textAlign: textAlignment !== 'left' ? textAlignment : undefined,
            maxWidth: this.props.width ? this.props.width + 'px' : undefined,
            minHeight: this.props.height ? this.props.height + 'px' : undefined,
            height: this.props.height && this.props.height < 64 ? this.props.height + 'px' : undefined
        };

        // Class name
        let fieldGroupClassName = s.fieldGroup;
        fieldGroupClassName += this.props.className ? ' ' + this.props.className : '';

        // Render
        return (
            <div className={fieldGroupClassName}>
                <textarea
                    ref="field"
                    style={textStyles}
                    className={this.props.fieldClassName ? this.props.fieldClassName : undefined}
                    disabled={this.props.disabled ? true : undefined}
                    placeholder={this.props.label}
                    value={this.props.value !== null ? this.props.value : undefined}
                    defaultValue={this.props.value === null ? this.props.defaultValue : undefined}
                    onChange={e => this.handleChange(e)}
                    onPaste={e => this.handlePaste(e)}
                    onFocus={e => this.handleFocus(e)}
                    onBlur={e => this.handleBlur(e)}
                />
            </div>
        );
    }
}

TextArea.propTypes = propTypes;
TextArea.defaultProps = defaultProps;

export default TextArea;
