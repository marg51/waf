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

export function createColumn() {
    return {
        template: require('./create.html'),
        scope: {
            onSave: '&'
        }
    }
}
