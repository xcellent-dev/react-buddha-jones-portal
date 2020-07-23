import React, { PropTypes } from 'react';
import moment from 'moment';
import s from './DatePicker.css';
import Button from './../Button/Button';
import DropdownContainer from './../Form/DropdownContainer';
import DayPickerCalendar from './../Calendar/DayPickerCalendar';
import IconTickWhite from './../Icons/IconTickWhite';

const propTypes = {
    onChange: PropTypes.func,
    className: PropTypes.string,
    label: PropTypes.string,
    type: PropTypes.oneOf(['oneline', 'twolines', 'field']),
    value: PropTypes.object,
    isAmerican: PropTypes.bool,
    isWhite: PropTypes.bool
};

const defaultProps = {
    onChange: null,
    className: '',
    label: '',
    type: 'oneline',
    value: null,
    isAmerican: true,
    isWhite: false
};

class DatePicker extends React.Component {
    constructor(props, context) {
        super(props, context);

        this.state = {
            date: null,
            dateSelected: '',
            dateLabel: ''
        };
    }

    componentDidMount() {
        // Set initial date
        const date = this.props.value ? moment(this.props.value) : moment();
        this.handleDateChange(date);
    }

    componentWillReceiveProps(nextProps) {
        if (this.props.value !== nextProps.value && nextProps.value) {
            this.handleDateChange(
                typeof nextProps.value.isValid !== 'undefined' && nextProps.value.isValid()
                    ? nextProps.value
                    : moment(nextProps.value)
            );
        }
    }

    handleDropdownConfirmation(e) {
        if (typeof this.refs.container !== 'undefined') {
            const container = this.refs.container;
            if (typeof container.closeDropdown !== 'undefined') {
                container.closeDropdown();
            }
        }
    }

    handleDateChange(date, update) {
        update = typeof update !== 'undefined' ? update : false;

        if (typeof date !== 'undefined' && date && typeof date.isValid !== 'undefined' && date.isValid()) {
            const oldDate = this.state.dateSelected;
            this.setState({
                date: date,
                dateLabel: date.format('MMMM D, YYYY'),
                dateSelected: this.props.isAmerican
                    ? date.format('MM/DD/YYYY')
                    : date.format('DD.MM.YYYY')
            }, () => {
                if (update && this.props.onChange) {
                    if (oldDate === null || !date.isSame(oldDate, 'day')) {
                        this.props.onChange(date);
                    }
                }
            });
        }
    }

    render() {
        // Dropdown class name
        const dropdownClassName = this.props.className !== '' ? this.props.className : '';

        // Render
        return (
            <DropdownContainer
                ref="container"
                className={dropdownClassName !== '' ? dropdownClassName : null}
                minWidth={318}
                maxWidth={318}
                value={this.state.dateSelected}
                type={this.props.type}
                label={this.props.label}
                isWhite={this.props.isWhite}
            >
                <DayPickerCalendar
                    onChange={e => this.handleDateChange(e, true)}
                    value={this.state.date}
                />
                <div className={s.summary}>
                    <Button
                        onClick={e => this.handleDropdownConfirmation(e)}
                        label={{
                            text: this.state.dateLabel,
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
    }
}

DatePicker.propTypes = propTypes;
DatePicker.defaultProps = defaultProps;

export default DatePicker;
