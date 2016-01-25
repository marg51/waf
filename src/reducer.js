export function reducer(state = {
    socket_connected: false,
    selected_story: null,
    stories: {}
}, action) {
    switch(action.type) {
        case 'UI:SOCKET:CONNECTED':
            return _.merge({}, state, {socket_connected: true})
        case 'UI:SOCKET:DISCONNECTED':
            return _.merge({}, state, {socket_connected: false})
        case 'UI:STORY:OPEN':
            return _.merge({}, state, {stories: {[action.id]: {open: true}}})
        case 'UI:STORY:CLOSE':
            return _.merge({}, state, {stories: {[action.id]: {open: false}}})
        case 'UI:STORY:EDIT':
            return _.merge({}, state, {stories: {[action.id]: {edit: true}}})
        case 'UI:STORY:STOP_EDIT':
            return _.merge({}, state, {stories: {[action.id]: {edit: false}}})
        case 'UI:STORY:SELECT':
            return _.merge({}, state, {selected_story: action.story})
    }

    return state
}
