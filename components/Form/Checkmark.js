import React, { PropTypes } from 'react';
import { capitalizePhraseOrWord } from './../../helpers/text';
import IconTickBlue from './../Icons/IconTickBlue';
import IconTickGreen from './../Icons/IconTickGreen';
import IconTickWhite from './../Icons/IconTickWhite';
import s from './Checkmark.css';

const propTypes = {
    onClick: PropTypes.func,
    type: PropTypes.oneOf(['default', 'blue', 'green']),
    size: PropTypes.oneOf(['default', 'small']),
    checked: PropTypes.bool,
    defaultChecked: PropTypes.bool,
    label: PropTypes.shape({
        text: PropTypes.string,
        onLeft: PropTypes.bool
    })
};

const defaultProps = {
    onClick: null,
    type: 'default',
    size: 'default',
    defaultChecked: false,
    label: {
        text: '',
        onLeft: false
    }
};

class Checkmark extends React.Component {
    constructor(props, context) {
        super(props, context);

        this.state = {
            checked: typeof this.props.checked !== 'undefined' ? this.props.checked : this.props.defaultChecked
        };
    }

    componentWillReceiveProps(nextProps) {
        // If it contains new checked value
        if (typeof nextProps.checked !== 'undefined') {
            this.setState({
                checked: nextProps.checked
            });
        }
    }

    handleCheckmarkClick(e) {
        // Reverse checked state
        const checked = !this.state.checked;

        // Reverse state if state is not controlled
        if (typeof this.props.checked === 'undefined') {
            this.setState({
                checked: checked
            });
        }

        // Pass event further
        if (this.props.onClick) {
            this.props.onClick(e, checked);
        }

        // Prevent default
        e.preventDefault();
    }

    render() {
        // Prepare label class
        let labelClassName = s.label;
        labelClassName += this.props.type !== 'default' && this.props.type !== 'blue' ? ' ' + s['label' + capitalizePhraseOrWord(this.props.type)] : '';
        labelClassName += this.props.size !== 'default' ? ' ' + s['label' + capitalizePhraseOrWord(this.props.size)] : '';

        // Prepare button class
        let buttonClassName = s.checkmark;
        buttonClassName += this.state.checked === true ? ' ' + s.active : '';

        // Prepare icon
        let icon = null;
        if (this.state.checked) {
            icon = <IconTickWhite width={11} height={9} />;
        } else {
            if (this.props.type === 'green') {
                icon = <IconTickGreen width={11} height={9} />;
            } else {
                icon = <IconTickBlue width={11} height={9} />;
            }
        }

        // Prepare label
        const label = <span className={s.name}>{this.props.label.text}</span>;

        // Render
        return (
            <label className={labelClassName} onClick={e => this.handleCheckmarkClick(e)}>

                {(this.props.label.text && this.props.label.onLeft) && (
                    label
                )}

                <button className={buttonClassName}>
                    {icon}
                </button>

                {(this.props.label.text && this.props.label.onLeft === false) && (
                    label
                )}

            </label>
        );
    }
}

Checkmark.propTypes = propTypes;
Checkmark.defaultProps = defaultProps;

export default Checkmark;
