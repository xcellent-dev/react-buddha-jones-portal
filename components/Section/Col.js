import React, { PropTypes } from 'react';
import s from './RowCol.css';

const propTypes = {
    onClick: PropTypes.func,
    className: PropTypes.string,
    style: PropTypes.string,
    minWidth: PropTypes.number,
    maxWidth: PropTypes.number,
    width: PropTypes.number,
    removeGutter: PropTypes.bool,
    flex: PropTypes.string,
    size: PropTypes.oneOf([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12])
};

const defaultProps = {
    onClick: null,
    className: '',
    style: null,
    minWidth: 0,
    maxWidth: 0,
    width: null,
    removeGutter: false,
    flex: null,
    size: null
};

class Col extends React.Component {
    constructor(props, context) {
        super(props, context);
    }

    render() {
        // Col class name
        let colClassName = 'col';
        colClassName += this.props.size !== null ? ' col' + this.props.size : '';
        colClassName += this.props.className !== '' ? ' ' + this.props.className : '';
        colClassName += this.props.removeGutter === true ? ' ' + 'colNoGutter' : '';

        // Col styles
        let colStyles = {
            minWidth: this.props.minWidth > 0 ? this.props.minWidth + 'px' : null,
            maxWidth: this.props.maxWidth > 0 ? this.props.maxWidth + 'px' : null,
            width: this.props.width !== null ? this.props.width + 'px' : null,
            flex: this.props.flex !== null
                ? this.props.flex
                : this.props.width !== null
                    ? '0 1 auto'
                    : null
        };

        // Col additional styles
        if (this.props.style !== null) {
            colStyles = Object.assign({}, colStyles, this.props.style);
        }

        // Render
        return (
            <div
                style={colStyles}
                className={colClassName}
                onClick={this.props.onClick !== null ? e => this.props.onClick(e) : undefined}
            >
                {this.props.children}
            </div>
        );
    }
}

Col.propTypes = propTypes;
Col.defaultProps = defaultProps;

export default Col;
