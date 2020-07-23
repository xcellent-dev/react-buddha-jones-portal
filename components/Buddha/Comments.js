import React, { PropTypes } from 'react';
import zenscroll from 'zenscroll';
import * as API from './../../actions/api';
import s from './Comments.css';
import Row from './../Section/Row';
import Col from './../Section/Col';
import Button from './../Button/Button';
import Paragraph from './../Content/Paragraph';
import TextArea from './../Form/TextArea';
import LoadingShade from './../Loaders/LoadingShade';
import LoadingSpinner from './../Loaders/LoadingSpinner';
import IconChatBubbleWhiteIcon from './../Icons/IconChatBubbleWhiteIcon';
import { printDateAsTimeAgo, parseStringAsDateObject } from './../../helpers/date';

const propTypes = {
    label: PropTypes.string,
    noParentLabel: PropTypes.string,
    noCommentsLabel: PropTypes.string,
    typeId: PropTypes.number.isRequired,
    parentId: PropTypes.number,
    showComments: PropTypes.number
};

const defaultProps = {
    label: 'Write your comment...',
    noParentLabel: 'Comments disabled.',
    noCommentsLabel: 'Currently there are no comments.',
    typeId: null,
    showComments: 2
};

class Comments extends React.Component {
    constructor(props, context) {
        super(props, context);

        this.exists = true;

        this.state = {
            commentAdded: false,
            myCommentContent: '',
            myCommentIndex: null,
            isLoadingComments: false,
            isSavingComment: false,
            isShowingAll: false,
            comments: []
        };
    }

    componentDidMount() {
        if (this.props.typeId && this.props.parentId) {
            this.fetchComments(this.props.typeId, this.props.parentId, 0, 9999);
        }
    }

    componentWillUnmount() {
        this.exists = false;
    }

    componentWillReceiveProps(nextProps) {
        // Fetch comments only when type or parent is changed
        if (nextProps.typeId && nextProps.parentId) {
            if (nextProps.parentId !== this.props.parentId || nextProps.typeId !== this.props.typeId) {
                this.fetchComments(nextProps.typeId, nextProps.parentId, 0, 9999);
            }
        }
    }

    fetchComments(typeId, parentId, offset, length) {
        // Default params
        offset = typeof offset !== 'undefined' ? offset : 0;
        length = typeof length !== 'undefined' ? length : 99999;

        // API fetch params
        const params = {
            type_id: typeId,
            parent_id: parentId,
            offset: offset,
            length: length
        };

        // Show that loading
        if (typeof this.exists !== 'undefined' && this.exists) {
            this.setState({
                isLoadingComments: true
            });
        }

        // Fetch comments
        API.get(API.COMMENT, params)
            .then(response => {
                const comments = response.map(comment => {
                    return {
                        id: comment.id,
                        author: {
                            id: comment.user.id,
                            name: comment.user.fullName,
                            image: comment.user.image
                        },
                        date: new Date(comment.createdAt),
                        content: comment.comment
                    };
                });

                if (typeof this.exists !== 'undefined' && this.exists) {
                    this.setState({
                        isLoadingComments: false,
                        comments: comments
                    });
                }
            })
            .catch(error => {
                if (typeof this.exists !== 'undefined' && this.exists) {
                    this.setState({
                        isLoadingComments: false
                    });
                }
            });
    }

    uploadComment(comment, callback) {
        // Method params
        let { typeId, parentId } = this.props;

        // API fetch params
        const params = {
            type_id: typeId,
            parent_id: parentId,
            comment: comment
        };

        // Show that uploading
        this.setState({
            isSavingComment: true
        });

        // Uploading comment
        API.post(API.COMMENT, API.makePostData(params))
            .then(response => {
                const comment = response.data;
                const savedComment = {
                    id: comment.id,
                    author: {
                        id: comment.user.id,
                        name: comment.user.fullName,
                        image: comment.user.image
                    },
                    date: new Date(comment.createdAt),
                    content: comment.comment,
                    editable: true
                };

                this.setState({
                    isSavingComment: false
                });

                callback(savedComment);
            })
            .catch(error => {
                this.setState({
                    isSavingComment: false
                });
            });
    }

    updateComment(commentId, comment, callback) {
        const typeId = this.props.typeId ? this.props.typeId : undefined;
        const parentId = this.props.parentId ? this.props.parentId : undefined;

        // Request params
        const params = {
            comment_id: commentId,
            parent_id: parentId,
            type_id: typeId,
            comment: comment
        };

        // Show that saving comment

        this.setState({
            isSavingComment: true
        });

        // Update comment with API
        API.put(API.COMMENT + '/' + commentId, API.makePutData(params))
            .then(response => {
                this.setState({
                    isSavingComment: false
                });

                callback();
            })
            .catch(error => {
                this.setState({
                    isSavingComment: false
                });
            });
    }

