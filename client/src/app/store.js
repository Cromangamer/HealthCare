import { configureStore } from "@reduxjs/toolkit";
import locationReducer from "../features/location/getlocation";
import firebaseLogin from "../features/auth/firebaseLogin";
import caregiverReducer from "../features/caregiver/careateCaregiver";

export const store = configureStore({
    reducer:{
        ServiceLocation: locationReducer,
        firebaseLogin,
        caregiver: caregiverReducer,
    }
})