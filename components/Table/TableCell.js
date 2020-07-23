import React, { PropTypes } from 'react';
import { capitalize } from 'lodash';
import s from './TableCell.css';

const propTypes = {
    className: PropTypes.string,
    align: PropTypes.oneOf(['left', 'center', 'right']),
    colSpan: PropTypes.number
};

const defaultProps = {
    className: '',
    align: null,
    colSpan: 1
};


class TableCell extends React.Component {
    constructor(props, context) {
        super(props, context);
    }

    render() {
        // Cell class name
        let cellClassName = '';
        cellClassName += this.props.className !== '' ? ' ' + this.props.className : '';
        cellClassName += this.props.align ? ' ' + s['align' + capitalize(this.props.align)] : '';

        // Render
        return (
            <td
                className={cellClassName !== '' ? cellClassName : undefined}
                colSpan={this.props.colSpan > 1 ? this.props.colSpan : undefined}
            >
                {this.props.children}
            </td>
        );
    }
}

TableCell.propTypes = propTypes;
TableCell.defaultProps = defaultProps;

export default TableCell;
