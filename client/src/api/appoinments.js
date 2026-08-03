import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import getToken from "../firebase/getToken";
import { apiBaseUrl } from "./config";

export const getAppointments = createAsyncThunk(
  "appointments/getAppointments",
  async (_, thunkAPI) => {
    const token = await getToken();
    try {
      const response = await axios.get(
        `${apiBaseUrl}/bookings`,
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
        `${apiBaseUrl}/bookings/${bookingId}`,
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
            const response = await axios.patch(
                `${apiBaseUrl}/bookings/${bookingId}/status`,
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
