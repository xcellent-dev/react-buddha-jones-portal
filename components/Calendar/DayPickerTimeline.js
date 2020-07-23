import React from 'react';
import { debounce } from 'lodash';
import s from './DayPickerTimeline.css';
import {
    printMonthName,
    printWeekDayName,
    getAllMonthsBetweenTwoDates,
    checkIfTwoDatesAreTheSameDay,
    checkIfYearDashMonthStringIsTheSameAsDate,
    convertYearDashMonthStringIntoDate,
    constructMonthYearObject
} from './../../helpers/date';
import Row from './../Section/Row';
import Col from './../Section/Col';
import Dropdown from './../Form/Dropdown';
import Button from './../Button/Button';
import IconArrowLeftYellow from './../Icons/IconArrowLeftYellow';
import IconArrowRightYellow from './../Icons/IconArrowRightYellow';

class DayPickerTimeline extends React.Component {
    constructor(props, context) {
        super(props, context);

        // Create debounced window resize function
        this.windowResizeEvent = null;
        this.delayedWindowResize = debounce(function(e) {
            this.windowResizeDebounced(e);
        }, 512);

        // Prepare dates
        const now = new Date();
        const months = getAllMonthsBetweenTwoDates(this.props.limitFromDate, this.props.limitToDate, true, false);
        const current = checkIfTwoDatesAreTheSameDay(this.props.startingDate, now) === true ? 0 : null;
        const starting = typeof this.props.startingDate !== 'undefined' ? this.props.startingDate : now;

        // Selected month
        let selected = null;
        if (months.length > 0) {
            selected = months[0];
            for (let m = 0; m < months.length; m++) {
                const month = months[m];
                if (checkIfYearDashMonthStringIsTheSameAsDate(month.value, starting) === true) {
                    selected = month;
                    break;
                }
            }
        }

        // Set initial state
        this.state = {
            calculating: false,
            monthSelected: selected,
            monthOptions: months,
            currentDayIndex: current,
            selectedDayIndex: 0,
            selectedDate: starting,
            todayDate: now,
            days: [starting]
        };
    }

    componentDidMount() {
        // Add resize window event
        this.windowResizeEvent = this.windowResize.bind(this);
        window.addEventListener('resize', this.windowResizeEvent, false);

        // Delay to make sure all elements load
        setTimeout(() => {
            // Calculate
            const days = this.calculateVisibleDays(this.state.days[0], 'center');
            const currentDayIndex = this.getIndexOfCurrentDateInDays(days);
            const selectedDayIndex = this.getIndexOfSelectedDateInDays(days);

            // Calculate visible days
            this.setState(
                Object.assign({}, this.state, {
                    days: days,
                    currentDayIndex: currentDayIndex,
                    selectedDayIndex: selectedDayIndex
                })
            );
        }, 256);
    }

    componentWillUnmount() {
        // Remove window resize event
        if (typeof this.windowResizeEvent !== 'undefined' && this.windowResizeEvent !== null) {
            window.removeEventListener('resize', this.windowResizeEvent);
        }
    }

    windowResize(e) {
        this.delayedWindowResize(e);
    }

    windowResizeDebounced(e) {
        // Start calculation
        this.setState(
            Object.assign({}, this.state, {
                calculating: true
            })
        );

        // Get date to calculate form
        let date, position;
        if (this.state.selectedDayIndex !== -1) {
            date = this.state.days[this.state.selectedDayIndex];
            position = 'center';
        } else {
            date = this.state.days[0];
            position = 'first';
        }

        // Calculate new days
        const days = this.calculateVisibleDays(date, position);
        const currentDayIndex = this.getIndexOfCurrentDateInDays(days);
        const selectedDayIndex = this.getIndexOfSelectedDateInDays(days);

        // Update state
        this.setState(
            Object.assign({}, this.state, {
                calculating: false,
                currentDayIndex: currentDayIndex,
                selectedDayIndex: selectedDayIndex,
                days: days
            })
        );
    }

