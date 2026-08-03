import { createSlice } from "@reduxjs/toolkit";
import { createCaregiver, updateCaregiver, getCaregiver } from "../../api/caregiver";

const initialState = {
    loading: true, 
    userId: null,
    qualification: [],
    specialization: [],
    languages: [],
    certificates: [],
    aadhaarNumber: null,
    licenseNumber: null,
    isVerified: false,
    bio: null,
    location: {
        type: "Point",
        coordinates: [0, 0],
    },
};

const caregiverSlice = createSlice({
    name: "caregiver",
    initialState,

    reducers:{},

    extraReducers: (builder) => {
        builder
            .addCase(createCaregiver.fulfilled, (state, action) => {
                Object.assign(state, action.payload);
                state.loading = false;
            })
            .addCase(createCaregiver.rejected, (state, action) => {
                console.log(action.payload);
                state.loading = false;
            })
            .addCase(updateCaregiver.fulfilled, (state, action) => {
                Object.assign(state, action.payload);
                state.loading = false;
            })
            .addCase(updateCaregiver.rejected, (state, action) => {
                console.log(action.payload);
                state.loading = false;
            })
            .addCase(getCaregiver.fulfilled, (state, action) => {
                Object.assign(state, action.payload);
                state.loading = false;
            })
            .addCase(getCaregiver.rejected, (state, action) => {
                console.log(action.payload);
                state.loading = false;
            });
    },
});

export default caregiverSlice.reducer;