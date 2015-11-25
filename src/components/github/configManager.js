const defaultConfig = {
    columns: {}
}

export function configManager(GithubService, $q) {
    return {
        get(repo) {
            return GithubService.getConfig(repo)
             .catch(error => {
                return GithubService.createIssue(repo, {body: JSON.stringify(defaultConfig), labels: ['waf:config'], title: "[ignore] Waf config", state: "closed"})
                    .then((issue) => GithubService.patchIssue(repo, issue.number, {state: "closed"}))
                    .then(() => defaultConfig)
                    .catch(error => {
                        console.error('couldnt get config', error)
                    })
             })
        }
    }
}
