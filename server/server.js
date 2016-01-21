require('./auth')

var fs = require('fs')
import {config} from './config'
console.log(config)

global._ = require('lodash')

import {store} from './store'

var state = JSON.parse(fs.readFileSync('./state.json'))


var io = require('socket.io')(4042)
var socketioJwt = require('socketio-jwt')

io.use(socketioJwt.authorize({
  secret: config.secret,
  handshake: true
}));


console.log("Socket listening on", 4042)

store.dispatch({type:'//init/state', state})

store.subscribe(_.debounce(() => {
    fs.writeFile('./state.json', JSON.stringify(store.getState()))
}, 500))

io.on('connection', function (socket) {
  console.log('hello! ', socket.decoded_token);

  socket.on('state', function (data) {
    socket.emit('state', _.pick(store.getState(), ["stories", "columns", "board", "tasks"]));
  });

  socket.on('dispatch', function(action, callback) {
    console.log('•',action.type)
    store.dispatch(action)

    callback()
    action.from_network = true
    action.from = _.pick(socket.decoded_token, ['name','avatar_url'])
    socket.broadcast.emit('dispatch', action)
  })
});
