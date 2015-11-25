import {GITHUB_ENDPOINT} from './index.js'

export function GithubService($http, $q) {
    var service = {
        getConfig(repo) {
            return service.getIssues(repo, '?labels=waf:config&state=closed')
                .then(data => {
                    if(data.length == 0) {
                        return $q.reject('No config issue found')
                    }
                    try {
                        var config = JSON.parse(data[0].body)
                    } catch(e) {
                        return $q.reject('Body of config issue is not parseable ( '+data[0].url+' )')
                    }

                    return config
                })
        },


        getIssues(repo, params="") {
            return $http.get(GITHUB_ENDPOINT+'repos/'+repo+'/issues'+params)
                .then(data => data.data)
                .then(data => {
                    return _.filter(data, issue => {
                        return !issue.pull_request
                    })
                })
                .then(data => {
                    return _.map(data, issue => {
                        var tags = {}
                        _.map(issue.labels, (label) => {
                            var splitted = label.name.split(':')
                            if(splitted.length == 2) {
                                if(!tags[splitted[0]])
                                    tags[splitted[0]] = []
                                tags[splitted[0]].push(splitted[1])
                            }
                        })

                        issue.tags = tags

                        return issue
                    })
                })
        },
        getIssue(repo, id) {
            return $http.get(GITHUB_ENDPOINT+'repos/'+repo+'/issues/'+id)
                .then(data => data.data)
        },
        createIssue(repo, form) {
            return $http.post(GITHUB_ENDPOINT+'repos/'+repo+'/issues', form)
                .then(data => data.data)
        },
        patchIssue(repo, id, form) {
            return $http.patch(GITHUB_ENDPOINT+'repos/'+repo+'/issues/'+id, form)
                .then(data => data.data)
        },



        getLabels(repo) {
            return $http.get(GITHUB_ENDPOINT+'repos/'+repo+'/labels')
                .then(data => _.pluck(data.data,'name'))
        },
        createLabel(repo, name) {
            return $http.post(GITHUB_ENDPOINT+'repos/'+repo+'/labels', {name, color:'f29513'})
                .then(data => data.data)
        },
        addLabelToStory(repo, id, label) {
            return $http.post(GITHUB_ENDPOINT+'repos/'+repo+'/issues/'+id+'/labels', [label])
                .then(data => data.data)
        },
        removeLabelFromStory(repo, id, label) {
            return $http.delete(GITHUB_ENDPOINT+'repos/'+repo+'/issues/'+id+'/labels/'+label)
                .then(data => data.data)
        }
    }

    return service
}
