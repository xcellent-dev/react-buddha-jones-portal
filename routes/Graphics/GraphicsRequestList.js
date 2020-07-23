import React from 'react';
import { connect } from 'react-redux';
import { debounce, toNumber } from 'lodash';
import * as API from './../../actions/api';
import * as actions from './../../actions/ActionTypes';
import history from './../../core/history';
import Layout from './../../components/Layout/Layout';
import Section from './../../components/Section/Section';
import Row from './../../components/Section/Row';
import Col from './../../components/Section/Col';
import Table from './../../components/Table/Table';
import TableRow from './../../components/Table/TableRow';
import TableCell from './../../components/Table/TableCell';
import Pagination from './../../components/Pagination/Pagination';
import Paragraph from './../../components/Content/Paragraph';
import Money from './../../components/Content/Money';
import Number from './../../components/Content/Number';
import Date from './../../components/Content/Date';
import Button from './../../components/Button/Button';
import Input from './../../components/Form/Input';
import DropdownContainer from './../../components/Form/DropdownContainer';
import OptionsList from './../../components/Form/OptionsList';
import ClientsFilter from './../../components/Buddha/ClientsFilter';
import IconArrowRight from './../../components/Icons/IconArrowRight';
import IconSearchLoupe from './../../components/Icons/IconSearchLoupe';
import IconPlusWhite from './../../components/Icons/IconPlusWhite';
import LoadingShade from './../../components/Loaders/LoadingShade';
import LoadingSpinner from './../../components/Loaders/LoadingSpinner';

const REQUEST_PER_PAGE = 10;

class PageGraphicsRequestList extends React.Component {
    constructor(props, context) {
        super(props, context);

        this.state = {
            requestsFilter: {
                sort: 'ASC',
                search: '',
                //status: { value: '1', label: 'All' },
                client: { value: '', label: 'All' },
                clientSearch: ''
            },
            requests: [],
            currentPage: typeof this.props.requestPage !== 'undefined' ? toNumber(this.props.requestPage) : 1,
            totalCount: 0,
            isLoadingRequest: false
        };

        // Binding
        this.changeRequestsTablePage = this.changeRequestsTablePage.bind(this);
    }

    componentDidMount() {
        // Scroll to top
        window.scrollTo(0, 0);

        // Dispatch header
        this.props.dispatch({
            type: actions.HEADER_SET_ALL,
            payload: {
                title: 'All graphics requests',
                elements: [
                    <Button
                        onClick={e => this.handleCreateNewEstimateClick(e)}
                        label={{
                            text: 'Create new graphics request',
                            color: 'white',
                            size: 'large',
                            onLeft: true
                        }}
                        icon={{
                            background: 'yellow',
                            size: 'small',
                            element:
                                <IconPlusWhite
                                    width={12}
                                    height={12}
                                    marginTop={-6}
                                    marginLeft={-6}
                                />
                        }}
                    />
                ]
            }
        });

        this.fetchRequests();
    }

    componentWillUmount() {
        // Remove header
        this.props.dispatch({
            type: actions.HEADER_RESET
        });
    }

    changeRequestsTablePage(newPage) {
        history.push('/graphics/' + newPage);
        this.setState({
            currentPage: newPage
        }, () => {
            this.fetchRequests();
        });
    }

    fetchRequests(resetOffset) {
        // Defaults
        resetOffset = typeof resetOffset !== 'undefined' ? resetOffset : false;

        // Show loading
        this.setState({
            isLoadingRequest: true,
            currentPage: resetOffset ? 1 : this.state.currentPage
        }, () => {
            // Request params
            const params = {
                offset: (this.state.currentPage - 1) * REQUEST_PER_PAGE,
                length: REQUEST_PER_PAGE,
                //status_id: this.state.requestsFilter.status.value,                
                sort: this.state.requestsFilter.sort
            };

            // Fetch
            API.getRaw(API.GRAPHICS_REQUEST, params)
                .then(response => {
                    let requests = response.data.map(request => {
                        return {
                            id:             request.id,                            
                            projectName:    request.projectName,
                            campaignName:   request.campaignName,
                            spotName:       request.spotName,
                            versionName:    request.versionName,
                            createdAt:      request.createdAt,
                            updatedAt:      typeof request.updatedAt !== 'undefined' ? request.updatedAt : null,
                            resolution:     request.resolution,
                            resolutionNote: request.resolutionNote,
                            note:           request.note,
                            status:         request.statusId
                        };
                    });
                    
                    this.setState({
                        totalCount: response.total_count,
                        requests: requests,
                        isLoadingRequest: false
                    });
                })
                .catch(error => {
                    console.log(error);
                    this.setState({
                        isLoadingRequest: false
                    });                    
                });
        });
    }

