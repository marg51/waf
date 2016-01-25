import * as taskActions from './actions'

export function TaskController($scope, store) {
    $scope.$on('$destroy', store.subscribe(() => {
        $scope.state = store.getState()
    }))
    $scope.state = store.getState()

    $scope.updateTodo = function(id, todo) {
        store.dispatch(taskActions.update({id, todo}))
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