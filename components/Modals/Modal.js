import React, { Component, PropTypes } from 'react';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import { connect } from 'react-redux';
import { capitalize } from 'lodash';
import { actionRemoveModal } from './../../actions/Modal';
import s from './Modal.css';
import Button from './../Button/Button';
import Paragraph from './../Content/Paragraph';
import IconClose from './../Icons/IconClose';

const propTypes = {
    show: PropTypes.bool,
    title: PropTypes.string,
    text: PropTypes.string,
    type: PropTypes.oneOf(['default', 'success', 'alert']),
    closeButton: PropTypes.bool,
    actions: PropTypes.arrayOf(PropTypes.shape({
        onClick: PropTypes.func,
        closeOnClick: PropTypes.bool.isRequired,
        label: PropTypes.string.isRequired,
        type: PropTypes.oneOf(['default', 'success', 'alert'])
    }))
};

const defaultProps = {
    show: false,
    title: null,
    text: null,
    type: 'default',
    closeButton: false,
    actions: []
};

class Modal extends Component {
    constructor(props, context) {
        super(props, context);

        this.state = {
            show: false
        };
    }

    handleClickAction(closeOnClick, onClick) {
        if (closeOnClick) {
            this.props.dispatch(actionRemoveModal());
        }

        if (typeof onClick !== 'undefined' && onClick !== null) {
            onClick();
        }
    }

    handleClickClose() {
        this.props.dispatch(actionRemoveModal());
    }

    // Render
    render() {
        return (
            <ReactCSSTransitionGroup
                transitionName="modal"
                transitionEnter={true}
                transitionEnterTimeout={1000}
                transitionLeave={true}
                transitionLeaveTimeout={500}
            >
                {(this.props.show) && (
                    <div key="modal-one" className={s.modal}>
                        <div className={s.flexbox}>
                            <div className={s.wrapper}>
                                <div className={s.container}>

                                    {(this.props.title) && (
                                        <div className={s.header}>
                                            <h2>
                                                {this.props.title}
                                            </h2>
                                        </div>
                                    )}

                                    {(this.props.text) && (
                                        <div className={s.content}>
                                            <Paragraph>
                                                {this.props.text}
                                            </Paragraph>
                                        </div>
                                    )}

                                    <div className={s.footer}>
                                        {this.props.actions.map((action, index) => {
                                            // Action button class name
                                            let actionButtonClassName = s.actionButton;
                                            actionButtonClassName += typeof action.type !== 'undefined' && action.type
                                                ? ' style' + capitalize(action.type)
                                                : '';

                                            // Button actions
                                            const closeOnClick = typeof action.closeOnClick && action.closeOnClick !== null
                                                ? action.closeOnClick
                                                : true;
                                            const onClick = typeof action.onClick !== 'undefined' && action.onClick
                                                ? action.onClick
                                                : null;

                                            // Button label color
                                            let labelColor = 'blue';
                                            if (typeof action.type !== 'undefined' && action.type) {
                                                switch (action.type) {
                                                    case 'success':
                                                        labelColor = 'green';
                                                        break;

                                                    case 'alert':
                                                        labelColor = 'orange';
                                                        break;

                                                    default:
                                                        break;
                                                }
                                            }

                                            // Render action button
                                            return (
                                                <Button
                                                    key={`action-button-${index}`}
                                                    onClick={e => this.handleClickAction(closeOnClick, onClick)}
                                                    isInBox={true}
                                                    label={{
                                                        text: typeof action.label !== 'undefined' ? action.label : '',
                                                        color: labelColor
                                                    }}
                                                />
                                            );
                                        })}
                                    </div>

                                    {(this.props.closeButton) && (
                                        <Button
                                            className={s.closeButton}
                                            onClick={e => this.handleClickClose(e)}
                                            tooltip={{
                                                text: 'Close modal popup',
                                                on: 'left'
                                            }}
                                            icon={{
                                                size: 'small',
                                                background: 'none',
                                                element:
                                                    <IconClose
                                                        width={12}
                                                        height={12}
                                                        marginLeft={-6}
                                                        marginTop={-6}
                                                    />
                                            }}
                                        />
                                    )}

                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </ReactCSSTransitionGroup>
        );
    }
}

Modal.propTypes = propTypes;
Modal.defaultProps = defaultProps;

function mapStateToProps(state) {
    return {
        ...state.modal
    };
}

export default connect(mapStateToProps)(Modal);
