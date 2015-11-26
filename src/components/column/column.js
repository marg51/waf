export function ColumnController($scope, store) {
    $scope.$on('$destroy', store.subscribe(() => {
        $scope.state = store.getState()
    }))
    $scope.state = store.getState()

    $scope.onInsert = function(story, index) {
        store.dispatch({type: 'COLUMN:STORY:ADD', id: $scope.column.id, index, storyId: story})
    }

     $scope.onMove = function(story) {
        store.dispatch({type: 'COLUMN:STORY:REMOVE', id: $scope.column.id, storyId: story})
    }
}
