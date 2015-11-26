export const INIT_STATE = {
    items: {}
}

export function checkColumn(state, id) {
    if(!state.items[id]) {
        throw new Error('no such column #'+id)
    }
}

export function reducer(state = INIT_STATE, action) {
    switch(action.type) {
        case '//init/state':
            return action.state.columns
        case 'COLUMN:STORY:ADD':
            checkColumn(state, action.id)

            return _.merge({}, state, {
                items: {
                    [action.id]: {
                        stories: [...state.items[action.id].stories.slice(0,action.index), action.storyId, ...state.items[action.id].stories.slice(action.index)]
                    }
                }
            })
        case 'COLUMN:STORY:REMOVE':
            checkColumn(state, action.id)

            state.items[action.id].stories.splice(state.items[action.id].stories.indexOf(action.storyId),1)
            return _.merge({}, state, {
                items: {
                    [action.id]: {
                        stories: [...state.items[action.id].stories]
                    }
                }
            })

        case 'COLUMN:STORY:MOVE':
            checkColumn(state, action.id)

            state.items[action.id].stories.splice(state.items[action.id].stories.indexOf(action.storyId),1)
            state.items[action.id].stories.splice(action.index,0,action.storyId)

            return _.merge({}, state, {
                items: {
                    [action.id]: {
                        stories: [...state.items[action.id].stories]
                    }
                }
            })
        case 'COLUMN:CREATE':
            return _.merge({}, state, {
                items: {
                    [action.id]: action.object
                }
            })
        case 'COLUMN:UPDATE':
            checkColumn(state, action.id)

            return _.merge({}, state, {
                items: {
                    [action.id]: action.object
                }
            })
        case 'COLUMN:REMOVE':
            checkColumn(state, action.id)

            delete state.items[action.id]

            return _.merge({}, state)
    }

    return state
}
