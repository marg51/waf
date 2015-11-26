import {createStore, applyMiddleware} from 'redux';
import thunkMiddleware from 'redux-thunk';
import createLogger from 'redux-logger';
import {socketMiddleware} from './socketMiddleware'

var $q = angular.injector(['ng']).get('$q')

export const newStore = applyMiddleware(
          thunkMiddleware,
          socketMiddleware,
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
