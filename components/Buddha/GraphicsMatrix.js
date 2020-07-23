import React, { PropTypes } from 'react';
import s from './GraphicsMatrix.css';
import Section from './../Section/Section';
import Row from './../Section/Row';
import Col from './../Section/Col';
import TextArea from './../Form/TextArea';
import Table from './../Table/Table';
import TableRow from './../Table/TableRow';
import TableCell from './../Table/TableCell';
import Paragraph from './../Content/Paragraph';
import Input from './../Form/Input';
import Button from './../Button/Button';
import IconPlusWhite from './../Icons/IconPlusWhite';

const propTypes = {
    onChange: PropTypes.func
};

const defaultProps = {
    onChange: null
};

class GraphicsMatrix extends React.Component {
    constructor(props, context) {
        super(props, context);

        this.state = {
            input: '',
            graphics: []
        };
    }

    componentWillUpdate(nextProps, nextState) {
        // Check if graphics state has changed
        if (this.state.graphics.length !== nextState.graphics.length) {
            // Pass updated state to prop function
            if (this.props.onChange) {
                this.props.onChange(nextState.graphics);
            }
        }
    }

    handleInputChange(e) {
        // Update state
        this.setState({
            input: e.target.value
        });
    }

    handleFileChange(e, graphicIndex, field) {
        if (typeof e !== 'undefined' && typeof e.target !== 'undefined' && typeof e.target.value !== 'undefined' && typeof graphicIndex !== 'undefined') {
            this.setState({
                graphics: this.state.graphics.slice(0, graphicIndex)
                    .concat(Object.assign({}, this.state.graphics[graphicIndex], {
                        [field]: e.target.value
                    }))
                    .concat(this.state.graphics.slice(graphicIndex + 1))
            });
        }
    }

    handleInputPaste(e) {
        // Files to add
        const graphics = [];

        // Get clipboard data
        const clipboard = e.clipboardData || window.clipboardData;
        if (typeof clipboard !== 'undefined' && clipboard) {
            // Get pasted text
            const pasted = clipboard.getData('Text');

            // Verify pasted text and update state if any files have been pasted
            if (typeof pasted !== 'undefined' && pasted) {
                this.updateStateWithNewGraphics(pasted);
            }
        }

        // Cancel default behavior
        e.stopPropagation();
        e.preventDefault();
    }

    handleInputAdd(e) {
        if (this.state.input !== '') {
            this.updateStateWithNewGraphics(this.state.input);
        }
    }

    updateStateWithNewGraphics(value) {
        if (typeof value !== 'undefined' && value) {
            const files = this.splitFiles(value);
            const graphics = this.formGraphicsStateFromFilesArray(files);
            if (graphics && graphics.length > 0) {
                this.setState({
                    input: '',
                    graphics: graphics.concat(this.state.graphics)
                });
            }
        }
    }

    splitFiles(value) {
        let files = [];
        if (typeof value !== 'undefined' && value) {
            const filesMatch = value.trim().match(/(\w+\.\w{2,4})/gi);
            files = filesMatch ? filesMatch : [];
        }
        return files;
    }

    formGraphicsStateFromFilesArray(files) {
        let graphics = [];
        if (typeof files !== 'undefined' && files && files.length > 0) {
            files.map(fileString => {
                const file = fileString.trim();
                if (file !== '') {
                    const exists = this.state.graphics.some((fileObject, fileIndex) => {
                        return fileObject.filename === file ? true : false;
                    });

                    if (!exists) {
                        graphics.push({
                            filename: file,
                            description: ''
                        });
                    }
                }
            });
        }
        return graphics;
    }

    handleInputRemove(e, graphicIndex) {
        if (typeof graphicIndex !== 'undefined' && typeof this.state.graphics[graphicIndex] !== 'undefined') {
            this.setState({
                graphics: this.state.graphics.slice(0, graphicIndex)
                    .concat(this.state.graphics.slice(graphicIndex + 1))
            });
        }
    }

    render() {
        // Render
        return (
            <div>

                <Row removeGutter={true}>
                    <Col size={9}>
                        <TextArea
                            fieldClassName={s.filesField}
                            label="Enter or paste single or multiple graphic files names"
                            onChange={e => this.handleInputChange(e)}
                            onPaste={e => this.handleInputPaste(e)}
                            value={this.state.input}
                            width={1152}
                            height={40}
                        />
                    </Col>
                    <Col size={3} width={128} className={s.graphicsAddCol}>
                        <Button
                            onClick={e => this.handleInputAdd(e)}
                            float="right"
                            icon={{
                                element: React.createElement(IconPlusWhite, {
                                    width: 12,
                                    height: 12,
                                    marginTop: -6,
                                    marginLeft: -5
                                }, null),
                                size: 'small',
                                background: 'blue'
                            }}
                            label={{
                                text: 'Add graphic',
                                size: 'small',
                                color: 'blue',
                                onLeft: true
                            }}
                        />
                    </Col>
                </Row>

                {this.state.graphics.length > 0 && (
                    <Table
                        className={s.graphics}
                        header={[{ title: 'Added graphic files:', align: 'left', colSpan: 3 }]}
                    >
                        {this.state.graphics.map((graphic, index) => {
                            return (
                                <TableRow key={graphic.filename}>
                                    <TableCell>
                                        <Input
                                            onChange={e => this.handleFileChange(e, index, 'filename')}
                                            value={graphic.filename}
                                            label="File name"
                                        />
                                    </TableCell>
                                    <TableCell>
                                        <Input
                                            onChange={e => this.handleFileChange(e, index, 'description')}
                                            value={graphic.description}
                                            label="File description"
                                        />
                                    </TableCell>
                                    <TableCell>
                                        <Button
                                            onClick={e => this.handleInputRemove(e, index)}
                                            float="right"
                                            label={{
                                                text: 'Remove',
                                                size: 'small',
                                                color: 'orange'
                                            }}
                                        />
                                    </TableCell>
                                </TableRow>
                            );
                        })}
                    </Table>
                ) || (
                    <Paragraph className={s.noGraphics} type="dim">No graphic files added</Paragraph>
                )}

            </div>
        );
    };
}

GraphicsMatrix.propTypes = propTypes;
GraphicsMatrix.defaultProps = defaultProps;

export default GraphicsMatrix;
