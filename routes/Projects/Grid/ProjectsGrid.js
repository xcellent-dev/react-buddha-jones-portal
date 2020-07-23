import React from 'react';
import { connect } from 'react-redux';
import { debounce } from 'lodash';
import * as actions from './../../../actions/ActionTypes';
import history from './../../../core/history';
import * as API from './../../../actions/api';
import s from './ProjectsGrid.css';
import { printDateAsDateStringWithTime } from './../../../helpers/date';
import { padWithCharacter } from './../../../helpers/text';
import Layout from './../../../components/Layout/Layout';
import Section from './../../../components/Section/Section';
import Row from './../../../components/Section/Row';
import Col from './../../../components/Section/Col';
import Paragraph from './../../../components/Content/Paragraph';
import Person from './../../../components/Buddha/Person';
import Button from './../../../components/Button/Button';
import ClientsFilter from './../../../components/Buddha/ClientsFilter';
import Input from './../../../components/Form/Input';
import Pagination from './../../../components/Pagination/Pagination';
import IconArrowRight from './../../../components/Icons/IconArrowRight';
import IconPlusWhite from './../../../components/Icons/IconPlusWhite';
import IconSearchLoupe from './../../../components/Icons/IconSearchLoupe';
import LoadingShade from './../../../components/Loaders/LoadingShade';
import LoadingSpinner from './../../../components/Loaders/LoadingSpinner';

class PageProjectsGrid extends React.Component {
    constructor(props, context) {
        super(props, context);

        this.delayedWindowResize = debounce(function(e) {
            this.windowResizeDebounced(e);
        }, 256);

        this.fetchProjects = debounce(this.fetchProjects, 300);

        this.openEvents = {
            window: []
        };

        this.state = {
            boardWidth: 720,
            pagination: {
                currentPage: 1,
                countPerPage: 10,
                countTotal: 0
            },
            filter: {
                query: '',
                client: { value: '', label: 'All' }
            },
            loadingProjects: false,
            projects: []
        };
    }

    componentDidMount() {
        // Scroll to top
        window.scrollTo(0, 0);

        // Dispatch header
        this.props.dispatch({
            type: actions.HEADER_SET_ALL,
            payload: {
                title: 'Projects board',
                elements: [
                    React.createElement(Button, {
                        onClick: e => this.handleDefineNewProjectClick(e),
                        label: {
                            text: 'Define new project',
                            color: 'white',
                            size: 'large',
                            onLeft: true
                        },
                        icon: {
                            element: React.createElement(IconPlusWhite, {
                                width: 12,
                                height: 12,
                                marginTop: -6,
                                marginLeft: -6
                            }),
                            size: 'small',
                            background: 'yellow'
                        }
                    })
                ]
            }
        });

        // Create window resize event
        const windowResize = this.windowResize.bind(this);
        this.openEvents.window.push({ type: 'resize', handler: windowResize });
        window.addEventListener('resize', windowResize, false);

        // Update state wth board width
        if (typeof this.refs.board !== 'undefined') {
            this.setState(
                Object.assign({}, this.state, {
                    boardWidth: this.refs.board.offsetWidth
                })
            );
        }

        this.fetchProjects();
    }

    fetchProjects() {
        this.setState({
            loadingProjects: true
        });

        API.getRaw(API.PROJECT, {
            sort: 'last_update_date',
            customer_id: this.state.filter.client.value,
            offset: (this.state.pagination.currentPage - 1) * this.state.pagination.countPerPage,
            length: this.state.pagination.countPerPage,
            search: this.state.filter.query
        }).then(response => {
            const projects = response.data.map(project => {
                const { id, projectName, customerId, customerName, campaign, lastUpdatedAt, lastUpdateUser, comment } = project;

                return {
                    id,
                    name: projectName,
                    clientId: customerId,
                    client: customerName,
                    campaigns: campaign.map(c => {
                        return {
                            id: c.campaignId,
                            name: c.campaignName
                        };
                    }),
                    lastUpdate: {
                        date: new Date(lastUpdatedAt),
                        user: {
                            id: lastUpdateUser.userId,
                            name: lastUpdateUser.name,
                            image: lastUpdateUser.image
                        }
                    },
                    activity: {
                        count: comment.count,
                        unread: comment.count === comment.unread
                    }
                };
            });

            this.setState({
                loadingProjects: false,
                pagination: Object.assign({}, this.state.pagination, {
                    countTotal: response.total_count,
                }),
                projects
            });
        })
        .catch(error => {
            this.setState({
                loadingProjects: false
            });
        });
    }

