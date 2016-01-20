export function StoryController($scope, store, uuid) {
    $scope.MUST = 5
    $scope.SHOULD = 4
    $scope.COULD = 3
    $scope.WOULD = 2

    $scope.FRONTEND = 1
    $scope.BACKEND = 2
    $scope.DESIGN = 3

    $scope.$on('$destroy', store.subscribe(() => {
        $scope.state = store.getState()
    }))
    $scope.state = store.getState()

    $scope.updateStory = function(object) {
        store.dispatch({type: 'STORY:UPDATE', id:$scope.story.id, object, sync:true})
    }
    $scope.removeStory = function(id) {
        store.dispatch({type: 'COLUMN:STORY:REMOVE', storyId: id, sync: true})
        store.dispatch({type: 'STORY:REMOVE', id, sync: true})
    }

    // create a new todo and add it to the stories tasks
    $scope.addTodo = function(todo, index) {
        var id = uuid('todo')
        store.dispatch({type: 'TODO:ADD', id, todo: {id, title:todo, checked:false}, sync: true})
        store.dispatch({type: 'STORY:TODO:ADD', id:$scope.story.id, todoId:id, index, sync: true})
    }

    $scope.removeTodo = function(todoId) {
        store.dispatch({type: 'STORY:TODO:REMOVE', id:$scope.story.id, todoId, sync:true})
        // soft delete
        store.dispatch({type: 'TODO:REMOVE', id:todoId, sync:true})
    }

    $scope.openStory = function(id) {
        store.dispatch({type: 'UI:STORY:OPEN', id})
    }
    $scope.closeStory = function(id) {
        store.dispatch({type: 'UI:STORY:CLOSE', id})
    }

    $scope.toggleOpenStory = function(id) {
        if($scope.state.ui.stories[id] && $scope.state.ui.stories[id].open) {
            $scope.closeStory(id)
        } else {
            $scope.openStory(id)
        }
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

    $scope.cloneTodo = function(todo, index) {
        $scope.addTodo(todo.title, index)
    }

    $scope.select = function() {
        store.dispatch({type: "UI:STORY:SELECT", story: {
            id: $scope.story.id,
            column_id: $scope.$parent.column.id,
            row: $scope.state.columns.items[$scope.$parent.column.id].stories.indexOf($scope.story.id),
            column: $scope.state.board.columns.indexOf($scope.$parent.column.id)
        }})
    }

    $scope.$watch('state.tasks', () => {
        $scope.story.checked_todo = _.filter($scope.story.todos, todoId => $scope.state.tasks.items[todoId].checked).length
    })
}
