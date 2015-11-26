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


        case 'STORY:TODO:ADD':
            checkStory(state, action.id)

            return _.merge({},
                state,
                {
                    items: {
                        [action.id]: {
                            todos: [...story.todos, action.todo]
                        }
                    }
                }
            )
        case 'STORY:TODO:REMOVE':
            checkStory(state, action.id)

            return _.merge({},
                state,
                {
                    items: {
                        [action.id]: {
                            todos: [...story.todos.slice(0, action.todoId), ...story.todos.slice(index+1)]
                        }
                    }
                }
            )

        case 'STORY:TODO:CHECK':
            checkStory(state, action.id)

            state.stories[action.id].todos[todoId].checked = true

            return _.merge({},
                state,
                {
                    items: {
                        [action.id]: {
                            todos: [...story.todos]
                        }
                    }
                }
            )
        case 'STORY:TODO:UNCHECK':
            checkStory(state, action.id)

            state.stories[action.id].todos[todoId].checked = false

            return _.merge({},
                state,
                {
                    items: {
                        [action.id]: {
                            todos: [...story.todos]
                        }
                    }
                }
            )
    }

    return state
}
