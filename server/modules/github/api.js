const Github = require("github")

const api = new Github({
    version: '3.0.0'
})

import {config} from '../../config'

api.authenticate({
    type: "token",
    token: config.plugins.github.token,
});


export function createIssue({issue}, callback) {
    return api.issues.create({
        user: config.plugins.github.user,
        repo: config.plugins.github.repo,
        title: issue.title,
        body: issue.description
     }, callback)
}

export function updateIssue({issue}, callback) {
    if(!_.get(issue, '_metadata.github.number')) {
        console.log('[github]', 'cant save issue because no metadata', issue)
        return
    }
    return api.issues.edit({
        user: config.plugins.github.user,
        repo: config.plugins.github.repo,
        title: issue.title,
        body: issue.description,
        number: issue._metadata.github.number
     }, callback)
}