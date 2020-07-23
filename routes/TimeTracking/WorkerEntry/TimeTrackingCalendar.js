import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { debounce, padStart, toNumber, isEqual } from 'lodash';
import moment from 'moment';
import * as API from './../../../actions/api';
import { actionCreateModal } from './../../../actions/Modal';
import { actionAlertNotify } from './../../../actions/Notifications';
import { printHoursNumberAsHoursMinutesString } from './../../../helpers/date';
import HeaderSection from './../../../components/Layout/HeaderSection';
import Row from './../../../components/Section/Row';
import Col from './../../../components/Section/Col';
import Paragraph from './../../../components/Content/Paragraph';
import Dropdown from './../../../components/Form/Dropdown';
import DropdownContainer from './../../../components/Form/DropdownContainer';
import OptionsList from './../../../components/Form/OptionsList';
import Button from './../../../components/Button/Button';
import DatePicker from './../../../components/Calendar/DatePicker';
import TimePicker from './../../../components/Calendar/TimePicker';
import DurationPicker from './../../../components/Calendar/DurationPicker';
import LoadingShade from './../../../components/Loaders/LoadingShade';
import LoadingSpinner from './../../../components/Loaders/LoadingSpinner';
import IconArrowLeftYellow from './../../../components/Icons/IconArrowLeftYellow';
import IconArrowRightYellow from './../../../components/Icons/IconArrowRightYellow';
import s from './TimeTrackingCalendar.css';

const propTypes = {
    onChange: PropTypes.func,
    onEntryCreate: PropTypes.func,
    onOverlappingChange: PropTypes.func,
    onEntryEdit: PropTypes.func,
    editingEntryId: PropTypes.number,
    forceFetchDays: PropTypes.number,
    increments: PropTypes.oneOf([1, 2, 5, 10, 15, 20, 30]),
    isAmerican: PropTypes.bool,
    limitToSingleDay: PropTypes.bool,
    defaultValue: PropTypes.shape({
        startDate: PropTypes.instanceOf(moment),
        start: PropTypes.number,
        end: PropTypes.number,
        duration: PropTypes.number
    })
};

const defaultProps = {
    onChange: null,
    onEntryCreate: null,
    onOverlappingChange: null,
    onEntryEdit: null,
    editingEntryId: null,
    forceFetchDays: 0,
    increments: 15,
    isAmerican: true,
    limitToSingleDay: false
};

class TimeTrackingCalendar extends React.Component {
    constructor(props, context) {
        super(props, context);

        this.openEvents = {
            window: []
        };

        // Today
        const now = moment();

        // Set initial times
        const startTotalMinutes = this.getClosestToIncrementHour(now);
        const durationTotalMinutes = 60;
        const endTotalMinutes = startTotalMinutes + durationTotalMinutes;

        // Prepare current week days
        const weekDaysPeriod = this.createDaysPeriod(now.clone().hour(12).minute(0), true);

        // Set initial state
        this.state = {
            today: now,
            dailyView: false,
            daysLoading: true,
            days: weekDaysPeriod.days,
            currentDayIndex: weekDaysPeriod.currentDayIndex,
            entered: {
                startDate: now.clone(),
                start: startTotalMinutes,
                duration: durationTotalMinutes,
                end: endTotalMinutes
            },
            timeline: [],
            isOverlapping: false
        };
    }

    componentWillMount() {
        // Create timeline
        let timeline = [];
        for (let t = 0; t < 24; t++) {
            let hour = {
                hour: padStart(t.toString(), 2, '0', true),
                minutes: '00'
            };
            if (this.props.isAmerican === true) {
                if (t === 0) {
                    hour.hour = '12';
                    hour.minutes = 'AM';
                } else if (t > 0 && t < 12) {
                    hour.minutes = 'AM';
                } else if (t === 12) {
                    hour.minutes = 'PM';
                } else {
                    hour.hour = padStart((t - 12).toString(), 2, '0', true);
                    hour.minutes = 'PM';
                }
            }
            timeline.push(hour);
        }

        // Update state
        this.setState({
            timeline: timeline
        });
    }

    componentDidMount() {
        // Resize calendar

        if (this.props.defaultValue !== undefined) {
            this.setState({
                entered: this.props.defaultValue
            });
        }

        setTimeout((e) => {
            this.resizeTimeTrackingCalendar();
            this.passStateToPropOnChange();
        }, 128);

        // Fetch entries for current week
        this.fetchEntriesForDays();

        // Create window resize event
        const windowResize = this.windowResize.bind(this);
        this.openEvents.window.push({ type: 'resize', handler: windowResize });
        window.addEventListener('resize', windowResize, false);
    }

    componentWillUnmount() {
        // Remove window events
        this.openEvents.window.map(evt => {
            window.removeEventListener(evt.type, evt.handler);
        });
    }

