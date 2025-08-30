import { createSlice } from "@reduxjs/toolkit";

const gamesSlice = createSlice({
    name: "games",
    initialState: {
        games: [
            {name: 'Home'}, 
            {name: 'Catch Master', desc: '“Grab Apples, Dodge stones!”'}, 
            {name: 'Burst Shot',desc: '“Analyze, Aim and Shoot!”'}, 
            {name: 'Shapes Fit',desc: '“Shape match, Time clash”'}, 
            {name: 'Be Careful',desc: '“Think before you click:)”'}
        ]
    },
    reducers: {
        setGames: (state, action) => {
            state.games = action.payload;
        },
    }
});
export const { setGames } = gamesSlice.actions;
export default gamesSlice.reducer;