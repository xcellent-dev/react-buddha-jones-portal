import React, { PropTypes } from 'react';
import history from './../../core/history';
import { padStart } from 'lodash';
import s from './Dashboard.css';

const propTypes = {
    links: PropTypes.arrayOf(
        PropTypes.shape({
            label: PropTypes.string.isRequired,
            to: PropTypes.string.isRequired
        })
    )
};

const defaultProps = {
    links: []
};

export default class Dashboard extends React.Component {
    constructor(props, context) {
        super(props, context);
    }

    handleLinkClick(e, to) {
        e.preventDefault();

        if (typeof to !== 'undefined') {
            history.push(to);
        }
    }

    render() {
        return (
            <div className={s.links}>
                {this.props.links.map((link, linkIndex) => {
                    if (typeof link.to !== 'undefined') {
                        const label = typeof link.label !== 'undefined' && link.label ? link.label : 'Link';
                        return (
                            <div key={link.to}>
                                <button onClick={e => this.handleLinkClick(e, link.to)}>
                                    <span>{padStart((linkIndex + 1).toString(), 2, '0') + '.'}</span>
                                    <strong>{label}</strong>
                                </button>
                            </div>
                        );
                    }
                })}
            </div>
        );
    }
}

Dashboard.propTypes = propTypes;
Dashboard.defaultProps = defaultProps;
