import * as _ from 'lodash'
import * as api from './api'

import * as StoryActions from '../../../src/components/story/actions'

const decorate = (action) => {
    return _.set(action, '_metadata.origin', 'github')
}

export const GithubMiddleware = store => {

    return next => action => {
        if(action._metadata.origin !== "webapp") return next(action)

        const result = next(action)
        const state = store.getState()


        switch(action.type) {
            case 'STORY:CREATE':
                return api.createIssue({issue: state.stories.items[action.id]}, (err, body) => {
                    if(!err) {
                        store.dispatch(decorate(StoryActions.update({id: action.id, story: {
                            _metadata: {
                                github: _.omit(body, 'meta')
                            }
                        }})))
                    }
                })
            case 'STORY:UPDATE':
                return api.updateIssue({issue: state.stories.items[action.id]}, (err, body) => {
                    if(!err) {
                        store.dispatch(decorate(StoryActions.update({id: action.id, story: {
                            _metadata: {
                                github: _.omit(body, 'meta')
                            }
                        }})))
                    }
                })
            case 'STORY:COMMENT:CREATE':
                return api.createComment({storyId: action.id, comment: state.stories.items[action.id].comments[action.commendId]})
        }


        return result
    }

}
