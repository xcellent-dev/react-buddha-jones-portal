import React from 'react';
import s from './HeaderSection.css';
import Row from './../Section/Row';
import Col from './../Section/Col';

class HeaderSection extends React.Component {
    constructor(props, context) {
        super(props, context);
    }

    render() {
        // Section class name
        let headerSectionClassName = 'headerSection';
        headerSectionClassName += typeof this.props.className !== 'undefined' && this.props.className !== null ? ' ' + this.props.className : '';
        headerSectionClassName += this.props.marginBottom === true ? ' ' + s.margin : '';

        // Render
        return (
            <div className={headerSectionClassName}>
                <hr className={s.separator} />
                <Row className={s.contentRow} removeGutter={true}>
                    <Col>
                        {this.props.children}
                    </Col>
                </Row>
            </div>
        );
    }
}

HeaderSection.propTypes = {
    className: React.PropTypes.string,
    marginBottom: React.PropTypes.bool
};

HeaderSection.defaultProps = {
    marginBottom: false
};

export default HeaderSection;