    componentWillUnmount() {
        // Remove window events
        this.openEvents.window.map(evt => {
            window.removeEventListener(evt.type, evt.handler);
        });
    }

    windowResize(e) {
        this.delayedWindowResize(e);
    }

    windowResizeDebounced(e) {
        if (typeof this.refs.board !== 'undefined') {
            const board = this.refs.board;
            const boardWidth = board.offsetWidth;
            if (boardWidth !== this.state.boardWidth) {
                this.setState(
                    Object.assign({}, this.state, {
                        boardWidth: boardWidth
                    })
                );
            }
        }
    }

    handleClientFilterChange(selected) {
        if (typeof selected !== 'undefined' && typeof selected.value !== 'undefined') {
            this.setState({
                filter: Object.assign({}, this.state.filter, {
                    client: selected
                }),
                pagination: Object.assign({}, this.state.pagination, {
                    currentPage: 1
                })
            }, () => {
                // Close client filter dropdown
                if (this.refs.clientFilter !== undefined
                    && this.refs.clientFilter.refs.clientsFilterDropdown !== undefined
                    && this.refs.clientFilter.refs.clientsFilterDropdown.closeDropdown !== undefined) {
                        this.refs.clientFilter.refs.clientsFilterDropdown.closeDropdown();
                }

                this.fetchProjects();
            });
        }
    }

    handleProjectNameSearchChange(e) {
        this.setState({
            pagination: Object.assign({}, this.state.pagination, {
                currentPage: 1
            }),
            filter: Object.assign({}, this.state.filter, {
                query: e.target.value
            })
        }, () => {
            this.fetchProjects();
        });
    }

    handleProjectsPageChange(newPage) {
        this.setState({
            pagination: Object.assign({}, this.state.pagination, {
                currentPage: newPage
            })
        }, () => {
            this.fetchProjects();
        });
    }

    handleDefineNewProjectClick(e) {
        history.push('/projects/new');
    }

    handleProjectClick(clientId, clientName, projectId, projectName) {
        if (
            typeof clientId !== 'undefined' &&
            typeof clientName !== 'undefined' &&
            typeof projectId !== 'undefined' &&
            typeof projectName !== 'undefined'
        ) {
            let url = '/project';
            url += '/' + clientId.toString();
            url += '/' + encodeURIComponent(clientName);
            url += '/' + projectId.toString();
            url += '/' + encodeURIComponent(projectName);
            history.push(url);
        }
    }

