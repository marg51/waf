export function ColumnController($scope, store) {
    $scope.$on('$destroy', store.subscribe(() => {
        $scope.state = store.getState()
    }))
    $scope.state = store.getState()

    $scope.onInsert = function(storyId, index, sourceId) {
        if(sourceId !== $scope.column.id) {
            store.dispatch({type: "//GROUP", items: [
                    {type: 'COLUMN:STORY:ADD', id: $scope.column.id, index, storyId},
                    {type: 'COLUMN:STORY:REMOVE', id: sourceId, storyId}
                ]
                , sync: true
                , name: "STORY:COLUMN:CHANGE"
            })
        }
        else {
            store.dispatch({type: 'COLUMN:STORY:MOVE', id: $scope.column.id, index, storyId, sync: true})
        }
    }
}
