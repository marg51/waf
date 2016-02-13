import * as columnActions from './actions'
import * as storyActions from '../story/actions'

export function ColumnController($scope, store, uuid, $timeout) {
    $scope.$on('$destroy', store.subscribe(() => {
        $scope.state = store.getState()
    }))
    $scope.state = store.getState()

    $scope.onInsert = function(storyId, index, metadata) {
        //  metadata comes from D&D lib and includes the column id
        //  if the source' column's id is different, then we remove from the source colulb and add it to the current column
        if(metadata[1].id !== $scope.column.id) {
            store.dispatch(columnActions.removeStory({id: metadata[1].id, storyId}))
            store.dispatch(columnActions.addStory({id: $scope.column.id, storyId, index}))
        }
        else {
            // bc the d&d count the new position with the previous elm still at its original place
            // so we actually have to remove 1 to account for that
            if($scope.column.stories.indexOf(storyId) < index) {
                index--
            }

            store.dispatch(columnActions.moveStory({id: $scope.column.id, storyId, index}))
        }
    }

    $scope.dragoverCallback = function(event, index, external, type) {
        return type[0] == "story"
    }

    $scope.addStory = function() {
        var id = uuid('story')
        store.dispatch(storyActions.add({id, title:"New Story"}))
        store.dispatch(columnActions.addStory({id: $scope.column.id, storyId:id}))

        store.dispatch({type: 'UI:STORY:OPEN', id})
    }

    $scope.updateColumn = function(column) {
        store.dispatch(columnActions.update({id: $scope.column.id, column}))
    }

    $scope.$watch('column', column => {
        if(column) {
            // count the sum of points
        }
    })
}
