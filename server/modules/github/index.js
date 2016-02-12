import * as _ from 'lodash'
import * as api from './api'

import * as StoryActions from '../../../src/components/story/actions'

const decorate = (action) => {
    return _.set(action, '_metadata.origin', 'github')
}

export const GithubMiddleware = store => {

    setTimeout(function() {
        // this toggles waf's third task
        console.log(store.getState().tasks.items["todo_f3d561fe-0bb0-4bf3-a548-5745e0d51154"].checked)
        store.dispatch({type: 'TODO:UPDATE', id: "todo_f3d561fe-0bb0-4bf3-a548-5745e0d51154", todo: {checked: !store.getState().tasks.items["todo_f3d561fe-0bb0-4bf3-a548-5745e0d51154"].checked}, _metadata: {origin: 'github'}})
        console.log(store.getState().tasks.items["todo_f3d561fe-0bb0-4bf3-a548-5745e0d51154"].checked)
    }, 5000)

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
