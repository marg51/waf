var fs = require('fs')
import {config} from './config'

// lodash should be imported in each reducers. Until it's done, make lodash available everywhere
global._ = require('lodash')



// REDUX stuff
import {store} from './store';

// reload state from previous session
const state = JSON.parse(fs.readFileSync('./state.json'))
store.dispatch({
    type:'//init/state',
    state,
    _metadata: {
        origin: 'server'
    }
})

// We write the state up to 2 times per second
store.subscribe(_.debounce(() => {
    fs.writeFile('./state.json', JSON.stringify(store.getState()))
}, 500))
// -- end of Redux stuff



// modules
require('./modules/github')

// activate github OAUTH login
require('./auth')


// SOCKET SERVER
var io = require('socket.io')(4042)
var socketioJwt = require('socketio-jwt')

io.use(socketioJwt.authorize({
  secret: config.secret,
  handshake: true
}));

console.log("Socket listening on", 4042)

// For each socket:
io.on('connection', function (socket) {
    console.log('User logged-in', socket.decoded_token);

    // when the user request the current state
    // right now, the state is not automatically sent upon connection to avoid conflicts when the server restarts
    socket.on('state', function (data) {
      socket.emit('state', _.pick(
          store.getState(), ["stories", "columns", "board", "tasks"]
      ));
    });

    // when the user send an action
    socket.on('dispatch', function(action, callback) {

    // we need to identify the action
    action._metadata = {
        origin: "webapp",
        user: {
            name: socket.decoded_token.name,
            url: socket.decoded_token.avatar_url,
            id: socket.decoded_token.id
        }
    }

    store.dispatch(action)

    // notify the client that we received the action.
    // I wonder what would happen if an error is triggered in the dispatch phase
    callback(action)

    // send the action to everyone. In the future, it should be into its own namespace
    socket.broadcast.emit('dispatch', action)
  })
});
