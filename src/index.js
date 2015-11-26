var app = angular.module('app', [
    // 'ui.router',
    'ui.bootstrap',
    'dndLists'
])



// function AppConfig($stateProvider, $urlRouterProvider, $locationProvider) {
//     $locationProvider.html5Mode(true);
//     $urlRouterProvider.otherwise('/');

//     $stateProvider.state('main', {
//         url: '/',
//         template: "<playlist/>",
//         controller: function($scope, $timeout, PlaylistService, PlayerService) {
//             $scope.state = store.getState()

//             window.x = function() {
//                 $scope.state = store.getState()
//                 $scope.$apply()
//             }

//             $scope.$on('$destroy', store.subscribe(() => {
//                 $scope.state = store.getState()
//                 $timeout(angular.noop,0)
//             }))
//         }
//     })
// }

function AppRun($rootScope, GithubService, GithubLabelsManager, GithubConfigManager) {
    window.__$scope = $rootScope
    window.__GithubService = GithubService
    window.__GithubConfigManager = GithubConfigManager
    window.__GithubLabelsManager = GithubLabelsManager
}

// app.config(AppConfig)
app.run(AppRun)


import {init as githubInit} from './components/github/'
githubInit(app)
import {init as boardInit} from './components/board/'
boardInit(app)
import {init as storyInit} from './components/story/'
storyInit(app)
import {init as columnInit} from './components/column/'
columnInit(app)


import {combineReducers} from 'redux'
import {newStore} from './store'

import {reducer as stories} from './components/story/reducer'
import {reducer as board} from './components/board/reducer'
import {reducer as columns} from './components/column/reducer'

export const store = newStore(combineReducers({
    stories,
    board,
    columns
}))


app.constant('store', store)

app.directive('promise', function() {
    return {
        restrict: 'A',
        scope: {
            promise: '='
        },
        controller: function($scope, $q) {
            // it's low level, so might break
            $scope.$watch('promise.$$state.status', function(status) {
                if(status === undefined) return;
                $scope.promise.isLoading = (status == 0);
                $scope.promise.isLoaded  = (status == 1);
                $scope.promise.hasError  = (status == 2);

                if(status == 2) {
                    if( $scope.promise.$$state.value) {
                        $scope.promise.errorMessage = $scope.promise.$$state.value.statusText || $scope.promise.$$state.value.message || $scope.promise.$$state.value;
                        $scope.promise.errorCode = $scope.promise.$$state.value.status;
                    }
                }
            });
        }
    }
});
