export function ColumnController($scope, store) {
    $scope.$on('$destroy', store.subscribe(() => {
        $scope.state = store.getState()
    }))
    $scope.state = store.getState()

    $scope.onInsert = function(storyId, index, metadata) {
        if(metadata[1].id !== $scope.column.id) {
            store.dispatch({type: "//GROUP", items: [
                    {type: 'COLUMN:STORY:ADD', id: $scope.column.id, index, storyId},
                    {type: 'COLUMN:STORY:REMOVE', id: metadata[1].id, storyId}
                ]
                , sync: true
                , name: "STORY:COLUMN:CHANGE"
            })
        }
        else {
            store.dispatch({type: 'COLUMN:STORY:MOVE', id: metadata[1].id, index, storyId, sync: true})
        }
    }

    $scope.dragoverCallback = function(event, index, external, type) {
        return type[0] == "story"
    }

    $scope.$watch('column', column => {
        if(column) {
            // didn't finish, I wanted to count the sum of points
        }
    })
}
