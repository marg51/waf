import {createStore, combineReducers, applyMiddleware} from 'redux';
import {PluginMiddleware} from './plugin_middleware'

import {reducer as stories} from '../src/components/story/reducer'
import {reducer as board} from '../src/components/board/reducer'
import {reducer as columns} from '../src/components/column/reducer'
import {reducer as tasks} from '../src/components/task/reducer'
import {reducer as users} from './user_reducer'


export const store = applyMiddleware(PluginMiddleware)(createStore)(combineReducers({
    stories,
    board,
    columns,
    tasks,
    users
}))
