import React from 'react';
import { connect } from 'react-redux';
import Row from './../Section/Row';
import Col from './../Section/Col';
import s from './Header.css';

class Header extends React.Component {
    constructor(props, context) {
        super(props, context);
    }

    render() {
        return (
            <div className={s.header}>
                {(() => {
                    if (
                        (this.props.header.title !== null && this.props.header.title !== '')
                        ||
                        (this.props.header.subTitle !== null && this.props.header.subTitle !== '')
                    ) {
                        return (
                            <Col className={s.headerText}>
                                {(() => {
                                    if (this.props.header.title !== null && this.props.header.title !== '') {
                                        // Prepare title
                                        let titleElement = React.createElement('h1', {
                                            className: s.headerTitle
                                        }, [
                                                this.props.header.preTitleSpan !== null && this.props.header.preTitleSpan !== ''
                                                    ? React.createElement('span', { key: 0 }, this.props.header.preTitleSpan)
                                                    : undefined,
                                                this.props.header.title
                                        ]);

                                        // Render
                                        return titleElement;
                                    }
                                })()}
                                {(() => {
                                    if (this.props.header.subTitle !== null && this.props.header.subTitle !== '') {
                                        // Prepare sub title
                                        let subTitleElement = React.createElement('h3', {
                                            className: s.headerSubTitle
                                        }, [
                                                this.props.header.preSubTitleSpan !== null && this.props.header.preSubTitleSpan !== ''
                                                    ? React.createElement('span', { key: 0 }, this.props.header.preSubTitleSpan)
                                                    : undefined,
                                                this.props.header.subTitle
                                        ]);

                                        // Render
                                        return subTitleElement;
                                    }
                                })()}
                            </Col>
                        );
                    }
                })()}
                {(() => {
                    if (typeof this.props.header.elements !== 'undefined' && this.props.header.elements && this.props.header.elements.length > 0) {
                        return (
                            <Col size={1} className={s.headerElements}>
                                <Row removeGutter={true}>
                                    {this.props.header.elements.map((element, index) => {
                                        return (
                                            <Col key={index}>
                                                {element}
                                            </Col>
                                        );
                                    })}
                                </Row>
                            </Col>
                        );
                    }
                })()}
            </div>
        );
    }
}

function mapStateToProps(state) {
    return {
        header: state.header
    };
}

export default connect(mapStateToProps)(Header);
