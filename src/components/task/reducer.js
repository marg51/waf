export const INITIAL_STATE = {
    items: {}
}

export function reducer(state = INITIAL_STATE, action) {
    switch(action.type) {
        case '//init/state':
            return action.state.tasks || INITIAL_STATE
        case 'TODO:ADD':
            return _.merge({}, state, {
                items: {
                    [action.todo.id]: action.todo
                }
            })

        // soft delete
        case 'TODO:REMOVE':
            return {
                items: _.merge({}, state.items, {
                    [action.id]: {
                        removed: true
                    }
                })
            }

        case 'TODO:UPDATE':
            return {
                items: _.merge({}, state.items, {
                    [action.id]: action.todo
                })
            }

        case 'TODO:ADD_TYPE':
            console.warn("[deprecated] todo:add_type", action)

            return state
        case 'TODO:REMOVE_TYPE':
            console.warn("[deprecated] todo:add_type", action)

            return state
    }

    return state
}