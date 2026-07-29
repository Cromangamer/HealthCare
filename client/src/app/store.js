import { configureStore } from "@reduxjs/toolkit";
import locationReducer from "../features/location/getlocation";
import firebaseLogin from "../features/auth/firebaseLogin"

export const store = configureStore({
    reducer:{
        ServiceLocation: locationReducer,
        firebaseLogin,
    }
})