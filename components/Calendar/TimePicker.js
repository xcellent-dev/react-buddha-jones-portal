import React, { PropTypes } from 'react';
import s from './TimePicker.css';
import { padWithCharacter } from './../../helpers/text';
import { printDateAsHumanReadableFullDateString, convertTotalMinutesToTimeLabel } from './../../helpers/date';
import Dropdown from './../Form/Dropdown';
import DropdownContainer from './../Form/DropdownContainer';
import OptionsList from './../Form/OptionsList';
import Paragraph from './../Content/Paragraph';
import Button from './../Button/Button';
import Row from './../Section/Row';
import Col from './../Section/Col';
import IconTickWhite from './../Icons/IconTickWhite';

const propTypes = {
    className: PropTypes.string,
    onChange: PropTypes.func,
    increments: PropTypes.oneOf([1, 2, 5, 10, 15, 20, 30]),
    isAmerican: PropTypes.bool,
    isOneLine: PropTypes.bool,
    label: PropTypes.string,
    value: PropTypes.number,
    startWithCurrentTime: PropTypes.bool
};

const defaultProps = {
    className: '',
    onChange: null,
    increments: 15,
    isAmerican: true,
    isOneLine: false,
    label: '',
    value: null,
    startWithCurrentTime: false
};

class TimePicker extends React.Component {
    constructor(props, context) {
        super(props, context);

        let value;
        if (this.props.startWithCurrentTime === true) {
            const now = new Date();
            const hours = now.getHours();
            const minutes = now.getMinutes();
            value = hours * 60 + minutes;
        } else {
            value = this.props.value;
        }

        this.state = {
            value: value,
            valueText: 'Pick',
            selected: {
                days: null,
                hours: null,
                minutes: null,
                period: null
            },
            columns: {
                hours: this.calculateHours(),
                minutes: this.calculateMinutes(),
                periods: [
                    { value: 'AM', label: 'AM' },
                    { value: 'PM', label: 'PM' }
                ]
            }
        };
    }

    componentWillMount() {
        // Align time to increment
        if (this.state.value !== null) {
            this.updateSelectedTimeStateFromTotalMinutesValue(this.state.value);
        }
    }

    componentWillUpdate(nextProps, nextState) {
        // When prop value has change, modify the state
        if (this.props.value !== nextProps.value) {
            this.updateSelectedTimeStateFromTotalMinutesValue(nextProps.value);
        }
    }

    updateSelectedTimeStateFromTotalMinutesValue(totalMinutes) {
        if (typeof totalMinutes !== 'undefined') {
            if (totalMinutes !== null) {
                const alignedValue = this.getValueClosestToIncrement(totalMinutes);

                const inHours = alignedValue / 60;
                const baseHours = Math.floor(inHours);
                const baseMinutes = (inHours - baseHours) * 60;

                let baseDays = 0;
                let daysCalc = alignedValue;
                while (daysCalc >= 1440) {
                    daysCalc -= 1440;
                    baseDays++;
                }

                const totalMinutesTimeLabel = convertTotalMinutesToTimeLabel(alignedValue, this.props.isAmerican);

                this.setState({
                    value: alignedValue,
                    valueText: totalMinutesTimeLabel.label,
                    selected: Object.assign({}, this.state.selected, {
                        days: baseDays,
                        hours: baseDays > 0 ? baseHours - (baseDays * 24) : baseHours,
                        minutes: baseMinutes,
                        period: baseHours > 12 ? 'PM' : 'AM'
                    })
                }, () => {
                    if (this.state.value !== alignedValue && this.props.onChange !== null) {
                        this.props.onChange({
                            value: this.state.value,
                            valueText: this.state.valueText,
                            selected: this.state.selected
                        });
                    }
                });
            } else {
                this.setState({
                    value: null,
                    valueText: 'Pick',
                    selected: Object.assign({}, this.state.selected, {
                        days: null,
                        hours: null,
                        minutes: null,
                        period: null
                    })
                });
            }
        }
    }

    getValueClosestToIncrement(totalMinutes) {
        if (typeof totalMinutes !== 'undefined') {
            // Get increment
            const increment = this.props.increments;

            // Calculate aligned value
            let alignedValue;
            if (totalMinutes <= 0) {
                alignedValue = 0;
            } else {
                const mod = totalMinutes % increment;
                alignedValue = totalMinutes - mod;
            }

            // Return aligned value
            return alignedValue;
        }
    }

