import React, { PropTypes } from 'react';
import s from './Pagination.css';
import Row from './../Section/Row';
import Col from './../Section/Col';
import IconArrowLeft from './../../components/Icons/IconArrowLeft';
import IconArrowRight from './../../components/Icons/IconArrowRight';
import IconEllipsis from './../../components/Icons/IconEllipsis';

const propTypes = {
    className: React.PropTypes.string,
    edgesCount: React.PropTypes.number,
    currentPage: React.PropTypes.number.isRequired,
    countPerPage: React.PropTypes.number.isRequired,
    countTotal: React.PropTypes.number.isRequired,
    displayTotals: React.PropTypes.bool,
    onPageChange: React.PropTypes.func.isRequired,
};

const defaultProps = {
    className: '',
    edgesCount: 3,
    displayTotals: true
};

class Pagination extends React.Component {
    constructor(props, context) {
        super(props, context);

        // Set default state
        this.state = {
            showingFrom: 1,
            showingTo: this.props.countPerPage,
            currentPage: this.props.currentPage,
            totalPages: this.calculatePagesCount(this.props.countTotal, this.props.countPerPage),
            pagesToDisplay: [1],
            displayEllipsisAtStart: false,
            displayEllipsisAtEnd: false
        };
    }

    componentDidMount() {
        // Set pages to display
        this.setPagesToDisplay();
    }

    componentWillReceiveProps(nextProps) {
        // Check if total count or count per page has changed
        if (this.countTotal !== nextProps.countTotal || this.countPerPage !== nextProps.countPerPage) {
            // Calculate new total pages
            const totalPages = this.calculatePagesCount(nextProps.countTotal, nextProps.countPerPage);
            this.setPagesToDisplay(nextProps.currentPage, totalPages, nextProps.countTotal);
        } else if (this.props.currentPage !== nextProps.currentPage) {
            this.switchToPage(nextProps.currentPage);
        }
    }

    calculatePagesCount(countTotal, countPerPage) {
        return Math.ceil(countTotal / countPerPage);
    }

    setPagesToDisplay(newPage, newTotalPages, newTotalCount) {
        // Get total pages
        const totalPages = typeof newTotalPages !== 'undefined' ? newTotalPages : this.state.totalPages;

        // Check if newPage is provided
        if (typeof newPage === 'undefined' || !newPage) {
            newPage = this.state.currentPage;
        }

        // Get total count
        const totalCount = typeof newTotalCount !== 'undefined' ? newTotalCount : this.props.totalCount;

        // Initially
        let displayEllipsisAtStart = false;
        let displayEllipsisAtEnd = false;
        let pagesToDisplay = [newPage];

        // Add edges
        for (let i = 0; i < this.props.edgesCount; i++) {
            if (pagesToDisplay[0] > 1) {
                pagesToDisplay.unshift(pagesToDisplay[0] - 1);
            }

            if (pagesToDisplay[pagesToDisplay.length - 1] < totalPages) {
                pagesToDisplay.push(pagesToDisplay[pagesToDisplay.length - 1] + 1);
            }
        }

        // Check if ellipsis should show at the start
        if (pagesToDisplay[0] > 2) {
            displayEllipsisAtStart = true;
        }

        // Check if ellipsis should show at the end
        if (pagesToDisplay[pagesToDisplay.length - 1] - 1 < totalPages) {
            displayEllipsisAtEnd = true;
        }

        // End of showing entries
        let showingTo = newPage * this.props.countPerPage;
        let showingFrom = showingTo - this.props.countPerPage + 1;
        showingTo = showingTo > totalCount ? totalCount : showingTo;

        // Set new state
        this.setState({
            'totalPages': totalPages,
            'currentPage': newPage,
            'pagesToDisplay': pagesToDisplay,
            'showingFrom': showingFrom,
            'showingTo': showingTo,
            'displayEllipsisAtStart': displayEllipsisAtStart,
            'displayEllipsisAtEnd': displayEllipsisAtEnd
        });
    }

