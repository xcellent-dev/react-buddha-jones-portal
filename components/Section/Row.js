import React, { PropTypes } from 'react';
import s from './RowCol.css';

const propTypes = {
    className: PropTypes.string,
    style: PropTypes.any,
    removeMargins: PropTypes.bool,
    removeGutter: PropTypes.bool,
    doWrap: PropTypes.bool,
    justifyContent: PropTypes.oneOf(['inherit', 'initial', 'flex-start', 'flex-end', 'center', 'space-around', 'space-between']),
    alignContent: PropTypes.oneOf(['inherit', 'initial', 'flex-start', 'flex-end', 'center', 'space-around', 'space-between', 'stretch']),
    alignItems: PropTypes.oneOf(['inherit', 'initial', 'stretch', 'baseline', 'center', 'flex-start', 'flex-end'])
};

const defaultProps = {
    className: '',
    style: null,
    removeMargins: false,
    removeGutter: false,
    doWrap: false,
    justifyContent: null,
    alignContent: null,
    alignItems: null
};

class Row extends React.Component {
    constructor(props, context) {
        super(props, context);
    }

    render() {
        // Row class name
        let rowClassName = 'row';
        rowClassName += this.props.doWrap === true ? ' rowWrap' : '';
        rowClassName += this.props.removeGutter === true ? ' rowNoGutter' : '';
        rowClassName += this.props.removeMargins === true ? ' rowNoMargins' : '';
        rowClassName += this.props.className !== '' ? ' ' + this.props.className : '';

        // Row style
        let rowStyle = {
            justifyContent: this.props.justifyContent !== null ? this.props.justifyContent : null,
            alignContent: this.props.alignContent !== null ? this.props.alignContent : null,
            alignItems: this.props.alignItems !== null ? this.props.alignItems : null
        };

        // Additional row style
        if (this.props.style !== null) {
            rowStyle = Object.assign({}, rowStyle, this.props.style);
        }

        // Render
        return (
            <div className={rowClassName} style={rowStyle}>
                {this.props.children}
            </div>
        );
    }
}

Row.propTypes = propTypes;
Row.defaultProps = defaultProps;

export default Row;
