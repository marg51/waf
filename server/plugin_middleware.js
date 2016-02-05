import {merge} from 'lodash'
// see https://github.com/rackt/redux/blob/master/src/applyMiddleware.js
// or https://github.com/rackt/redux/blob/72ae943646fe5e23e55e4b287744028bc46e593c/src/applyMiddleware.js for the exact file
import {compose} from 'redux'

/**
 * updated applyMiddleware
 */
export function applyWafMiddleware(...middlewares) {
  return store => {
    var dispatch = store.dispatch
    var chain = []

    var middlewareAPI = {
      getState: store.getState,
      dispatch: (action) => {
        //   this is our waf code
        merge(action, {_metadata: {isPlugin: true}})

        return dispatch(action)
      }
    }
    chain = middlewares.map(middleware => middleware(middlewareAPI))
    dispatch = compose(...chain)(store.dispatch)

    return {
      ...store,
      dispatch
    }
  }
}