    render() {
        // Project columns
        let column1 = [];
        let column2 = [];
        if (this.state.boardWidth >= 720) {
            for (let i = 0; i < this.state.projects.length; i++) {
                const project =
                    <ProjectCard
                        key={`project-${this.state.projects[i].id}`}
                        project={this.state.projects[i]}
                        handleProjectClick={this.handleProjectClick}
                    />;
                if (i % 2 === 0) {
                    column1.push(project);
                } else {
                    column2.push(project);
                }
            }
        } else {
            for (let i = 0; i < this.state.projects.length; i++) {
                column1.push(
                    <Col key={`project-${this.state.projects[i].id}`}>
                        <ProjectCard
                            project={this.state.projects[i]}
                            handleProjectClick={this.handleProjectClick}
                        />
                    </Col>
                );
            }
        }

        // Render
        return (
            <Layout>

                <Section
                    title="All projects"
                    noSeparator={true}
                    headerElements={[
                        {
                            element:
                                <ClientsFilter
                                    ref="clientFilter"
                                    onChange={e => this.handleClientFilterChange(e)}
                                    truncuateLabelTo={64}
                                />
                        },
                        {
                            element: React.createElement(Input, {
                                onChange: e => this.handleProjectNameSearchChange(e),
                                label: 'Search project by name...',
                                icon: React.createElement(IconSearchLoupe, {
                                    width: 13,
                                    height: 13,
                                    marginTop: -6
                                }),
                                width: 320
                            })
                        }
                    ]}
                >

                    {(() => {
                        if (column2.length > 0) {
                            return (
                                <div ref="board" className={s.board}>
                                    <Row>
                                        <Col size={6}>
                                            {column1}
                                        </Col>
                                        <Col size={6}>
                                            {column2}
                                        </Col>
                                    </Row>
                                </div>
                            );
                        } else {
                            return (
                                <div ref="board" className={s.board}>
                                    <Row justifyContent="center">
                                        <Col size={6}>
                                            {column1}
                                        </Col>
                                    </Row>
                                </div>
                            );
                        }
                    })()}

                    <Pagination
                        className={s.pagination}
                        onPageChange={e => this.handleProjectsPageChange(e)}
                        currentPage={this.state.pagination.currentPage}
                        countPerPage={this.state.pagination.countPerPage}
                        countTotal={this.state.pagination.countTotal}
                    />

                    {(() => {
                        if (this.state.loadingProjects === true) {
                            return (
                                <LoadingShade background="rgba(247, 247, 247, 0.9)">
                                    <LoadingSpinner size={64} color="#5A4D3F" />
                                </LoadingShade>
                            );
                        }
                    })()}
                </Section>

            </Layout>
        );
    }
}

function ProjectCard(props) {
    return (
        <div className={s.project}>
            <Row className={s.lastUpdate} removeMargins={true}>
                <Col className={s.dateCol}>
                    <Paragraph><span>Last update</span>{printDateAsDateStringWithTime(props.project.lastUpdate.date)}</Paragraph>
                </Col>
                <Col className={s.nameCol}>
                    <Person
                        align="right"
                        nameOnLeft={true}
                        name={props.project.lastUpdate.user.name}
                        image={props.project.lastUpdate.user.image}
                    />
                </Col>
            </Row>
            <Row className={s.title} removeMargins={true}>
                <Col onClick={e => props.handleProjectClick(
                    props.project.clientId,
                    props.project.client,
                    props.project.id,
                    props.project.name
                )}>
                    <h3 className={s.name}>{props.project.name}</h3>
                    <h4 className={s.client}>{props.project.client}</h4>
                </Col>
            </Row>
            <Row className={s.campaigns} doWrap={true} removeMargins={true}>
                {props.project.campaigns.map((campaign) => {
                    return (
                        <Col key={`project-${props.project.id}-campaign-${campaign.id}`} size={0}>{campaign.name}</Col>
                    );
                })}
            </Row>
            <Row className={s.summary} removeMargins={true}>
                <Col className={props.project.activity.unread === false ? s.activity : s.activity + ' ' + s.unread}>
                    <Paragraph>{padWithCharacter(props.project.activity.count.toString(), 3, '0', true)}</Paragraph>
                </Col>
                <Col className={s.action}>
                    <Button
                        onClick={e => props.handleProjectClick(
                            props.project.clientId,
                            props.project.client,
                            props.project.id,
                            props.project.name
                        )}
                        float="right"
                        label={{
                            text: 'Details',
                            size: 'small',
                            color: 'blue',
                            onLeft: true
                        }}
                        icon={{
                            element: React.createElement(IconArrowRight, {
                                width: 15,
                                height: 11,
                                marginTop: -5,
                                marginLeft: -7
                            }, null),
                            size: 'small',
                            background: 'none'
                        }}
                    />
                </Col>
            </Row>
        </div>
    );
}

function mapStateToProps(state) {
    return {
        header: state.header,
        notifications: state.notifications
    };
}

export default connect(mapStateToProps)(PageProjectsGrid);
