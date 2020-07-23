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
    onClose: PropTypes.func,
    show: PropTypes.bool,
    title: PropTypes.string,
    content: PropTypes.element,
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
    onClose: null,
    show: false,
    title: null,
    content: null,
    type: 'default',
    closeButton: false,
    actions: []
};

class ModalInline extends Component {
    constructor(props, context) {
        super(props, context);

        this.state = {
            show: false
        };
    }

    componentDidMount() {
        if (this.props.show) {
            this.setState({
                show: true
            });
        }
    }

    componentWillReceiveProps(nextProps) {
        const { props } = this;

        if (props.show !== nextProps.show && nextProps.show !== this.state.show) {
            this.setState({
                show: nextProps.show
            });
        }
    }

    handleClickAction(closeOnClick, onClick) {
        if (closeOnClick) {
            this.setState({
                show: false
            });

            if (this.props.onClose) {
                this.props.onClose();
            }
        }

        if (typeof onClick !== 'undefined' && onClick !== null) {
            onClick();
        }
    }

    handleClickClose() {
        this.setState({
            show: false
        });

        if (this.props.onClose) {
            this.props.onClose();
        }
    }

    // Render
    render() {
        return (
            <ReactCSSTransitionGroup
                component="div"
                transitionName="modal"
                transitionAppear={true}
                transitionAppearTimeout={1000}
                transitionEnter={true}
                transitionEnterTimeout={1000}
                transitionLeave={true}
                transitionLeaveTimeout={500}
            >
                {(this.state.show) && (
                    <div key="modal-inline" className={s.modal}>
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

                                    {(this.props.content) && (
                                        <div className={s.content}>
                                            {this.props.content}
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

ModalInline.propTypes = propTypes;
ModalInline.defaultProps = defaultProps;

export default ModalInline;
