import {map, merge} from 'lodash'
import {store} from './store'

const services = {}

/*
 * we send the action to all registered services
 */
export const PluginMiddleware = store => next => action => {
    if(!action._metadata) {
        throw new Error(`action of type ${action.type} doesn't have metadata`)
    }
    console.log(action._metadata.origin, action.type)
    map(services, (callback, name) => {
        if(action._metadata.origin != name) {
            try {
                callback(action, store.getState)
            } catch(e) {
                console.error(`• Couldnt execute service "${name}" for action of type "${action.type}"`, e)
            }
        }
    })

    return next(action)
}

// const {dispatch, getState} = service.add('github', onActionCallback)
export const PluginService = {
    add(name, callback) {
        if(services[name]) {
            throw new Error(`Plugin ${name} is already registered`)
        }

        services[name] = callback


        return {
            dispatch: (action) => {
                merge(action, {_metadata: {origin: name, isPlugin: true}})

                return store.dispatch(action)
            },
            getState: store.getState
        }
    }, remove(name) {
        delete services[name]
    }
}