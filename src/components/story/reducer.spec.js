import {expect} from 'chai';
import {reducer} from './reducer'
import * as actions from './actions'

describe('StoryReducer', () => {
    describe('//init/state', () => {
        it('should load init state', () => {
            var state = reducer(undefined, {type: '//init/state', state: {stories: {items: {1:true}}}})

            expect(state).to.deep.equal({items: {1: true}})
        })
    })

    describe('STORY:ADD', () => {
        it('should add a story', () => {
            var state = reducer(undefined, actions.add({id:1, title: "salut"}))

            expect(state).to.deep.equal({items:{1:{id: 1, title: "salut", todos: []}}})
        })
    })

    describe('STORY:UPDATE', () => {
        it('should update a story', () => {
            var state = reducer(undefined, actions.add({id: 1, title:"salut"}))

            state = reducer(state, actions.update({id:1, story: {checked: true, title: "woop"}}))

            expect(state).to.deep.equal({items: {1: {id: 1, title: "woop", checked: true, todos: []}}})
        })
    })

    describe('STORY:REMOVE', () => {
        it('should update a story', () => {
            var state = reducer(undefined, actions.add({id: 1, title:"salut"}))

            state = reducer(state, actions.remove(1))

            expect(state).to.deep.equal({items: {}})
        })
    })

    describe('TASKS', () => {
        describe('STORY:TODO:ADD', () => {
            it('should add a task', () => {
                var state = reducer(undefined, actions.add({id: 1, title:"salut"}))

                state = reducer(state, actions.addTask({id:1, todoId: 1}))

                expect(state.items[1].todos).to.deep.equal([1])
            })

            it('should add a task at correct index', () => {
                // add a task between the previous two
                var state = reducer(undefined, actions.add({id: 1, title:"salut"}))
                state = reducer(state, actions.addTask({id:1, todoId: 1}))
                state = reducer(state, actions.addTask({id:1, todoId: 3}))

                state = reducer(state, actions.addTask({id:1, index:1, todoId: 2}))

                expect(state.items[1].todos).to.deep.equal([1,2,3])
            })
        })

        describe('STORY:TODO:MOVE', () => {
            it('should move a task', () => {
                // move task 2 from pos 2 to pos 1
                var state = reducer(undefined, actions.add({id: 1, title:"salut"}))
                state = reducer(state, actions.addTask({id:1, todoId: 1}))
                state = reducer(state, actions.addTask({id:1, todoId: 2}))
                state = reducer(state, actions.addTask({id:1, todoId: 3}))

                state = reducer(state, actions.moveTask({id:1, todoId:2,index:0}))

                expect(state.items[1].todos).to.deep.equal([2,1,3])
            })
            it('should move a task and account for weird index from D&D lib', () => {
                // move task 1 from pos 1 to pos 3
                var state = reducer(undefined, actions.add({id: 1, title:"salut"}))
                state = reducer(state, actions.addTask({id:1, todoId: 1}))
                state = reducer(state, actions.addTask({id:1, todoId: 2}))
                state = reducer(state, actions.addTask({id:1, todoId: 3}))

                // index:3 means position 4, even if we want position 3; that's because the drag&drop lib has a weird behaviour
                // and the reducer is fixing that
                state = reducer(state, actions.moveTask({id:1, todoId:1,index:3}))

                expect(state.items[1].todos).to.deep.equal([2,3,1])
            })
        })

        describe('STORY:TODO:REMOVE', () => {
            it('should remove a task', () => {
                var state = reducer(undefined, actions.add({id: 1, title:"salut"}))
                state = reducer(state, actions.addTask({id:1, todoId: 1}))
                state = reducer(state, actions.addTask({id:1, todoId: 2}))
                state = reducer(state, actions.addTask({id:1, todoId: 3}))

                state = reducer(state, actions.removeTask({id:1, todoId:2}))

                expect(state.items[1].todos).to.deep.equal([1,3])
            })
        })
    })

    describe('teams', () => {
        it('should add a team', () => {
            var state = reducer(undefined, actions.add({id: 1, title:"salut"}))
                state = reducer(state, actions.updateTeamStep({id:1, team: "frontend", step:"unstarted"}))

                expect(state.items[1].teams).to.deep.equal({frontend: {step: "unstarted"}})
        })
        it('should update a team', () => {
            var state = reducer(undefined, actions.add({id: 1, title:"salut"}))
                state = reducer(state, actions.updateTeamStep({id:1, team: "frontend", step:"unstarted"}))
                state = reducer(state, actions.updateTeamStep({id:1, team: "frontend", step:"started"}))

                expect(state.items[1].teams).to.deep.equal({frontend: {step: "started"}})
        })
        it('should remove a team', () => {
            var state = reducer(undefined, actions.add({id: 1, title:"salut"}))
                state = reducer(state, actions.updateTeamStep({id:1, team: "frontend", step:"unstarted"}))
                state = reducer(state, actions.removeTeam({id:1, team: "frontend"}))

                expect(state.items[1].teams).to.deep.equal({})
        })
    })

});
