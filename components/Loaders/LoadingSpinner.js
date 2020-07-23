import React, { PropTypes } from 'react';
import s from './LoadingSpinner.css';

const propTypes = {
    className: PropTypes.string,
    color: PropTypes.string,
    size: PropTypes.number
};

const defaultProps = {
    className: '',
    color: '#0768D8',
    size: 64
};

class LoadingSpinner extends React.Component {
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

    polarToCartesian(centerX, centerY, radius, angleInDegrees) {
        const angleInRadians = (angleInDegrees-90) * Math.PI / 180.0;

        return {
            x: centerX + (radius * Math.cos(angleInRadians)),
            y: centerY + (radius * Math.sin(angleInRadians))
        };
    }

    describeArc(x, y, radius, startAngle, endAngle) {
        const start = this.polarToCartesian(x, y, radius, endAngle);
        const end = this.polarToCartesian(x, y, radius, startAngle);

        const largeArcFlag = endAngle - startAngle <= 180 ? '0' : '1';

        const d = [
            'M', start.x, start.y,
            'A', radius, radius, 0, largeArcFlag, 0, end.x, end.y
        ].join(' ');

        return d;
    }

    render() {
        // Calculations
        const { size, color } = this.props;
        const sizeHalf = size / 2;
        const strokeWidth = size / 10;
        const arcRadius = sizeHalf - strokeWidth;

        // Spinner class name
        let spinnerClassName = s.spinner;
        spinnerClassName += this.props.className ? ' ' + this.props.className : '';
        spinnerClassName += this.state.visible === true ? ' ' + s.visible : '';

        // Render
        return (
            <svg
                ref={node => this.canvas = node}
                className={spinnerClassName}
                width={this.props.size}
                height={this.props.size}
            >
                <path
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    stroke={color}
                    strokeWidth={strokeWidth}
                    d={this.describeArc(sizeHalf, sizeHalf, arcRadius, -45, 45)}
                />
                <circle
                    cx={sizeHalf}
                    cy={sizeHalf}
                    r={arcRadius}
                    fill="none"
                    stroke={color}
                    strokeWidth={strokeWidth}
                    opacity={0.2}
                />
            </svg>
        );
    }
}

LoadingSpinner.propsTypes = propTypes;
LoadingSpinner.defaultProps = defaultProps;

export default LoadingSpinner;
