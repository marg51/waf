import Trello from 'node-trello'
import {config} from '../../config'

const api = new Trello(config.plugins.trello.key, config.plugins.trello.token)

api.get('/1/cards/8vdQrvMA', (err, data) => {
    console.log(JSON.stringify(data))
})