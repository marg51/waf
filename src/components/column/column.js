export function ColumnController($scope, GithubService, GithubConfigManager, GithubLabelsManager, $timeout) {
    $scope.onInsert = function(story, index) {
        story.promise = GithubLabelsManager.updateStoryColumn(story, $scope.$parent.column)
            .then(() => {
                $timeout(() => {
                    delete story.promise
                }, 5000)
            })
    }

     $scope.onMove = function(story) {
        $scope.stories.splice($scope.stories.indexOf(story), 1)
    }
}
