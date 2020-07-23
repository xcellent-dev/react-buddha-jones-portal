// Libraries
import React, { PropTypes } from 'react';
import moment from 'moment';

// Common components
import HeaderSection from './../../../components/Layout/HeaderSection';
import Row from './../../../components/Section/Row';
import Col from './../../../components/Section/Col';
import Button from './../../../components/Button/Button';
import Person from './../../../components/Buddha/Person';

// Styles
import IconArrowLeftYellow from './../../../components/Icons/IconArrowLeftYellow';
import IconArrowRightYellow from './../../../components/Icons/IconArrowRightYellow';
import s from './ProjectBoard.css';

// Props
const changesLogProps = {
    history: PropTypes.arrayOf(PropTypes.shape({
        id: PropTypes.number,
        user: PropTypes.string,
        image: PropTypes.string,
        text: PropTypes.string,
        date: PropTypes.string
    }))
};

const changesLogDefaultProps = {
    history: []
};

// Component
class ChangesLog extends React.Component {
    constructor(props) {
        super(props);

        this.limitCompactViewCount = 3;

        this.state = {
            showAll: false
        };

        this.table = null;
        this.referenceTable = (ref) => this.table = ref;
    }

    handleChangesListExpansion(e) {
        this.setState({
            showAll: !this.state.showAll
        });
    }

    render() {
        // Destructure
        const { showAll } = this.state;

        // Map changes as table rows
        let changesRows = [];
        if (this.props.history.length > 0) {
            // Iterate history change log
            this.props.history.map((change, changeIndex) => {
                // Check if whole history should be visible
                if (this.state.showAll || changeIndex < this.limitCompactViewCount) {
                    // Verify the date
                    let timeAgo = '';
                    let date = moment(change.date);
                    if (date.isValid()) {
                        timeAgo = date.fromNow();
                    } else {
                        timeAgo = 'Recently';
                    }

                    // Push to rows array
                    changesRows.push(
                        <tr key={`change-${change.id}`}>
                            <td>
                                <Person
                                    image={change.image}
                                    name={change.user}
                                    nameOnLeft={false}
                                    smallImage={true}
                                    darkImage={true}
                                />
                            </td>
                            <td>
                                <p>{change.text}</p>
                            </td>
                            <td>
                                <p>{timeAgo}</p>
                            </td>
                        </tr>
                    );
                } else {
                    return null;
                }
            });
        } else {
            changesRows.push(
                <tr key="no-changes">
                    <td></td><td><p>No project history has been saved yet.</p></td><td></td>
                </tr>
            );
        }

        // Render
        return (
            <HeaderSection marginBottom={true}>

                <Row removeGutter={true}>

                    <Col size={6}>
                        <p>Changes log:</p>
                    </Col>

                    {this.props.history.length > 3 && (
                        <Col size={6} className={s.arrows}>
                            <Button
                                onClick={e => this.handleChangesListExpansion(e)}
                                float="right"
                                icon={{
                                    size: 'nopadding',
                                    background: 'none',
                                    element: showAll
                                        ? <IconArrowLeftYellow width={15} height={11} />
                                        : <IconArrowRightYellow width={15} height={11} />
                                }}
                                label={{
                                    text: showAll === true
                                        ? 'Hide complete project history'
                                        : 'View complete project history',
                                    onLeft: showAll ? false : true,
                                    color: 'yellow',
                                    size: 'small'
                                }}
                            />
                        </Col>
                    )}

                </Row>

                <table ref={this.referenceTable} className={s.changesList}>
                    <tbody>
                        {changesRows}
                    </tbody>
                </table>

            </HeaderSection>
        );
    }
}

ChangesLog.propTypes = changesLogProps;
ChangesLog.defaultProps = changesLogDefaultProps;

export default ChangesLog;
