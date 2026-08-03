import { createSlice } from "@reduxjs/toolkit";
import { userLogin } from "../../api/login";

const initialState = {
  isAuthenticated: false,
  loading: true,

  _id: null,
  firebaseUid: null,
  authProvider: null,
  isActive: null,
  firstName: null,
  lastName: null,
  email: null,
  emailVerified: null,
  providers: [],
  role: null,
  profileImage: null,
  profileCompleted: null,
  createdAt: null,
  updatedAt: null,
  __v: null,
};

const firebaseLogin = createSlice({
  name: "login",
  initialState,

  reducers: {
    userLogout: (state) => {
      Object.assign(state, initialState);
      state.loading = false;  
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(userLogin.fulfilled, (state, action) => {
        Object.assign(state, action.payload);

        state.isAuthenticated = true;
        state.loading = false;  
      })
      .addCase(userLogin.rejected, (state) => {
        state.loading = false;  
      });
  },
});

export const { userLogout } = firebaseLogin.actions;
export default firebaseLogin.reducer;
