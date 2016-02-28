import Trello from 'node-trello'
import _ from 'lodash'
import colors from 'colors'
import fs from 'fs'
const readline = require('readline');

global._ = require('lodash')

import * as columnActions from '../../../src/components/column/actions'
import * as storyActions from '../../../src/components/story/actions'
import * as boardActions from '../../../src/components/board/actions'


var rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

import {initStore} from '../../store';

var store = initStore(undefined, [])

const save = function() {
    fs.writeFile('../../state.json', JSON.stringify(store.getState()))
}

import {config} from '../../config'

const api = new Trello(config.plugins.trello.key, config.plugins.trello.token)


api.get('/1/members/laurentmargirier/boards', (err, data) => {
    // console.log(JSON.stringify(data))
    _.map(data, (board, index) => {
        console.log((index+"").green+") "+board.name.gray)
    })

    rl.question('Which board do you want to import? Type the number: '.magenta, (answer) => {

        if(data[answer])
            console.log('Selected board:', data[answer].name);
        else {
            console.log("This is not a board: '"+answer+"'")
            process.exit(1)
        }

        rl.close();

        var board = data[answer]
        var cards, lists;

        var hackAsync = 0

        var next = function() {
            var cardsByList = _.groupBy(cards, 'idList')
            var listsIndexed = _.indexBy(lists, 'id')

            _.map(cardsByList, (cards, listId) => {
                console.log(listsIndexed[listId].name.green)

                _.map(cards, card => {
                    console.log(" • ",card.name.gray)
                })
            })

            rl = readline.createInterface({
                input: process.stdin,
                output: process.stdout
            });
            rl.question('Are you ready to process? [Y/n]'.magenta, (answer) => {
                rl.close();
                if(answer != "n" && answer != "N")
                    createBoard(board, listsIndexed, cardsByList)

            })
        }

        api.get('/1/boards/'+board.id+'/cards', (err, data) => {
            cards = data
            hackAsync++
            if(hackAsync == 2) {
                next()
            }
        })

        api.get('/1/boards/'+board.id+'/lists', (err, data) => {
            lists = data
            hackAsync++
            if(hackAsync == 2) {
                next()
            }
        })
    });
})

function createBoard(board, lists, cards) {
    function log(action) {
        store.dispatch(action)
    }

    log({type: 'BOARD:CREATE', id: board.id, title: board.name})


    _.map(lists, (list, id) => {
      log(columnActions.add({id, name: list.name, _metadata: {trello: {id}}}))
      log(boardActions.addColumn({id: 1, columnId: id}))

      _.map(cards[id], card => {
          log(storyActions.add({id:card.id, title: card.name, description:card.desc, labels: _.mapValues(_.indexBy(card.labels,'color'), () => true), _metadata: {trello: {id: card.id}}}))
          log({type: 'COLUMN:STORY:ADD', id, storyId: card.id})
      })
    })

    save()
}

// api.get('/1/cards/GIPwUxQ2', (err, data) => {
//     console.log(JSON.stringify(data))
// })
