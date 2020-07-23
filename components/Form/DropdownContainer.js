import React, { PropTypes } from 'react';
import { debounce } from 'lodash';
import s from './DropdownContainer.css';
import { searchPhraseInString } from './../../helpers/search';
import { truncuateString } from './../../helpers/text';
import Input from './Input';
import IconDropdownArrow from './../../components/Icons/IconDropdownArrow';
import IconDropdownArrowYellow from './../../components/Icons/IconDropdownArrowYellow';

const propTypes = {
    hide: PropTypes.bool,
    className: PropTypes.string,
    onOpenChange: PropTypes.func,
    onMaxHeightChange: PropTypes.func,
    minWidth: PropTypes.number,
    maxWidth: PropTypes.number,
    maxHeight: PropTypes.number,
    overflowAuto: PropTypes.bool,
    align: PropTypes.oneOf(['left', 'center', 'right']),
    type: PropTypes.oneOf(['oneline', 'twolines', 'field']),
    isWhite: PropTypes.bool,
    label: PropTypes.string.isRequired,
    value: PropTypes.string,
    truncuateValueTo: PropTypes.number
};

const defaultProps = {
    hide: false,
    className: null,
    onOpenChange: null,
    onMaxHeightChange: null,
    minWidth: 0,
    maxWidth: 0,
    maxHeight: 0,
    overflowAuto: false,
    align: 'left',
    type: 'oneline',
    isWhite: false,
    label: '',
    value: '',
    truncuateValueTo: 0
};

class DropdownContainer extends React.Component {
    constructor(props, context) {
        super(props, context);

        this.delayedWindowResize = debounce(function(e) {
            this.windowResizeDebounced(e);
        }, 256);

        this.state = {
            open: false,
            highlighted: null,
            positionOnTop: false,
            positionMarginLeft: 0,
            positionMarginTop: 0,
            maxHeight: 440
        };

        this.openEvents = {
            window: []
        };
    }

    componentWillUnmount() {
        this.removeOpenEvents();
    }

    addOpenEvents() {
        // Create window click event
        const windowClick = this.windowClicked.bind(this);
        this.openEvents.window.push({ type: 'click', handler: windowClick });
        window.addEventListener('click', windowClick, false);

        // Create window key up event
        const windowKeyUp = this.windowKeyedUp.bind(this);
        this.openEvents.window.push({ type: 'keyup', handler: windowKeyUp });
        window.addEventListener('keyup', windowKeyUp, false);

        // Create window resize event
        const windowResize = this.windowResize.bind(this);
        this.openEvents.window.push({ type: 'resize', handler: windowResize });
        window.addEventListener('resize', windowResize, false);
    }

    removeOpenEvents() {
        // Remove window events
        this.openEvents.window.map(evt => {
            window.removeEventListener(evt.type, evt.handler);
        });
    }

    windowClicked(e) {
        this.closeDropdown();
    }

    windowKeyedUp(e) {
        // Base behavior on the logged key
        switch (e.keyCode) {
            // ESC key
            case 27:
                this.closeDropdown();
                break;

            default:
                break;
        }
    }

    windowResize(e) {
        this.delayedWindowResize(e);
    }

    windowResizeDebounced(e) {
        this.positionAndResizeDropdown();
    }

    closeDropdown() {
        // Change state to closed
        this.setState({
            open: false,
            positionMarginLeft: 0,
            positionMarginTop: 0
        });

        // Remove events associated with open dropdown
        this.removeOpenEvents();
    }

    handleLabelClick(e) {
        // Close
        if (this.state.open === true) {
            // Set closed state
            this.closeDropdown();
        // Open
        } else {
            // Add events related to open dropdown
            this.addOpenEvents();

            // Position dropdown
            this.positionAndResizeDropdown();
        }

        // Stop propagation
        e.stopPropagation();
    }

