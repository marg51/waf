export function StoryController($scope, store, uuid) {
    $scope.$on('$destroy', store.subscribe(() => {
        $scope.state = store.getState()
    }))
    $scope.state = store.getState()

    $scope.updateStory = function(object) {
        store.dispatch({type: 'STORY:UPDATE', id:$scope.story.id, object, sync:true})
    }

    $scope.toggleTodo = function(todoId, value) {
        if(value) {
            store.dispatch({type: 'STORY:TODO:CHECK', id:$scope.story.id, todoId, sync:true})
        }
        else {
            store.dispatch({type: 'STORY:TODO:UNCHECK', id:$scope.story.id, todoId, sync:true})
        }
    }

    $scope.addTodo = function(todo, index) {
        store.dispatch({type: 'STORY:TODO:ADD', id:$scope.story.id, todo: {id: uuid('todo'), title:todo, checked:false}, index, sync: true})
    }
    $scope.removeTodo = function(todoId) {
        store.dispatch({type: 'STORY:TODO:REMOVE', id:$scope.story.id, todoId, sync:true})
    }
    $scope.updateTodo = function(todoId, object) {
        store.dispatch({type: 'STORY:TODO:UPDATE', id:$scope.story.id, todoId, object, sync:true})
    }
    $scope.openStory = function(id) {
        store.dispatch({type: 'UI:STORY:OPEN', id})
    }
    $scope.closeStory = function(id) {
        store.dispatch({type: 'UI:STORY:CLOSE', id})
    }
    $scope.editStory = function(id) {
        store.dispatch({type: 'UI:STORY:EDIT', id})
    }
    $scope.stopEditStory = function(id) {
        store.dispatch({type: 'UI:STORY:STOP_EDIT', id})
    }
    $scope.onTodoMove = function(todoId,index) {
        store.dispatch({type: 'STORY:TODO:MOVE', id:$scope.story.id, todoId, index, sync:true})
    }

    $scope.dragoverCallback = function(event, index, external, type) {
        return type[0] == 'todo' && type[1].id == $scope.story.id
    }
    $scope.setTodoType = function(todo, kind) {
        if(todo['is_'+kind]) {
            store.dispatch({type: 'STORY:TODO:REMOVE_TYPE', id:$scope.story.id, todoId: todo.id, kind, sync:true})
        } else {
            store.dispatch({type: 'STORY:TODO:ADD_TYPE', id:$scope.story.id, todoId: todo.id, kind, sync:true})

        }
    }
    $scope.cloneTodo = function(todo, index) {
        $scope.addTodo(todo.title, index)
    }

    $scope.$watch('story', story => {
        if(story) {
            story.checked_todo = _.filter(story.todos, todo => todo.checked).length
        }
    })
}
