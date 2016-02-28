export const IoMiddlewareFactory = io => store => next => action => {
    const result = next(action)

    if(action._metadata.isPlugin) {
        if(!action._metadata.origin && !action._metadata.private) {
            throw new Error('all actions should define an origin')
        }
        io.emit('dispatch', action)
    }

    return result
}