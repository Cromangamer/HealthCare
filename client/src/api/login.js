import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { apiBaseUrl } from "./config";

export const userLogin = createAsyncThunk(
  "login/userLogin",
  async (idToken, thunkAPI) => {
    try {
      const response = await axios.post(
        `${apiBaseUrl}/auth/firebase-login`,
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

