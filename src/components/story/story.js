export function StoryController($scope, store) {
    $scope.toggleTodo = function(index, value) {
        if(value)
            store.dispatch({type: 'STORY:TODO:CHECK', id:$scope.story.id, index})
        else
            store.dispatch({type: 'STORY:TODO:UNCHECK', id:$scope.story.id, index})
    }
}
