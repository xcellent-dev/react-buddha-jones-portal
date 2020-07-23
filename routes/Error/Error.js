import React from 'react';
import { connect } from 'react-redux';
import * as actions from './../../actions/ActionTypes';
import history from '../../core/history';
import s from './Error.css';
import Layout from './../../components/Layout/Layout';
import Row from './../../components/Section/Row';
import Col from './../../components/Section/Col';
import Button from './../../components/Button/Button';
import IconArrowLeftYellow from './../../components/Icons/IconArrowLeftYellow';

class ErrorPage extends React.Component {
    constructor(props, context) {
        super(props, context);

        console.error(typeof this.props.error !== 'undefined' && this.props.error ? this.props.error : 'Error');
    }

    componentDidMount() {
        // Set header
        this.props.dispatch({
            type: actions.HEADER_SET_ALL,
            payload: {
                'title': this.props.error && this.props.error.status === 404 ? 'Page not found' : 'Error',
                'elements': [
                    React.createElement(Button, {
                        onClick: this.goBack,
                        label: {
                            text: 'Go back',
                            color: 'white',
                            size: 'large',
                            onLeft: false
                        },
                        icon: {
                            element: React.createElement(IconArrowLeftYellow, {
                                width: 15,
                                height: 11,
                                marginTop: -5,
                                marginLeft: -7
                            }),
                            size: 'small',
                            background: 'none-alt'
                        }
                    }, null),
                    React.createElement(Button, {
                        onClick: this.goToDashboard,
                        label: {
                            text: 'Go to dashboard',
                            color: 'white',
                            size: 'large',
                            onLeft: false
                        },
                        icon: {
                            element: React.createElement(IconArrowLeftYellow, {
                                width: 15,
                                height: 11,
                                marginTop: -5,
                                marginLeft: -7
                            }),
                            size: 'small',
                            background: 'none-alt'
                        }
                    }, null)
                ]
            }
        });
    }

    componentWillUmount() {
        // Remove header content
        this.props.dispatch({
            type: actions.HEADER_RESET
        });
    }

    goBack(e) {
        e.preventDefault();
        history.goBack();
    }

    goToDashboard(e) {
        e.preventDefault();
        history.push('/');
    }

    render() {
        const [code, title] = this.props.error && this.props.error.status === 404 ?
            ['404', 'Page not found'] :
            ['Error', 'Something went wrong'];

        return (
            <Layout>
                <Row>
                    <Col>
                        <div className={s.errorPage}>
                            <h1 className={s.errorHeadline}>
                                {code}
                            </h1>
                            <p className={s.errorDescription}>
                                {code === '404' ?
                                    'The page you are looking for does not exist.' :
                                    'Unexpected error has occurred. We will inspect it.'
                                }
                            </p>
                        </div>
                    </Col>
                </Row>
            </Layout>
        );
    }
}

ErrorPage.propTypes = {
    error: React.PropTypes.object
};


function mapStateToProps(state) {
    return {
        header: state.header
    };
}

export default connect(mapStateToProps)(ErrorPage);
