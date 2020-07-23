import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import * as actions from './../../actions/ActionTypes';
import { actionInitializeCustomer, actionLoadCustomer } from './../../actions/Customers';
import { actionCreateModal } from './../../actions/Modal';
import * as API from './../../actions/api';
import { isEqual } from 'lodash';
import Row from './../Section/Row';
import Col from './../Section/Col';
import Button from './../Button/Button';
import Checkmark from './../Form/Checkmark';
import Paragraph from './../Content/Paragraph';
import CustomerContactCreateForm from './CustomerContactCreateForm';
import IconPlusWhite from './../Icons/IconPlusWhite';
import s from './CustomerContactPicker.css';

const propTypes = {
    allowCreating: PropTypes.bool,
    onPersonPicked: PropTypes.func,
    onPersonRemoved: PropTypes.func,
    onChange: PropTypes.func,
    align: PropTypes.oneOf(['left', 'center', 'right']),
    pickedPeopleLimit: PropTypes.number,
    pickedPeopleIds: PropTypes.arrayOf(PropTypes.number),
    customerId: PropTypes.number.isRequired,
    customerName: PropTypes.string,
    label: PropTypes.string
};

const defaultProps = {
    allowCreating: false,
    onPersonPicked: null,
    onPersonRemoved: null,
    onChange: null,
    align: 'left',
    pickedPeopleLimit: 0,
    pickedPeopleIds: [],
    customerId: null,
    customerName: null,
    label: 'Customer contacts'
};

class CustomerContactPicker extends React.Component {
    constructor(props, state) {
        super(props, state);

        this.state = {
            newContact: {
                creating: false,
                name: '',
                email: '',
                phoneMobile: '',
                phoneOffice: '',
                address: ''
            },
            selectedContacts: []
        };

        // Get current timestamp
        const timestamp = new Date().getTime();

        // Check if customer has to be initialized or updated
        if (props.customer === null) {
            this.initializeCustomer();
        } else if (
            props.customer !== null &&
            typeof props.customer.lastTimestamp !== 'undefined' &&
            (
                props.customer.lastTimestamp < 1 ||
                timestamp - props.customer.lastTimestamp > 1000 * 60 * 5
            )
        ) {
            this.fetchCustomer();
        }
    }

    initializeCustomer(id) {
        id = typeof id !== 'undefined' && id !== null ? id : this.props.customerId ? this.props.customerId : null;

        if (id) {
            this.props.dispatch(
                actionInitializeCustomer(id)
            );
        }
    }

    fetchCustomer(id) {
        id = typeof id !== 'undefined' && id !== null ? id : this.props.customerId ? this.props.customerId : null;

        if (id) {
            this.props.dispatch(
                actionLoadCustomer(id)
            );
        }
    }

    componentDidMount() {
        const { customer } = this.props;

        // Get current timestamp
        const timestamp = new Date().getTime();

        // Fetch customer contacts unless they've been loaded less than 5 minutes ago
        if (
            (customer === null) ||
            (
                customer !== null &&
                typeof customer.lastTimestamp !== 'undefined' &&
                (
                    customer.lastTimestamp < 1 ||
                    timestamp - customer.lastTimestamp > 1000 * 60 * 5
                )
            )
        ) {
            this.fetchCustomer();
        }
    }

    componentWillReceiveProps(nextProps) {
        const { props } = this;

        if (props.customerId !== nextProps.customerId) {
            this.fetchCustomer(nextProps.customerId);
        }

        if (isEqual(props.pickedPeopleIds, nextProps.pickedPeopleIds) === false && isEqual(nextProps.pickedPeopleIds, this.state.selectedContacts) === false) {
            this.setState({
                selectedContacts: nextProps.pickedPeopleIds
            });
        }
    }

    handleContactToggle(id) {
        if (typeof id !== 'undefined') {
            // Check if contact is already selected
            const contactIndex = this.state.selectedContacts.indexOf(id);
            if (contactIndex !== -1) {
                this.setState({
                    selectedContacts: this.state.selectedContacts
                        .slice(0, contactIndex)
                        .concat(this.state.selectedContacts.slice(contactIndex + 1))
                }, () => {
                    this.returnOnRemoved();
                    this.returnOnChange();
                });
            } else {
                this.setState({
                    selectedContacts: this.state.selectedContacts.concat([id])
                }, () => {
                    this.returnOnAdded();
                    this.returnOnChange();
                });
            }
        }
    }