    handleCreateNewEstimateClick(e) {
        history.push('/graphic/graphics-request');
    }

    handleNavigationToRequest(requestId) {
        if (typeof requestId !== 'undefined') {
            history.push('/graphic/graphics-request/' + requestId + '/' + this.state.currentPage);
        }
    }

    render() {
        return (
            <Layout>
                <Row removeGutter={true}>
                    <Col>
                        <Section
                            title="Graphic requests"
                        >
                            <Table
                                header={
                                    [                                        
                                        { title: 'Project', align: 'left' },
                                        { title: 'Campaign', align: 'left' },
                                        { title: 'Spot', align: 'left' },
                                        { title: 'Resolution', align: 'right' },
                                        { title: 'Resolution note', align: 'right' },
                                        { title: 'Note', algin: 'right' },
                                        { title: 'Status', align: 'right' },
                                        { title: 'Action', align: 'right' }
                                    ]
                                }
                            >
                                {(() => {
                                    if (this.state.requests.length === 0) {
                                        return (
                                            <TableRow type="border">
                                                <TableCell colSpan={9} align="center">
                                                    <Paragraph>No request matches selected criteria</Paragraph>
                                                </TableCell>
                                            </TableRow>
                                        );
                                    } else {
                                        let requestsResultNodes = this.state.requests.map((request, index) => {
                                            // Render request table row
                                            return (
                                                <TableRow key={request.id}>
                                                    <TableCell>
                                                        <Paragraph>{request.projectName}</Paragraph>
                                                    </TableCell>
                                                    <TableCell>
                                                        <Paragraph>{request.campaignName}</Paragraph>
                                                    </TableCell>
                                                    <TableCell>
                                                        <Paragraph>{request.spotName}</Paragraph>
                                                    </TableCell>
                                                    <TableCell>
                                                        <Paragraph>{request.resolution}</Paragraph>
                                                    </TableCell>
                                                    <TableCell>
                                                        <Paragraph>{request.resolutionNote}</Paragraph>
                                                    </TableCell>
                                                    <TableCell>
                                                        <Paragraph>{request.note==='null'?'':request.note}</Paragraph>
                                                    </TableCell>
                                                    <TableCell>
                                                        <Paragraph>{request.status==='1'? 'Draft' : (request.status==='2'?'Approved':'Accepted')}</Paragraph>
                                                    </TableCell>
                                                    <TableCell align="right">
                                                        <Button
                                                            onClick={e => this.handleNavigationToRequest(request.id)}
                                                            float="right"
                                                            tooltip={{
                                                                text: request.status === '1' ? 'Edit request\'s draft' : 'Go to request',
                                                                on: 'left'
                                                            }}
                                                            icon={{
                                                                size: 'small',
                                                                background: 'none',
                                                                element:
                                                                    <IconArrowRight
                                                                        width={15}
                                                                        marginLeft={-7}
                                                                        height={11}
                                                                        marginTop={-5}
                                                                    />
                                                            }}
                                                        />
                                                    </TableCell>
                                                </TableRow>
                                            );
                                        });
                                        return requestsResultNodes;
                                    }
                                })()}
                            </Table>

                            <Pagination
                                currentPage={this.state.currentPage}
                                countPerPage={REQUEST_PER_PAGE}
                                countTotal={this.state.totalCount}
                                displayTotals={true}
                                onPageChange={this.changeRequestsTablePage}
                            />

                            {(() => {
                                if (this.state.isLoadingRequest === true) {
                                    return (
                                        <LoadingShade background="rgba(247, 247, 247, 0.9)">
                                            <LoadingSpinner size={64} color="#5A4D3F" />
                                        </LoadingShade>
                                    );
                                }
                            })()}

                        </Section>
                    </Col>
                </Row>
            </Layout>
        );
    }
}

function mapStateToProps(state) {
    return {
        header: state.header
    };
}

export default connect(mapStateToProps)(PageGraphicsRequestList);