    handleCommentChange(e) {
        if (typeof e !== 'undefined' && typeof e.target !== 'undefined' && typeof e.target.value !== 'undefined') {
            this.setState({
                myCommentContent: e.target.value
            });
        }
    }

    handleCommentEdit(commentIndex) {
        if (typeof commentIndex !== 'undefined' && commentIndex >= 0) {
            // Enable editing
            this.setState({
                myCommentContent: this.state.comments[commentIndex].content,
                myCommentIndex: commentIndex
            });

            // Focus on edit field
            if (typeof this.refs.newCommentField !== 'undefined') {
                if (typeof this.refs.newCommentField.refs.field !== 'undefined') {
                    const field = this.refs.newCommentField.refs.field;
                    zenscroll.intoView(field);
                    field.focus();
                }
            }
        }
    }

    handleCommentSubmit(e) {
        // Get field and value
        const value = this.state.myCommentContent.trim();
        const myCommentIndex = this.state.myCommentIndex;

        // Check if value is not empty
        if (value.length > 0) {
            // Create new comment
            if (myCommentIndex === null) {
                this.uploadComment(value, (comment) => {
                    // Add the comment to state and clear comment field if uploaded successfully
                    this.setState({
                        commentAdded: true,
                        myCommentContent: '',
                        myCommentIndex: null,
                        comments: [comment].concat(this.state.comments)
                    }, () => {
                        // Enable comment editing for 5 minutes
                        const commentIndex = 0;
                        setTimeout(() => {
                            if (typeof this.state.comments[commentIndex] !== 'undefined') {
                                this.setState({
                                    comments: this.state.comments
                                        .slice(0, commentIndex)
                                        .concat(
                                            Object.assign({}, this.state.comments[commentIndex], {
                                                editable: false
                                            })
                                        )
                                        .concat(this.state.comments.slice(commentIndex + 1))
                                });
                            }
                        }, 1000 * 60 * 5);

                        // Remove comment added message after delay
                        setTimeout(() => {
                            this.setState({
                                commentAdded: false
                            });
                        }, 1024 * 5);
                    });
                });
            } else if (myCommentIndex !== null && myCommentIndex >= 0) {
                // Update comment
                this.updateComment(this.state.comments[myCommentIndex].id, value, () => {
                    // Update comment content in user interface
                    this.setState({
                        myCommentContent: '',
                        myCommentIndex: null,
                        comments: this.state.comments
                            .slice(0, myCommentIndex)
                            .concat(
                                Object.assign({}, this.state.comments[myCommentIndex], {
                                    content: value
                                })
                            )
                            .concat(this.state.comments.slice(myCommentIndex + 1))
                    });
                });
            }
        }
    }

    handleToggleShowingAll(value) {
        this.setState({
            isShowingAll: value
        });
    }

