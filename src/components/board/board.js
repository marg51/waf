import * as columnActions from '../column/actions'
import * as boardActions from './actions'

export function BoardController($scope, store, $timeout, uuid, $modal) {

    window.socket = io({
        query: 'token='+localStorage.getItem('waf.token')
    });

    $scope.$on('$destroy', store.subscribe(() => {
        $scope.state = store.getState()
        $timeout(angular.noop,0)
    }))

    // eh!, not sure this should be there
    socket.emit('state', function(){});
    socket.on('state', function(state){
      store.dispatch({type: '//init/state', state})
    });
    socket.on('me', function(data) {
        $scope.me = data
    })
    socket.on('dispatch', function(action){
      store.dispatch(action)
    });
    socket.on('connect', () => {
        store.dispatch({type: 'UI:SOCKET:CONNECTED'})
    })
    socket.on('disconnect', () => {
        store.dispatch({type: 'UI:SOCKET:DISCONNECTED'})
    })
    // end — eh! —

    $scope.addColumn = function() {
        var id = uuid('column')

        store.dispatch(columnActions.add({id, name:"New Column"}))
        store.dispatch(boardActions.addColumn({id:1, columnId:id}))
    }

    $scope.removeColumn = function(columnId) {
        store.dispatch(boardActions.removeColumn({id:1, columnId}))
        // if we don't remove the object, does it mean we can undo really easily?
        // store.dispatch(columnActions.remove(columnId))
    }


    var current_modal;
    $scope.$watch('state.ui.open_story', (story_id) => {
        if(current_modal) current_modal.close()

        if(story_id) {
            current_modal = $modal.open({
                size: 'lg',
                template: `<div story-modal="state.stories.items['${story_id}']"/>`,
                scope: $scope,
                animation: false
            })

            // this is(should be) only triggered when you click outside the modal
            current_modal.result.catch(() => {
                store.dispatch({type: 'UI:STORY:CLOSE', story_id})
            })
        }
    })

}
