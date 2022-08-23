import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "../../axios";
export const fetchAuth = createAsyncThunk("auth/fetchAuth", async (params) => {
  const { data } = await axios.post("/auth/login", params);
  return data;
});
export const fetchLogin = createAsyncThunk("auth/fetchLogin", async () => {
  const { data } = await axios.get("/auth/me");
  return data;
});
export const fetchNewUser = createAsyncThunk("registe/fetchNewUser", async (params) => {
  const { data } = await axios.post("/register", params);
  return data;
});

const initialState = {
  data: null,
  status: "loading",
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    signOut: (state) => {
      state.data = null;
      window.localStorage.removeItem("token");
    },
  },
  extraReducers: {
    [fetchAuth.pending]: (state) => {
      state.status = "loading";
      state.data = null;
    },
    [fetchAuth.fulfilled]: (state, action) => {
      state.data = action.payload;
      state.sattus = "loaded";
    },
    [fetchAuth.rejected]: (state) => {
      state.data = null;
      state.status = "error";
    },
    [fetchLogin.pending]: (state) => {
      state.status = "loading";
      state.data = null;
    },
    [fetchLogin.fulfilled]: (state, action) => {
      state.data = action.payload;
      state.sattus = "loaded";
    },
    [fetchLogin.rejected]: (state) => {
      state.data = null;
      state.status = "error";
    },
    [fetchNewUser.pending]: (state) => {
      state.status = "loading";
      state.data = null;
    },
    [fetchNewUser.fulfilled]: (state, action) => {
      state.data = action.payload;
      state.sattus = "loaded";
    },
    [fetchNewUser.rejected]: (state) => {
      state.data = null;
      state.status = "error";
    },
  },
});
export const isAuthSelect = (state) => Boolean(state.auth.data);
export const authReducer = authSlice.reducer;
export const { signOut } = authSlice.actions;
