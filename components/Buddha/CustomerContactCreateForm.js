import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import * as actions from './../../actions/ActionTypes';
import { actionCreateCustomerContact } from './../../actions/Customers';
import { isEqual } from 'lodash';
import ModalInline from './../Modals/ModalInline';
import Col from './../Section/Col';
import Input from './../Form/Input';
import Paragraph from './../Content/Paragraph';
import s from './CustomerContactCreateForm.css';

const propTypes = {
    onClose: PropTypes.func,
    show: PropTypes.bool,
    customerId: PropTypes.number.isRequired,
    customerName: PropTypes.string,
    value: PropTypes.shape({
        name: PropTypes.string,
        email: PropTypes.string,
        phoneMobile: PropTypes.string,
        phoneOffice: PropTypes.string,
        address: PropTypes.string
    })
};

const defaultProps = {
    onClose: null,
    show: false,
    customerId: null,
    customerName: null,
    value: {
        name: null,
        email: null,
        phoneMobile: null,
        phoneOffice: null,
        address: null
    }
};

class CustomerContactCreateForm extends React.Component {
    constructor(props, state) {
        super(props, state);

        this.state = {
            saving: false,
            saveError: false,
            value: {
                name: typeof props.value.name !== 'undefined' && props.value.name !== null ? props.value.name : '',
                email: typeof props.value.email !== 'undefined' && props.value.email !== null ? props.value.email : '',
                phoneMobile: typeof props.value.phoneMobile !== 'undefined' && props.value.phoneMobile !== null ? props.value.phoneMobile : '',
                phoneOffice: typeof props.value.phoneOffice !== 'undefined' && props.value.phoneOffice !== null ? props.value.phoneOffice : '',
                address: typeof props.value.address !== 'undefined' && props.value.address !== null ? props.value.address : ''
            }
        };
    }

    componentWillReceiveProps(nextProps) {
        const { props } = this;
        const { value } = nextProps;

        if (isEqual(props.value, value) === false && isEqual(nextProps.value, this.state.value) === false) {
            this.setState({
                value: Object.assign({}, this.state.value, {
                    name: typeof value.name !== 'undefined' && value.name !== null ? value.name : undefined,
                    email: typeof value.email !== 'undefined' && value.email !== null ? value.email : undefined,
                    phoneMobile: typeof value.phoneMobile !== 'undefined' && value.phoneMobile !== null ? value.phoneMobile : undefined,
                    phoneOffice: typeof value.phoneOffice !== 'undefined' && value.phoneOffice !== null ? value.phoneOffice : undefined,
                    address: typeof value.address !== 'undefined' && value.address !== null ? value.address : undefined,
                })
            });
        }
    }

    handleValueChange(e, name) {
        if (typeof e !== 'undefined' && typeof e.target !== 'undefined' && typeof e.target.value !== 'undefined' && typeof name !== 'undefined') {
            this.setState({
                value: Object.assign({}, this.state.value, {
                    [name]: e.target.value
                })
            });
        }
    }

    handleModalClose() {
        if (this.props.onClose) {
            this.props.onClose();
        }
    }

    handleContactSaved(e) {
        if (this.state.value.name.trim() === '') {
            this.setState({
                saveError: true
            });
        } else {
            this.setState({
                saveError: false
            });

            this.props.dispatch({
                type: actions.CUSTOMER_TOGGLE_SAVING_CONTACT,
                payload: true
            });

            this.props.dispatch(
                actionCreateCustomerContact(
                    this.props.customerId,
                    this.state.value
                )
            ).then(() => {
                this.handleModalClose();
            });
        }
    }

    render() {
        // Form
        const form = (
            <div className={s.form}>
                {this.state.saveError && (
                    <Paragraph type="alert">Contact's name is required</Paragraph>
                )}
                <Input
                    onChange={e => this.handleValueChange(e, 'name')}
                    value={this.state.value.name}
                    label="Full name"
                    type="text"
                />
                <Input
                    onChange={e => this.handleValueChange(e, 'email')}
                    value={this.state.value.email}
                    label="Email address"
                    type="text"
                />
                <Input
                    onChange={e => this.handleValueChange(e, 'phoneMobile')}
                    value={this.state.value.phoneMobile}
                    label="Mobile phone"
                    type="text"
                />
                <Input
                    onChange={e => this.handleValueChange(e, 'phoneOffice')}
                    value={this.state.value.phoneOffice}
                    label="Office phone"
                    type="text"
                />
                <Input
                    onChange={e => this.handleValueChange(e, 'address')}
                    value={this.state.value.address}
                    label="Postal address"
                    type="text"
                />
            </div>
        );

        // Buttons
        let buttons = [];

        if (this.props.savingContact === false) {
            buttons.push({
                type: 'alert',
                label: 'Cancel',
                closeOnClick: true
            });
        }

        buttons.push({
            type: this.props.savingContact ? 'default' : 'success',
            label: this.props.savingContact ? 'Saving contact...' : 'Save contact',
            onClick: this.props.savingContact ? undefined : e => this.handleContactSaved(e),
            closeOnClick: false
        });

        return (
            <ModalInline
                closeButton={true}
                show={this.props.show}
                onClose={e => this.handleModalClose()}
                title={`Create contact for ${this.props.customerName ? this.props.customerName : this.props.customerId}`}
                content={form}
                actions={buttons}
            />
        );
    }
}

CustomerContactCreateForm.propTypes = propTypes;
CustomerContactCreateForm.defaultProps = defaultProps;

const mapStateToProps = (state, ownProps) => {
    return {
        savingContact: state.customers.savingContact
    };
};

export default connect(mapStateToProps)(CustomerContactCreateForm);