    componentWillReceiveProps(nextProps) {
        // Check if default value has changed
        if (!isEqual(this.props.defaultValue, nextProps.defaultValue)) {
            this.setState({
                entered: nextProps.defaultValue
            });
        }

        // Check if days should be force fetched
        if (this.props.forceFetchDays !== nextProps.forceFetchDays) {
            this.fetchEntriesForDays();
        }
    }

    windowResize(e) {
        this.resizeTimeTrackingCalendar();
    }

    windowResizeDebounced(e) {
        this.resizeTimeTrackingCalendar();
    }

    resizeTimeTrackingCalendar() {
        if (typeof this.refs.daysTable !== 'undefined') {
            // Get days table and its style
            const daysTable = this.refs.daysTable;
            const daysTableStyle = window.getComputedStyle(daysTable);

            // Hide table temporarily
            daysTable.style.width = '128px';

            // Get and prepare margin
            let marginToAdd = 0;
            const daysTableMargin = daysTableStyle.marginLeft;
            if (daysTableMargin !== null) {
                let daysTableMarginNumber = parseInt(daysTableMargin, 10);
                if (!isNaN(daysTableMarginNumber)) {
                    marginToAdd = daysTableMarginNumber >= 0 ? daysTableMarginNumber * 2 : daysTableMarginNumber * -1 * 2;
                }
            }

            // Get container and its width
            const daysTableContainer = daysTable.parentElement;
            const daysTableContainerWidth = daysTableContainer.offsetWidth;

            // Assign width to the days table
            daysTable.style.width = (daysTableContainerWidth + marginToAdd) + 'px';
        }
    }

    getClosestToIncrementHour(date) {
        let totalMinutes = 0;

        if (typeof date !== 'undefined' && date && typeof date.isValid !== 'undefined' && date.isValid()) {
            // Minutes
            const minutes = date.minutes();
            const { increments } = this.props;
            totalMinutes = (date.hours() * 60) + minutes;

            // Difference
            const difference = minutes % increments;
            if (difference > 0) {
                totalMinutes -= difference;
            }
        }

        return totalMinutes;
    }

    alignEnteredToClosestEmptySlot() {
        // Difference
        const { increments } = this.props;
        const { entered } = this.state;
        const difference = entered.start % increments;
        if (difference > 0) {
            totalMinutes = entered.start - difference;
        }

        // Entry
        let timeEntry = {
            start: this.state.entered.start,
            end: this.state.entered.end
        };

        // Check if time is overlapping
        let isOverlappingOtherEntry = this.checkOverlappingEntries(this.state.days[this.state.currentDayIndex], timeEntry);
        if (isOverlappingOtherEntry === true) {
            while (isOverlappingOtherEntry === true) {
                timeEntry.start += increments;
                timeEntry.end += increments;
                isOverlappingOtherEntry = this.checkOverlappingEntries(this.state.days[this.state.currentDayIndex], timeEntry);
            }

            // Set new time state
            this.setState({
                entered: Object.assign({}, this.state.entered, {
                    start: timeEntry.start,
                    end: timeEntry.end
                })
            }, () => {
                this.updateOverlappingStatus();
                this.passStateToPropOnChange();
            });
        }
    }

    checkOverlappingEntries(day, newEntry) {
        // Get start and end time of new entry
        const start = newEntry.start;
        const end = newEntry.end;

        // Check if day has any existing entries
        let isOverlapping = false;
        if (typeof day !== 'undefined' && typeof day.entriesTimeline !== 'undefined') {
            if (day.entriesTimeline.length > 0) {
                isOverlapping = day.entriesTimeline.some((entry, i) => {
                    if (!this.props.editingEntryId || this.props.editingEntryId && this.props.editingEntryId !== entry.id) {
                        const entryStart = entry.startInMinutes;
                        const entryEnd = entry.endInMinutes;
                        if (Math.max(start, entryStart) - Math.min(end, entryEnd) < 0) {
                            return true;
                        } else {
                            return false;
                        }
                    }
                });
            }
        }

        return isOverlapping;
    }

    updateOverlappingStatus() {
        const isOverlapping = this.checkOverlappingEntries(this.state.days[this.state.currentDayIndex], this.state.entered);

        return this.setState({
            isOverlapping: isOverlapping
        }, () => {
            if (this.props.onOverlappingChange) {
                this.props.onOverlappingChange(this.state.isOverlapping);
            }
        });
    }