    positionAndResizeDropdown() {
        // Get dimensions needed for calculations
        const windowHeight = window.innerHeight;
        const windowWidth = window.innerWidth;
        const label = this.refs.label;
        const labelPosition = label.getBoundingClientRect();
        const labelWidth = label.offsetWidth;
        const labelHeight = label.offsetHeight;
        const dropdownWidth = labelWidth > 192 ? labelWidth : 192;

        // Determine top or bottom position
        const positionOnTop = windowHeight * 0.8 < labelPosition.top ? true : false;

        // Determine left margin
        let positionMarginLeft = 0;
        if (labelWidth < dropdownWidth) {
            switch (this.props.align) {
                case 'right':
                    positionMarginLeft = -(dropdownWidth - labelWidth);
                    break;

                case 'center':
                    positionMarginLeft = -((dropdownWidth - labelWidth) / 2);
                    break;

                default:
                    break;
            }
        }
        const rightDropdownEdgePosition = labelPosition.left + dropdownWidth + positionMarginLeft;
        if (windowWidth < rightDropdownEdgePosition) {
            positionMarginLeft = positionMarginLeft - (rightDropdownEdgePosition - windowWidth);
        }

        // Determine top margin
        let positionMarginTop = 0;
        if (positionOnTop === true) {
            positionMarginTop = -labelHeight - 8;
        } else {
            positionMarginTop = labelHeight + 8;
        }

        // Calculate max height
        let maxHeight = this.props.maxHeight;
        if (positionOnTop === true) {
            const maxHeightOnTop = labelPosition.top + positionMarginTop - 12;
            if (maxHeightOnTop < maxHeight || maxHeight === 0) {
                maxHeight = maxHeightOnTop;
            }
        } else {
            const maxHeightOnBottom = windowHeight - (labelPosition.top + positionMarginTop + 12);
            if (maxHeightOnBottom < maxHeight || maxHeight === 0) {
                maxHeight = maxHeightOnBottom;
            }
        }

        // Check if maxHeight has changed
        if (this.props.onMaxHeightChange && this.state.maxHeight !== maxHeight) {
            this.props.onMaxHeightChange(maxHeight);
        }

        // Set open state
        this.setState({
            open: true,
            positionOnTop: positionOnTop,
            positionMarginLeft: positionMarginLeft,
            positionMarginTop: positionMarginTop,
            maxHeight: maxHeight
        });
    }

    handleDropdownGroupClick(e) {
        e.stopPropagation();
    }

    render() {
        // Prepare class name
        let dropdownClassName = 'dropdown';
        dropdownClassName += this.props.className ? ' ' + this.props.className : '';
        dropdownClassName += ' ' + this.props.type;
        dropdownClassName += this.state.open === true ? ' ' + s.open : '';
        dropdownClassName += this.props.isWhite === true ? ' ' + s.white : '';

        // Dropdown container style
        let dropdownStyle = {
            maxWidth: this.props.maxWidth > 0 ? this.props.maxWidth + 'px' : undefined,
            margin: this.props.align === 'center' ? '0 auto' : undefined,
            marginLeft: this.props.align === 'right' ? 'auto' : undefined,
            marginRight: this.props.align === 'left' ? 'auto' : undefined,
            display: this.props.hide ? 'none' : undefined
        };

        // Label class name
        let labelClassName = 'dropdownLabel';
        labelClassName += ' ' + this.props.align;

        // Dropdown group class name
        let dropdownGroupClassName = 'dropdownGroup';
        dropdownGroupClassName += this.state.positionOnTop === true ? ' top' : '';

        // Dropdown group style
        let dropdownGroupStyle = {
            marginLeft: this.state.positionMarginLeft !== 0 ? this.state.positionMarginLeft + 'px' : undefined,
            marginTop: this.state.positionMarginTop > 0 ? this.state.positionMarginTop + 'px' : undefined,
            marginBottom: this.state.positionMarginTop < 0 ? -(this.state.positionMarginTop) + 'px' : undefined,
            maxWidth: this.props.maxWidth > 0 ? this.props.maxWidth + 'px' : undefined,
            minWidth: this.props.minWidth > 0 ? this.props.minWidth + 'px' : undefined,
            maxHeight: this.state.maxHeight + 'px',
            overflow: this.props.overflowAuto ? 'auto' : undefined
        };

        // Selection
        let selectionText = 'None';
        if (this.props.value !== null) {
            selectionText = this.props.truncuateValueTo > 0
                ? truncuateString(this.props.value, this.props.truncuateValueTo, '...')
                : this.props.value;
        }

        // Icon
        const icon = this.props.isWhite
            ?
            <IconDropdownArrowYellow
                width={11}
                height={8}
                marginTop={-4}
            />
            :
            <IconDropdownArrow
                width={11}
                height={8}
                marginTop={-4}
            />;

        // Render
        return (
            <div className={dropdownClassName} style={dropdownStyle}>
                <div ref="label" className={labelClassName} onClick={e => this.handleLabelClick(e)}>
                    <p>
                        <span>{this.props.label}</span>
                        <strong>{selectionText}</strong>
                    </p>
                    {icon}
                </div>
                {(typeof this.props.children !== 'undefined' && this.props.children) && (
                    <div style={dropdownGroupStyle} className={dropdownGroupClassName} onClick={e => this.handleDropdownGroupClick(e)}>
                        {this.state.open === true && (
                            this.props.children
                        )}
                    </div>
                )}
            </div>
        );
    }
}

DropdownContainer.propTypes = propTypes;
DropdownContainer.defaultProps = defaultProps;

export default DropdownContainer;
