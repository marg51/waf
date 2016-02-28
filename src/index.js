var app = angular.module('app', [
    'ui.router',
    'dndLists',
    'ui.bootstrap',
    'monospaced.elastic'
])


function AppConfig($stateProvider, $urlRouterProvider, $locationProvider) {
    $locationProvider.html5Mode(true);
    $urlRouterProvider.otherwise('/');

    $stateProvider.state('board', {
        url: '/',
        template: "<board/>",
        resolve: {
            token: function($q, $state, $timeout){
                if(localStorage.getItem('waf.token'))
                    return $q.when(localStorage.getItem('waf.token'))
                else {
                    return $timeout(() => {
                        return $state.go('login')
                    })
                }
            }
        }
    })

    $stateProvider.state('demo', {
        url: '/demo',
        template: "<demo/>"
    })

    $stateProvider.state('login', {
      url: '/login',
      template: `<div class="well">
            <a href="https://trello.com/1/authorize?expiration=never&name=uto.io&key=05d910022daa0558e1ada897808482b2&callback_method=fragment&scope=read,write&return_url=${encodeURIComponent(window.location.href)}/trello"><i class="fa fa-trello fa-2x"></i> Login using Trello</a><br />
            <a href="https://github.com/login/oauth/authorize?client_id=8d57891975e4f895c94e&redirect_uri=${encodeURIComponent(window.location.href)}/github"><i class="fa fa-github fa-2x"></i> Login using Github</a>
            <ui-view/>
        </div>`
    })
    $stateProvider.state('login.gh', {
        url: '/github?code',
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
    $stateProvider.state('login.trello', {
        url: '/trello?code',
        template: "<span promise='promise'></span><span ng-if='promise.isLoading'>Logging in, please wait …</span><span ng-if='promise.isLoaded'>Logged in! <a ui-sref='board'>Go to main page</a></span><span ng-if='promise.hasError'>Sorry, login failed</span>",
        reloadOnSearch: false,
        controller: function($scope, $location, $stateParams, $http, $state) {
            var code = $location.hash().split('=')[1]
            $location.search('code','github')

            $scope.promise = $http.get('/auth/trello?code='+code).then(function(data) {
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
import {init as demoInit} from './components/demo/'
demoInit(app)
import {init as shortcutsInit} from './shortcuts'
shortcutsInit(app)

import {combineReducers} from 'redux'
import {newStore} from './store'

import {reducer as stories} from './components/story/reducer'
import {reducer as teams} from './components/team/reducer'
import {reducer as board} from './components/board/reducer'
import {reducer as columns} from './components/column/reducer'
import {reducer as tasks} from './components/task/reducer'
import {reducer as ui} from './reducer'

export const store = newStore(combineReducers({
    stories,
    board,
    columns,
    teams,
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
        elm.on('keydown', function($event) {
            if(event.keyCode == 13 && !event.shiftKey) {
                scope.$eval(attr.onEnter, {$event})
                scope.$apply()
            }
        })
    }
})

app.directive('onEsc', function() {
    return (scope, elm, attr) => {
        elm.on('keydown', function($event) {
            if(event.keyCode == 27) {
                scope.$eval(attr.onEsc, {$event})
                scope.$apply()
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

app.directive('progressBar', function() {
    return {
        template: `<span class="progress-bar-item" ng-style="{width: width}">&nbsp;</span>`,
        scope: {
            width: '@progressBar'
        },
        link: (scope, $elm) => {
            scope.$watch('width', width => {
                if(width === "100%") {
                    $elm.addClass('full-width')
                } else {
                    $elm.removeClass('full-width')
                }
            })
        }
    }
})

// https://gist.github.com/mlynch/dd407b93ed288d499778
app.directive('appAutofocus', ['$timeout', function($timeout) {
  return {
    restrict: 'A',
    link : function($scope, $element, $attrs) {
      $timeout(function() {
          console.log($scope.$eval($attrs.autofocus))
          if(!$attrs.appAutofocus || $scope.$eval($attrs.appAutofocus)) {
            // $element[0].focus();
            console.log("autofocus is disabled")
          }
      });
    }
  }
}]);