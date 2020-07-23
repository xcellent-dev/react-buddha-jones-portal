import React, { PropTypes } from 'react';
import s from './Person.css';
import Row from './../Section/Row';
import Col from './../Section/Col';
import Checkmark from './../Form/Checkmark';
import IconClose from './../../components/Icons/IconClose';

const propTypes = {
    onClick: PropTypes.func,
    checkmark: PropTypes.shape({
        display: PropTypes.bool,
        defaultChecked: PropTypes.bool,
        checked: PropTypes.bool
    }),
    displayRemoveIcon: PropTypes.bool,
    align: PropTypes.oneOf(['left', 'center', 'right']),
    name: PropTypes.string,
    nameOnLeft: PropTypes.bool,
    image: PropTypes.string,
    smallImage: PropTypes.bool,
    darkImage: PropTypes.bool
};

const defaultProps = {
    onClick: null,
    checkmark: {
        display: false,
        defaultChecked: false
    },
    displayRemoveIcon: false,
    name: '',
    nameOnLeft: false,
    image: null,
    smallImage: false,
    darkImage: false
};

class Person extends React.Component {
    constructor(props, context) {
        super(props, context);
    }

    handlePersonClick(e) {
        if (this.props.onClick) {
            this.props.onClick(e);
        }
    }

    handleCheckmarkClick(e, checked) {
        if (this.props.onClick) {
            this.props.onClick(e, checked);
        }
    }

    render() {
        // Image
        const img =
            <Col className="personImage" size={0}>
                <span style={{
                    backgroundImage: this.props.image
                        ? `url(${this.props.image})`
                        : undefined
                }} />
            </Col>
        ;

        // Align
        let justify;
        if (typeof this.props.align !== 'undefined') {
            switch (this.props.align) {
                case 'left':
                    justify = 'flex-start';
                    break;

                case 'right':
                    justify = 'flex-end';
                    break;

                case 'center':
                    justify = 'center';
                    break;

                default:
                    justify = undefined;
            }
        }

        // Person class name
        let personClassName = 'person';
        personClassName += this.props.smallImage ? ' smallImage' : '';
        personClassName += this.props.darkImage ? ' darkImage' : '';
        personClassName += this.props.onClick ? ' personClickable' : '';

        // Person content
        let person = null;
        if (this.props.checkmark.display === true) {
            person =
                <Checkmark
                    onClick={(e, checked) => this.handleCheckmarkClick(e, checked)}
                    checked={typeof this.props.checkmark.checked !== 'undefined' ? this.props.checkmark.checked : undefined}
                    defaultChecked={this.props.checkmark.defaultChecked}
                    label={{
                        text: this.props.name,
                        onLeft: this.props.nameOnLeft === true ? false : true
                    }}
                />;
        } else {
            person =
                <p onClick={e => this.handlePersonClick(e)}>
                    {this.props.name}
                    {this.props.displayRemoveIcon && (
                        <span className="personCloseIcon">
                            <IconClose width={8} height={8} />
                        </span>
                    )}
                </p>;
        }

        // Render
        return (
            <Row className={personClassName} removeMargins={true} justifyContent={justify}>

                {this.props.nameOnLeft === false && img}

                <Col className="personName" size={0}>
                    {person}
                </Col>

                {this.props.nameOnLeft === true && img}

            </Row>
        );
    }
}

Person.propTypes = propTypes;
Person.defaultProps = defaultProps;

export default Person;
