import {createStore, combineReducers} from 'redux';

import {reducer as stories} from '../src/components/story/reducer'
import {reducer as board} from '../src/components/board/reducer'
import {reducer as columns} from '../src/components/column/reducer'
import {reducer as users} from './user_reducer'


export const store = createStore(combineReducers({
    stories,
    board,
    columns,
    users
}))
