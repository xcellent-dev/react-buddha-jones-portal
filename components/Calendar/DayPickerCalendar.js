import React, { PropTypes } from 'react';
import s from './DayPickerCalendar.css';
import { isEqual, padStart } from 'lodash';
import moment from 'moment';
import Row from './../Section/Row';
import Col from './../Section/Col';
import Button from './../Button/Button';
import Paragraph from './../Content/Paragraph';
import IconArrowLeft from './../Icons/IconArrowLeft';
import IconArrowRight from './../Icons/IconArrowRight';

const propTypes = {
    onChange: PropTypes.func,
    className: PropTypes.string,
    value: PropTypes.object
};

const defaultProps = {
    onChange: null,
    className: '',
    value: null
};

class DayPickerCalendar extends React.Component {
    constructor(props, context) {
        super(props, context);

        this.state = {
            today: moment(),
            showDays: true,
            date: {
                selected: null,
                displayed: null
            },
            weekDayNames: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
        };
    }

    shouldComponentUpdate(nextProps, nextState) {
        if (nextProps.date !== this.props.date) {
            return true;
        } else if (this.state.date.selected !== nextProps.date) {
            return true;
        } else if (this.state.showDays !== nextState.showDays) {
            return true;
        } else if (this.state.date.displayed !== nextState.date.displayed) {
            return true;
        } else {
            console.log('Ignore DayPickerCalendar component changes');
            return false;
        }
    }

    componentDidMount(nextProps, nextState) {
        // Set date
        let date = moment(this.props.value);
        date = date.isValid() ? date : moment();

        // Update state
        this.setState({
            date: Object.assign({}, this.state.date, {
                selected: date,
                displayed: date
            })
        }, () => {
            this.onChangeCallback();
        });
    }

    componentWillReceiveProps(nextProps) {
        // Set date
        if (nextProps.value) {
            const nextDate = typeof nextProps.value.isValid !== 'undefined' ? nextProps.value.clone() : moment(nextProps.value);
            const oldDate = this.state.date.selected;
            if (nextDate.isValid() && oldDate && oldDate.isSame(nextDate, 'day')) {
                this.setState({
                    date: Object.assign({}, this.state.date, {
                        selected: nextDate
                    })
                });
            }
        }
    }

    onChangeCallback() {
        if (this.props.onChange) {
            this.props.onChange(this.state.date.selected);
        }
    }

    handlePeriodArrowClick(direction) {
        // Calculate next date
        let nextDisplayedDate = this.state.date.displayed.clone();
        nextDisplayedDate.date(15);
        if (typeof direction !== 'undefined' && direction === 'right') {
            if (this.state.showDays) {
                nextDisplayedDate.add(1, 'month');
            } else {
                nextDisplayedDate.add(1, 'year');
            }
        } else {
            if (this.state.showDays) {
                nextDisplayedDate.subtract(1, 'month');
            } else {
                nextDisplayedDate.subtract(1, 'year');
            }
        }

        // Update state
        this.setState({
            date: Object.assign({}, this.state.date, {
                displayed: nextDisplayedDate
            })
        });
    }

    handleDaysMonthsToggle(e) {
        this.setState({
            showDays: !this.state.showDays
        });
    }

    handleDateChange(dateString) {
        if (typeof dateString !== 'undefined') {
            // Parse date string
            const nextDate = moment(dateString);

            // Update state
            if (nextDate.isValid()) {
                this.setState({
                    date: Object.assign({}, this.state.date, {
                        selected: nextDate,
                        displayed: nextDate
                    })
                }, () => {
                    this.onChangeCallback();
                });
            }
        }
    }

    handleDisplayedMonthChange(dateString) {
        if (typeof dateString !== 'undefined') {
            // Parse date string
            const nextDisplayedDate = moment(dateString + '-15');

            // Update state
            if (nextDisplayedDate.isValid()) {
                this.setState({
                    date: Object.assign({}, this.state.date, {
                        displayed: nextDisplayedDate
                    }),
                    showDays: true
                });
            }
        }
    }

    createDateObject(date) {
        if (typeof date !== 'undefined' && this.state.date.selected) {
            return {
                id: date.format('YYYY-MM-DD'),
                date: date.date(),
                dateString: date.format('DD'),
                isSelected: date.isSame(this.state.date.selected, 'day'),
                isCurrentMonth: date.isSame(this.state.date.displayed, 'month'),
                isToday: date.isSame(this.state.today, 'day')
            };
        } else {
            return false;
        }
    }

    createMonthObject(date) {
        if (typeof date !== 'undefined' && this.state.date.selected) {
            return {
                id: date.format('YYYY-MM'),
                month: date.month(),
                monthString: date.format('MMMM'),
                isSelected: date.isSame(this.state.date.selected, 'month')
            };
        } else {
            return false;
        }
    }

