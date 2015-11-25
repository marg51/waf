import {BoardController} from './board'
export function board() {
    return {
        template: require('./board.html'),
        scope: {
            repo:'@'
        },
        controller: BoardController
    }
}
