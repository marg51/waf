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

export function bind(keys, fn, event) {
    Mousetrap.bind(keys, fn, event)

    return () => {
        return Mousetrap.unbind(keys)
    }
}


export function init(app) {
    app.run(function(store) {

        // that's free of charge
        var __ = bind

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
}