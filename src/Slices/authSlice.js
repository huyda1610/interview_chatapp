import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  loginAccount: JSON.parse(localStorage.getItem("loginAccount"))
    ? JSON.parse(localStorage.getItem("loginAccount"))
    : null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login: (state, { payload }) => {
      localStorage.setItem("accessToken", payload.token);
      localStorage.setItem(
        "loginAccount",
        JSON.stringify({
          username: payload.username,
          email: payload.email,
        })
      );
      state.loginAccount = {
        username: payload.username,
        email: payload.email,
      };
    },
    logout: (state) => {
      localStorage.clear();
      window.location.reload();
      state.loginAccount = {};
    },
  },
});

export const { login, logout } = authSlice.actions;
export default authSlice.reducer;
