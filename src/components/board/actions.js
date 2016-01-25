export function addColumn({id, columnId}) {
    return {
        type: 'BOARD:COLUMN:ADD',
        columnId,
        sync: true
    }
}
export function removeColumn({id, columnId}) {
    return {
        type: 'BOARD:COLUMN:REMOVE',
        columnId,
        sync: true
    }
}