    createDaysPeriod(anyDateFromWeekToCreate, shouldReturn) {
        anyDateFromWeekToCreate = typeof anyDateFromWeekToCreate !== 'undefined' ? anyDateFromWeekToCreate : this.state.entered.startDate;
        shouldReturn = typeof shouldReturn !== 'undefined' ? shouldReturn : true;
        let days = [];
        let selectedDayIndex = null;

        if (typeof anyDateFromWeekToCreate !== 'undefined') {
            // Start from Sunday and iterate days till Saturday
            let daysCount = 0;
            let thisDay = anyDateFromWeekToCreate.clone().day(0);
            while (daysCount < 7) {
                // Create day object and push it to days array
                days.push({
                    date: thisDay.clone(),
                    dayApproved: false,
                    dayClosed: true,
                    dayLoading: false,
                    entriesTimeline: [],
                    entries: shouldReturn
                        ? []
                        : typeof this.state.days[daysCount] !== 'undefined' && this.state.days[daysCount].entries.length > 0
                            ? this.state.days[daysCount].entries
                            : []
                });

                // Check if that day is selected
                if (typeof this.state !== 'undefined') {
                    if (this.state.entered.startDate && typeof this.state.entered.startDate.isSame !== 'undefined') {
                        if (this.state.entered.startDate.isSame(thisDay, 'day')) {
                            selectedDayIndex = daysCount;
                        }
                    }
                } else {
                    if (anyDateFromWeekToCreate.isSame(thisDay, 'day')) {
                        selectedDayIndex = daysCount;
                    }
                }

                // Iterate day
                thisDay.add(1, 'days');
                daysCount++;
            }
        }

        if (shouldReturn) {
            return {
                dailyView: false,
                days: days,
                currentDayIndex: selectedDayIndex
            };
        } else {
            this.setState({
                dailyView: false,
                days: days,
                currentDayIndex: selectedDayIndex
            }, () => {
                this.fetchEntriesForDays();
            });
        }
    }

    createSingleDayPeriod(date, shouldReturn) {
        date = typeof date !== 'undefined' ? date : this.state.entered.startDate;
        shouldReturn = typeof shouldReturn !== 'undefined' ? shouldReturn : true;
        let days = [];
        const selectedDayIndex = 0;

        // If day entries are already fetched, reuse them
        const existingDay = this.state.days.find(day => {
            return day.date.isSame(date, 'day');
        });

        // Create day object and push it to days array
        days.push({
            date: date.clone(),
            dayApproved: false,
            dayClosed: true,
            dayLoading: false,
            entriesTimeline: [],
            entries: typeof existingDay !== 'undefined' && typeof existingDay.entries !== 'undefined' ? existingDay.entries : []
        });

        if (shouldReturn) {
            return {
                dailyView: true,
                days: days,
                currentDayIndex: selectedDayIndex
            };
        } else {
            this.setState({
                dailyView: true,
                days: days,
                currentDayIndex: selectedDayIndex
            }, () => {
                this.fetchEntriesForDays();
            });
        }
    }

    fetchEntriesForDays() {
        if (this.state.days && this.state.days.length > 0) {
            // Start loading
            this.setState({
                daysLoading: true
            }, () => {
                // Get period
                const firstDate = this.state.days[0].date.format('YYYY-MM-DD');
                const lastDate = this.state.days[this.state.days.length - 1].date.format('YYYY-MM-DD');

                // Fetch entries
                API.get(API.TIME_ENTRY_OF_USER, {
                    start_date: firstDate,
                    end_date: lastDate
                }).then(responseData => {
                    // Iterate days from response
                    const days = Object.keys(responseData).map((responseKey, dayIndex) => {
                        // Get single day
                        const day = responseData[responseKey];

                        // Create entries timeline
                        let entriesTimeline = [];

                        // Count entries statuses
                        let dayStatusDraftCount = 0;
                        let dayStatusUnderReviewCount = 0;
                        let dayStatusApprovedCount = 0;

                        // Iterate entries
                        const dayEntries = day.map(entry => {
                            // Construct entry's duration
                            let totalDuration = 0;
                            if (typeof entry.duration !== 'undefined' && entry.duration) {
                                const splitDuration = entry.duration.split('.');
                                const durationHours = toNumber(splitDuration[0]);
                                const durationMinutes = splitDuration.length >= 2 ? toNumber(splitDuration[1] / 60) : 0;
                                totalDuration = durationHours + durationMinutes;
                            }

                            // Construct entry's timeline box
                            const entryStartDate = moment(entry.startDate);
                            const startInMinutes = (entryStartDate.hours() * 60) + entryStartDate.minutes();
                            entriesTimeline.push({
                                id: toNumber(entry.id),
                                startInMinutes: startInMinutes,
                                endInMinutes: startInMinutes + (totalDuration * 60)
                            });

                            // Construct entry's name
                            let dayName = '';
                            dayName += typeof entry.projectName !== 'undefined' && entry.projectName
                                ? entry.projectName
                                : '';
                            dayName += typeof entry.campaignName !== 'undefined' && entry.campaignName
                                ? (dayName.length > 0 ? ' - ' : '') + entry.campaignName
                                : '';
                            dayName += typeof entry.spotName !== 'undefined' && entry.spotName
                                ? (dayName.length > 0 ? ' - ' : '') + entry.spotName
                                : '';
                            dayName += typeof entry.versionName !== 'undefined' && entry.versionName
                                ? (dayName.length > 0 ? ' - ' : '') + 'ver. #' + entry.versionName
                                : '';
                            dayName += typeof entry.activityLabel !== 'undefined' && entry.activityLabel
                                ? (dayName.length > 0 ? ', ' : '') + entry.activityLabel
                                : '';

                            // Iterate statuses
                            switch (entry.status) {
                                case 3:
                                    dayStatusUnderReviewCount++;
                                    break;

                                case 4:
                                    dayStatusApprovedCount++;
                                    break;

                                default:
                                    dayStatusDraftCount++;
                                    break;
                            }

                            // Return day entry
                            return {
                                id: toNumber(entry.id),
                                name: dayName,
                                hours: totalDuration
                            };
                        });

                        // Return day with entries
                        return Object.assign({}, this.state.days[dayIndex], {
                            entries: dayEntries,
                            entriesTimeline: entriesTimeline,
                            dayApproved: dayStatusUnderReviewCount === 0 && day.length > 0 ? true : false,
                            dayClosed: dayStatusDraftCount === 0 && day.length > 0 ? true : false,
                            dayLoading: false
                        });
                    });

                    // Update state with fetched entries
                    this.setState({
                        daysLoading: false,
                        days: days
                    }, () => {
                        this.updateOverlappingStatus();
                        this.alignEnteredToClosestEmptySlot();
                    });
                }).catch(error => {
                    setTimeout(() => {
                        this.fetchEntriesForDays();
                    }, 1024);
                });
            });
        }
    }

