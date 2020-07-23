import React, { PropTypes } from 'react';
import s from './LoadingShade.css';
import Row from './../Section/Row';
import Col from './../Section/Col';

const propTypes = {
    className: PropTypes.string,
    background: PropTypes.string,
    border: PropTypes.string,
    contentCentered: PropTypes.bool
};

const defaultProps = {
    className: '',
    background: null,
    border: null,
    contentCentered: true
};

class LoadingShade extends React.Component {
    constructor(props, context) {
        super(props, context);

        this.exists = true;

        this.state = {
            visible: false
        };
    }

    componentDidMount() {
        setTimeout(() => {
            if (typeof this.exists !== typeof undefined && this.exists) {
                this.setState({
                    visible: true
                });
            }
        }, 128);
    }

    componentWillUnmount() {
        this.exists = false;
    }

    render() {
        // Shade classs name
        let shadeClassName = s.shade;
        shadeClassName += this.state.visible === true ? ' ' + s.visible : '';
        shadeClassName += this.props.contentCentered === false ? ' ' + s.alignLeft : '';
        shadeClassName += this.props.className ? ' ' + this.props.className : '';

        // Shade style
        const style = this.props.background !== null || this.props.border !== null
            ? {
                background: this.props.background,
                border: this.props.border
            }
            : null;

        // Render
        return (
            <Row
                style={style}
                className={shadeClassName}
                removeGutter={true}
                removeMargins={true}
            >
                <Col size={0}>
                    {this.props.children}
                </Col>
            </Row>
        );
    }
};

export default LoadingShade;