    render() {
        if (this.props.typeId === null || this.props.parentId === null) {
            return (
                <div className={s.comments}>
                    <div className={s.commentsTimeline}>
                        <div className={s.comment}>
                            <div className={s.commentContent}>
                                { this.props.parentId === null ? this.props.noParentLabel : '' }
                            </div>
                        </div>
                    </div>
                </div>
            );
        }

        return (
            <div className={s.comments}>
                <div className={s.commentForm}>
                    <TextArea
                        ref="newCommentField"
                        onChange={e => this.handleCommentChange(e)}
                        value={this.state.myCommentContent}
                        label={this.props.label}
                        height={80}
                        width={1152}
                    />
                </div>
                <div className={s.commentButtonContainer}>
                    {(() => {
                        const commentsLength = this.state.comments.length;
                        let message = '';
                        let messageType = 'success';
                        if (this.state.commentAdded === true) {
                            message = 'Comment posted';
                        } else if (this.state.isSavingComment === true) {
                            message = 'Saving comment';
                        } else {
                            if (commentsLength > 0) {
                                messageType = 'default';
                                message = commentsLength.toString() + ' comment' + (commentsLength > 1 ? 's' : '');
                            } else {
                                messageType = 'dim';
                                message = 'No comments';
                            }
                        }

                        return (
                            <Paragraph
                                className={s.commentMessage}
                                type={messageType}
                            >
                                {message}
                            </Paragraph>
                        );
                    })()}
                    <Button
                        onClick={e => this.handleCommentSubmit(e)}
                        label={{
                            text: 'Save comment',
                            size: 'small',
                            color: 'blue'
                        }}
                        icon={{
                            background: 'blue',
                            size: 'small',
                            element:
                                <IconChatBubbleWhiteIcon
                                    width={17}
                                    marginLeft={-8}
                                    height={14}
                                    marginTop={-6}
                                />
                        }}
                        disabled={this.state.isSavingComment}
                    />
                </div>
                {(() => {
                    if (this.state.comments.length > 0) {
                        const commentsCount = this.state.comments.length;
                        let comments;

                        // Visible comments
                        if (commentsCount > this.props.showComments && this.state.isShowingAll === false) {
                            comments = this.state.comments.slice(0, this.props.showComments);
                        } else {
                            comments = this.state.comments;
                        }

                        let commentsNodes = [
                            <div key={0} className={s.commentsTimeline}>
                                {comments.map((comment, commentIndex) => {
                                    const parsedDate = parseStringAsDateObject(comment.date);
                                    const commentDate = printDateAsTimeAgo(parsedDate, true, true);
                                    return (
                                        <Comment
                                            key={comment.id}
                                            onEditClick={e => this.handleCommentEdit(commentIndex)}
                                            authorImage={
                                                typeof comment.author.image !== 'undefined' && comment.author.image
                                                    ? comment.author.image
                                                    : undefined
                                            }
                                            authorName={comment.author.name}
                                            commentDate={commentDate}
                                            commentContent={comment.content}
                                            editable={typeof comment.editable !== 'undefined' && comment.editable === true ? true : false}
                                        />
                                    );
                                })}
                            </div>
                        ];

                        if (commentsCount > this.props.showComments) {
                            if (this.state.isShowingAll === false) {
                                const remainsCount = commentsCount - this.props.showComments;
                                const message = remainsCount.toString() + ' hidden comment' + (remainsCount > 1 ? 's' : '');

                                commentsNodes.push(
                                    <div key={1} className={s.commentButtonContainer}>
                                        <Paragraph
                                            className={s.commentMessage}
                                            type="dim"
                                        >
                                            {message}
                                        </Paragraph>
                                        <Button
                                            onClick={e => this.handleToggleShowingAll(true)}
                                            label={{
                                                text: 'Read all comments',
                                                size: 'small',
                                                color: 'blue'
                                            }}
                                        />
                                    </div>
                                );
                            } else {
                                commentsNodes.push(
                                    <div key={1} className={s.commentButtonContainer}>
                                        <Paragraph
                                            className={s.commentMessage}
                                            type="dim"
                                        >
                                            {'Viewing all ' + this.state.comments.length.toString() + ' comments'}
                                        </Paragraph>
                                        <Button
                                            onClick={e => this.handleToggleShowingAll(false)}
                                            label={{
                                                text: 'Hide older comments',
                                                size: 'small',
                                                color: 'blue'
                                            }}
                                        />
                                    </div>
                                );
                            }
                        }

                        // Render comments
                        return commentsNodes;
                    }
                })()}
                {(() => {
                    if (this.state.isLoadingComments === true) {
                        return (
                            <LoadingShade background="rgba(247, 247, 247, 0.9)">
                                <LoadingSpinner size={48} color="#5A4D3F" />
                            </LoadingShade>
                        );
                    }
                })()}
            </div>
        );
    }
}

function Comment(props) {
    if (typeof props.commentContent !== 'undefined') {
        return (
            <div className={s.comment}>
                <div className={s.commentHeader}>
                    <p className={s.commentImage}>
                        <span
                            className={s.commentImage}
                            style={
                                typeof props.authorImage !== 'undefined'
                                    ? {
                                        backgroundImage: 'url(' + props.authorImage + ')'
                                    }
                                    : null
                            }
                            ></span>
                    </p>
                    <p className={s.commentAuthor}>
                        <span className={s.commentName}>
                            {props.authorName}
                        </span>
                        <span className={s.commentDate}>
                            {props.commentDate}
                        </span>
                    </p>
                </div>
                <div className={s.commentContent}>
                    {props.commentContent}
                    <br />
                    {(() => {
                        if (props.editable === true) {
                            return (
                                <Button
                                    onClick={e => props.onEditClick(e)}
                                    float="right"
                                    label={{
                                        text: 'Edit comment',
                                        size: 'small',
                                        color: 'blue',
                                        onLeft: true
                                    }}
                                />
                            );
                        }
                    })()}
                </div>
            </div>
        );
    }
}

Comments.propTypes = propTypes;
Comments.defaultProps = defaultProps;

export default Comments;
