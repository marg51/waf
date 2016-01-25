const STORY_SELECT_UP = "up"
const STORY_SELECT_DOWN = "down"
const STORY_SELECT_RIGHT = "right"
const STORY_SELECT_LEFT = "left"
const STORY_MOVE_UP = "shift+up"
const STORY_MOVE_DOWN = "shift+down"
const STORY_SIZE_UP = "cmd+up"
const STORY_SIZE_DOWN = "cmd+down"
const STORY_OPEN = "enter"
const STORY_CLOSE = "esc"

export function init(app) {
    app.run(function(store) {
        // that's free of charge
        var __ = Mousetrap.bind

        function getSelectedStory() {
            return store.getState().ui.selected_story
        }

        __(STORY_MOVE_UP, () => {
            var state = store.getState()
            var story = state.ui.selected_story
            var column = state.columns.items[story.column_id]

            var currentStoryIndex = column.stories.indexOf(story.id)

            // already FIRST or NOT FOUND
            if(currentStoryIndex < 1) return

            store.dispatch({type: 'COLUMN:STORY:MOVE', id: story.column_id, storyId:story.id, index: currentStoryIndex - 1})
        })
        __(STORY_MOVE_DOWN, () => {
            var state = store.getState()
            var story = state.ui.selected_story
            var column = state.columns.items[story.column_id]

            var currentStoryIndex = column.stories.indexOf(story.id)

            // already LAST or NOT FOUND
            if(currentStoryIndex === -1 || currentStoryIndex > column.stories.length - 1) return

            store.dispatch({type: 'COLUMN:STORY:MOVE', id: story.column_id, storyId:story.id, index: currentStoryIndex + 1})
        })

        function build_story_path(column, row) {
            var state = store.getState()

            return {
                column_id: state.board.columns[column],
                id: state.columns.items[ state.board.columns[column] ].stories[ row ],
                row,
                column
            }
        }
        __(STORY_SELECT_UP, () => {
            var state = store.getState()
            var story = state.ui.selected_story


            // already FIRST
            if(story.row == 0) return

            store.dispatch({type: 'UI:STORY:SELECT', story:build_story_path(story.column, story.row-1)})

            return false
        })
        __(STORY_SELECT_DOWN, () => {
            var state = store.getState()
            var story = state.ui.selected_story
            var column = state.columns.items[story.column_id]

            // already LAST
            if(story.row > column.stories.length - 1) return


            store.dispatch({type: 'UI:STORY:SELECT', story:build_story_path(story.column, story.row+1)})

            return false
        })
        __(STORY_SELECT_LEFT, () => {
            var state = store.getState()
            var story = state.ui.selected_story


            // already FIRST
            if(story.column == 0) return

            store.dispatch({type: 'UI:STORY:SELECT', story:build_story_path(story.column-1, 0)})

            return false
        })
        __(STORY_SELECT_RIGHT, () => {
            var state = store.getState()
            var story = state.ui.selected_story
            var column = state.columns.items[story.column_id]

            // already LAST column
            if(story.column > state.board.columns.length - 1) return


            store.dispatch({type: 'UI:STORY:SELECT', story:build_story_path(story.column+1, 0)})

            return false
        })

        __(STORY_OPEN, () => {
            var state = store.getState()
            var story = state.ui.selected_story

            if(!state.ui.stories[story.id] || !state.ui.stories[story.id].open)
                store.dispatch({type: 'UI:STORY:OPEN', id:story.id})
        })

        __(STORY_CLOSE, () => {
            var state = store.getState()
            var story = state.ui.selected_story

            store.dispatch({type: 'UI:STORY:CLOSE', id:story.id})
        })
    })

    app.factory('shortcuts', ($rootScope) => {
        var list = {};
        var letters = "abc".split('')
        var availables = {}

        _.map(letters, (letter) => {
            _.map(letters, (letter2) => {
                _.map(letters, (letter3) => {
                    var generated = {shortcut: letter3+" "+letter+" "+letter2, action: null}
                    availables[generated.shortcut] = generated
                })
            })
        })


        var service = {
            matches: [],
            setMatches(matches){service.matches = matches},
            register(action, format="_") {
                var without_actions = _.filter(availables, (shortcut) => !shortcut.action)

                if(without_actions.length == 0) {
                    throw new Error('no more shortcuts available')
                }

                without_actions[0].action = action

                var shortcut = format.replace('_', without_actions[0].shortcut)

                Mousetrap.bind(shortcut, () => {
                    $rootScope.$apply(() => action())
                })

                return {
                    unregister: () => service.unregister(shortcut),
                    shortcut
                }

            }, unregister(shortcut) {
                Mousetrap.unbind(shortcut)

                availables[shortcut].action = null
            }
        }

        return service
    })

    app.directive('shortcut', (shortcuts, $timeout) => {
        return {
            template: `<span class='label label-default' ng-class='{"active label-success": match}' ng-if="hide!==false">
                <span ng-if="type == 'default'">
                    <span
                        class='letter'
                        ng-repeat="letter in shortcut.shortcut.replace(' ','').replace(' ','').split('') track by $index"
                        ng-class='{"active":match && match.level >= $index, next: $index-1 == match.level}'>
                        {{letter}}
                    </span>
                </span>
                <span ng-if="type !== 'default'">
                    <span
                        ng-if="$index==0 || match"
                        class='letter'
                        ng-repeat="letter in shortcut.shortcut.replace(' ','').replace(' ','').split('') track by $index"
                        ng-class='{"active":match && match.level >= $index, "inactive": (match.level>=0 && $index-1 >= match.level), next: $index-1 == match.level}'>
                        {{letter}}
                    </span>
                </span>
            </span>`,
            scope: {
                onAction: '&shortcut',
                type:"@",
                hide:'='
            }, link(scope, elm) {
                scope.shortcut = shortcuts.register(() => {
                    scope.onAction()
                    elm.addClass('activated')
                    $timeout(() => {
                        elm.removeClass('activated')
                    }, 300)
                })
                let callbacks = Mousetrap.getCallbacks()
                scope.shortcuts = shortcuts
                // scope.x = _.filter(callbacks[scope.shortcut.shortcut[0]], (sequence) => sequence.seq == scope.shortcut.shortcut && sequence.level == 0)[0]

                scope.$watch('shortcuts.matches', () => {
                    scope.match = _.get(_.filter(scope.shortcuts.matches, (match) => match.seq == scope.shortcut.shortcut), '[0]')
                })

                scope.$on('$destroy', scope.shortcut.unregister)
            }
        }
    })
}