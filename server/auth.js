var request = require('request');
var restify = require('restify');
var jwt = require('jsonwebtoken');
var config = require('./config')
import {store} from './store'

function getToken(code, callback) {
    request({
        method: 'POST',
        uri: "https://github.com/login/oauth/access_token?client_id=${config.client_id}&client_secret=${config.client_secret}&redirect_uri=${config.redirect_uri}&code="+code,
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
    store.dispatch({type: 'USER:ADD', token, id: req.params.code})
    getBasicGithubData(token, function(err, data) {
        if(err == 200 && data.access_token) {
            store.dispatch({type: 'USER:UPDATE', id: req.params.code, object: _.pick(data, ['name','avatar_url', 'id'])})

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

server.listen(4043, function () {
  console.log('%s listening at %s', server.name, server.url);
});
