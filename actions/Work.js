import * as actions from './ActionTypes';
import * as API from './api';

const initialState = {
    loadingStages: false,
    stages: []
};

export default function ActionsWork(state = initialState, action) {
    switch (action.type) {

        case actions.WORK_STAGES_LOADING:
            return Object.assign({}, state, {
                loadingStages: typeof action.payload !== 'undefined' ? action.payload : !state.loadingStages
            });

        case actions.WORK_STAGES_UPDATE:
            return Object.assign({}, state, {
                loadingStages: false,
                stages: typeof action.payload !== 'undefined' ? action.payload : []
            });

        default:
            return state;

    }
}

export function actionWorkStagesLoadingIndicator(visible) {
    return function(dispatch) {
        return dispatch({
            type: actions.WORK_STAGES_LOADING,
            payload: typeof visible !== 'undefined' ? visible : undefined
        });
    };
}

export function actionLoadWorkStages() {
    return function(dispatch) {
        dispatch(actionWorkStagesLoadingIndicator(true));

        API.get(API.WORK_STAGE).then((response) => {
            if (typeof response !== 'undefined' && response && response.length > 0) {
                return dispatch({
                    type: actions.WORK_STAGES_UPDATE,
                    payload: response
                });
            }
        }).catch((error) => {
            console.error('Could not load work stages', error);
        });
    };
}
