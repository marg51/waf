var app = angular.module('app', [
    'ui.router',
    'dndLists',
    'ui.bootstrap'
])


function AppConfig($stateProvider, $urlRouterProvider, $locationProvider) {
    $locationProvider.html5Mode(true);
    $urlRouterProvider.otherwise('/');

    $stateProvider.state('board', {
        url: '/',
        template: "<board/>",
        resolve: {
            token: function($q, $state){
                if(localStorage.getItem('waf.token'))
                    return $q.when(localStorage.getItem('waf.token'))
                else {
                    alert('please login')
                    return $q.reject('Not logged in')
                }
            }
        }
    })

    $stateProvider.state('login', {
        url: '/login?code',
        template: "<span promise='promise'></span><span ng-if='promise.isLoading'>Logging in, please wait …</span><span ng-if='promise.isLoaded'>Logged in! <a ui-sref='board'>Go to main page</a></span><span ng-if='promise.hasError'>Sorry, login failed</span>",
        reloadOnSearch: false,
        controller: function($scope, $location, $stateParams, $http, $state) {
            var code = $stateParams.code;
            $location.search('code','github')

            $scope.promise = $http.get('/auth/github?code='+code).then(function(data) {
                localStorage.setItem("waf.token", data.data)
                $state.go('board')
            })
        }
    })
}

function AppRun($rootScope) {
    window.__$scope = $rootScope
}

require('./index.less')

app.config(AppConfig)
app.run(AppRun)

import {init as boardInit} from './components/board/'
boardInit(app)
import {init as storyInit} from './components/story/'
storyInit(app)
import {init as columnInit} from './components/column/'
columnInit(app)
import {init as taskInit} from './components/task/'
taskInit(app)
import {init as shortcutsInit} from './shortcuts'
shortcutsInit(app)

import {combineReducers} from 'redux'
import {newStore} from './store'

import {reducer as stories} from './components/story/reducer'
import {reducer as board} from './components/board/reducer'
import {reducer as columns} from './components/column/reducer'
import {reducer as tasks} from './components/task/reducer'
import {reducer as ui} from './reducer'

export const store = newStore(combineReducers({
    stories,
    board,
    columns,
    ui,
    tasks,
    history: (state = [], action) => {
        if(action.type == "HISTORY:SYNC") {
            return _.map(state, history => {
                if(history.id == action.id) {
                    return _.merge({}, history, {sync: true})
                }

                return history
            })
        }

        return state
    }
}))

window.__store = store

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

app.directive('onEnter', function() {
    return (scope, elm, attr) => {
        elm.on('keydown', function(event) {
            if(event.keyCode == 13) {
                scope.$eval(attr.onEnter)
            }
        })
    }
})

var uuid = require('node-uuid')

app.factory('uuid', function() {
    return function(type) {
        return type+'_'+uuid.v4()
    }
})

app.directive('input', function() {
    return {
        restrict: 'E',
        link: (scope, elm) => {
            elm.on('keydown', function(event) {
                if(event.keyCode == 27) {
                    elm[0].blur()
                }
            })
        }
    }
})

app.directive('marked', function($timeout) {
    return {
        scope: {
            marked: '=',
            opts: '='
        },
        link: (scope, elm, attrs) => {
            scope.$watch('marked', function(){scope.apply()})
            scope.$watch('opts', function(){scope.apply()})

            scope.apply = () => {
                elm.html(marked(scope.marked, _.merge({gfm:true, breaks: true},scope.opts)))
            }

            scope.apply()
        }
    }
})

// https://gist.github.com/mlynch/dd407b93ed288d499778
app.directive('autofocus', ['$timeout', function($timeout) {
  return {
    restrict: 'A',
    link : function($scope, $element) {
      $timeout(function() {
        $element[0].focus();
      });
    }
  }
}]);