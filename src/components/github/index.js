import {GithubService} from './service'
import {labelsManager} from './labelsManager'
import {configManager} from './configManager'
import {interceptor} from './interceptor'

export const GITHUB_TOKEN="YOUR TOKEN HERE"
export const GITHUB_ENDPOINT="https://api.github.com/"


function GithubConfig($httpProvider) {
    $httpProvider.interceptors.push(interceptor)
}


export function init(app) {
    app.factory('GithubService', GithubService)
    app.factory('GithubLabelsManager', labelsManager)
    app.factory('GithubConfigManager', configManager)
    app.config(GithubConfig)
}
