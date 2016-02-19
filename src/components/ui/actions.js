export function selectStory({id,columnId}) {
    return (dispatch, getState) => {
            var state = getState()

            return {
                column_id: state.board.columns[columnId],
                id: state.columns.items[ state.board.columns[columnId] ].stories[ storyId ],
                row,
                column
            }
        }
    }
}