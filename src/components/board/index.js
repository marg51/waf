import {board} from './directive'

export function init(app) {
    app.directive('board', board)
    require('./board.less')
}
