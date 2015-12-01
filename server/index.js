// require('./auth')

var fs = require('fs')

global._ = require('lodash')

import {store} from './store'

var state = JSON.parse(fs.readFileSync('./state.json'))

var io = require('socket.io')(4042);


store.dispatch({type:'//init/state', state})

store.subscribe(_.debounce(() => {
    fs.writeFile('./state.json', JSON.stringify(store.getState()))
}, 500))

io.on('connection', function (socket) {
  socket.on('state', function (data) {
    socket.emit('state', _.pick(store.getState(), ["stories", "columns", "board"]));
  });

  socket.on('dispatch', function(action, callback) {
    console.log('•',action.type)
    store.dispatch(action)

    callback()
    action.from_network = true
    socket.broadcast.emit('dispatch', action)
  })
});
