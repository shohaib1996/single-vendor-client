import { combineReducers } from '@reduxjs/toolkit';
import { baseApi } from './api/baseApi';
import { tagTypesList } from './tagTypes/tagTypes';

const rootReducer = combineReducers({
  [baseApi.reducerPath]: baseApi.reducer,
});

export default rootReducer;
