import * as actions from './ActionTypes';

export default function ActionsHeader(state = {

    'title': null,
    'preTitleSpan': null,
    'subTitle': null,
    'preSubTitleSpan': null,
    'elements': null

}, action) {
    // Payload
    let title = null;
    let preTitleSpan = null;
    let subTitle = null;
    let preSubTitleSpan = null;
    let elements = [];

    // Switch statement
    switch (action.type) {

        case actions.HEADER_CHANGE_TITLE:
            title = typeof action.payload.title !== 'undefined' ? action.payload.title : title;
            preTitleSpan = typeof action.payload.preTitleSpan !== 'undefined' ? action.payload.preTitleSpan : preTitleSpan;
            return Object.assign({}, state, {
                'title': title,
                'preTitleSpan': preTitleSpan
            });

        case actions.HEADER_CHANGE_SUB_TITLE:
            subTitle = typeof action.payload.subTitle !== 'undefined' ? action.payload.subTitle : subTitle;
            preSubTitleSpan = typeof action.payload.preSubTitleSpan !== 'undefined' ? action.payload.preSubTitleSpan : preSubTitleSpan;
            return Object.assign({}, state, {
                'subTitle': subTitle,
                'preSubTitleSpan': preSubTitleSpan
            });

        case actions.HEADER_CHANGE_TITLES:
            title = typeof action.payload.title !== 'undefined' ? action.payload.title : title;
            preTitleSpan = typeof action.payload.preTitleSpan !== 'undefined' ? action.payload.preTitleSpan : preTitleSpan;
            subTitle = typeof action.payload.subTitle !== 'undefined' ? action.payload.subTitle : subTitle;
            preSubTitleSpan = typeof action.payload.preSubTitleSpan !== 'undefined' ? action.payload.preSubTitleSpan : preSubTitleSpan;
            return Object.assign({}, state, {
                'title': title,
                'preTitleSpan': preTitleSpan,
                'subTitle': subTitle,
                'preSubTitleSpan': preSubTitleSpan
            });

        case actions.HEADER_SET_ELEMENTS:
            elements = typeof action.payload !== 'undefined' ? action.payload : elements;
            return Object.assign({}, state, {
                'elements': elements
            });

        case actions.HEADER_SET_ALL:
            if (typeof action.payload !== 'undefined') {
                title = typeof action.payload.title !== 'undefined' ? action.payload.title : title;
                preTitleSpan = typeof action.payload.preTitleSpan !== 'undefined' ? action.payload.preTitleSpan : preTitleSpan;
                subTitle = typeof action.payload.subTitle !== 'undefined' ? action.payload.subTitle : subTitle;
                preSubTitleSpan = typeof action.payload.preSubTitleSpan !== 'undefined' ? action.payload.preSubTitleSpan : preSubTitleSpan;
                elements = typeof action.payload.elements !== 'undefined' ? action.payload.elements : elements;
                return Object.assign({}, state, {
                    'title': title,
                    'preTitleSpan': preTitleSpan,
                    'subTitle': subTitle,
                    'preSubTitleSpan': preSubTitleSpan,
                    'elements': elements
                });
            } else {
                return state;
            }

        case actions.HEADER_RESET:
            return Object.assign({}, state, {
                'title': title,
                'preTitleSpan': preTitleSpan,
                'subTitle': subTitle,
                'preSubTitleSpan': preSubTitleSpan,
                'elements': elements
            });

        default:
            return state;

    }
}