    calculateHours() {
        // Hours array
        let hours = [];

        // Iterate hours
        if (this.props.isAmerican === true) {
            hours.push({ value: [0, 12], label: '12' });
            for (let h = 1; h < 12; h++) {
                hours.push({
                    value: [h, h + 12],
                    label: padWithCharacter(h.toString(), 2, '0', true)
                });
            }
        } else {
            for (let h = 0; h < 24; h++) {
                hours.push({
                    value: h,
                    label: padWithCharacter(h.toString(), 2, '0', true)
                });
            }
        }

        // Return
        return hours;
    }

    calculateMinutes() {
        // Minutes array
        let minutes = [];

        // Get increment
        const increment = this.props.increments;

        // Iterate before hour ends
        let minute = 0;
        while (minute < 60) {
            minutes.push({
                value: minute,
                label: padWithCharacter(minute.toString(), 2, '0', true)
            });
            minute += increment;
        }

        // Return
        return minutes;
    }

    handleTimeChange(changed, column) {
        // Get existing selected values
        let selected = this.state.selected;
        const periodBefore = selected.period;

        // Modify selected values
        if (typeof changed !== 'undefined' && typeof changed.value !== 'undefined' && typeof column !== 'undefined') {
            if (typeof changed.value === 'object') {
                if (this.state.selected.period === 'PM') {
                    selected[column] = changed.value[changed.value.length - 1];
                } else {
                    selected[column] = changed.value[0];
                }
            } else {
                selected[column] = changed.value;
            }
        }

        // Check if period has changed
        if (periodBefore !== selected.period) {
            if (periodBefore === 'AM' && selected.period === 'PM') {
                selected.hours += 12;
            } else if (periodBefore === 'PM' && selected.period === 'AM') {
                selected.hours -= 12;
            }
        }

        // Calculate value
        let alignedValue = (selected.hours * 60) + selected.minutes;
        const alignedValueLabel = convertTotalMinutesToTimeLabel(alignedValue, this.props.isAmerican);

        // Update state
        this.setState({
            value: alignedValue,
            valueText: alignedValueLabel.label,
            selected: Object.assign({}, this.state.selected, selected)
        }, () => {
            // Pass state further
            if (typeof this.props.onChange !== 'undefined') {
                this.props.onChange({
                    value: this.state.value,
                    valueText: this.state.valueText,
                    selected: this.state.selected
                });
            }
        });
    }

    handleTimeSelectionConfirmation(e) {
        if (typeof this.refs.container !== 'undefined') {
            const container = this.refs.container;
            if (typeof container.closeDropdown !== 'undefined') {
                container.closeDropdown();
            }
        }
    }

    render() {
        // Dropdown class name
        let dropdownClassName = s.timePickerDropdown;
        dropdownClassName += typeof this.props.className !== 'undefined' && this.props.className !== null ? ' ' + this.props.className : '';

        // Render
        return (
            <DropdownContainer
                ref="container"
                className={dropdownClassName}
                align="right"
                minWidth={256}
                type={this.props.isOneLine === true ? 'oneline' : 'twolines'}
                isWhite={true}
                label={this.props.label}
                value={this.state.valueText}
            >
                <Row className={s.entries} removeGutter={true} removeMargins={true}>
                    <Col size={4} removeGutter={true}>
                        <OptionsList
                            onChange={e => this.handleTimeChange(e, 'hours')}
                            options={this.state.columns.hours}
                            value={this.state.selected.hours}
                            label="Hours"
                            align="center"
                        />
                    </Col>
                    <Col size={4} removeGutter={true}>
                        <OptionsList
                            onChange={e => this.handleTimeChange(e, 'minutes')}
                            options={this.state.columns.minutes}
                            value={this.state.selected.minutes}
                            label="Minutes"
                            align="center"
                        />
                    </Col>
                    {(() => {
                        if (this.props.isAmerican === true) {
                            return (
                                <Col size={4} removeGutter={true}>
                                    <OptionsList
                                        onChange={e => this.handleTimeChange(e, 'period')}
                                        options={this.state.columns.periods}
                                        value={this.state.selected.period}
                                        label="Period"
                                        align="center"
                                    />
                                </Col>
                            );
                        }
                    })()}
                </Row>
                <div className={s.summary}>
                    <Button
                        onClick={e => this.handleTimeSelectionConfirmation(e)}
                        label={{
                            text: this.state.valueText,
                            size: 'large',
                            color: 'blue',
                            onLeft: true
                        }}
                        icon={{
                            element:
                                <IconTickWhite
                                    width={12}
                                    marginLeft={-6}
                                    height={9}
                                    marginTop={-4}
                                />,
                            size: 'small',
                            background: 'green'
                        }}
                    />
                </div>
            </DropdownContainer>
        );
    };
}

TimePicker.propTypes = propTypes;
TimePicker.defaultProps = defaultProps;

export default TimePicker;
