import React, { PropTypes } from 'react';
import s from './LoadingBar.css';

const propTypes = {
    background: PropTypes.string,
    width: PropTypes.number,
    size: PropTypes.oneOf(['default', 'big']),
    height: PropTypes.number,
    opacity: PropTypes.number,
    progress: PropTypes.number,
    showProgress: PropTypes.bool,
    label: PropTypes.string
};

const defaultProps = {
    background: '#EEEAE7',
    width: 0,
    size: 'default',
    opacity: 0.3,
    progress: 100,
    showProgress: false,
    label: ''
};

class LoadingBar extends React.Component {
    constructor(props, context) {
        super(props, context);

        this.exists = true;

        this.state = {
            visible: false
        };
    }

    componentDidMount() {
        // Show spinner
        setTimeout(() => {
            if (typeof this.exists !== typeof undefined && this.exists) {
                this.setState({
                    visible: true
                });
            }
        }, 128);
    }

    componentWillUnmount() {
        this.exists = false;
    }

    render() {
        // Container class name
        let containerClassName = s.container;
        containerClassName += this.state.visible === true ? ' ' + s.visible : '';

        // Size
        switch (this.props.size) {
            case 'big':
                containerClassName += ' ' + s.sizeBig;
                break;

            default:
                containerClassName += ' ' + s.sizeNormal;
                break;
        }

        // Container style
        const containerStyle = {
            width: this.props.width > 0 ? this.props.width + 'px' : null,
            background: this.props.background
        };

        // Progress class name
        const progressClassName = s.progress;

        // Progress style
        const progresStyle = {
            width: this.props.progress + '%'
        };

        // Bar class name
        const barClassName = s.bar;

        // Bar style
        const barStyle = {
            opacity: this.props.opacity
        };

        // Render
        return (
            <div className={containerClassName} style={containerStyle}>
                <div className={progressClassName} style={progresStyle}>
                    <div className={barClassName} style={barStyle}></div>
                </div>
                {(() => {
                    if (this.props.showProgress || this.props.label) {
                        // Prepare label
                        let label = '';
                        label += this.props.label ? this.props.label : '';
                        if (this.props.showProgress) {
                            if (label !== '') {
                                label += ' ';
                            }
                            label += this.props.progress + '%';
                        }

                        // Render label
                        return (
                            <div className={s.label}>
                                <p>{label}</p>
                            </div>
                        );
                    }
                })()}
            </div>
        );
    }
}

LoadingBar.propsTypes = propTypes;
LoadingBar.defaultProps = defaultProps;

export default LoadingBar;