    calculateTimelineEntryStyle(startTimeInMinutes, durationInMinutes, isActive) {
        // Defaults
        startTimeInMinutes = typeof startTimeInMinutes !== 'undefined' ? startTimeInMinutes : 0;
        durationInMinutes = typeof durationInMinutes !== 'undefined' ? durationInMinutes : 60;
        isActive = typeof isActive !== 'undefined' ? isActive : false;

        // Calculate timeline box dimensions
        const startRatio = startTimeInMinutes / 1440;
        const durationRatio = durationInMinutes / 1440;
        const boxLeft = 100 * startRatio;
        const boxWidth = 100 * durationRatio;

        // Timeline box size
        let boxStyle = {
            left: boxLeft + '%',
            width: boxWidth + '%',
        };

        // Add borders if it's active
        if (isActive) {
            boxStyle = Object.assign({}, boxStyle, {
                borderLeftWidth: boxWidth === 0 ? '0px' : null,
                borderRightWidth: boxWidth === 0 ? '0px' : null
            });
        }

        // Return timeline's style
        return boxStyle;
    }

    passStateToPropOnChange() {
        if (this.props.onChange) {
            this.props.onChange(this.state.entered);
        }
    }

    handleDailyWeeklyViewSwitch(toDaily) {
        toDaily = typeof toDaily !== 'undefined' ? toDaily : !this.state.dailyView;

        if (toDaily) {
            this.createSingleDayPeriod(this.state.entered.startDate, false);
        } else {
            this.createDaysPeriod(this.state.entered.startDate, false);
        }
    }

    handlePeriodSwitch(toNext) {
        // Defaults
        toNext = typeof toNext !== 'undefined' ? toNext : true;

        // Get day of next or previous period
        let dayFromOtherPeriod;
        if (this.state.days.length > 0) {
            if (toNext) {
                dayFromOtherPeriod = this.state.days[this.state.days.length - 1].date.clone().add(1, 'day');
            } else {
                dayFromOtherPeriod = this.state.days[0].date.clone().subtract(1, 'day');
            }
        } else {
            dayFromOtherPeriod = moment().hour(12).minute(0);
        }

        // Render new period
        if (this.state.dailyView) {
            this.createSingleDayPeriod(dayFromOtherPeriod, false);
        } else {
            this.createDaysPeriod(dayFromOtherPeriod, false);
        }
    }

    handleExistingEntryEditClick(entryId, dayIndex) {
        if (typeof entryId !== 'undefined' && typeof dayIndex !== 'undefined') {
            this.setState({
                currentDayIndex: dayIndex
            }, () => {
                if (this.props.onEntryEdit) {
                    this.props.onEntryEdit(entryId, dayIndex);
                }
            });
        }
    }

    handleChangingTimeEntryDateFromCalendarView(dayIndex) {
        if (typeof dayIndex !== 'undefined') {
            const day = this.state.days[dayIndex];
            if (day.date !== 'undefined' && day.date) {
                this.setState({
                    currentDayIndex: dayIndex,
                    entered: Object.assign({}, this.state.entered, {
                        startDate: day.date.clone().hours(12).minutes(0)
                    })
                }, () => {
                    this.alignEnteredToClosestEmptySlot();
                    this.passStateToPropOnChange();
                    if (this.props.onEntryCreate) {
                        this.props.onEntryCreate(dayIndex);
                    }
                });
            }
        }
    }

