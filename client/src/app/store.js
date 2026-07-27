import { configureStore } from "@reduxjs/toolkit";
import locationReducer from "../features/location/getlocation"

export const store = configureStore({
    reducer:{
        ServiceLocation: locationReducer,
    }
})