export function BoardController($scope, GithubService, GithubConfigManager) {

    $scope.fetch = function() {
        return GithubConfigManager.get($scope.repo)
         .then(_config => $scope.config = _config)
         .then(() => GithubService.getIssues($scope.repo, '?labels=waf:story'))
         .then(stories => $scope.stories = stories)
    }

    $scope.$watch('stories', stories => {
        if(stories) {
            $scope.columns = _.groupBy(stories, story => story.tags.column[0])

            _.map($scope.config.tags.column.items, column => {
                if(!$scope.columns[column])
                    $scope.columns[column] = []
            })
        }
    })
}
