import { createSlice } from "@reduxjs/toolkit";

export interface IUser {
  id: string;
  name: string;
  email: string;
  role: string;
  avatarUrl?: string;
  address?: string;
  phone?: string;
}

export interface AuthState {
  user: IUser | null;
  token: string | null;
}

const initialState: AuthState = {
  user: null,
  token: null,
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login: (state, action) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
    },
  },
});

export const { login, logout } = authSlice.actions;
export default authSlice.reducer;
