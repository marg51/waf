export function BoardController($scope, store) {

    $scope.$on('$destroy', store.subscribe(() => {
        $scope.state = store.getState()
    }))

    $scope.fetch = function() {
        $scope.stories = [{
            id: 1,
            title: "SALUT"
        }, {
            id: 2,
            title: "WOOP WOOP"
        }]

        store.dispatch({type: 'COLUMN:CREATE', id:1, object: {id:1, name: 'doing', stories: []}})
        store.dispatch({type: 'COLUMN:CREATE', id:2, object: {id:2, name: 'review', stories: []}})

        store.dispatch({type: 'STORY:CREATE', id:1, object:{id:1, title:"salut", size: 1}})
        store.dispatch({type: 'STORY:CREATE', id:2, object:{id:2, title:"woop woop", size: 2}})

        store.dispatch({type: 'COLUMN:STORY:ADD', id: 1, index: 0, storyId: 1})
        store.dispatch({type: 'COLUMN:STORY:ADD', id: 2, index: 0, storyId: 2})

        store.dispatch({type: 'BOARD:COLUMN:ADD', columnId: 1})
        store.dispatch({type: 'BOARD:COLUMN:ADD', columnId: 2})
    }

    $scope.fetch()
}
