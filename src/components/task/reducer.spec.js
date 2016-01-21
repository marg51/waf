import {expect} from 'chai';
import {reducer} from './reducer'
import * as actions from './actions'

describe('TaskReducer', () => {
    describe('//init/state', () => {
        it('should load init state', () => {
            var state = reducer(undefined, {type: '//init/state', state: {tasks: {items: {1:true}}}})

            expect(state).to.deep.equal({items: {1: true}})
        })
    })

    describe('TODO:ADD', () => {
        it('should add a todo', () => {
            var state = reducer(undefined, actions.add({id: 1, title:"salut"}))

            expect(state).to.deep.equal({items:{1:{id: 1, title: "salut"}}})
        })
    })

    describe('TODO:REMOVE', () => {
        it('should remove a todo', () => {
            var state = reducer(undefined, actions.add({id: 1, title:"salut"}))
            state = reducer(state, actions.remove(1))

            expect(state).to.deep.equal({items:{1:{id: 1, title: "salut", removed: true}}})
        })
    })

    describe('TODO:UPDATE', () => {
        it('should update a todo', () => {
            var state = reducer(undefined, actions.add({id: 1, title:"salut"}))

            state = reducer(state, actions.update({id:1, todo: {checked: true, title: "woop"}}))

            expect(state).to.deep.equal({items: {1: {id: 1, title: "woop", checked: true}}})
        })
    })
});
