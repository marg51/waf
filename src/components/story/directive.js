import {StoryController} from './story'
export function story() {
    return {
        template: require('./story.html'),
        scope: true,
        controller: StoryController
    }
}
