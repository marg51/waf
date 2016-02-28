var restify = require('restify');

var server = restify.createServer({
  name: 'trello auth',
  version: '0.0.1'
});
server.use(restify.acceptParser(server.acceptable));
server.use(restify.queryParser());
server.use(restify.bodyParser());

import * as storyActions from '../../../src/components/story/actions'

const decorate = (action) => {
    return _.set(action, '_metadata.origin', 'trello')
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
                        const id = _.filter(state.stories.items, (story) => _.get(story, '_metadata.trello.id') == action.data.card.id)[0].id
                        console.log(storyActions.update({id, story: {title: action.data.card.name}}))
                        store.dispatch(decorate(storyActions.update({id, story: {title: action.data.card.name}})))
                    }
                    else if(action.data.old.desc) {
                        console.log(action.data.card.id)
                        const id = _.filter(state.stories.items, (story) => _.get(story, '_metadata.trello.id') == action.data.card.id)[0].id
                        console.log(storyActions.update({id, story: {description: action.data.card.desc}}))
                        store.dispatch(decorate(storyActions.update({id, story: {description: action.data.card.desc}})))
                    }

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




