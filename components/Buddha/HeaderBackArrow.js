import React, { PropTypes } from 'react';
import history from './../../core/history';
import Button from './../Button/Button';
import IconArrowLeftYellow from './../Icons/IconArrowLeftYellow';

const propTypes = {
    label: PropTypes.string,
    to: PropTypes.string
};

const defaultProps = {
    label: 'Back',
    to: null
};

export default class HeaderBackArrow extends React.Component {
    constructor(props, context) {
        super(props, context);
    }

    handleClick(e) {
        e.preventDefault();

        if (this.props.to) {
            history.push(this.props.to);
        } else {
            history.goBack();
        }
    }

    render() {
        return (
            <Button
                onClick={e => this.handleClick(e)}
                label={{
                    text: this.props.label,
                    color: 'white',
                    size: 'large',
                    onLeft: false
                }}
                icon={{
                    size: 'small',
                    background: 'none-alt',
                    element:
                        <IconArrowLeftYellow
                            width={15}
                            marginLeft={-7}
                            height={11}
                            marginTop={-5}
                        />
                }}
            />
        );
    };
}

HeaderBackArrow.propTypes = propTypes;
HeaderBackArrow.defaultProps = defaultProps;
