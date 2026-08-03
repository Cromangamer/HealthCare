import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const userLogin = createAsyncThunk(
  "login/userLogin",
  async (idToken, thunkAPI) => {
    try {
      const response = await axios.post(
        "http://localhost:3000/auth/firebase-login",
        {},
        {
          headers: {
            Authorization: `Bearer ${idToken}`,
          },
        }
      );

      return response.data.user;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data);
    }
  }
);

