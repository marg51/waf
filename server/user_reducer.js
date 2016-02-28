export const INIT_STATE = {
    items: {}
}

export function checkUser(state, id) {
    if(!state.items[id]) {
        throw new Error('no such column #'+id)
    }
}

export function reducer(state = INIT_STATE, action) {
    switch(action.type) {
        case '//init/state':
            return action.state.users || {}
        case 'USER:ADD':

            return _.merge({}, state, {
                items: {
                    [action.id]: {
                        id: action.id,
                        data: {
                            token_id: action.id,
                        },
                        tokens: {
                            [action.token_type]: action.token
                        }
                    }
                }
            })
        case 'USER:UPDATE':
            checkUser(state, action.id)

            return _.merge({}, state, {
                items: {
                    [action.id]: {
                        data: action.object
                    }
                }
            })

    }

    return state
}
