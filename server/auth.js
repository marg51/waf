var request = require('request');
var restify = require('restify');
var jwt = require('jsonwebtoken');
import {config} from './config'

function getToken(code, callback) {
    request({
        method: 'POST',
        uri: `https://github.com/login/oauth/access_token?client_id=${config.client_id}&client_secret=${config.client_secret}&redirect_uri=${config.redirect_uri}&code=`+code,
        json: true
    },
    function (error, response, body) {
        callback(response.statusCode, body)
    })
}
function getBasicGithubData(token, callback) {
    request({
        method: 'GET',
        uri:'https://api.github.com/user?access_token='+token.access_token,
        headers: {
            "User-Agent": "marg51"
        },
        json: true
    }, function (error, response, body) {
        callback(response.statusCode, body)
    })
}

var server = restify.createServer({
  name: 'github auth',
  version: '0.0.1'
});
server.use(restify.acceptParser(server.acceptable));
server.use(restify.queryParser());
server.use(restify.bodyParser());

server.get('/github', function (req, res, next) {
  getToken(req.params.code, function(err, token) {
    store.dispatch({type: 'USER:ADD', token, token_type: "github", id: req.params.code, _metadata: {origin: 'Github Auth', private: true}})
    getBasicGithubData(token, function(err, data) {
        if(err == 200) {
            store.dispatch({type: 'USER:UPDATE', id: req.params.code, object: {github: _.pick(data, ['name','avatar_url', 'id'])}, _metadata: {origin: 'Github Auth', private: true}})

            var token = jwt.sign(store.getState().users.items[req.params.code].data, config.secret);
            res.send(token)
        } else {
            console.log('couldnt login', err, data)
            res.send(403, "Couldn't login")
        }

    })
  })
  return next();
});

import Trello from 'node-trello'

server.get('/trello', function (req, res, next) {
    new Trello(config.plugins.trello.key, req.params.code).get(`/1/tokens/`+req.params.code, (err, body) => {
        if(err) return res.send(403, err)

        store.dispatch({type: 'USER:ADD', token:req.params.code, token_type:"trello", id:body.idMember, _metadata: {origin: 'Trello Auth', private: true}})
        store.dispatch({type: 'USER:UPDATE', id:body.idMember, object: {trello: {id: body.idMember}}, _metadata: {origin: 'Trello Auth', private: true}})

        var token = jwt.sign(store.getState().users.items[body.idMember].data, config.secret);
            res.send(token)
    })
  return next();
});

server.listen(4043, function () {
  console.log('%s listening at %s', server.name, server.url);
});

var store;
export default {
    setStore(_store) {
        store = _store
    }

}
