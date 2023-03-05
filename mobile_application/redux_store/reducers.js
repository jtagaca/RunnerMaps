import { createSlice } from "@reduxjs/toolkit";

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
  initialState: [],
  reducers: {
    setTargetLocations: (state, action) => {
      return action.payload;
    },
  },
});

const buildingLocationsSlice = createSlice({
  name: "buildingLocations",
  initialState: [],
  reducers: {
    setBuildingLocations: (state, action) => {
      return action.payload;
    },
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
export const { setTargetLocations } = targetLocationsSlice.actions;
export const { setBuildingLocations } = buildingLocationsSlice.actions;
export const { setCurrentLocation } = currentLocationSlice.actions;

export default {
  closestLocations: closestLocationsSlice.reducer,
  targetLocations: targetLocationsSlice.reducer,
  buildingLocations: buildingLocationsSlice.reducer,
  currentLocation: currentLocationSlice.reducer,
};
