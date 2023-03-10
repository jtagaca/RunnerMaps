import { createSlice } from "@reduxjs/toolkit";
import { fetchBuildings } from "./actions/Building_Locations";
import { fetchTargetLocations } from "./actions/Indoor_Locations";
const closestLocationsSlice = createSlice({
  name: "closestLocations",
  initialState: [],
  reducers: {
    setClosestLocations: (state, action) => {
      return action.payload;
    },
  },
});

const targetLocationsSlice = createSlice({
  name: "targetLocations",
  initialState: {
    data: [],
    status: "idle",
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchTargetLocations.pending, (state) => {
        state.status = "pending";
      })
      .addCase(fetchTargetLocations.fulfilled, (state, action) => {
        state.status = "fulfilled";
        state.data = action.payload;
      })
      .addCase(fetchTargetLocations.rejected, (state, action) => {
        state.status = "rejected";
      });
  },
});

const buildingLocationsSlice = createSlice({
  name: "buildings",
  initialState: {
    data: [],
    status: "idle",
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchBuildings.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchBuildings.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.data = action.payload;
      })
      .addCase(fetchBuildings.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
  },
});

const currentLocationSlice = createSlice({
  name: "currentLocation",
  initialState: null,
  reducers: {
    setCurrentLocation: (state, action) => {
      return action.payload;
    },
  },
});

export const { setClosestLocations } = closestLocationsSlice.actions;
export const { setCurrentLocation } = currentLocationSlice.actions;

export default {
  closestLocations: closestLocationsSlice.reducer,
  targetLocations: targetLocationsSlice.reducer,
  buildingLocations: buildingLocationsSlice.reducer,
  currentLocation: currentLocationSlice.reducer,
};
