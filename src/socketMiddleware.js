export const socketMiddleware = store => next => action => {

    var history = {
        id: Date.now()+'_'+Math.ceil(Math.random()*100000),
        object: action,
        sync: false,
        date: Date.now(),
        from_network: !!action.from_network
    }


    if(action.sync && !action.from_network) {
        store.getState().history.push(history)
        socket.emit('dispatch', action, () => {
            store.dispatch({type: 'HISTORY:SYNC', id:history.id})
        })
    }

    if(action.from_network) {
        store.getState().history.push(history)
    }

    return next(action)
}
