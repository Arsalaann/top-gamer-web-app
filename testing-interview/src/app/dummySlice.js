import { createSlice } from "@reduxjs/toolkit";

const dummySlice=createSlice({
    name:'dummy',
    initialState:{
        value:0
    },
    reducers:{
        dummyReducer1:(state)=>state
    }
});

export default dummySlice.reducer;

