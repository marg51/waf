import {expect} from 'chai';
import {reducer} from './reducer'
import * as actions from './actions'

describe('ColumnReducer', () => {
    describe('//init/state', () => {
        it('should load init state', () => {
            var state = reducer(undefined, {type: '//init/state', state: {columns: {items: {1:true}}}})

            expect(state).to.deep.equal({items: {1: true}})
        })
    })

    describe('COLUMN:ADD', () => {
        it('should add a column', () => {
            var state = reducer(undefined, actions.add({id:1, title: "salut"}))

            expect(state).to.deep.equal({items:{1:{id: 1, title: "salut", stories: []}}})
        })
    })

    describe('COLUMN:UPDATE', () => {
        it('should update a column', () => {
            var state = reducer(undefined, actions.add({id: 1, title:"salut"}))

            state = reducer(state, actions.update({id:1, column: {checked: true, title: "woop"}}))

            expect(state).to.deep.equal({items: {1: {id: 1, title: "woop", checked: true, stories: []}}})
        })
    })

    describe('COLUMN:REMOVE', () => {
        it('should remove a column', () => {
            var state = reducer(undefined, actions.add({id: 1, title:"salut"}))

            state = reducer(state, actions.remove(1))

            expect(state).to.deep.equal({items: {}})
        })
    })

    describe('STORY', () => {
        describe('COLUMN:STORY:ADD', () => {
            it('should add a story', () => {
                var state = reducer(undefined, actions.add({id: 1, title:"salut"}))

                state = reducer(state, actions.addStory({id: 1, storyId: 1}))
                state = reducer(state, actions.addStory({id: 1, storyId: 2}))

                expect(state.items[1].stories).to.deep.equal([1,2])
            })
        })

        describe('COLUMN:STORY:MOVE', () => {
            it('should move a story', () => {
                var state = reducer(undefined, actions.add({id: 1, title:"salut"}))

                state = reducer(state, actions.addStory({id: 1, storyId: 1}))
                state = reducer(state, actions.addStory({id: 1, storyId: 2}))
                state = reducer(state, actions.addStory({id: 1, storyId: 3}))

                state = reducer(state, actions.moveStory({id: 1, storyId: 3, index: 1}))

                expect(state.items[1].stories).to.deep.equal([1,3,2])
            })
        })

        describe('COLUMN:STORY:REMOVE', () => {
            it('should remove a story', () => {
                var state = reducer(undefined, actions.add({id: 1, title:"salut"}))

                state = reducer(state, actions.addStory({id: 1, storyId: 1}))
                state = reducer(state, actions.addStory({id: 1, storyId: 2}))
                state = reducer(state, actions.addStory({id: 1, storyId: 3}))

                state = reducer(state, actions.removeStory({id: 1, storyId: 2}))

                expect(state.items[1].stories).to.deep.equal([1,3])
            })
        })
    })




});
