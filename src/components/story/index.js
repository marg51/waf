import {story, storyModal} from './directive'

export function init(app) {
    app.directive('story', story)
    app.directive('storyModal', storyModal)
    require('./story.less')
}