    handleConfirmationModalForEntriesSubmitForReview(dayISODate, dayIndex) {
        if (typeof dayISODate !== 'undefined' && typeof dayIndex !== 'undefined') {
            // Show modal
            const dateInUs = moment(dayISODate).format('MM/DD/YYYY');
            this.props.dispatch(
                actionCreateModal(
                    'Close and submit work day ' + dateInUs + '?',
                    'Are you certain that you want to close day ' + dateInUs + '?'
                        + ' Making any changes or creating new time entries won\'t be possible for this day afterwards.'
                        + ' You will be notified when review process is complete',
                    'default',
                    true,
                    [
                        {
                            closeOnClick: true,
                            label: 'No, cancel',
                            type: 'alert'
                        },
                        {
                            onClick: e => this.handleCloseDayAndSubmitEntriesForReview(dayISODate, dayIndex),
                            closeOnClick: true,
                            label: 'Yes, submit for review',
                            type: 'default'
                        }
                    ]
                )
            );
        }
    }

    handleCloseDayAndSubmitEntriesForReview(dayISODate, dayIndex) {
        // Add loader to day
        this.setState({
            days: this.state.days.slice(0, dayIndex)
                .concat(
                    Object.assign({}, this.state.days[dayIndex], {
                        dayLoading: true
                    })
                )
                .concat(this.state.days.slice(dayIndex + 1))
        }, () => {
            // Post day for review to the database
            API.post(API.TIME_ENTRY_SUBMIT_FOR_REVIEW, API.makePostData(
                {
                    date: dayISODate
                }
            )).then(response => {
                // Change status of the day
                this.setState({
                    days: this.state.days.slice(0, dayIndex)
                        .concat(
                            Object.assign({}, this.state.days[dayIndex], {
                                dayClosed: true,
                                dayApproved: false,
                                dayLoading: false
                            })
                        )
                        .concat(this.state.days.slice(dayIndex + 1))
                });

                // Success message
                this.props.dispatch(
                    actionAlertNotify(
                        'Day submitted for review',
                        'You will be notified when your work day is reviewed',
                        'success',
                        false,
                        true,
                        false,
                        5
                    )
                );
            }).catch(error => {
                // Error message
                this.props.dispatch(
                    actionAlertNotify(
                        'Something went wrong',
                        'Please try to close the day again',
                        'error',
                        false,
                        true,
                        false,
                        10
                    )
                );
            });
        });
    }

    handleDateChange(date) {
        if (typeof date !== 'undefined' && typeof date.isValid !== 'undefined' && date.isValid()) {
            if (!date.isSame(this.state.entered.startDate, 'day')) {
                this.setState({
                    entered: Object.assign({}, this.state.entered, {
                        startDate: date
                    })
                }, () => {
                    this.alignEnteredToClosestEmptySlot();
                    this.passStateToPropOnChange();

                    if (this.state.dailyView) {
                        this.createSingleDayPeriod(date.hours(12).minutes(0), false);
                    } else {
                        this.createDaysPeriod(date.hours(12).minutes(0), false);
                    }
                });
            }
        }
    }

    handleStartTimeChange(nextStartTimeObject) {
        if (typeof nextStartTimeObject !== 'undefined') {
            // Calculate new duration and end time
            let durationTotalMinutes = this.state.entered.duration;
            let endTotalMinutes = this.state.entered.end;
            if (nextStartTimeObject.value > endTotalMinutes) {
                durationTotalMinutes = this.props.increments;
                endTotalMinutes = nextStartTimeObject.value + durationTotalMinutes;
            } else {
                durationTotalMinutes = endTotalMinutes - nextStartTimeObject.value;
            }

            // Update state
            this.setState({
                entered: Object.assign({}, this.state.entered, {
                    start: nextStartTimeObject.value,
                    duration: durationTotalMinutes,
                    end: endTotalMinutes
                })
            }, () => {
                this.updateOverlappingStatus();
                this.passStateToPropOnChange();
            });
        }
    }

    handleEndTimeChange(nextEndTimeObject) {
        if (typeof nextEndTimeObject !== 'undefined') {
            // Selected end time
            let endTotalMinutes = nextEndTimeObject.value;

            // Calculate new duration
            let startTotalMinutes = this.state.entered.start;
            let newDuration = endTotalMinutes - startTotalMinutes;

            // Check if new duration is negative
            if (newDuration < 0) {
                newDuration = this.state.entered.duration;
                startTotalMinutes = endTotalMinutes - newDuration;
            }

            // Update state
            this.setState({
                entered: Object.assign({}, this.state.entered, {
                    start: startTotalMinutes,
                    duration: newDuration,
                    end: endTotalMinutes
                })
            }, () => {
                this.updateOverlappingStatus();
                this.passStateToPropOnChange();
            });
        }
    }

    handleDurationChange(duration) {
        if (typeof duration !== 'undefined' && typeof duration.totalMinutes !== 'undefined') {
            // Set duration
            let totalDuration = duration.totalMinutes;

            // Calculate end time
            let endTotalMinutes = this.state.entered.start + totalDuration;

            // Update duration and end time
            this.setState({
                entered: Object.assign({}, this.state.entered, {
                    duration: totalDuration,
                    end: endTotalMinutes
                })
            }, () => {
                this.updateOverlappingStatus();
                this.passStateToPropOnChange();
            });
        }
    }

