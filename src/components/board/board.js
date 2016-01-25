import * as columnActions from '../column/actions'
import * as boardActions from './actions'

export function BoardController($scope, store, $timeout, uuid) {

    window.socket = io('http://localhost:4042', {
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

}
