import React, { PropTypes } from 'react';
import s from './DurationPicker.css';
import { padStart } from 'lodash';
import Button from './../Button/Button';
import IconArrowTopBlue from './../Icons/IconArrowTopBlue';

const propTypes = {
    onChange: PropTypes.func,
    className: PropTypes.string,
    label: PropTypes.string,
    increments: PropTypes.oneOf([1, 2, 5, 10, 15, 20, 30]),
    totalMinutes: PropTypes.number
};

const defaultProps = {
    className: '',
    label: '',
    increments: 15,
    totalMinutes: 60
};

class DurationPicker extends React.Component {
    constructor(props, context) {
        super(props, context);

        this.mounted = false;

        this.state = {
            hours: Math.floor(this.props.totalMinutes / 60),
            minutes: this.props.totalMinutes % 60,
            totalMinutes: this.props.totalMinutes
        };
    }

    componentDidMount() {
        this.mounted = true;
    }

    componentWillUpdate(nextProps, nextState) {
        // Check if total minutes have changed
        if (
            (this.mounted === true && nextProps.totalMinutes !== 'undefined')
            &&
            (nextProps.totalMinutes !== this.state.totalMinutes || nextProps.totalMinutes !== nextState.totalMinutes)
        ) {
            const totalMinutes = nextProps.totalMinutes - (nextProps.totalMinutes % this.props.increments);
            this.setState(
                Object.assign({}, this.state, {
                    hours: Math.floor(totalMinutes / 60),
                    minutes: totalMinutes % 60,
                    totalMinutes: totalMinutes
                })
            );
        }
    }

    handleDurationChange(increase) {
        // Properties
        increase = typeof increase !== 'undefined' ? increase : true;
        const increment = this.props.increments;
        let newHours = this.state.hours;
        let newMinutes = this.state.minutes;
        let newTotalMinutes = this.state.totalMinutes;

        // Calculate
        if (increase === true) {
            newTotalMinutes = this.state.totalMinutes + increment;
            const addMinutes = this.state.minutes + increment;
            if (addMinutes > 59) {
                newHours = this.state.hours + 1;
                newMinutes = addMinutes - 60;
            } else {
                newHours = this.state.hours;
                newMinutes = addMinutes;
            }
        } else {
            if (this.state.totalMinutes < increment) {
                newHours = 0;
                newMinutes = 0;
                newTotalMinutes = 0;
            } else {
                newTotalMinutes = this.state.totalMinutes - increment;
                const removeMinutes = this.state.minutes - increment;
                if (removeMinutes < 0) {
                    newHours = this.state.hours - 1;
                    newMinutes = removeMinutes + 60;
                } else {
                    newHours = this.state.hours;
                    newMinutes = removeMinutes;
                }
            }
        }

        // Update state
        this.setState({
            hours: newHours,
            minutes: newMinutes,
            totalMinutes: newTotalMinutes
        });

        // Update parent component
        if (typeof this.props.onChange !== 'undefined') {
            this.props.onChange({ hours: newHours, minutes: newMinutes, totalMinutes: newTotalMinutes });
        }
    }

    render() {
        // Duration picker class name
        let durationClassName = 'durationPicker';
        durationClassName += this.props.className !== '' ? ' ' + this.props.className : '';

        // Render
        return (
            <div className={durationClassName}>
                {(() => {
                    if (this.props.label !== '') {
                        return (
                            <p className="durationPickerLabel">{this.props.label}</p>
                        );
                    }
                })()}
                <Button
                    className={s.decreaseArrow}
                    onClick={e => this.handleDurationChange(false)}
                    icon={{
                        element: React.createElement(IconArrowTopBlue, {
                            width: 15,
                            height: 20,
                            transform: 'rotateZ(180deg)'
                        }),
                        size: 'nopadding',
                        background: 'none'
                    }}
                    tooltip={{
                        text: 'Decrease by ' + this.props.increments + ' minutes',
                        on: 'left'
                    }}
                />
                <p className="durationPickerTime">
                    <strong>{padStart(this.state.hours.toString(), 2, '0')}</strong>
                    <span>H</span>
                    <strong>{padStart(this.state.minutes.toString(), 2, '0')}</strong>
                    <span>M</span>
                </p>
                <Button
                    className={s.increaseArrow}
                    onClick={e => this.handleDurationChange(true)}
                    icon={{
                        element: React.createElement(IconArrowTopBlue, {
                            width: 15,
                            height: 20
                        }),
                        size: 'nopadding',
                        background: 'none'
                    }}
                    tooltip={{
                        text: 'Increase by ' + this.props.increments + ' minutes',
                        on: 'right'
                    }}
                />
            </div>
        );
    }
}

DurationPicker.propTypes = propTypes;
DurationPicker.defaultProps = defaultProps;

export default DurationPicker;
