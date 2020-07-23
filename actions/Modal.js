import * as actions from './ActionTypes';

// Reducer
export default function ActionsModal(state = {
    show: false,
    title: null,
    text: null,
    type: 'default',
    closeButton: false,
    actions: []
}, action) {
    switch (action.type) {
        case actions.MODAL_SHOW:
            return Object.assign({}, state, action.payload);

        case actions.MODAL_HIDE:
            return Object.assign({}, state, {
                show: false
            });

        default:
            return state;
    }
}

/* Action creators */

// Hide modal
export function actionRemoveModal() {
    return {
        type: actions.MODAL_HIDE
    };
}

// Show modal
export function actionCreateModal(title, text, type, closeButton, actionButtons) {
    return {
        type: actions.MODAL_SHOW,
        payload: {
            show: true,
            title: typeof title !== 'undefined' ? title : null,
            text: typeof text !== 'undefined' ? text : null,
            type: typeof type !== 'undefined' ? type : 'default',
            closeButton: typeof closeButton !== 'undefined' ? closeButton : false,
            actions: typeof actionButtons !== 'undefined' && actionButtons.length > 0 ? actionButtons : []
        }
    };
}