    render() {
        // Calendar class name
        let calendarClassName = s.calendar;
        calendarClassName += this.props.className !== '' ? ' ' + this.props.className : '';

        // Days months toggle label
        let daysMonthsToggleLabel = '';
        if (this.state.date.displayed) {
            if (this.state.showDays) {
                daysMonthsToggleLabel = this.state.date.displayed.format('MMMM YYYY');
            } else {
                daysMonthsToggleLabel = this.state.date.displayed.format('YYYY');
            }
        }

        // Render
        return (
            <div className={s.calendarClassName}>

                <Row className={s.navigation} removeGutter={true} removeMargins={true}>
                    <Col>
                        <Button
                            onClick={e => this.handlePeriodArrowClick('left')}
                            float="left"
                            icon={{
                                size: 'small',
                                background: 'none',
                                element:
                                    <IconArrowLeft
                                        width={15}
                                        height={11}
                                        marginLeft={-8}
                                        marginTop={-5}
                                    />
                            }}
                        />
                    </Col>
                    <Col>
                        <Button
                            onClick={e => this.handleDaysMonthsToggle(e)}
                            className={s.daysMonthsToggle}
                            label={{
                                color: 'blue',
                                text: daysMonthsToggleLabel
                            }}
                        />
                    </Col>
                    <Col>
                        <Button
                            onClick={e => this.handlePeriodArrowClick('right')}
                            float="right"
                            icon={{
                                size: 'small',
                                background: 'none',
                                element:
                                    <IconArrowRight
                                        width={15}
                                        height={11}
                                        marginLeft={-7}
                                        marginTop={-5}
                                    />
                            }}
                        />
                    </Col>
                </Row>

                <Row className={s.weekDays} removeGutter={true} removeMargins={true}>
                    {(() => {
                        let weekDaysOutput = [];

                        if (this.state.showDays) {
                            this.state.weekDayNames.map((dayName, dayId) => {
                                weekDaysOutput.push(
                                    <Col key={dayId}>
                                        <Paragraph>{dayName}</Paragraph>
                                    </Col>
                                );
                            });
                        } else {
                            weekDaysOutput.push(
                                <Col key="monthsLine">
                                    <Paragraph>Jump to any month</Paragraph>
                                </Col>
                            );
                        }

                        return weekDaysOutput;
                    })()}
                </Row>

                {(() => {
                    // Shows days calendar view
                    if (this.state.showDays === true && this.state.date.selected && this.state.date.displayed) {
                        // Prepare object structure
                        let weeks = [];
                        let days = [];

                        // Start from Sunday - might be in previous month
                        let startDate = this.state.date.displayed.clone().date(1);
                        while (startDate.day() > 0) {
                            startDate.subtract(1, 'days');
                        }

                        // Iterate all days in 6 weeks
                        let iteratedDate = startDate.clone();
                        while (weeks.length < 6) {
                            // Create day object
                            days.push(this.createDateObject(iteratedDate));

                            // If week ends, push all days to the week
                            if (iteratedDate.day() >= 6) {
                                weeks.push({
                                    id: iteratedDate.year().toString() + 'W' + padStart(iteratedDate.isoWeek().toString(), 2, '0'),
                                    days: days
                                });
                                days = [];
                            }

                            // Move to next day
                            iteratedDate.add(1, 'day');
                        }
                        iteratedDate = null;

                        // Render
                        return (
                            <div className={s.days}>
                                {weeks.map(week => {
                                    return (
                                        <Row key={week.id} removeGutter={true} removeMargins={true}>
                                            {week.days.map(day => {
                                                // Day class name
                                                let dayClassName = '';
                                                dayClassName += day.isSelected ? ' ' + s.daySelected : '';
                                                dayClassName += day.isCurrentMonth === false ? ' ' + s.dayNotCurrentMonth : '';
                                                dayClassName += day.isToday ? ' ' + s.dayToday : '';

                                                // Render day
                                                return (
                                                    <Col key={day.id}>
                                                        <button
                                                            className={dayClassName !== '' ? dayClassName : null}
                                                            onClick={e => this.handleDateChange(day.id)}
                                                        >{day.dateString}</button>
                                                    </Col>
                                                );
                                            })}
                                        </Row>
                                    );
                                })}
                            </div>
                        );
                    }
                })()}

                {(() => {
                    // Show years calendar view
                    if (this.state.showDays === false && this.state.date.selected && this.state.date.displayed) {
                        // Prepare object structure
                        let rows = [];
                        let months = [];

                        // Start from January
                        const startDate = this.state.date.displayed.clone().month(0);

                        // Iterate all months
                        let iteratedDate = startDate.clone();
                        while (rows.length < 6) {
                            // Create month object
                            months.push(this.createMonthObject(iteratedDate));

                            // If row ends, push all months to the row
                            if (months.length >= 2) {
                                rows.push({
                                    id: iteratedDate.year().toString() + 'R' + (rows.length + 1).toString(),
                                    months: months
                                });
                                months = [];
                            }

                            // Move to next day
                            iteratedDate.add(1, 'month');
                        }
                        iteratedDate = null;

                        // Render
                        return (
                            <div className={s.months}>
                                {rows.map(row => {
                                    return (
                                        <Row key={row.id} removeGutter={true} removeMargins={true}>
                                            {row.months.map(month => {
                                                // Month class name
                                                let monthClassName = '';
                                                monthClassName += month.isSelected ? ' ' + s.monthSelected : '';

                                                // Render month
                                                return (
                                                    <Col key={month.id}>
                                                        <button
                                                            className={monthClassName !== '' ? monthClassName : null}
                                                            onClick={e => this.handleDisplayedMonthChange(month.id)}
                                                        >{month.monthString}</button>
                                                    </Col>
                                                );
                                            })}
                                        </Row>
                                    );
                                })}
                            </div>
                        );
                    }
                })()}

            </div>
        );
    }
}

DayPickerCalendar.propTypes = propTypes;
DayPickerCalendar.defaultProps = defaultProps;

export default DayPickerCalendar;
