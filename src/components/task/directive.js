import {TaskController} from './task'
export function task() {
    return {
        template: require('./task.html'),
        scope: {
            task: "=",
            edit: "=",
            onClone: '&?',
            onRemove: '&?'
        },
        controller: TaskController
    }
}
