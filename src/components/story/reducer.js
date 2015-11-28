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

            var elm = _.filter(state.items[action.id].todos, (todo) => todo.id == action.todoId)

            if(!elm[0]) return state

            var index = state.items[action.id].todos.indexOf(elm[0])

            if(index < action.index)
                action.index--

            state.items[action.id].todos.splice(index, 1)
            state.items[action.id].todos.splice(action.index,0,elm[0])

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

            return _.merge({},
                state,
                {
                    items: {
                        [action.id]: {
                            todos: [...state.items[action.id].todos, action.todo]
                        }
                    }
                }
            )
        case 'STORY:TODO:REMOVE':
            checkStory(state, action.id)

            state.items[action.id].todos = _.filter(state.items[action.id].todos, (todo) => todo.id != action.todoId)
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

        case 'STORY:TODO:CHECK':
            checkStory(state, action.id)

            state.items[action.id].todos = _.map(state.items[action.id].todos, todo => {
                if(todo.id == action.todoId) {
                    todo.checked = true
                }
                return todo
            })

            return _.merge({},
                state,
                {
                    items: {
                        [action.id]: {
                            todos: [...state.items[action.id]]
                        }
                    }
                }
            )
        case 'STORY:TODO:UNCHECK':
            checkStory(state, action.id)

            state.items[action.id].todos = _.map(state.items[action.id].todos, todo => {
                if(todo.id == action.todoId) {
                    todo.checked = false
                }
                return todo
            })

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

        case 'STORY:TODO:ADD_TYPE':
            checkStory(state, action.id)

            state.items[action.id].todos = _.map(state.items[action.id].todos, todo => {
                if(todo.id == action.todoId) {
                    todo['is_'+action.kind] = true
                }
                return todo
            })

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
        case 'STORY:TODO:REMOVE_TYPE':
            checkStory(state, action.id)

            state.items[action.id].todos = _.map(state.items[action.id].todos, todo => {
                if(todo.id == action.todoId) {
                    todo['is_'+action.kind] = false
                }
                return todo
            })

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
