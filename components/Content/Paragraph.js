import React, { PropTypes } from 'react';
import { capitalize } from 'lodash';
import s from './Paragraph.css';

const propTypes = {
    className: PropTypes.string,
    style: PropTypes.object,
    align: PropTypes.oneOf(['left', 'center', 'right']),
    float: PropTypes.oneOf(['none', 'left', 'right']),
    type: PropTypes.oneOf(['default', 'white', 'dim', 'blue', 'alert', 'success']),
    bold: PropTypes.bool
};

const defaultProps = {
    className: '',
    style: null,
    align: null,
    float: 'none',
    type: 'default',
    bold: false
};

class Paragraph extends React.Component {
    constructor(props, context) {
        super(props, context);
    }

    render() {
        // Prepare paragraph class name
        let pClassName = '';
        pClassName += this.props.className !== '' ? ' ' + this.props.className : '';
        pClassName += this.props.type !== 'default' ? ' ' + s['type' + capitalize(this.props.type)] : '';
        pClassName += this.props.bold === true ? ' ' + s.styleBold : '';

        // Prepare style
        let style = {
            textAlign: this.props.align ? this.props.align : null,
            float: this.props.float !== 'none' ? this.props.float : null
        };
        style = this.props.style ? Object.assign({}, style, this.props.style) : style;

        // Render paragraph
        return (
            <p className={pClassName !== '' ? pClassName : null} style={style}>
                {this.props.children}
            </p>
        );
    }
}

Paragraph.propTypes = propTypes;
Paragraph.defaultProps = defaultProps;

export default Paragraph;
