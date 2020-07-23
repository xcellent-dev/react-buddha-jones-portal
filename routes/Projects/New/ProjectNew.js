// Libraries
import React from 'react';
import { connect } from 'react-redux';
import * as actions from './../../../actions/ActionTypes';
import { actionAlertNotify } from './../../../actions/Notifications';
import * as API from './../../../actions/api';
import history from './../../../core/history';

// Components
import Layout from './../../../components/Layout/Layout';
import Section from './../../../components/Section/Section';
import Row from './../../../components/Section/Row';
import Col from './../../../components/Section/Col';
import Button from './../../../components/Button/Button';
import ClientsFilter from './../../../components/Buddha/ClientsFilter';
import Input from './../../../components/Form/Input';
import TextArea from './../../../components/Form/TextArea';
import Pagination from './../../../components/Pagination/Pagination';
import IconArrowLeftYellow from './../../../components/Icons/IconArrowLeftYellow';
import IconSendSubmit from './../../../components/Icons/IconSendSubmit';

// Styles
import s from './ProjectNew.css';

class PageProjectNew extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            client: undefined,
            projectName: '',
            notes: '',
            errorMessage: '',
            isUploading: false
        };
    }

    componentDidMount() {
        // Scroll to top
        window.scrollTo(0, 0);

        // Load page header
        this.loadPageHeader();
    }

    loadPageHeader() {
        // Dispatch header
        this.props.dispatch({
            type: actions.HEADER_SET_ALL,
            payload: {
                title: 'Define new project',
                elements: [
                    <Button
                        onClick={e => this.handleBackToBoardNavigation(e)}
                        label={{
                            text: 'Back to projects board',
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
                                    height={11}
                                    marginTop={-5}
                                    marginLeft={-7}
                                />
                        }}
                    />
                ]
            }
        });
    }

    handleBackToBoardNavigation(e) {
        e.preventDefault();
        history.push('/projects');
    }

    handleClientFilterChange(e) {
        this.setState({
            client: e,
            errorMessage: ''
        });
    }

    handleProjectNameChange(e) {
        this.setState({
            projectName: e.target.value,
            errorMessage: ''
        });
    }

    handleNotesChange(e) {
        this.setState({
            notes: e.target.value,
            errorMessage: ''
        });
    }

    handleSubmit(e) {
        if (this.state.client === undefined || this.state.projectName === '') {
            this.props.dispatch(
                actionAlertNotify(
                    'Title and customer are required',
                    null,
                    'error',
                    false,
                    true,
                    false,
                    15
                )
            );
        } else {
            this.setState({
                isUploading: true
            });

            API.post(API.PROJECT, API.makePostData({
                name: this.state.projectName,
                customer_id: this.state.client.value,
                notes: this.state.notes
            })).then(response => {
                if (response.status === 1) {
                    history.push(
                        '/project/' + this.state.client.value +
                        '/' + this.state.client.label +
                        '/' + response.data.project_id +
                        '/' + this.state.projectName
                    );
                } else {
                    this.setState({
                        isUploading: false,
                        errorMessage: 'Unexpected Error'
                    });
                }
            }).catch(error => {
                this.setState({
                    isUploading: false,
                    errorMessage: re
                });
            });
        }
    }

    render() {
        // Submit label
        const submitButtonLabel = this.state.isUploading
            ? 'Defining...'
            : 'Define new project';

        // Render
        return (
            <Layout>
                <Section noSeparator={true}>
                    <Row>
                        <Col size={8}>
                            <Input
                                className={s.nameContainer}
                                fieldClassName={s.name}
                                onChange={e => this.handleProjectNameChange(e)}
                                autoFocus={true}
                                value={this.state.projectName}
                                label="Title..."
                                type="text"
                            />
                        </Col>
                        <Col size={4}>
                            <ClientsFilter
                                className={s.client}
                                align="right"
                                maxWidth={640}
                                onChange={(e) => this.handleClientFilterChange(e)}
                                label="Pick customer"
                                truncuateLabelTo={96}
                            />
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            <TextArea
                                className={s.notesContainer}
                                fieldClassName={s.notes}
                                value={this.state.notes}
                                onChange={e => this.handleNotesChange(e)}
                                label="Description..."
                                width={1152}
                                height={128}
                            />
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            <br />
                            <Button
                                onClick={e => this.handleSubmit(e)}
                                float="right"
                                label={{
                                    text: submitButtonLabel,
                                    color: 'orange',
                                    size: 'small',
                                    onLeft: true
                                }}
                                icon={{
                                    size: 'large',
                                    background: 'orange',
                                    element:
                                        <IconSendSubmit
                                            width={25}
                                            height={26}
                                            marginLeft={-13}
                                            marginTop={-13}
                                        />
                                }}
                            />
                        </Col>
                    </Row>
                </Section>
            </Layout>
        );
    }
}

function mapStateToProps(state) {
    return {
        header: state.header,
        notifications: state.notifications
    };
}

export default connect(mapStateToProps)(PageProjectNew);
