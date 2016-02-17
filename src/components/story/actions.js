import * as _ from 'lodash'

export function add(story) {
    story = _.merge({
        todos: []
    }, story)

    return {
        type: 'STORY:CREATE',
        id: story.id,
        object: story,
        sync: true
    }
}

export function update({id, story}) {
    return {
        type: "STORY:UPDATE",
        id,
        object: story,
        sync: true
    }
}

export function remove(id) {
    return {
        type: 'STORY:REMOVE',
        id,
        sync: true
    }
}

export function addTask({id,index=Infinity,todoId}) {
    return {
        type: 'STORY:TODO:ADD',
        id,
        todoId,
        index,
        sync: true
    }
}

export function removeTask({id, todoId}) {
    return {
        type: 'STORY:TODO:REMOVE',
        id,
        todoId,
        sync:true
     }
}

export function moveTask({id, todoId, index}) {
    return {
        type: 'STORY:TODO:MOVE',
        id,
        todoId,
        index,
        sync: true
    }
}

export function updateTeamStep({id, team, step}) {
    return {
        type: 'STORY:UPDATE',
        id,
        object: {
            teams: {
                [team]: {
                    step
                }
            }
        },
        sync:true
     }
}
