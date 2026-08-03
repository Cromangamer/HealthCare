import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import getToken from "../firebase/getToken";
import { apiBaseUrl } from "./config";


export const createCaregiver = createAsyncThunk(
  "login/createCaregiver",
  async (caregiverData, thunkAPI) => {
    const token = await getToken();
    try {
      const response = await axios.post(
        `${apiBaseUrl}/caregivers`,
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
        `${apiBaseUrl}/caregivers/${caregiverData.userId}`,
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
        `${apiBaseUrl}/caregivers/${userId}`
      );
      return response.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data);
    }
});

export const getCaregivers = async (params) => {
  const response = await axios.get(`${apiBaseUrl}/caregivers`, { params });
  return response.data;
};

export const deleteCaregiver = createAsyncThunk(
  "login/deleteCaregiver",
  async (userId, thunkAPI) => {
    const token = await getToken();
    try {
      const response = await axios.delete(
        `${apiBaseUrl}/caregivers/${userId}`,
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
