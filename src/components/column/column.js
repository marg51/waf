export function ColumnController($scope, store, uuid, $timeout) {
    $scope.$on('$destroy', store.subscribe(() => {
        $scope.state = store.getState()
    }))
    $scope.state = store.getState()

    $scope.onInsert = function(storyId, index, metadata) {
        if(metadata[1].id !== $scope.column.id) {
            store.dispatch({type: "//GROUP", items: [
                    {type: 'COLUMN:STORY:REMOVE', id: metadata[1].id, storyId},
                    {type: 'COLUMN:STORY:ADD', id: $scope.column.id, index, storyId}
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

    $scope.addStory = function() {
        var id = uuid('story')
        store.dispatch({type: 'STORY:CREATE', id, object: {id, title: 'New Story', todos: [], size:0}, sync: true})
        store.dispatch({type: 'COLUMN:STORY:ADD', id:$scope.column.id, index: $scope.column.stories.length, storyId: id, sync: true})
        store.dispatch({type: 'UI:STORY:EDIT', id})
    }

    $scope.updateColumn = function(object) {
        store.dispatch({type: 'COLUMN:UPDATE', id:$scope.column.id, object, sync: true})
    }

    $scope.$watch('column', column => {
        if(column) {
            // count the sum of points
        }
    })
}
