import { createSlice } from "@reduxjs/toolkit";
import cities from "../../data/cities.js";

const initialState = {
  cities: [],
  selectedCity: null,
};

const locationSlice = createSlice({
  name: "location",
  initialState,

  reducers: {
    loadCities: (state) => {
      state.cities = cities;
    },

    setLocation: (state, action) => {
      state.selectedCity = action.payload;
    },
  },
});

export const { loadCities, setLocation } = locationSlice.actions;

export default locationSlice.reducer;