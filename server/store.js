import {createStore, combineReducers, applyMiddleware} from 'redux';
import {applyWafMiddleware} from './plugin_middleware'

import {reducer as stories} from '../src/components/story/reducer'
import {reducer as board} from '../src/components/board/reducer'
import {reducer as columns} from '../src/components/column/reducer'
import {reducer as tasks} from '../src/components/task/reducer'
import {reducer as teams} from '../src/components/team/reducer'
import {reducer as users} from './user_reducer'


export const initStore = (state, plugins) => {
    return applyWafMiddleware(...plugins)(createStore(combineReducers({
        stories,
        board,
        columns,
        tasks,
        users,
        teams
    }), state))
}
