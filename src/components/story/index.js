import {story} from './directive'

export function init(app) {
    app.directive('story', story)
    require('./story.less')
}
