import React, { PropTypes } from 'react';
import s from './Section.css';
import Row from './Row';
import Col from './Col';

const propTypes = {
    className: PropTypes.string,
    title: PropTypes.string,
    subTitle: PropTypes.string,
    noSeparator: PropTypes.bool,
    headerElements: PropTypes.arrayOf(
        PropTypes.shape({
            element: PropTypes.element.isRequired,
            minWidth: PropTypes.number,
            maxWidth: PropTypes.number
        })
    )
};

const defaultProps = {
    className: '',
    title: '',
    subTitle: '',
    noSeparator: false,
    headerElements: []
};

class Section extends React.Component {
    constructor(props, context) {
        super(props, context);
    }

    render() {
        // Section class name
        let sectionClassName = 'section';
        sectionClassName += this.props.className !== '' ? ' ' + this.props.className : '';

        // Render
        return (
            <div ref="container" className={sectionClassName}>

                {this.props.noSeparator === false && (
                    <hr />
                )}

                <Row className={s.sectionHeader} removeGutter={true}>
                    {(this.props.title || this.props.subTitle) && (
                        <Col className={s.sectionTitle}>
                            <h3>
                                <strong>{this.props.title}</strong>
                                {(this.props.title && this.props.subTitle) && (
                                    <em> — </em>
                                )}
                                <span>{this.props.subTitle + ':'}</span>
                            </h3>
                        </Col>
                    )}

                    {(this.props.headerElements.length > 0) && (
                        <Col className={s.sectionElements}>
                            <Row removeGutter={true}>
                                {this.props.headerElements.map((el, index) => {
                                    if (el !== null) {
                                        return (
                                            <Col
                                                key={index}
                                                minWidth={typeof el.minWidth !== 'undefined' ? el.minWidth : null}
                                                maxWidth={typeof el.maxWidth !== 'undefined' ? el.maxWidth : null}
                                            >
                                                {el.element}
                                            </Col>
                                        );
                                    } else {
                                        return null;
                                    }
                                })}
                            </Row>
                        </Col>
                    )}

                </Row>

                {typeof this.props.children !== 'undefined' && (
                    <div className={s.sectionInner}>
                        {this.props.children}
                    </div>
                )}

            </div>
        );
    }
}

Section.propTypes = propTypes;
Section.defaultProps = defaultProps;

export default Section;
