import {PluginService} from '../../plugin_middleware'

export const onAction = (action, getState) => {
    console.log('•', action._metadata.origin, action._metadata.user, action.type)
}


const {dispatch, getState} = PluginService.add('github', onAction)


setTimeout(function() {
    dispatch({type: 'YUP, it works'})
}, 1000)
