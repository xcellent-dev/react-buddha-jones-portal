import React, { PropTypes } from 'react';
import { capitalize } from 'lodash';
import s from './Button.css';

const propTypes = {
    onClick: PropTypes.func,
    className: PropTypes.string,
    float: PropTypes.oneOf(['left', 'right', 'none']),
    isInBox: PropTypes.bool,
    icon: PropTypes.shape({
        element: PropTypes.element.isRequired,
        size: PropTypes.oneOf(['nopadding', 'small', 'large']),
        background: PropTypes.oneOf(['none', 'none-alt', 'white', 'yellow', 'blue', 'orange', 'green']),
    }),
    label: PropTypes.shape({
        text: PropTypes.string.isRequired,
        size: PropTypes.oneOf(['small', 'large']),
        color: PropTypes.oneOf(['black', 'white', 'yellow', 'green', 'blue', 'orange']),
        onLeft: PropTypes.bool
    }),
    tooltip: PropTypes.shape({
        text: PropTypes.string.isRequired,
        on: PropTypes.oneOf(['left', 'top', 'right', 'bottom'])
    }),
    disabled: PropTypes.bool
};

const defaultProps = {
    onClick: null,
    className: '',
    float: 'none',
    isInBox: false,
    icon: null,
    label: null,
    tooltip: null,
    disabled: false
};

class Button extends React.Component {
    constructor(props, context) {
        super(props, context);
    }

    handleButtonClick(e) {
        if (this.props.onClick !== null && this.props.disabled !== true) {
            this.props.onClick(e);
        }
    }

    handleButtonMouseEnter(e) {
        // Animate tooltip in if it exists
        if (typeof this.refs.tooltip !== 'undefined') {
            // Get tooltip
            const tooltip = this.refs.tooltip;

            // Initial style
            tooltip.style.display = 'block';
            tooltip.style.opacity = '1';

            // Animation position
            let tooltipOn = typeof this.props.tooltip.on !== 'undefined' ? this.props.tooltip.on : 'left';

            // Align element
            switch (tooltipOn) {
                case 'top':
                case 'bottom':
                    tooltip.style.top = null;
                    tooltip.style.left = '50%';
                    tooltip.style.marginTop = null;
                    tooltip.style.marginLeft = -(tooltip.offsetWidth / 2) + 'px';
                    break;

                default:
                    tooltip.style.top = '50%';
                    tooltip.style.left = null;
                    tooltip.style.marginTop = -(tooltip.offsetHeight / 2) + 'px';
                    tooltip.style.marginLeft = null;
                    break;
            }

            // Animate element in
            switch (tooltipOn) {
                case 'top':
                    tooltip.classList.add('buttonTooltipOntopIn');
                    break;

                case 'bottom':
                    tooltip.classList.add('buttonTooltipOnbottomIn');
                    break;

                case 'right':
                    tooltip.classList.add('buttonTooltipOnrightIn');
                    break;

                default:
                    tooltip.classList.add('buttonTooltipOnleftIn');
                    break;
            }
        }
    }

    handleButtonMouseLeave(e) {
        // Animate tooltip out if it exists
        if (typeof this.refs.tooltip !== 'undefined') {
            // Get tooltip
            const tooltip = this.refs.tooltip;

            // Animation position
            let tooltipOn = typeof this.props.tooltip.on !== 'undefined' ? this.props.tooltip.on : 'left';

            // Remove opacity
            tooltip.style.opacity = '0';

            // Animate element out
            switch (tooltipOn) {
                case 'top':
                    tooltip.classList.add('buttonTooltipOntopOut');
                    tooltip.classList.remove('buttonTooltipOntopIn');
                    break;

                case 'bottom':
                    tooltip.classList.add('buttonTooltipOnbottomOut');
                    tooltip.classList.remove('buttonTooltipOnbottomIn');
                    break;

                case 'right':
                    tooltip.classList.add('buttonTooltipOnrightOut');
                    tooltip.classList.remove('buttonTooltipOnrightIn');
                    break;

                default:
                    tooltip.classList.add('buttonTooltipOnleftOut');
                    tooltip.classList.remove('buttonTooltipOnleftIn');
                    break;
            }

            // End animation
            setTimeout(() => {
                tooltip.style.display = null;
                tooltip.style.opacity = null;
                tooltip.classList.remove('buttonTooltipOntopIn');
                tooltip.classList.remove('buttonTooltipOntopOut');
                tooltip.classList.remove('buttonTooltipOnbottomIn');
                tooltip.classList.remove('buttonTooltipOnbottomOut');
                tooltip.classList.remove('buttonTooltipOnrightIn');
                tooltip.classList.remove('buttonTooltipOnrightOut');
                tooltip.classList.remove('buttonTooltipOnleftIn');
                tooltip.classList.remove('buttonTooltipOnleftOut');
            }, 500);
        }
    }