    switchToPage(newPage) {
        // Check if new page is smaller than first page
        if (newPage < 1) {
            newPage = this.state.totalPages;
        } else if (newPage > this.state.totalPages) {
            newPage = 1;
        }

        // Change current page
        this.setPagesToDisplay(newPage);

        // Pass event further
        this.props.onPageChange(newPage);
    }

    render() {
        // Pagination class name
        let paginationClassName = s.pagination;
        paginationClassName += this.props.className !== '' ? ' ' + this.props.className : '';

        // If no results
        if (this.props.countTotal === 0) {
            return (
                <div className={paginationClassName}>
                    <Row>
                        <Col>
                            <p className={s.paginationTotals}>No entries available</p>
                        </Col>
                    </Row>
                </div>
            );
        }

        // Render
        return (
            <div className={paginationClassName}>
                <Row>
                    {(() => {
                        if (this.props.displayTotals === true) {
                            return (
                                <Col>
                                    <p className={s.paginationTotals}>Showing entries&nbsp;
                                        <strong>{this.state.showingFrom}</strong>&nbsp;&mdash;&nbsp;
                                        <strong>{this.state.showingTo}</strong>&nbsp;from total of&nbsp;
                                        <strong>{this.props.countTotal}</strong>
                                    </p>
                                </Col>
                            );
                        }
                    })()}
                    <Col>
                        <ul className={s.paginationLinksList}>
                            <li className={s.paginationArrow}>
                                <button onClick={e => this.switchToPage(this.state.currentPage - 1)}>
                                    <IconArrowLeft />
                                </button>
                            </li>
                            {(() => {
                                const pages = this.state.pagesToDisplay;
                                if (this.state.displayEllipsisAtEnd === true && pages[0] > 1) {
                                    const pageBeforeEllipsis = 1;
                                    return (
                                        <li className={s.paginationPage}>
                                            <button onClick={e => this.switchToPage(pageBeforeEllipsis)}>{pageBeforeEllipsis}</button>
                                        </li>
                                    );
                                }
                            })()}
                            {(() => {
                                const pages = this.state.pagesToDisplay;
                                if (this.state.displayEllipsisAtStart === true && pages[0] > 1) {
                                    return (
                                        <li className={s.paginationEllipsis}>
                                            <button onClick={e => this.switchToPage(this.state.pagesToDisplay[0] - 1)}>
                                                <IconEllipsis />
                                            </button>
                                        </li>
                                    );
                                }
                            })()}
                            {this.state.pagesToDisplay.map(page => {
                                let pageClassName = s.paginationPage;
                                pageClassName += this.state.currentPage === page ? ' ' + s.paginationPageActive : '';
                                return (
                                    <li key={page} className={pageClassName}>
                                        <button onClick={e => this.switchToPage(page)}>{page}</button>
                                    </li>
                                );
                            })}
                            {(() => {
                                const pages = this.state.pagesToDisplay;
                                if (this.state.displayEllipsisAtEnd === true && pages[pages.length - 1] < this.state.totalPages) {
                                    return (
                                        <li className={s.paginationEllipsis}>
                                            <button onClick={e => this.switchToPage(this.state.pagesToDisplay[this.state.pagesToDisplay.length - 1] + 1)}>
                                                <IconEllipsis />
                                            </button>
                                        </li>
                                    );
                                }
                            })()}
                            {(() => {
                                const pages = this.state.pagesToDisplay;
                                if (this.state.displayEllipsisAtEnd === true && pages[pages.length - 1] < this.state.totalPages) {
                                    const pageAfterEllipsis = this.state.totalPages;
                                    return (
                                        <li className={s.paginationPage}>
                                            <button onClick={e => this.switchToPage(pageAfterEllipsis)}>{pageAfterEllipsis}</button>
                                        </li>
                                    );
                                }
                            })()}
                            <li className={s.paginationArrow}>
                                <button onClick={e => this.switchToPage(this.state.currentPage + 1)}>
                                    <IconArrowRight />
                                </button>
                            </li>
                        </ul>
                    </Col>
                </Row>
            </div>
        );
    }
}

Pagination.propTypes = propTypes;
Pagination.defaultProps = defaultProps;

export default Pagination;
