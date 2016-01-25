export const INIT_STATE = {
    columns: []
}

export function reducer(state = INIT_STATE, action) {
    switch(action.type) {
        case '//init/state':
            return action.state.board
        case 'BOARD:COLUMN:MOVE':
            state.columns.splice(state.columns.indexOf(action.columnId),1)
            state.columns.splice(state.columns.index, 0, action.columnId)

            return _.merge({}, state, {columns: [...state.columns]})

        case 'BOARD:COLUMN:ADD':
            return _.merge({}, state, {
                columns: [...state.columns, action.columnId]
            })

        case 'BOARD:COLUMN:REMOVE':
            // this version doesn't work, even if, to me, they do the same
            // -- I tried to understand a bit more, I don't get it. WTF guys?
            // -- I give up, Laurent, 21-jan-16, 7:47pm
            //
            //   _______ _________ _______
            //   (  ____ )\__   __/(  ____ )
            //   | (    )|   ) (   | (    )|
            //   | (____)|   | |   | (____)|
            //   |     __)   | |   |  _____)
            //   | (\ (      | |   | (
            //   | ) \ \_____) (___| )
            //   |/   \__/\_______/|/

            // _.merge({}, state, {
            //     columns: _.filter(state.columns, (id)=> id!= action.columnId)
            // })

            // I don't like this version because it will break if we update the init_state
            // even if it's slower, I still want to use _.merge above. HELP
            return {
                columns: _.filter(state.columns, (id)=> id!= action.columnId)
            }
    }

    return state;
}
