import React, { PropTypes } from 'react';
import s from './Table.css';
import { capitalizePhraseOrWord } from './../../helpers/text';

const propTypes = {
    className: PropTypes.string,
    type: PropTypes.oneOf(['default', 'compact']),
    title: PropTypes.string,
    header: PropTypes.arrayOf(
        PropTypes.shape({
            title: PropTypes.string.isRequired,
            align: PropTypes.oneOf(['left', 'center', 'right']),
            colSpan: PropTypes.number,
            width: PropTypes.number
        })
    ),
    columnsWidths: PropTypes.arrayOf(
        PropTypes.string
    ),
    footerRows: PropTypes.arrayOf(
        PropTypes.element
    )
};

const defaultProps = {
    className: null,
    type: 'default',
    title: null,
    header: [],
    columnsWidths: [],
    footerRows: []
};

class Table extends React.Component {
    constructor(props, context) {
        super(props, context);
    }

    render() {
        return (
            <div ref="container">

                {this.props.title && (
                    <h3 className={s.title}>{this.props.title}</h3>
                )}

                <table className={[
                    this.props.type === 'compact' ? s.compact : null,
                    this.props.className ? this.props.className : null
                ].join(' ')}>

                    {(this.props.columnsWidths && this.props.columnsWidths.length > 0) && (
                        <colgroup>
                            {this.props.columnsWidths.map((colWidth, colIndex) => {
                                return (
                                    <col key={colIndex} width={colWidth}></col>
                                );
                            })}
                        </colgroup>
                    )}

                    {(this.props.header && this.props.header.length > 0) && (
                        <thead>
                            <tr>
                                {this.props.header.map((theadCol, index) => {
                                    // Prepare thead column class
                                    let theadColClassName = '';
                                    if (typeof theadCol.align !== 'undefined') {
                                        theadColClassName += ' ' + s['align' + capitalizePhraseOrWord(theadCol.align)];
                                    }

                                    // Return thead column
                                    return (
                                        <th
                                            key={index}
                                            colSpan={typeof theadCol.colSpan !== 'undefined' ? theadCol.colSpan : null}
                                            className={theadColClassName}
                                            width={typeof theadCol.width !== 'undefined' ? theadCol.width : null}
                                        >
                                            {theadCol.title}
                                        </th>
                                    );
                                })}
                            </tr>
                        </thead>
                    )}

                    {(typeof this.props.children !== 'undefined' && this.props.children !== null) && (
                        <tbody>
                            {this.props.children}
                        </tbody>
                    )}

                    {(this.props.footerRows && this.props.footerRows.length > 0) && (
                        <tfoot>
                            {this.props.footerRows}
                        </tfoot>
                    )}

                </table>
            </div>
        );
    }
}

Table.propTypes = propTypes;
Table.defaultProps = defaultProps;

export default Table;
