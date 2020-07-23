import React, { PropTypes } from 'react';
import s from './Icon.css';

const propTypes = {
    width: PropTypes.number,
    height: PropTypes.number,
    marginLeft: PropTypes.number,
    marginLeftAuto: PropTypes.bool,
    marginRight: PropTypes.number,
    marginRightAuto: PropTypes.bool,
    marginTop: PropTypes.number,
    transform: PropTypes.string
};

const defaultProps = {
    width: null,
    height: null,
    marginLeft: null,
    marginLeftAuto: false,
    marginRight: null,
    marginRightAuto: false,
    marginTop: null,
    marginTopAuto: false,
    marginBottom: null,
    marginBottomAuto: false,
    transform: null
};

class Icon extends React.Component {
    constructor(props, context) {
        super(props, context);
    }

    render() {
        return (
            <i
                className={'icon ' + (this.constructor.displayName || this.constructor.name || '')}
                style={{
                    backgroundSize: this.props.width && this.props.height
                        ? this.props.width + 'px ' + this.props.height + 'px' :
                        null,
                    width: this.props.width
                        ? this.props.width + 'px'
                        : null,
                    height: this.props.height
                        ? this.props.height + 'px'
                        : null,
                    marginLeft: this.props.marginLeftAuto
                        ? 'auto'
                        : this.props.marginLeft
                            ? this.props.marginLeft + 'px'
                            : null,
                    marginRight: this.props.marginRightAuto
                        ? 'auto'
                        : this.props.marginRight
                            ? this.props.marginRight + 'px'
                            : null,
                    marginTop: this.props.marginTopAuto
                        ? 'auto'
                        : this.props.marginTop
                            ? this.props.marginTop + 'px'
                            : null,
                    marginBottom: this.props.marginBottomAuto
                        ? 'auto'
                        : this.props.marginBottom
                            ? this.props.marginBottom + 'px'
                            : null,
                    transform: this.props.transform
                        ? this.props.transform
                        : null
                }}
            >
            </i>
        );
    }
}

Icon.propTypes = propTypes;
Icon.defaultProps = defaultProps;

export default Icon;
