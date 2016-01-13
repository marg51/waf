export function BoardController($scope, store, $timeout, uuid) {

    window.socket = io('http://localhost:4042', {
        query: 'token='+localStorage.getItem('waf.token')
    });

    $scope.$on('$destroy', store.subscribe(() => {
        $scope.state = store.getState()
        $timeout(angular.noop,0)
    }))

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

    $scope.addColumn = function(column) {
        column.id = uuid('column')
        column.stories = []

        store.dispatch({type: '//GROUP', items: [
                {type: 'COLUMN:CREATE', id:column.id, object: column},
                {type: 'BOARD:COLUMN:ADD', columnId: column.id}
            ],
            name: 'COLUMN:CREATE',
            sync: true
        })
        $scope.__.addColumn = false
    }

}
