import * as _ from 'lodash'

export const INITIAL_STATE = {
    items: {}
}

export function reducer(state = INITIAL_STATE, action) {
    switch(action.type) {
        case '//init/state':
            return action.state.teams || INITIAL_STATE
    }
    return state
}