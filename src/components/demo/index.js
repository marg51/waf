export function DemoController($scope) {
    $scope.actions = []
    $scope.add = function(id) {
        $scope.actions.push({checked: false, id: Math.ceil(Math.random()*1000)})
    }

    $scope.remove= function(index) {
        $scope.actions.splice($scope.actions.indexOf(index), 1)
    }
}

export function init(app) {
    app.directive('demo', () => {
        return {
            restrict: 'E',
            template: require('./index.html'),
            controller: DemoController
        }
    })
}