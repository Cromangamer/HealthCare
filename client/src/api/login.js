import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { apiBaseUrl } from "./config";

export const userLogin = createAsyncThunk(
  "login/userLogin",
  async (idToken, thunkAPI) => {
    try {
      console.log("Sending token to backend");
      const response = await axios.post(
        `${apiBaseUrl}/auth/firebase-login`,
        {},
        {
          headers: {
            Authorization: `Bearer ${idToken}`,
          },
        }
      );
      console.log("Backend response:", response.data);
      // return response.data.user;
      console.error("Axios Error:", err.response?.data || err);

      return thunkAPI.rejectWithValue(
        err.response?.data || err.message
      );
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data);
    }
  }
);

