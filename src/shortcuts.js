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
const STORY_LIGHTEN = "space"
const LABEL_GREEN = "1"
const LABEL_YELLOW = "2"
const LABEL_ORANGE = "3"
const LABEL_RED = "4"
const LABEL_PURPLE = "5"
const LABEL_BLUE = "6"


import * as storyActions from './components/story/actions'

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

            store.dispatch({type: 'COLUMN:STORY:MOVE', id: story.column_id, storyId:story.id, index: currentStoryIndex - 1, sync: true})
        })
        __(STORY_MOVE_DOWN, () => {
            var state = store.getState()
            var story = state.ui.selected_story
            var column = state.columns.items[story.column_id]

            var currentStoryIndex = column.stories.indexOf(story.id)

            // already LAST or NOT FOUND
            if(currentStoryIndex === -1 || currentStoryIndex > column.stories.length - 1) return

            store.dispatch({type: 'COLUMN:STORY:MOVE', id: story.column_id, storyId:story.id, index: currentStoryIndex + 1, sync: true})
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

            // if the story is open
            if(_.get(state.ui.stories[story.id], 'open'))
                store.dispatch({type: 'UI:STORY:CLOSE', id:story.id})
            // otherwise close all stories
            else
                store.dispatch({type: 'UI:STORY:CLOSE:ALL'})
        })

        __(STORY_LIGHTEN, () => {
            var state = store.getState()
            var isLightOn = state.ui.is_light_on

            if(isLightOn)
                store.dispatch({type: 'UI:STORY:LIGHT:OFF'})
            else store.dispatch({type: 'UI:STORY:LIGHT:ON'})
        })

        function toggleLabel(label) {
            var state = store.getState()
            var story = state.ui.selected_story

            if(state.stories.items[story.id]) {
                var currentValue = _.get(state.stories.items[story.id].labels,label)
                store.dispatch(storyActions.update({id:story.id, story:{labels: {[label]: !currentValue}}}))
            }
        }
        __(LABEL_GREEN, () => {
            toggleLabel("green")
        })
        __(LABEL_YELLOW, () => {
            toggleLabel("yellow")
        })
        __(LABEL_ORANGE, () => {
            toggleLabel("orange")
        })
        __(LABEL_RED, () => {
            toggleLabel("red")
        })
        __(LABEL_PURPLE, () => {
            toggleLabel("purple")
        })
        __(LABEL_BLUE, () => {
            toggleLabel("blue")
        })
    })
}

