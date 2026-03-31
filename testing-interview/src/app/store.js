import { configureStore } from '@reduxjs/toolkit';
import dummyReducer from './dummySlice';

export default configureStore({
  reducer: {
  	dummy:dummyReducer
  }
});
