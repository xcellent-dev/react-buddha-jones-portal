import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import * as API from './../../actions/api';
import { actionUsersListLoad, actionInitializeUserType } from './../../actions/Users';
import DropdownContainer from './../Form/DropdownContainer';
import Input from './../Form/Input';
import OptionsList from './../Form/OptionsList';
import Person from './Person';
import Section from './../Section/Section';
import Row from './../Section/Row';
import Col from './../Section/Col';
import { searchPhraseInString } from './../../helpers/search';
import s from './DropdownPeoplePicker.css';

const propTypes = {
    onPersonPicked: PropTypes.func,
    onPersonRemoved: PropTypes.func,
    editable: PropTypes.bool,
    align: PropTypes.oneOf(['left', 'center', 'right']),
    maxDropdownWidth: PropTypes.number,
    onChange: PropTypes.func,
    pickedPeopleLimit: PropTypes.number,
    pickedPeopleIds: PropTypes.arrayOf(PropTypes.number),
    label: PropTypes.string,
    valueLabel: PropTypes.string,
    type: PropTypes.oneOf(['all', 'editor', 'designer', 'producer', 'billing', 'writer', 'musician', 'manager']).isRequired
};

const defaultProps = {
    onPersonPicked: null,
    onPersonRemoved: null,
    editable: true,
    onChange: null,
    align: 'left',
    maxDropdownWidth: 360,
    pickedPeopleLimit: 0,
    pickedPeopleIds: [],
    valueLabel: 'People',
    label: 'Pick',
    type: 'all'
};

class NewPeoplePicker extends React.Component {
    constructor(props, context) {
        super(props, context);

        this.state = {
            search: '',
            options: [],
            pickedPeople: [],
            removingPeopleIds: [],
            maxHeight: 0
        };

        if (typeof this.props.users[this.props.type] === 'undefined') {
            // Initializing user type
            this.props.dispatch(
                actionInitializeUserType(this.props.type)
            );
        }

        this.peoplePickerDropdown = null;
        this.isComponentMounted = true;
    }

    componentDidMount() {
        this.fetchOptions(this.props.type);
    }

    componentWillReceiveProps(nextProps) {
        const { props } = this;
        const { users, type } = props;

        if (typeof nextProps.users[nextProps.type] !== 'undefined' && nextProps.users[nextProps.type].length > 0 && nextProps.pickedPeopleIds.length > 0) {
            this.setState({
                pickedPeople: nextProps.users[nextProps.type].filter((person, personIndex) => {
                    return nextProps.pickedPeopleIds.indexOf(person.id) !== -1 ? true : false;
                }),
                removingPeopleIds: []
            }, () => {
                this.setOptions(nextProps.users[nextProps.type]);
            });
        } else if (
            (props.type !== nextProps.type) ||
            (typeof props.users[nextProps.type] === 'undefined' && typeof nextProps.users[nextProps.type] !== 'undefined') ||
            (
                typeof props.users[nextProps.type] !== 'undefined' &&
                typeof nextProps.users[nextProps.type] !== 'undefined' &&
                props.users[nextProps.type].length !== nextProps.users[nextProps.type].length
            )
        ) {
            this.setOptions(nextProps.users[nextProps.type]);
        } else if (
            typeof props.users[props.type] !== 'undefined' &&
            typeof nextProps.users[nextProps.type] !== 'undefined' &&
            props.pickedPeopleIds.length > 0 &&
            nextProps.pickedPeopleIds.length <= 0
        ) {
            this.setState({
                search: '',
                pickedPeople: [],
                removingPeopleIds: []
            });
        }

        if (type !== nextProps.type) {
            this.fetchOptions(nextProps.type);
        }
    }

    componentWillUnmount() {
        this.isComponentMounted = false;
    }

    fetchOptions(type) {
        type = typeof type !== 'undefined' ? type : 'all';
        const { users } = this.props;

        // Get current timestamp
        const timestamp = new Date().getTime();

        if (
            (typeof users[type] === 'undefined') ||
            (
                typeof users[type] !== 'undefined' &&
                typeof users[type + 'LastTimestamp'] !== 'undefined' &&
                (users[type + 'LastTimestamp'] < 1 || timestamp - users[type + 'LastTimestamp'] > 1000 * 60 * 5)
            )
        ) {
            // Fetch users
            this.props.dispatch(
                actionUsersListLoad(type)
            );
        } else {
            this.setState({
                pickedPeople: users[type].filter((person, personIndex) => {
                    return this.props.pickedPeopleIds.indexOf(person.id) !== -1 ? true : false;
                })
            }, () => {
                this.setOptions(users[type]);
            });
        }
    }