    calculateMaxVisibleDaysCount() {
        // Check if container exists
        if (typeof this.refs !== 'undefined' && typeof this.refs.container !== 'undefined') {
            // Get container and dimensions
            const container = this.refs.container;
            const containerWidth = container.offsetWidth;
            const dayWidth = 44;

            // Calculate
            return Math.floor(containerWidth / dayWidth);
        } else {
            return 0;
        }
    }

    calculateVisibleDays(date, position) {
        // Set
        let days = [];
        let daysBeforeDate = [];
        let daysAfterDate = [];

        // Check if parameters are provided
        if (typeof date !== 'undefined' && typeof position !== 'undefined') {
            // Set date and position
            const getDate = date.getUTCDate();
            position = typeof position !== 'undefined' ? position : 'center';

            // Calculate amount of days that can be displayed at once
            const maxVisibleDays = this.calculateMaxVisibleDaysCount();

            // Only if you can display at least one day
            if (maxVisibleDays > 0) {
                // Iterate visible days
                let v = 1;
                while (v <= maxVisibleDays) {
                    // Previous dates
                    if (position === 'center' || position === 'last') {
                        let prevDate = new Date(date);
                        prevDate.setDate(getDate - v);
                        daysBeforeDate.push(prevDate);
                    }

                    // Next dates
                    if (position === 'center' || position === 'first') {
                        let nextDate = new Date(date);
                        nextDate.setDate(getDate + v);
                        daysAfterDate.push(nextDate);
                    }

                    // Check if we have enough
                    if (daysBeforeDate.length + daysAfterDate.length + 1 >= maxVisibleDays) {
                        break;
                    }

                    // Iterate
                    v++;
                }

                // Return concat of dates
                return daysBeforeDate.reverse().concat([date]).concat(daysAfterDate);
            } else {
                return days;
            }
        } else {
            return days;
        }
    }

    getIndexOfCurrentDateInDays(days, todayDate) {
        days = typeof days !== 'undefined' ? days : this.state.days;
        todayDate = typeof todayDate !== 'undefined' ? todayDate : this.state.todayDate;
        if (typeof days !== 'undefined' && days.length > 0) {
            for (let d = 0; d < days.length; d++) {
                const day = days[d];
                if (checkIfTwoDatesAreTheSameDay(day, todayDate) === true) {
                    return d;
                }
            }
        }
        return -1;
    }

    getIndexOfSelectedDateInDays(days, selectedDate) {
        days = typeof days !== 'undefined' ? days : this.state.days;
        selectedDate = typeof selectedDate !== 'undefined' ? selectedDate : this.state.selectedDate;
        if (typeof days !== 'undefined' && days.length > 0) {
            for (let d = 0; d < days.length; d++) {
                const day = days[d];
                if (checkIfTwoDatesAreTheSameDay(day, selectedDate) === true) {
                    return d;
                }
            }
        }
        return -1;
    }

    handleMonthChange(option) {
        if (typeof option !== 'undefined') {
            // Starting calculating
            this.setState(
                Object.assign({}, this.state, {
                    calculating: true
                })
            );

            // Convert date
            const date = convertYearDashMonthStringIntoDate(option.value);
            date.setDate(1);

            // Get days
            const days = this.calculateVisibleDays(date, 'first');
            const currentDayIndex = this.getIndexOfCurrentDateInDays(days);
            const selectedDayIndex = this.getIndexOfSelectedDateInDays(days);

            // Update state
            this.setState(
                Object.assign({}, this.state, {
                    calculating: false,
                    monthSelected: option,
                    currentDayIndex: currentDayIndex,
                    selectedDayIndex: selectedDayIndex,
                    days: days
                })
            );
        }
    }

    handleScrollingToMoreDays(scrollRight) {
        // Parameters
        scrollRight = typeof scrollRight !== 'undefined' ? scrollRight : true;

        // Get days on the right
        let newDays = [];
        if (scrollRight === true) {
            newDays = this.calculateVisibleDays(this.state.days[this.state.days.length - 1], 'first');
        } else {
            newDays = this.calculateVisibleDays(this.state.days[0], 'last');
        }

        // Get selected day and current day
        const currentDayIndex = this.getIndexOfCurrentDateInDays(newDays);
        const selectedDayIndex = this.getIndexOfSelectedDateInDays(newDays);

        // New selected month
        const monthSelected = constructMonthYearObject(newDays[0], true);

        // Update state
        this.setState(
            Object.assign({}, this.state, {
                monthSelected: monthSelected,
                currentDayIndex: currentDayIndex,
                selectedDayIndex: selectedDayIndex,
                days: newDays,
            })
        );
    }

