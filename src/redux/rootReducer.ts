import { combineReducers } from '@reduxjs/toolkit';
import { baseApi } from './api/baseApi';
import { trainApi } from './api/train/trainApi';
import authReducer from './features/auth/authSlice';
const rootReducer = combineReducers({
  auth: authReducer,
  [baseApi.reducerPath]: baseApi.reducer,
  [trainApi.reducerPath]: trainApi.reducer,
});

export default rootReducer;
