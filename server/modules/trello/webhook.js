var restify = require('restify');

var server = restify.createServer({
  name: 'trello auth',
  version: '0.0.1'
});
server.use(restify.acceptParser(server.acceptable));
server.use(restify.queryParser());
server.use(restify.bodyParser());

import * as storyActions from '../../../src/components/story/actions'
import * as columnActions from '../../../src/components/column/actions'

const decorate = (action) => {
    return _.set(action, '_metadata.origin', 'trello')
}

const getStoryId = function(state, trelloId) {
    return _.filter(state.stories.items, (story) => _.get(story, '_metadata.trello.id') == trelloId)[0].id
}
const getColumnIdByStoryId = function(state, storyId) {
    return _.filter(state.columns.items, (column) => column.stories.indexOf(storyId) >=0)[0].id
}
const getColumnId = function(state, trelloId) {
    return _.filter(state.columns.items, (story) => _.get(story, '_metadata.trello.id') == trelloId)[0].id
}

export const TrelloWebhookMiddleware =  (store) => {
    server.head('/', function (req, res, next) {
        res.send(200)
        return next();
    });

    server.post('/', function(req, res, next) {
        res.send(200)

        try {
            var state = store.getState()
            var action = req.params.action

            console.log(JSON.stringify(action,null,4))
            switch(action.type) {
                case 'updateCard':
                    if(action.data.old.name) {
                        console.log(action.data.card.id)
                        const id = getStoryId(state, action.data.card.id)
                        console.log(storyActions.update({id, story: {title: action.data.card.name}}))
                        store.dispatch(decorate(storyActions.update({id, story: {title: action.data.card.name}})))
                    }
                    else if(action.data.old.desc) {
                        console.log(action.data.card.id)
                        const id = getStoryId(state, action.data.card.id)
                        console.log(storyActions.update({id, story: {description: action.data.card.desc}}))
                        store.dispatch(decorate(storyActions.update({id, story: {description: action.data.card.desc}})))
                    }
                    // move position
                    else if(action.data.old.pos) {
                        var storyId = getStoryId(state, action.data.card.id)
                        var id = getColumnIdByStoryId(state, storyId)
                        store.dispatch(decorate(columnActions.moveStory({id, storyId, index: action.data.card.pos})))
                    }
                    // move column
                    else if(action.data.old.idList) {
                        var storyId = getStoryId(state, action.data.card.id)
                        var oldColumnId = getColumnIdByStoryId(state, storyId)
                        var id = getColumnId(state, action.data.card.idList)
                        store.dispatch(decorate(columnActions.removeStory({id:oldColumnId, storyId})))
                        store.dispatch(decorate(columnActions.addStory({id, storyId, index: 0})))
                    }
                    break
                case 'addLabelToCard':
                    var id = getStoryId(state, action.data.card.id)
                    store.dispatch(decorate(storyActions.update({id, story: {labels: {[action.data.value]:true}}})))
                    break;
                case 'removeLabelFromCard':
                    var id = getStoryId(state, action.data.card.id)
                    store.dispatch(decorate(storyActions.update({id, story: {labels: {[action.data.value]:false}}})))
                    break;

            }
        } catch(e) {
            console.log(e)
        }

        next()
    })

    server.listen(4044, function () {
        console.log('%s trello at %s', server.name, server.url);
    });


    return next => action => next(action)
}
