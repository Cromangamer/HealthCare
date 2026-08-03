import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import getToken from "../firebase/getToken";

export const getAppointments = createAsyncThunk(
  "appointments/getAppointments",
  async (caregiverId, thunkAPI) => {
    const token = await getToken();
    try {
      const response = await axios.get(
        `http://localhost:3000/appointments/${caregiverId}`,
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
});

export const getAppointmentDetails = createAsyncThunk(
  "appointments/getAppointmentDetails",
  async (bookingId, thunkAPI) => {
    const token = await getToken();
    try {
      const response = await axios.get(
        `http://localhost:3000/appointments/details/${bookingId}`,
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

export const updateBookingStatus = createAsyncThunk(
    "appointments/updateBookingStatus",
    async ({ bookingId, status }, thunkAPI) => {
        const token = await getToken();
        try{
            const response = await axios.post(
                `http://localhost:3000/appointments/${bookingId}/status`,
                { status },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            return response.data;
        }
        catch(err){
            return thunkAPI.rejectWithValue(err.response?.data);
        }
    }
)