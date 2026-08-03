import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import getToken from "../firebase/getToken";


export const createCaregiver = createAsyncThunk(
  "login/createCaregiver",
  async (caregiverData, thunkAPI) => {
    const token = await getToken();
    try {
      const response = await axios.post(
        "http://localhost:3000/caregivers",
        caregiverData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data);
    }
  }
);

export const updateCaregiver = createAsyncThunk(
  "login/updateCaregiver",
  async (caregiverData, thunkAPI) => {
    const token = await getToken();
    try {
      const response = await axios.patch(
        `http://localhost:3000/caregivers/${caregiverData.userId}`,
        caregiverData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data);
    }
  }
);

export const getCaregiver = createAsyncThunk(
  "login/getCaregiverById",
  async (userId, thunkAPI) => {
    try {
      const response = await axios.get(
        `http://localhost:3000/caregivers/${userId}`
      );
      return response.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data);
    }
});

export const deleteCaregiver = createAsyncThunk(
  "login/deleteCaregiver",
  async (userId, thunkAPI) => {
    const token = await getToken();
    try {
      const response = await axios.delete(
        `http://localhost:3000/caregivers/${userId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    }
    catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data);
    }
});
