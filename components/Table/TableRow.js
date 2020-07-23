import React, { PropTypes } from 'react';
import { capitalize } from 'lodash';
import s from './TableRow.css';

const propTypes = {
    className: PropTypes.string,
    type: PropTypes.oneOf(['default', 'highlight', 'subrow', 'border', 'compact'])
};

const defaultProps = {
    className: '',
    type: 'default'
};


class TableRow extends React.Component {
    constructor(props, context) {
        super(props, context);
    }

    render() {
        // Prepare class name
        let trClassName = '';
        trClassName += this.props.className !== '' ? ' ' + this.props.className : '';
        trClassName += this.props.type !== 'default' ? ' ' + s['row' + capitalize(this.props.type)] : '';

        // Render
        return (
            <tr className={trClassName !== '' ? trClassName : undefined}>
                {(() => {
                    if (typeof this.props.children !== 'undefined') {
                        return this.props.children;
                    }
                })()}
            </tr>
        );
    }
}

TableRow.propTypes = propTypes;
TableRow.defaultProps = defaultProps;

export default TableRow;
