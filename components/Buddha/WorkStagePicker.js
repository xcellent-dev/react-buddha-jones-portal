import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import * as API from './../../actions/api';
import { actionLoadWorkStages } from './../../actions/Work';
import DropdownContainer from './../Form/DropdownContainer';
import OptionsList from './../Form/OptionsList';
import Paragraph from './../Content/Paragraph';
import Row from './../Section/Row';
import Col from './../Section/Col';
import Checkmark from './../Form/Checkmark';
import s from './WorkStagePicker.css';

const propTypes = {
    onChange: PropTypes.func
};

const defaultProps = {
    onChange: null
};

class WorkStagePicker extends React.Component {
    constructor(props, state) {
        super(props, state);

        this.state = {
            stage: {
                id: 1,
                name: '',
                children: []
            },
            selected: []
        };

        this.dropdown = null;
    }

    componentDidMount() {
        this.props.dispatch(actionLoadWorkStages());
    }

    componentWillReceiveProps(nextProps, nextState) {
        const { props } = this;

        if (props.stages.length === 0 && nextProps.stages.length > 0) {
            this.setState({
                stage: Object.assign({}, this.state.stage, {
                    id: nextProps.stages[0].id,
                    name: nextProps.stages[0].name,
                    children: typeof nextProps.stages[0].children !== 'undefined' ? nextProps.stages[0].children : []
                }),
                selected: typeof nextProps.stages[0].children !== 'undefined' ? [] : [nextProps.stages[0].id]
            });
        }
    }

    handleStageChange(e) {
        if (typeof e !== 'undefined' && typeof e.value !== 'undefined' && typeof e.label !== 'undefined') {
            const stage = Object.assign({}, this.state.stage, {
                id: e.value,
                name: e.label
            });

            if (e.value !== this.state.stage.id) {
                let stageMatchIndex = null;
                this.props.stages.some((stage, stageIndex) => {
                    if (stage.id === e.value) {
                        stageMatchIndex = stageIndex;
                        return true;
                    }
                    return false;
                });

                let children = [];
                if (stageMatchIndex !== null && typeof this.props.stages[stageMatchIndex].children !== 'undefined') {
                    children = this.props.stages[stageMatchIndex].children;
                }

                this.setState({
                    stage: Object.assign({}, stage, {
                        children: children
                    }),
                    selected: children.length > 0 ? [] : [stage.id]
                }, () => {
                    this.updateParent();
                });
            } else {
                this.setState({
                    stage: stage
                });
            }
        }

        if (this.dropdown && typeof this.dropdown.closeDropdown !== 'undefined') {
            this.dropdown.closeDropdown();
        }
    }

    handleSelectedToggle(e, checked, id) {
        if (typeof checked !== 'undefined' && typeof id !== 'undefined') {
            if (checked) {
                this.setState({
                    selected: this.state.selected.concat([id])
                }, () => {
                    this.updateParent();
                });
            } else {
                let selectedMatchIndex = null;
                this.state.selected.some((selectedId, selectedIndex) => {
                    if (selectedId === id) {
                        selectedMatchIndex = selectedIndex;
                        return true;
                    }
                    return false;
                });

                if (selectedMatchIndex !== null) {
                    this.setState({
                        selected: this.state.selected.slice(0, selectedMatchIndex)
                            .concat(this.state.selected.slice(selectedMatchIndex + 1))
                    }, () => {
                        this.updateParent();
                    });
                }
            }
        }
    }

    updateParent() {
        if (this.props.onChange) {
            this.props.onChange(this.state.selected);
        }
    }

    render() {
        const { props } = this;

        if (props.loadingStages === true || props.stages.length === 0) {
            return (
                <div>
                    <Paragraph type="dim">Loading work stages...</Paragraph>
                </div>
            );
        } else {
            return (
                <div>
                    <DropdownContainer
                        ref={ref => this.dropdown = ref}
                        label="Work stage"
                        value={this.state.stage.name}
                    >
                        <OptionsList
                            onChange={e => this.handleStageChange(e)}
                            value={this.state.stage.id}
                            options={this.props.stages.map((stage, stageIndex) => {
                                return {
                                    key: 'stage-' + stage.id,
                                    value: stage.id,
                                    label: stage.name
                                };
                            })}
                        />
                    </DropdownContainer>
                    {this.state.stage.children.length > 0 && (
                        <Row className={s.children} doWrap={true} justifyContent="flex-start">
                            {this.state.stage.children.map((option, optionIndex) => {
                                return (
                                    <Col key={`stage-id-${option.id}`}>
                                        <Checkmark
                                            onClick={(e, checked) => this.handleSelectedToggle(e, checked, option.id)}
                                            checked={this.state.selected.indexOf(option.id) !== -1 ? true : false}
                                            defaultChecked={false}
                                            label={{
                                                text: option.name,
                                                onLeft: true
                                            }}
                                        />
                                    </Col>
                                );
                            })}
                        </Row>
                    )}
                </div>
            );
        }
    }
}

WorkStagePicker.propTypes = propTypes;
WorkStagePicker.defaultProps = defaultProps;

const mapStateToProps = (state, ownProps) => {
    return {
        loadingStages: state.work.loadingStages,
        stages: state.work.stages
    };
};

export default connect(mapStateToProps)(WorkStagePicker);
