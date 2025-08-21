import { configureStore } from "@reduxjs/toolkit";
import currentNavigationIndexReducer from './slices/currentNavigationIndexSlice';
import slideDirectionReducer from './slices/slideDirectionSlice'

const store=configureStore({
    reducer:{
        currentNavigationIndex:currentNavigationIndexReducer,
        slideDirection:slideDirectionReducer
    }
})

export default store;