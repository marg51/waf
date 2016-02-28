import * as _ from 'lodash'
import {config} from '../../config'

import Trello from 'node-trello'

const createApi = function(token) {
    return new Trello(config.plugins.trello.key, token)
}

import * as StoryActions from '../../../src/components/story/actions'

const decorate = (action) => {
    return _.set(action, '_metadata.origin', 'trello')
}

var pool = {}

var getApi = (token) => {
    if(!pool[token])
        pool[token] = createApi(token)

    return pool[token]
}
var getTokenForId = (state, id) => {
    return state.users.items[id].tokens.trello
}
export const TrelloMiddleware = store => {

    return next => action => {
        if(action._metadata.origin !== "webapp") return next(action)
        const result = next(action)
        const state = store.getState()

        if(!action._metadata.user.trello || !action._metadata.user.trello.id) return next(action)

        var token = getTokenForId(state, action._metadata.user.trello.id)
        var api = getApi(token)

        switch(action.type) {
            case 'COLUMN:STORY:MOVE':
            case 'COLUMN:STORY:ADD':
                var story = state.stories.items[action.storyId]
                var column = state.columns.items[action.id]

                // column changed
                if(_.get(story, '_metadata.trello.id')) {
                    return api.put(`/1/cards/${story._metadata.trello.id}`, {idList: column._metadata.trello.id, pos: action.index}, (err, body) => {
                        if(!err) {
                            store.dispatch(decorate(StoryActions.update({id: action.storyId, story: {
                                _metadata: {
                                    trello: {id: body.id}
                                }
                            }})))
                        }
                    })
                }

                return api.post(`/1/cards`, {idList: column._metadata.trello.id,name: story.title, desc: story.description, pos: action.index}, (err, body) => {
                    if(!err) {
                        console.log(body)
                        store.dispatch(decorate(StoryActions.update({id: action.storyId, story: {
                            _metadata: {
                                trello: {id: body.id}
                            }
                        }})))
                    }
                })
            case 'STORY:UPDATE':
                var story = state.stories.items[action.id]
                console.log(story)
                return api.put(`/1/cards/${story._metadata.trello.id}`, {name: story.title, desc: story.description}, (err, body) => {
                    console.log(err, body)
                })
        }


        return result
    }

}
