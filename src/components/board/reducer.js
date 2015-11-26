export const INIT_STATE = {
    columns: [],
    repos: ''
}

export function reducer(state = INIT_STATE, action) {
    switch(action.type) {
        case 'BOARD:COLUMN:MOVE':
            state.columns.splice(state.columns.indexOf(action.columnId),1)
            state.columns.splice(state.columns.index, 0, action.columnId)

            return _.merge({}, state, {columns: [...state.columns]})
    }

    return state;
}
