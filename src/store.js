import {createStore, applyMiddleware} from 'redux';
import thunkMiddleware from 'redux-thunk';
import createLogger from 'redux-logger';

var $q = angular.injector(['ng']).get('$q')

export const newStore = applyMiddleware(
          thunkMiddleware,
          store => next => action => {

                if(action.type=="//GROUP") {
                    _.map(action.items, item => {
                        item.sync = true
                        store.dispatch(item)
                    })

                    return
                }

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


                try {
                    var result = next(action)
                } catch(e) {
                    history.hasError = true
                    console.error(e)
                }

                return result
            },
          createLogger({collapsed:true})
        )(createStore)

// ,
//           store => next => action => {
//             try {
//                 var result = next(action)
//             } catch(e) {
//                 console.error(e)
//             }
//             return result
//           }
// BOARD:COLUMN:MOVE
// COLUMN:STORY:ADD
// COLUMN:STORY:REMOVE
// COLUMN:STORY:MOVE
// COLUMN:CREATE
// COLUMN:UPDATE
// COLUMN:REMOVE
// STORY:CREATE
// STORY:UPDATE
// STORY:CHANGE_SIZE
// STORY:TODO:ADD
// STORY:TODO:REMOVE
// STORY:TODO:CHECK
// STORY:TODO:UNCHECK