    returnOnAdded(id) {
        if (typeof id !== 'undefined' && id !== null && this.props.onPersonPicked) {
            let contactDetails = null;
            this.props.customer.contacts.some((contact, contactIndex) => {
                if (contact.id === id) {
                    contactDetails = contact;
                    return true;
                } else {
                    return false;
                }
            });
            if (contactDetails !== null) {
                this.props.onPersonPicked(contactDetails);
            }
        }
    }

    returnOnRemoved(id) {
        if (typeof id !== 'undefined' && id !== null && this.props.onPersonRemoved) {
            let contactDetails = null;
            this.props.customer.contacts.some((contact, contactIndex) => {
                if (contact.id === id) {
                    contactDetails = contact;
                    return true;
                } else {
                    return false;
                }
            });
            if (contactDetails !== null) {
                this.props.onPersonRemoved(contactDetails);
            }
        }
    }

    returnOnChange() {
        if (this.props.onChange) {
            this.props.onChange({
                ids: this.state.selectedContacts,
                details: this.props.customer.contacts.filter((contact, contactIndex) => {
                    return this.state.selectedContacts.indexOf(contact.id) !== -1 ? true : false;
                })
            });
        }
    }

    handleNewContactCreation(e) {
        e.preventDefault();
        this.setState({
            newContact: Object.assign({}, this.state, {
                creating: true
            })
        });
    }

    handleModalClose() {
        this.setState({
            newContact: Object.assign({}, this.state, {
                creating: false
            })
        });
    }

    render() {
        const { customer } = this.props;

        // Contacts row
        let contactsRowContent = [];

        if (customer !== null && typeof customer.id !== 'undefined' && typeof customer.contacts !== 'undefined') {
            // Check if customer has any contacts assigned
            if (customer.contacts.length === 0 && customer.loading === false) {
                contactsRowContent.push(
                    <Col key={'customer-' + customer.id + '-no-recipients'}>
                        <Paragraph type="dim">Customer has no contacts assigned</Paragraph>
                    </Col>
                );
            }

            // List customer contacts if there are any
            if (customer.contacts.length > 0) {
                customer.contacts.map((contact, contactIndex) => {
                    contactsRowContent.push(
                        <Col key={'customer-' + contact.customerId + '-contact-' + contact.id}>
                            <Checkmark
                                onClick={e => this.handleContactToggle(contact.id)}
                                checked={this.state.selectedContacts.indexOf(contact.id) !== -1}
                                label={{ text: contact.name, onLeft: false }}
                            />
                        </Col>
                    );
                });
            }

            // Show create new contact button
            if (this.props.allowCreating) {
                contactsRowContent.push(
                    <Col key={'customer-create-contact-button'}>
                        <Button
                            onClick={e => this.handleNewContactCreation(e)}
                            icon={{
                                size: 'small',
                                background: 'blue',
                                element:
                                    <IconPlusWhite
                                        width={12}
                                        height={12}
                                        marginTop={-6}
                                        marginLeft={-6}
                                    />
                            }}
                            label={{
                                text: 'Create new customer contact',
                                color: 'blue',
                                size: 'small',
                                onLeft: true
                            }}
                        />
                    </Col>
                );
            }
        }

        // Render
        return (
            <div>

                {(this.props.customerId && (customer === null || (typeof customer.loading !== 'undefined' && customer.loading))) && (
                    <Row className={s.contacts}>
                        <Col>
                            <Paragraph>Loading customer contacts...</Paragraph>
                        </Col>
                    </Row>
                )}

                <Row className={s.contacts} justifyContent="flex-start">

                    {(contactsRowContent.length > 0) && contactsRowContent}

                </Row>

                {this.props.allowCreating && (
                    <CustomerContactCreateForm
                        onClose={e => this.handleModalClose()}
                        show={this.state.newContact.creating}
                        customerId={this.props.customerId}
                        customerName={this.props.customerName}
                    />
                )}

            </div>
        );
    }
}

CustomerContactPicker.propTypes = propTypes;
CustomerContactPicker.defaultProps = defaultProps;

const mapStateToProps = (state, ownProps) => {
    return {
        customer: typeof state.customers[ownProps.customerId] !== 'undefined' ? state.customers[ownProps.customerId] : null
    };
};

export default connect(mapStateToProps)(CustomerContactPicker);
