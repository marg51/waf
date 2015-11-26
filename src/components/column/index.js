import {column} from './directive'
import {createColumn} from './directive'

export function init(app) {
    app.directive('column', column)
    app.directive('columnCreate', createColumn)
    require('./column.less')
}