    render() {
        // Prepare label class name
        let labelClassName = 'buttonLabel';
        if (this.props.label !== null && typeof this.props.label.text !== 'undefined') {
            // Color
            if (typeof this.props.label.color !== 'undefined') {
                labelClassName += ' buttonLabel' + capitalize(this.props.label.color);
            }

            // Size
            if (typeof this.props.label.size !== 'undefined') {
                labelClassName += ' buttonLabel' + capitalize(this.props.label.size);
            }
        }

        // Prepare button class
        let buttonClassName = 'button';
        buttonClassName += this.props.float !== 'none' ? ' ' + 'float' + capitalize(this.props.float) : '';
        if (this.props.isInBox) {
            buttonClassName += ' boxButton';
            buttonClassName += typeof this.props.label.color !== 'undefined' ? ' boxColor' + capitalize(this.props.label.color) : '';
        }
        buttonClassName += this.props.className ? ' ' + this.props.className : '';

        // Return button
        return (
            <button
                className={buttonClassName}
                onClick={e => this.handleButtonClick(e) }
                onMouseEnter={e => this.handleButtonMouseEnter(e)}
                onMouseLeave={e => this.handleButtonMouseLeave(e)}
            >

                {(this.props.label !== null && (typeof this.props.label.onLeft === 'undefined' || this.props.label.onLeft === true)) && (
                    <span className={labelClassName + ' buttonLabelOnLeft'}>{this.props.label.text}</span>
                )}

                {(() => {
                    if (this.props.icon !== null && typeof this.props.icon.element !== 'undefined') {
                        // Icon class name
                        let iconClassName = 'buttonIcon';

                        // Icon size class name
                        if (typeof this.props.icon.size !== 'undefined') {
                            iconClassName += ' buttonIcon' + capitalize(this.props.icon.size);
                        } else {
                            iconClassName += ' buttonIconLarge';
                        }

                        // Icon background class name
                        if (typeof this.props.icon.background !== 'undefined') {
                            iconClassName += ' buttonIconBackground' + capitalize(this.props.icon.background);
                        } else {
                            iconClassName += ' buttonIconBackgroundOrange';
                        }

                        // Render icon
                        return (
                            <span className={iconClassName}>
                                {(() => {
                                    if (typeof this.props.icon.element !== 'undefined') {
                                        return this.props.icon.element;
                                    }
                                })()}
                            </span>
                        );
                    }
                })()}

                {(this.props.label !== null && typeof this.props.label.text !== 'undefined' && this.props.label.onLeft === false) && (
                    <span className={labelClassName + ' buttonLabelOnRight'}>{this.props.label.text}</span>
                )}

                {(() => {
                    if (this.props.tooltip !== null && typeof this.props.tooltip.text !== 'undefined') {
                        const tooltipText = this.props.tooltip.text;
                        const tooltipOn = typeof this.props.tooltip.on !== 'undefined' ? this.props.tooltip.on : 'left';
                        const tooltipClassName = 'buttonTooltip' + ' buttonTooltipOn' + tooltipOn;
                        return (
                            <span ref="tooltip" className={tooltipClassName}>{tooltipText}</span>
                        );
                    }
                })()}
            </button>
        );
    }
}

Button.propTypes = propTypes;
Button.defaultProps = defaultProps;

export default Button;
