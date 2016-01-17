export const INIT_STATE = {
    items: {}
}

function checkStory(state, id) {
    if(!state.items[id]) {
        throw new Error('no such story #',id)
    }
}

export function reducer(state = INIT_STATE, action) {
    switch(action.type) {
        case '//init/state':
            return action.state.stories
        case 'STORY:REMOVE':
            delete state.items[action.id]

            return _.merge({}, state)
        case 'STORY:CREATE':
            return _.merge({},
                state,
                {
                    items: {
                        [action.id]: action.object
                    }
                }
            )

        case 'STORY:UPDATE':
            checkStory(state, action.id)

            return _.merge({},
                state,
                {
                    items: {
                        [action.id]: action.object
                    }
                }
            )

        case 'STORY:CHANGE_SIZE':
            checkStory(state, action.id)

            return _.merge({},
                state,
                {
                    items: {
                        [action.id]: {
                            size: action.size
                        }
                    }
                }
            )
        case 'STORY:TODO:MOVE':
            checkStory(state, action.id)

            var index = state.items[action.id].todos.indexOf(action.todoId)

            if(index == -1) return state

            // yeah, that's normal
            if(index < action.index)
                action.index--

            state.items[action.id].todos.splice(index, 1)
            state.items[action.id].todos.splice(action.index,0,action.todoId)

            return _.merge({},
                state,
                {
                    items: {
                        [action.id]: {
                            todos: [...state.items[action.id].todos]
                        }
                    }
                }
            )

        case 'STORY:TODO:ADD':
            checkStory(state, action.id)

            if(typeof action.index == "undefined") {
                state.items[action.id].todos.push(action.todoId)
            } else {
                state.items[action.id].todos.splice(action.index, 0, action.todoId)
            }

            return _.merge({},
                state,
                {
                    items: {
                        [action.id]: {
                            todos: [...state.items[action.id].todos]
                        }
                    }
                }
            )
        case 'STORY:TODO:REMOVE':
            checkStory(state, action.id)

            state.items[action.id].todos = _.filter(state.items[action.id].todos, (todo) => todo != action.todoId)
            return _.merge({},
                state,
                {
                    items: {
                        [action.id]: {
                            todos: [...state.items[action.id].todos]
                        }
                    }
                }
            )
    }

    return state
}
