import React, { PropTypes } from 'react';
import Toggle from './../Form/Toggle';
import IconAudioVisual from './../../components/Icons/IconAudioVisual';
import IconGraphics from './../../components/Icons/IconGraphics';

const propTypes = {
    onChange: PropTypes.func.isRequired,
    isWhite: PropTypes.bool,
    isLarge: PropTypes.bool,
    defaultToGraphics: PropTypes.bool,
    disabled: PropTypes.bool
};

const defaultProps = {
    isWhite: true,
    isLarge: true,
    defaultToGraphics: false,
    disabled: false
};

class GraphicsAudioVisualToggle extends React.Component {
    render() {
        return (
            <Toggle
                onChange={this.props.onChange}
                defaultRight={!this.props.defaultToGraphics}
                isWhite={this.props.isWhite}
                isLarge={this.props.isLarge}
                disabled={this.props.disabled}
                left={{
                    label: 'Graphics',
                    value: 'Designer',
                    icon:
                        <IconGraphics
                            width={11}
                            height={12}
                        />
                }}
                right={{
                    label: 'Audio/Visual',
                    value: 'Editor',
                    icon:
                        <IconAudioVisual
                            width={11}
                            height={11}
                        />
                }}
            />
        );
    }
}

GraphicsAudioVisualToggle.propTypes = propTypes;
GraphicsAudioVisualToggle.defaultProps = defaultProps;

export default GraphicsAudioVisualToggle;