    handleDayClick(e, date, selectedIndex) {
        // Check if date is defined
        if (typeof date !== 'undefined') {
            // Update state
            this.setState(
                Object.assign({}, this.state, {
                    selectedDate: date,
                    selectedDayIndex: selectedIndex
                })
            );

            // Pass change event to a prop
            if (typeof this.props.onChange !== 'undefined') {
                this.props.onChange(date);
            }
        }
    }

    render() {
        // Container class name
        let containerClassName = s.container;
        containerClassName += typeof this.props.className !== 'undefined' ? ' ' + this.props.className : '';

        // Days list class name
        let daysListClassName = s.daysList;
        daysListClassName += this.state.calculating === true ? ' ' + s.hide : '';

        // Render
        return (
            <div ref="container" className={containerClassName}>
                <Row removeGutter={true}>
                    <Col>
                        <Dropdown
                            onChange={e => this.handleMonthChange(e)}
                            label="Pick date"
                            type="oneline"
                            isWhite={true}
                            maxWidth={320}
                            selected={this.state.monthSelected}
                            options={this.state.monthOptions}
                        />
                    </Col>
                    <Col>
                        <Button
                            className={s.monthSwitchArrow}
                            onClick={e => this.handleScrollingToMoreDays(true)}
                            float="right"
                            icon={{
                                element: React.createElement(IconArrowRightYellow, {
                                    width: 15,
                                    height: 11
                                }, null),
                                size: 'nopadding',
                                background: 'none'
                            }}
                            label={{
                                text: 'NEXT',
                                size: 'small',
                                color: 'yellow',
                                onLeft: true
                            }}
                        />
                        <Button
                            className={s.monthSwitchArrow}
                            onClick={e => this.handleScrollingToMoreDays(false)}
                            float="right"
                            icon={{
                                element: React.createElement(IconArrowLeftYellow, {
                                    width: 15,
                                    height: 11
                                }, null),
                                size: 'nopadding',
                                background: 'none'
                            }}
                            label={{
                                text: 'PREV',
                                size: 'small',
                                color: 'yellow',
                                onLeft: false
                            }}
                        />
                    </Col>
                </Row>
                <Row className={s.daysListContainer} removeGutter={true}>
                    <Col>
                        <dl className={daysListClassName}>
                            {this.state.days.map((dayDate, index) => {
                                // Calculate
                                let allowClick = true;
                                let dayClassName = s.day;
                                dayClassName += this.state.currentDayIndex === index ? ' ' + s.currentDay : '';
                                dayClassName += this.state.selectedDayIndex === index ? ' ' + s.selectedDay : '';

                                // When day is before or after the limit
                                if (dayDate > this.props.limitToDate || dayDate < this.props.limitFromDate) {
                                    if (checkIfTwoDatesAreTheSameDay(dayDate, this.props.limitFromDate) === false) {
                                        dayClassName += ' ' + s.disabledDay;
                                        allowClick = false;
                                    }
                                }

                                // Render
                                return (
                                    <dd key={dayDate} className={dayClassName}>
                                        <button onClick={allowClick === true ? e => this.handleDayClick(e, dayDate, index) : null}>
                                            <p className={s.dayNumber}>{dayDate.getDate()}</p>
                                            <p className={s.dayShortName}>{printWeekDayName(dayDate, true)}</p>
                                        </button>
                                    </dd>
                                );
                            })}
                        </dl>
                    </Col>
                </Row>
            </div>
        );
    }
}

DayPickerTimeline.propTypes = {
    onChange: React.PropTypes.func,
    className: React.PropTypes.string,
    startingDate: React.PropTypes.object,
    limitFromDate: React.PropTypes.object.isRequired,
    limitToDate: React.PropTypes.object.isRequired
};

export default DayPickerTimeline;
