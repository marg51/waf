//  _       _  _____  ___    _   _  _  _   _  ___
// ( )  _  ( )(  _  )|  _`\ ( ) ( )(_)( ) ( )(  _`\
// | | ( ) | || (_) || (_) )| `\| || || `\| || ( (_)
// | | | | | ||  _  || ,  / | , ` || || , ` || |___
// | (_/ \_) || | | || |\ \ | |`\ || || |`\ || (_, )
// `\___x___/'(_) (_)(_) (_)(_) (_)(_)(_) (_)(____/'
//
// ok, let's be honest: it works but I'm not proud of it
//
// the goal of this middleware is to dispatch redux actions to the websocket server
// and to store an history of all actions (even the ones that come from others)
//
// it has to be redone.
//
// oh, btw, if anything breaks in this function, the state becomes out of sync. Love, Laurent
export const socketMiddleware = store => next => action => {

    var history = {
        id: Date.now()+'_'+Math.ceil(Math.random()*100000),
        object: action,
        sync: false, // it's updated when we emit HISTORY:SYNC below
        date: Date.now()
    }


    if(action.sync && !action._metadata) {
        store.getState().history.push(history)
        socket.emit('dispatch', action, () => {
            store.dispatch({type: 'HISTORY:SYNC', id:history.id})
        })
    }

    if(action._metadata) {
        // btw, this is really bad. I mean it.
        store.getState().history.push(history)
    }

    return next(action)
}
