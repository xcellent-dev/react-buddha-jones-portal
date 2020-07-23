import React from 'react';
import Person from './Person';
import Section from './../Section/Section';
import Row from './../Section/Row';
import Col from './../Section/Col';
import Input from './../Form/Input';
import IconSearchLoupe from './../Icons/IconSearchLoupe';

class PeoplePicker extends React.Component {
    constructor(props, context) {
        super(props, context);

        this.state = {
            people: [],
            selected: []
        };
    }

    componentDidMount() {
        // Add fake people
        this.setState(
            Object.assign({}, this.state, {
                people: this.state.people.concat(
                    [
                        {
                            id: 1,
                            name: 'Doran',
                            image: null
                        },
                        {
                            id: 2,
                            name: 'Kazadi',
                            image: null
                        },
                        {
                            id: 3,
                            name: 'Rob',
                            image: null
                        }
                    ]
                )
            })
        );
    }

    handleSearchChange(e) {

    }

    handlePersonSelection(e, checked, index) {
        // Check if valid data is passsed
        if (typeof checked !== 'undefined' && typeof index !== 'undefined') {
            // Check if multiple are allowed
            if (this.props.selectMultiple === true) {
                // Check if person has been checked
                if (checked === true) {
                    // Add picked person to selected
                    this.setState(
                        Object.assign({}, this.state, {
                            people: this.sortPeopleArray(
                                this.state.people
                                    .slice(0, index)
                                    .concat(this.state.people.slice(index + 1))
                            ),
                            selected: this.sortPeopleArray(
                                this.state.people
                                    .slice(index, index + 1)
                                    .concat(this.state.selected)
                            )
                        })
                    );
                } else {
                    // Remove picked person from selected
                    this.setState(
                        Object.assign({}, this.state, {
                            people: this.sortPeopleArray(
                                this.state.people
                                    .concat(this.state.selected
                                        .slice(index, index + 1))
                            ),
                            selected: this.sortPeopleArray(
                                this.state.selected
                                    .slice(0, index)
                                    .concat(this.state.selected.slice(index + 1))
                            )
                        })
                    );
                }
            } else {
                // Check if person has been checked
                if (checked === true) {
                    // Add picked person to selected
                    this.setState(
                        Object.assign({}, this.state, {
                            people: this.sortPeopleArray(
                                this.state.people
                                    .slice(0, index)
                                    .concat(this.state.people.slice(index + 1))
                                    .concat(this.state.selected)
                            ),
                            selected: this.sortPeopleArray(
                                this.state.people
                                    .slice(index, index + 1)
                            )
                        })
                    );
                } else {
                    // Remove picked person from selected
                    this.setState(
                        Object.assign({}, this.state, {
                            people: this.sortPeopleArray(
                                this.state.people
                                    .concat(this.state.selected)
                            ),
                            selected: []
                        })
                    );
                }
            }
        }
    }

    sortPeopleArray(people) {
        // Sort
        people.sort((a, b) => {
            // Change names into lower case
            const nameA = a.name.toLowerCase();
            const nameB = b.name.toLowerCase();

            // Compare
            if (nameA < nameB) {
                return -1;
            } else if (nameA > nameB) {
                return 1;
            } else {
                return 0;
            }
        });

        // Return sorted array
        return people;
    }

    render() {
        return (
            <Row doWrap={true}>
                <Col size={4} width={256}>
                    <Input
                        onChange={e => this.handleSearchChange(e)}
                        width={1480}
                        icon={React.createElement(IconSearchLoupe, {
                            width: 13,
                            height: 13,
                            marginTop: -6
                        })}
                        label={this.props.label}
                    />
                </Col>
                {this.state.selected.map((selectedPerson, index) => {
                    return (
                        <Col size={0} key={selectedPerson.id}>
                            <Person
                                onClick={(e, checked) => this.handlePersonSelection(e, checked, index)}
                                name={selectedPerson.name}
                                checkmark={{
                                    display: true,
                                    checked: true
                                }}
                            />
                        </Col>
                    );
                })}
                {this.state.people.map((availablePerson, index) => {
                    return (
                        <Col size={0} key={availablePerson.id}>
                            <Person
                                onClick={(e, checked) => this.handlePersonSelection(e, checked, index)}
                                name={availablePerson.name}
                                checkmark={{
                                    display: true,
                                    checked: false
                                }}
                            />
                        </Col>
                    );
                })}
            </Row>
        );
    }
}

PeoplePicker.propTypes = {
    onChange: React.PropTypes.func,
    label: React.PropTypes.string,
    selectMultiple: React.PropTypes.bool,
    type: React.PropTypes.oneOf(['designers', 'editors']).isRequired
};

PeoplePicker.defaultProps = {
    label: 'Select person',
    selectMultiple: false
};

export default PeoplePicker;
