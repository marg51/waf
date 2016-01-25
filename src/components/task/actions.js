export function add(todo) {
    return {
        type: 'TODO:ADD',
        id: todo.id,
        todo,
        sync:true
    }
}

export function remove(id) {
    return {
        type: 'TODO:REMOVE',
        id,
        sync:true
    }
}

export function update({id, todo}) {
    return {
        type: 'TODO:UPDATE',
        id,
        todo,
        sync:true
    }
}