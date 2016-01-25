import {column} from './directive'

export function init(app) {
    app.directive('column', column)
    require('./column.less')
}
