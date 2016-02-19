import {StoryController} from './story'
export function story() {
    return {
        template: require('./story.html'),
        scope: {
            story: "="
        },
        controller: StoryController
    }
}

export function storyModal() {
    return {
        template: require('./story-modal.html'),
        scope: {
            story: "=storyModal"
        },
        controller: StoryController
    }
}
