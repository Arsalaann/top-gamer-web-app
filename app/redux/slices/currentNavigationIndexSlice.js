import { createSlice } from "@reduxjs/toolkit";

const routeIndexSlice=createSlice({
    name:'currentNavigationIndex',
    initialState:0,
    reducers:{
        update:(state,action)=>{
            return action.payload;
        }
    }
    
});

export const {update} = routeIndexSlice.actions;
export default routeIndexSlice.reducer;