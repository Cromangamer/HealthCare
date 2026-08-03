import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { apiBaseUrl } from "./config";

export const userLogin = createAsyncThunk(
  "login/userLogin",
  async (idToken, thunkAPI) => {
    console.log("5. Thunk started");
    try {
      console.log("6. Sending request");
      const response = await axios.post(
        `${apiBaseUrl}/auth/firebase-login`,
        {},
        {
          headers: {
            Authorization: `Bearer ${idToken}`,
          },
        }
      );
      console.log("7. Response received", response.data);
      // return response.data.user;

      return thunkAPI.rejectWithValue(
        err.response?.data || err.message
      );
    } catch (err) {
      console.error("8. Axios failed", err);
      return thunkAPI.rejectWithValue(err.response?.data);
    }
  }
);

