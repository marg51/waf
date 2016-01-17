import {createStore, applyMiddleware} from 'redux';
import thunkMiddleware from 'redux-thunk';
import createLogger from 'redux-logger';
import {socketMiddleware} from './socketMiddleware'

export const newStore = applyMiddleware(
          thunkMiddleware,
          socketMiddleware,
          createLogger({collapsed:true})
        )(createStore)