    setOptions(users) {
        users = typeof users !== 'undefined'
            ? users
            : typeof this.props.users[this.props.type] !== 'undefined'
                ? this.props.users[this.props.type]
                : [];

        const { search } = this.state;
        const query = search.trim();

        let filteredUsers = [];

        // Search for query match
        if (typeof users !== 'undefined' && users.length > 0) {
            if (query !== '') {
                filteredUsers = users.filter((user) => {
                    return searchPhraseInString(user.fullName, query, true, true);
                });
            } else {
                filteredUsers = users;
            }
        }

        // Remove users that have already been selected
        filteredUsers = filteredUsers.filter((user) => {
            if (this.state.pickedPeople.find(person => person.id === user.id)) {
                return false;
            } else {
                return true;
            }
        });

        this.setState({
            options: filteredUsers.map((user) => {
                return {
                    label: user.fullName,
                    value: {
                        id: user.id,
                        username: user.userName,
                        fullname: user.fullName,
                        image: user.image,
                        typeId: user.typeId
                    }
                };
            })
        }, () => {
            // Set timeout to refresh users list in case dropdown is left mounted
            setTimeout(() => {
                if (this.isComponentMounted) {
                    const timestamp = new Date().getTime();
                    if (
                        typeof this.props.users[this.props.type + 'LastTimestamp'] !== 'undefined' &&
                        timestamp - this.props.users[this.props.type + 'LastTimestamp'] > 1000 * 60 * 5
                    ) {
                        this.props.dispatch(
                            actionUsersListLoad(this.props.type)
                        );
                    }
                }
            }, 1024 * 60 * 5);
        });
    }

    handleAddToPicked(e) {
        const person = this.props.users[this.props.type].find(user => user.id === e.value.id);

        this.setState({
            search: ''
        });

        if (this.props.onPersonPicked) {
            this.props.onPersonPicked(Object.assign({}, e, {
                type: this.props.type
            }));
        }

        if (this.peoplePickerDropdown) {
            this.peoplePickerDropdown.closeDropdown();
        }
    }

    handleRemoveFromPicked(person) {
        this.setState({
            removingPeopleIds: this.state.removingPeopleIds.concat([person.id])
        });

        if (this.props.onPersonRemoved) {
            this.props.onPersonRemoved({
                id: person.id,
                name: person.fullName,
                username: person.userName,
                type: this.props.type,
                typeId: person.typeId,
                image: person.image
            });
        }
    }

    handleMaxHeightChange(maxHeight) {
        this.setState({
            maxHeight
        });
    }

    handleUsersSearch(e) {
        if (typeof e !== 'undefined' && typeof e.target !== 'undefined' && typeof e.target.value !== 'undefined') {
            this.setState({
                search: e.target.value
            }, () => {
                this.setOptions();
            });
        }
    }

    render() {
        const { props } = this;

        // People content justification
        let justifyPeopleRow = 'space-around';
        if (props.align === 'left') {
            justifyPeopleRow = 'flex-start';
        } else if (props.align === 'right') {
            justifyPeopleRow = 'flex-end';
        }

        // Render
        return (
            <div className="dropdownPeoplePicker">

                {(this.props.editable && (this.props.pickedPeopleLimit === 0 || this.props.pickedPeopleLimit > this.state.pickedPeople.length)) && (
                    <DropdownContainer
                        ref={ref => this.peoplePickerDropdown = ref}
                        onMaxHeightChange={e => this.handleMaxHeightChange(e)}
                        align={props.align}
                        minWidth={210}
                        maxWidth={props.maxDropdownWidth}
                        maxHeight={480}
                        label={props.label}
                        value={props.valueLabel}
                        truncuateLabelTo={0}
                    >
                        <Input
                            autoFocus={true}
                            className={s.search}
                            label="Search person..."
                            value={this.state.search}
                            onChange={e => this.handleUsersSearch(e)}
                        />
                        <div
                            className={s.options}
                            style={{
                                maxHeight: this.state.maxHeight > 0 ? this.state.maxHeight + 'px' : undefined
                            }}
                        >
                            <OptionsList
                                onChange={e => this.handleAddToPicked(e)}
                                options={this.state.options}
                                loadingOptions={this.props.usersLoading}
                            />
                        </div>
                    </DropdownContainer>
                )}

                {this.props.usersLoading && (
                    <Row>
                        <Col>
                            <br />
                            <p>Loading people...</p>
                        </Col>
                    </Row>
                )}

                <Row className={s.people} doWrap={true} justifyContent={justifyPeopleRow}>
                    {this.state.pickedPeople.map((person, personIndex) => {
                        let personLabel = person.fullName;

                        // Is person being removed
                        let isBeingRemoved = false;
                        if (this.state.removingPeopleIds.indexOf(person.id) !== -1) {
                            personLabel = 'Removing ' + person.fullName;
                            isBeingRemoved = true;
                        }

                        // Render person
                        return (
                            <Col className={s.person} size={0} key={person.id}>
                                <Person
                                    onClick={this.props.editable ? (e, checked) => this.handleRemoveFromPicked(person) : undefined}
                                    displayRemoveIcon={this.props.editable ? true : false}
                                    name={personLabel}
                                />
                            </Col>
                        );
                    })}
                </Row>

            </div>
        );
    }
}

NewPeoplePicker.propTypes = propTypes;
NewPeoplePicker.defaultProps = defaultProps;

const mapStateToProps = (state, ownProps) => {
    return {
        users: state.users,
        usersLastUpdateTimestamp: state.users[ownProps.type + 'LastTimestamp'],
        usersLoading: state.users[ownProps.type + 'Loading']
    };
};

export default connect(mapStateToProps)(NewPeoplePicker);
