# Adding Plugins to the server

Plugins for our app are [redux' middlewares](http://redux.js.org/docs/advanced/Middleware.html), with a slight difference: We expect every dispatched action to have `{_metadata: {origin: PLUGIN_NAME}}`


## Examples

#### github-like middleware

We create a new comment in our app, we want to synchronise it with github

```javascript
export const GithubMiddleware = store => {

    /*
     * You can dispatch any action from here
     * it could be a http server waiting for webhooks
     */

    setTimeout( () => {
        store.dispatch({type: 'HELLO', _metadata: {origin: 'Github'}})
    }, 100)

    /*
     * this part is for listening events. It is mandatory, even if you don't want to listen to events. See the middleware docs above
     */

    return next => action => {

        // we get the state after the action has been handled by the reducers. If we want the state *before* the action takes place,
        // we can execute `next(action)` at the end
        const result = next(action)
        const state = store.getState()


        try {

            switch(action.type) {
                // This is the list of actions we are interested in
                case 'STORY:COMMENT:CREATE':
                    // random logic in here
                    doSomething(store.dispatch, state, action)
                    break
            }
        } catch (e) {
            console.log("[plugin][github] couldn't execute action blabla", action, e)
        }

        // MANDATORY
        return result // or return next(action) if it's not already called above
    }

}
```

Then you have to load the plugin in the main `./server.js`

```javascript
import {initStore} from './store';


// load your module
import {GithubMiddleware} from './modules/github'

// list of your plugins. Order matters
const store  = initStore(state, [GithubMiddleware])
```

#### no-op middleware

```javascript
export const MyNoopMiddleware = store => next => action => next(action)
```

#### dispatcher only

```javascript
export const MyNoopMiddleware = store => {

    setTimeout( () => {
        store.dispatch({type: 'HELLO', _metadata: {origin: 'Github'}})
    }, 100)

    return next => action => next(action)
}
```

#### listener only

```javascript
export const MyNoopMiddleware = store => next => action => {

    switch(action.type) {
        case 'STORY:COMMENT:CREATE':
            // random logic in here
            doSomething(store.dispatch, state, action)
            break
    }

    return next(action)
}
```