import {PluginService} from '../../plugin_middleware'

export const onAction = (action, getState) => {
    console.log('•', action._metadata.origin, action._metadata.user, action.type)
}


const {dispatch, getState} = PluginService.add('github', onAction)


setTimeout(function() {
    // this toggles waf's third task
    dispatch({type: 'TODO:UPDATE', id: "todo_f3d561fe-0bb0-4bf3-a548-5745e0d51154", todo: {checked: !getState().tasks.items["todo_f3d561fe-0bb0-4bf3-a548-5745e0d51154"].checked}})
}, 5000)

