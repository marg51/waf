export function add(column) {
    if(!column.stories) {
        column.stories = []
    }

    return {
        type: 'COLUMN:CREATE',
        id: column.id,
        object: column,
        sync: true
    }
}

export function update({id, column}) {
    return {
        type: 'COLUMN:UPDATE',
        id,
        object: column,
        sync: true
    }
}

export function remove(id) {
    return {
        type: 'COLUMN:REMOVE',
        id,
        sync: true
    }
}

export function addStory({id, storyId, index}) {
    return {
        type: 'COLUMN:STORY:ADD',
        id,
        storyId,
        index,
        sync: true
    }
}

export function moveStory({id, storyId, index}) {
    return {
        type: 'COLUMN:STORY:MOVE',
        id,
        storyId,
        index,
        sync: true
    }
}
export function removeStory({id, storyId}) {
    return {
        type: 'COLUMN:STORY:REMOVE',
        id,
        storyId,
        sync: true
    }
}