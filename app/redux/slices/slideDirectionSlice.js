import { createSlice } from "@reduxjs/toolkit";

const slideDirectionSlice=createSlice({
    name:'slideDirection',
    initialState:0,
    reducers:{
        update:(state,action)=>{
            return action.payload;
        }
    }
    
});

export const {update} = slideDirectionSlice.actions;
export default slideDirectionSlice.reducer;