export function TaskController($scope, store) {
    $scope.$on('$destroy', store.subscribe(() => {
        $scope.state = store.getState()
    }))
    $scope.state = store.getState()

    $scope.updateTodo = function(id, todo) {
        store.dispatch({type: 'TODO:UPDATE', id, todo, sync:true})
    }

    $scope.toggleTodo = function(id, value) {
        if(value) {
            $scope.updateTodo(id, {checked: true})
        }
        else {
            $scope.updateTodo(id, {checked: false})
        }
    }
}