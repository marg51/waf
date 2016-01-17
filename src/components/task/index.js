import {task} from './directive'

export function init(app) {
    app.directive('task', task)
    require('./task.less')
}
