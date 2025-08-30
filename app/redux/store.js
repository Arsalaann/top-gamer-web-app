import { configureStore } from "@reduxjs/toolkit";
import currentNavigationIndexReducer from './slices/currentNavigationIndexSlice';
import slideDirectionReducer from './slices/slideDirectionSlice';
import userDataReducer from './slices/userDataSlice';
import gamesReducer from './slices/gamesSlice';

const store=configureStore({
    reducer:{
        currentNavigationIndex:currentNavigationIndexReducer,
        slideDirection:slideDirectionReducer,
        userData:userDataReducer,
        games:gamesReducer,
    }
})

export default store;