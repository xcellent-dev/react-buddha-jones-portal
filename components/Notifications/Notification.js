import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import * as actions from './../../actions/ActionTypes';
import s from './Notification.css';
import { printDateAsTimeAgo } from './../../helpers/date';
import { capitalizePhraseOrWord } from './../../helpers/text';
import Row from './../Section/Row';
import Col from './../Section/Col';
import Button from './../Button/Button';
import Paragraph from './../Content/Paragraph';
import IconClose from './../Icons/IconClose';

const propTypes = {
    dismissable: PropTypes.shape({
        allow: PropTypes.bool,
        onDismiss: PropTypes.func,
        automaticallyAfter: PropTypes.number
    }),
    title: PropTypes.string.isRequired,
    description: PropTypes.string,
    type: PropTypes.oneOf(['default', 'success', 'error']),
    date: PropTypes.object,
    showDate: PropTypes.bool,
    actions: PropTypes.arrayOf(PropTypes.shape({
        onClick: PropTypes.func,
        dismisses: PropTypes.bool,
        iconElement: PropTypes.element.isRequired,
        labelText: PropTypes.string.isRequired
    }))
};

const defaultProps = {
    dismissable: {
        allow: true,
        onDismiss: null,
        automaticallyAfter: 0
    },
    title: '',
    description: null,
    type: 'default',
    date: null,
    showDate: false,
    actions: []
};

class Notification extends React.Component {
    constructor(props, context) {
        super(props, context);

        this.exists = true;

        const date = this.props.date ? this.props.date : new Date();

        this.state = {
            show: false,
            date: date,
            timeAgo: printDateAsTimeAgo(date, false, true)
        };
    }

    componentDidMount() {
        // Animate in
        setTimeout(() => {
            if (typeof this.exists !== typeof undefined && this.exists) {
                this.setState({
                    show: true
                });
            }
        }, 128);

        // Check if notification should dismiss automatically
        if (typeof this.props.dismissable.automaticallyAfter !== 'undefined' && this.props.dismissable.automaticallyAfter > 0) {
            setTimeout(() => {
                this.handleNotificationDismiss();
            }, this.props.dismissable.automaticallyAfter * 1000);
        }
    }

    componentWillUnmount() {
        this.exists = false;
    }

    handleNotificationDismiss(e) {
        // Hide notification
        if (typeof this.exists !== typeof undefined && this.exists) {
            this.setState({
                show: false
            });
        }

        // Pass further
        if (this.props.dismissable.onDismiss !== null) {
            setTimeout(() => {
                this.props.dismissable.onDismiss(e);
            }, 800);
        }
    }

    render() {
        // Notification class name
        let notificationClassName = s.notification;
        notificationClassName += this.state.show === false ? ' ' + s.hide : '';
        notificationClassName += this.props.type !== 'default' ? ' ' + s['ofType' + capitalizePhraseOrWord(this.props.type)] : '';
        notificationClassName += this.props.dismissable.allow === true ? ' ' + s.dismissable : '';

        // Render
        return (
            <div className={notificationClassName}>
                <div className={s.notificationHeader}>

                    <h3>{this.props.title}</h3>

                    {(this.props.description && this.props.showDate) && (
                        <hr />
                    )}

                    {this.props.description && (
                        <Paragraph className={s.description}>{this.props.description}</Paragraph>
                    )}

                    {this.props.showDate && (
                        <Paragraph className={s.date} float="right">{this.state.timeAgo}</Paragraph>
                    )}

                    {(this.props.dismissable !== null && this.props.dismissable.allow) && (
                        <Button
                            onClick={e => this.handleNotificationDismiss(e)}
                            className={s.dismiss}
                            icon={{
                                element: React.createElement(IconClose, {
                                    width: 12,
                                    height: 12,
                                    marginTop: -6,
                                    marginLeft: -6
                                }),
                                size: 'small',
                                background: 'none-alt'
                            }}
                            tooltip={{
                                text: 'Dismiss',
                                on: 'left'
                            }}
                        />
                    )}

                </div>

                {(this.props.actions && this.props.actions.length > 0) && (
                    <Row doWrap={true} className={s.notificationActions}>
                        {this.props.actions.map((action, index) => {
                            if (typeof action.iconElement !== 'undefined' && typeof action.labelText !== 'undefined') {
                                return (
                                    <Col
                                        key={action.labelText}
                                        onClick={
                                            typeof action.dismisses !== 'undefined' && action.dismisses === true
                                            ? e => this.handleNotificationDismiss(e)
                                            : undefined
                                        }
                                    >
                                        <Button
                                            onClick={
                                                typeof action.onClick !== 'undefined' && action.onClick !== null
                                                ? e => action.onClick(e)
                                                : undefined
                                            }
                                            icon={{
                                                element: action.iconElement,
                                                background: 'orange',
                                                size: 'small'
                                            }}
                                            label={{
                                                text: action.labelText,
                                                size: 'large',
                                                color: 'orange',
                                                onLeft: true
                                            }}
                                        />
                                    </Col>
                                );
                            }
                        })}
                    </Row>
                )}

            </div>
        );
    }
}

Notification.propTypes = propTypes;
Notification.defaultProps = defaultProps;

function mapStateToProps(state) {
    return {
        notifications: state.notifications
    };
}

export default connect(mapStateToProps)(Notification);
