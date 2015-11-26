import {ColumnController} from './column'
export function column() {
    return {
        template: require('./column.html'),
        scope: {
            column:'='
        },
        controller: ColumnController
    }
}