    render() {
        // Month name
        let firstDayMonthName, firstDayFullYear, lastDayMonthName, lastDayFullYear;
        if (this.state.days && this.state.days.length > 0) {
            firstDayMonthName = this.state.days[0].date.format('MMMM');
            firstDayFullYear = this.state.days[0].date.year();
            lastDayMonthName = this.state.days[this.state.days.length - 1].date.format('MMMM');
            lastDayFullYear = this.state.days[this.state.days.length - 1].date.year();
        } else {
            firstDayMonthName = this.state.today.format('MMMM');
            firstDayFullYear = this.state.today.year();
            lastDayMonthName = firstDayMonthName;
            lastDayFullYear = firstDayFullYear;
        }

        // Render
        return (
            <HeaderSection className={s.headerSection} marginBottom={true}>

                {(() => {
                    if (this.state.daysLoading) {
                        return <LoadingSpinner className={s.daysLoadingSpinner} size={48} />;
                    }
                })()}

                <Row removeGutter={true}>

                    <Col className={s.month}>
                        <p>
                            {'Current month '}
                            <strong>{firstDayMonthName}</strong>
                            {(() => {
                                if (firstDayMonthName === lastDayMonthName) {
                                    return [
                                        <span key={0}> {firstDayFullYear}</span>
                                    ];
                                } else if (firstDayFullYear === lastDayFullYear) {
                                    return [
                                        <i key={1}> / </i>,
                                        <strong key={2}>{lastDayMonthName}</strong>,
                                        <span key={3}> {lastDayFullYear}</span>
                                    ];
                                } else {
                                    return [
                                        <span key={0}> {firstDayFullYear}</span>,
                                        <i key={1}> / </i>,
                                        <strong key={2}>{lastDayMonthName}</strong>,
                                        <span key={3}> {lastDayFullYear}</span>
                                    ];
                                }
                            })()}
                        </p>
                    </Col>

                    <Col className={s.viewSwitches}>
                        <Button
                            onClick={e => this.handleDailyWeeklyViewSwitch(false)}
                            label={{
                                text: 'WEEKLY',
                                color: this.state.dailyView === true ? 'yellow' : 'white'
                            }}
                        />
                        <i>|</i>
                        <Button
                            onClick={e => this.handleDailyWeeklyViewSwitch(true)}
                            label={{
                                text: 'DAILY',
                                color: this.state.dailyView === false ? 'yellow' : 'white'
                            }}
                        />
                    </Col>

                    <Col className={s.arrows}>
                        <Button
                            onClick={e => this.handlePeriodSwitch(true)}
                            float="right"
                            icon={{
                                background: 'none',
                                size: 'nopadding',
                                element:
                                    <IconArrowRightYellow
                                        width={15}
                                        height={11}
                                    />
                            }}
                            label={{
                                text: 'NEXT',
                                size: 'small',
                                color: 'yellow',
                                onLeft: true
                            }}
                        />
                        <Button
                            onClick={e => this.handlePeriodSwitch(false)}
                            float="right"
                            icon={{
                                background: 'none',
                                size: 'nopadding',
                                element:
                                    <IconArrowLeftYellow
                                        width={15}
                                        height={11}
                                    />
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

                <table ref="daysTable" className={s.days}>

                    <thead>
                        <tr>
                            <td><hr /></td>
                            {this.state.days.map((day, index) => {
                                // Date operations
                                const dateDayOfWeek = day.date.day();

                                // Day class name
                                let dayClassName = '';
                                dayClassName += this.state.today.isSame(day.date, 'day') ? ' ' + s.today : '';
                                dayClassName += dateDayOfWeek === 0 || dateDayOfWeek === 6 ? ' ' + s.weekend : '';

                                // Render
                                return (
                                    <td key={'dayOfWeek-' + day.date.format('YYYY-MM-DD')} className={dayClassName !== '' ? dayClassName : null}>
                                        <p>
                                            {day.date.format('dddd')}
                                        </p>
                                        <span>{padStart(day.date.date().toString(), 2, '0', true)}</span>
                                        <hr />
                                    </td>
                                );
                            })}
                            <td><hr /></td>
                        </tr>
                    </thead>

                    <tbody>
                        <tr>
                            <td></td>
                            {this.state.days.map((day, dayIndex) => {
                                // Check if day is selected
                                let daySelected = false;
                                let dayClassName = '';

                                // Check if rendered date is the same as entered start date
                                if (this.state.currentDayIndex && this.state.currentDayIndex === dayIndex) {
                                    dayClassName += s.entering;
                                    daySelected = true;
                                }

                                // Render
                                return (
                                    <td
                                        key={'dayCalendar' + day.date.format('YYYY-MM-DD')}
                                        className={dayClassName !== '' ? dayClassName : null}
                                    >
                                        {(() => {
                                            if (this.state.daysLoading) {
                                                return <LoadingShade background="rgba(238, 234, 231, 0.8)" />;
                                            } else if (day.dayLoading) {
                                                return (
                                                    <LoadingShade background="rgba(238, 234, 231, 0.8)">
                                                        <LoadingSpinner size={48} />
                                                    </LoadingShade>
                                                );
                                            }
                                        })()}
                                        {(() => {
                                            if (day.entries.length > 0) {
                                                // Hours count
                                                let hoursCount = 0;

                                                // Editing count
                                                let editingCount = 0;

                                                // Render
                                                return (
                                                    <dl>
                                                        {day.entries.map((entry, entryIndex) => {
                                                            // Add hours
                                                            hoursCount += entry.hours;

                                                            // Check if entry is being edited
                                                            let isBeingEdited = false;
                                                            if (this.props.editingEntryId) {
                                                                if (this.props.editingEntryId === entry.id) {
                                                                    isBeingEdited = true;
                                                                    editingCount++;
                                                                }
                                                            }

                                                            // Entry class name
                                                            let entryClassName = '';
                                                            entryClassName += day.dayClosed === false ? ' ' + s.editable : s.closed;
                                                            entryClassName += day.dayApproved === false ? ' ' + s.pendingApproval : '';

                                                            // Render
                                                            return (
                                                                <dt
                                                                    key={entry.id}
                                                                    title={entry.name}
                                                                    className={entryClassName !== '' ? entryClassName : null}
                                                                    onClick={day.dayClosed === false
                                                                        ? e => this.handleExistingEntryEditClick(entry.id, dayIndex)
                                                                        : undefined}
                                                                >
                                                                    <i>
                                                                        {
                                                                            day.dayClosed
                                                                                ? ''
                                                                                : isBeingEdited
                                                                                    ? 'Editing entry'
                                                                                    : 'Edit'
                                                                        }
                                                                    </i>
                                                                    <p>
                                                                        <strong>{printHoursNumberAsHoursMinutesString(entry.hours)}:</strong>
                                                                        {entry.name}
                                                                    </p>
                                                                </dt>
                                                            );
                                                        })}
                                                        {(() => {
                                                            if (editingCount === 0 && day.dayClosed === false) {
                                                                return (
                                                                    <dt
                                                                        className={s.creatable}
                                                                        onClick={e => this.handleChangingTimeEntryDateFromCalendarView(dayIndex)}
                                                                    >
                                                                        <i></i>
                                                                        <p>{daySelected ? 'Creating entry' : 'Create new entry'}</p>
                                                                    </dt>
                                                                );
                                                            } else if (editingCount > 0 && day.dayClosed === false) {
                                                                return (
                                                                    <dt
                                                                        className={s.creatable}
                                                                        onClick={e => this.handleChangingTimeEntryDateFromCalendarView(dayIndex)}
                                                                    >
                                                                        <i></i>
                                                                        <p>Create new entry</p>
                                                                    </dt>
                                                                );
                                                            }
                                                        })()}
                                                        <dt className={s.totalHours}>
                                                            <p>
                                                                <strong>{printHoursNumberAsHoursMinutesString(hoursCount)}:</strong>
                                                                {'total'}
                                                            </p>
                                                        </dt>
                                                    </dl>
                                                );
                                            } else if (daySelected && day.dayClosed === false) {
                                                return (
                                                    <dl>
                                                        <dt>
                                                            <i></i>
                                                            <p>Creating entry</p>
                                                        </dt>
                                                    </dl>
                                                );
                                            } else if (day.dayClosed === false) {
                                                return (
                                                    <dl
                                                        className={s.fullSizeEntriesList}
                                                        onClick={e => this.handleChangingTimeEntryDateFromCalendarView(dayIndex)}
                                                    >
                                                        <dt
                                                            className={s.creatable}
                                                        >
                                                            <i></i>
                                                            <p>Create new entry</p>
                                                        </dt>
                                                    </dl>
                                                );
                                            } else {
                                                return (
                                                    <dl>
                                                        <dt>
                                                            <i></i>
                                                        </dt>
                                                    </dl>
                                                );
                                            }
                                        })()}
                                    </td>
                                );
                            })}
                            <td></td>
                        </tr>
                    </tbody>

                    <tfoot>
                        <tr>
                            <td></td>
                            {this.state.days.map((day, index) => {
                                // Check if day is in the future
                                let dayInFuture = this.state.today && this.state.today.isBefore(day.date, 'day');

                                // Render
                                return (
                                    <td key={'daySummary' + day.date.format('YYYY-MM-DD')}>
                                        {(() => {
                                            if (this.state.daysLoading) {
                                                return <LoadingShade background="rgba(230, 224, 219, 0.8)" />;
                                            }
                                        })()}
                                        <p>
                                            {(() => {
                                                // Determine class name and label
                                                let dayCloseClickEnabled = false;
                                                let dayLabel = '';
                                                let dayClassName = '';

                                                // Check if there are nay entries
                                                if (day.entries.length > 0) {
                                                    // Check if day is closed by the user
                                                    if (day.dayClosed) {
                                                        // Check if day is approved by reviewer
                                                        if (day.dayApproved) {
                                                            dayLabel = 'Day approved';
                                                            dayClassName += ' ' + s.dayApproved;
                                                        } else {
                                                            dayLabel = 'Day pending approval';
                                                            dayClassName += ' ' + s.dayPending;
                                                        }
                                                    } else {
                                                        dayClassName += ' ' + s.dayOpen;
                                                        if (day.dayLoading) {
                                                            dayLabel = 'Closing work day';
                                                        } else {
                                                            dayLabel = 'Close and submit day';
                                                            dayCloseClickEnabled = true;
                                                        }
                                                    }
                                                } else {
                                                    // No entries
                                                    dayClassName += ' ' + s.dayNoTimeTracked;
                                                    dayLabel = dayInFuture
                                                        ? 'Future date'
                                                        : 'No time tracked';
                                                }

                                                // Render
                                                return (
                                                    <span
                                                        className={dayClassName}
                                                        onClick={dayCloseClickEnabled
                                                            ? e => this.handleConfirmationModalForEntriesSubmitForReview(
                                                                day.date.format('YYYY-MM-DD'),
                                                                index
                                                            )
                                                            : undefined
                                                        }
                                                    >
                                                        {dayLabel}
                                                    </span>
                                                );
                                            })()}
                                        </p>
                                    </td>
                                );
                            })}
                            <td></td>
                        </tr>
                    </tfoot>

                </table>

                <Row className={s.timeRow} removeGutter={true}>
                    {(() => {
                        if (this.state.daysLoading) {
                            return <LoadingShade background="rgba(226, 219, 213, 0.8)" />;
                        }
                    })()}
                    <Col size={0}>
                        <DatePicker
                            className={s.dateTimePicker}
                            onChange={e => this.handleDateChange(e)}
                            value={this.state.entered.startDate}
                            label="Date"
                        />
                    </Col>
                    <Col size={0}>
                        <TimePicker
                            onChange={e => this.handleStartTimeChange(e)}
                            className={s.dateTimePicker}
                            label="Start time"
                            increments={this.props.increments}
                            value={this.state.entered.start}
                            isAmerican={true}
                            isOneLine={true}
                        />
                    </Col>
                    <Col size={0}>
                        <DurationPicker
                            className={s.durationPicker}
                            onChange={e => this.handleDurationChange(e)}
                            totalMinutes={this.state.entered.duration}
                            increments={this.props.increments}
                            label="Duration"
                        />
                    </Col>
                    <Col size={0}>
                        <TimePicker
                            onChange={e => this.handleEndTimeChange(e)}
                            className={s.dateTimePicker}
                            label="End time"
                            increments={this.props.increments}
                            value={this.state.entered.end}
                            isAmerican={true}
                            isOneLine={true}
                        />
                    </Col>
                </Row>

                <Row removeGutter={true} className={s.timelineRow}>
                    <Col>
                        <Row removeGutter={true}>
                            {this.state.timeline.map((entry, index) => {
                                return (
                                    <Col key={index} size={1}>
                                        <hr />
                                    </Col>
                                );
                            })}
                            {(() => {
                                let timelineEntries = [];

                                if (this.state.currentDayIndex) {
                                    if (typeof this.state.days[this.state.currentDayIndex] !== 'undefined') {
                                        this.state.days[this.state.currentDayIndex].entriesTimeline.map((timelineEntry, timelineEntryIndex) => {
                                            // Render existing entry on the timeline
                                            timelineEntries.push(
                                                <div
                                                    key={'entry-' + timelineEntry.id}
                                                    className={s.timelineBox}
                                                    style={this.calculateTimelineEntryStyle(
                                                        timelineEntry.startInMinutes,
                                                        timelineEntry.endInMinutes - timelineEntry.startInMinutes,
                                                        false
                                                    )}
                                                ></div>
                                            );
                                        });
                                    }
                                }

                                let editableTimelineBoxClassName = s.timelineBox + ' ' + s.timelineBoxEditable;
                                editableTimelineBoxClassName += this.state.isOverlapping ? ' ' + s.timelineBoxOverlapping : '';
                                timelineEntries.push(
                                    <div
                                        key="entry-current"
                                        className={editableTimelineBoxClassName}
                                        style={this.calculateTimelineEntryStyle(
                                            this.state.entered.start,
                                            this.state.entered.duration,
                                            true
                                        )}
                                    ></div>
                                );

                                return timelineEntries;
                            })()}
                        </Row>
                    </Col>
                </Row>

                <Row removeGutter={true} className={s.hoursRow}>
                    {this.state.timeline.map((entry, index) => {
                        return (
                            <Col key={index}>
                                <p>
                                    {entry.hour}
                                    <span>{entry.minutes}</span>
                                </p>
                            </Col>
                        );
                    })}
                </Row>

            </HeaderSection>
        );
    }
}

TimeTrackingCalendar.propTypes = propTypes;
TimeTrackingCalendar.defaultProps = defaultProps;

function mapStateToProps(state) {
    return {
        user: state.user,
        modal: state.modal,
        header: state.header,
        notifications: state.notifications
    };
}

export default connect(mapStateToProps, null, null, { withRef: true })(TimeTrackingCalendar);
