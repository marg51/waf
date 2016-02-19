import * as taskActions from '../task/actions'
import * as storyActions from './actions'
import {steps} from '../team'

export function StoryController($scope, store, uuid) {
    $scope.MUST = 5
    $scope.SHOULD = 4
    $scope.COULD = 3
    $scope.WOULD = 2

    $scope.FRONTEND = 1
    $scope.BACKEND = 2
    $scope.DESIGN = 3

    $scope._ = {}

    $scope.$on('$destroy', store.subscribe(() => {
        $scope.state = store.getState()
    }))
    $scope.state = store.getState()

    $scope.updateStory = function(story) {
        store.dispatch(
            storyActions.update({id:$scope.story.id, story})
        )
    }
    $scope.removeStory = function(id) {
        store.dispatch({type: 'COLUMN:STORY:REMOVE', storyId: id, sync: true})
        store.dispatch(
            storyActions.remove({id})
        )
    }

    // create a new todo and add it to the stories tasks
    $scope.addTodo = function(title, index) {
        if(!title) return;
        var id = uuid('todo')
        store.dispatch(
            taskActions.add({id, title})
        )
        store.dispatch(
            storyActions.addTask({id: $scope.story.id, index, todoId:id})
        )
    }

    $scope.removeTodo = function(todoId) {
        store.dispatch(storyActions.removeTask({id:$scope.story.id, todoId}))
        // soft delete
        store.dispatch(taskActions.remove({id:todoId}))
    }

    $scope.openStory = function(id) {
        store.dispatch({type: 'UI:STORY:OPEN', id})
    }
    $scope.closeStory = function(id) {
        store.dispatch({type: 'UI:STORY:CLOSE', id})
    }

    $scope.teamNextStep = function(team) {
        store.dispatch(storyActions.updateTeamStep({
            id:$scope.story.id,
            team,
            step: steps[ steps.indexOf(_.get($scope.story,'teams['+team+'].step')) + 1 ] || steps[0]
        }))
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
        store.dispatch(
            storyActions.moveTask({id:$scope.story.id, todoId, index})
        )
    }

    $scope.dragoverCallback = function(event, index, external, type) {
        return type[0] == 'todo' && type[1].id == $scope.story.id
    }

    $scope.cloneTodo = function(todo, index) {
        $scope.addTodo(todo.title, index)
    }

    $scope.select = function() {
        if(_.get($scope.state.ui,'selected_story.id') == $scope.story.id)
            return
        store.dispatch({type: "UI:STORY:SELECT", story: {
            id: $scope.story.id,
            column_id: $scope.$parent.column.id,
            row: $scope.state.columns.items[$scope.$parent.column.id].stories.indexOf($scope.story.id),
            column: $scope.state.board.columns.indexOf($scope.$parent.column.id)
        }})
    }

    $scope.$watch('story', () => {
        $scope.stats = _.reduce($scope.story.teams, (stats, team) => {
            stats.total += steps.length - 1
            stats.done += steps.indexOf(team.step)

            return stats
        }, {total:0, done: 0})
    })

    $scope.blur = function($event) {
        $event.currentTarget.blur()
    }
}
