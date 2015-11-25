export const labelsMap = {
    has: {
        color: '666666',
        items: [
            'frontend',
            'backend',
            'design'
        ]
    },
    is: {
        color: '999999',
        items: [
            0,
            1,
            2,
            3,
            5,
            8,
            13
        ]
    },
    column: {
        color: 'BBBBBB',
        items: [
            "Ready (This Sprint)",
            "Backlog",
            "Groomed",
            "In Progress",
            "In Review"
        ]
    },
    waf: {
        items: ['config','story']
    }
}

export function flattenTags(tags) {
    return _.flatten(_.map(tags, (elm,key) => {
        return _.map(elm.items, value => key+':'+value)
    }))
}

export function labelsManager(GithubService, GithubConfigManager, $q) {
    return {
        createLabels(repo) {
            return $q.all([
                GithubConfigManager.get(repo)
                 .then(config => config.tags),
                GithubService.getLabels(repo)
                     .then(labels  => {
                        return _.filter(labels, label => {
                            return label.split(':').length == 2
                        })
                    })
            ])
            .then(([expectedLabels, currentLabels]) => {
                let labelsToCreate = _.difference(flattenTags(expectedLabels), currentLabels)

                if(labelsToCreate.length) {
                    console.log('going to create labels:', labelsToCreate)

                    return $q.all(_.map(labelsToCreate, label => {
                        return GithubService.createLabel(repo, label)
                    }))
                } else {
                    console.log('no label to create')
                }

            }).catch(error => {
                console.error('Cant update labels', error)
            })
        },
        updateStoryColumn(story, newColumn) {
            var repo = story.labels_url.match(/github.com\/repos\/([a-z0-9-]+\/[a-z0-9-]+)\//)[1]

            var labelsToDelete = _.filter(story.labels, label => label.name.match(/^column:/) && !label.name.match('column:'+newColumn))
            var labelToAdd = {name: "column:"+newColumn}

            if(labelsToDelete.length == 0)
                return $q.resolve(true)

            story.labels = _.filter(story.labels, label => !label.name.match(/^column:/))

            var deletePromises = _.map(labelsToDelete, label => {
                return GithubService.removeLabelFromStory(repo, story.number, label.name)
            })

            story.labels.push(labelToAdd)

            var addPromise = GithubService.addLabelToStory(repo, story.number, labelToAdd.name)

            return $q.all([...deletePromises, addPromise])
        }
    }
}

