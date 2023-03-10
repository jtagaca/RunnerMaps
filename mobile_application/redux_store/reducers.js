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

const current_building_to_indoor_navigate_slice = createSlice({
  name: "currentIndoorNavigationBuilding",
  initialState: {
    id: null,
    title: null,
  },
  reducers: {
    setCurrentIndoorNavigationBuilding: (state, action) => {
      state.id = action.payload.id;
      state.title = action.payload.title;
    },
  },
});

export const { setClosestLocations } = closestLocationsSlice.actions;
export const { setCurrentLocation } = currentLocationSlice.actions;

export const { setCurrentIndoorNavigationBuilding } =
  current_building_to_indoor_navigate_slice.actions;
export default {
  closestLocations: closestLocationsSlice.reducer,
  targetLocations: targetLocationsSlice.reducer,
  buildingLocations: buildingLocationsSlice.reducer,
  currentLocation: currentLocationSlice.reducer,
  current_building_to_indoor_navigate_slice:
    current_building_to_indoor_navigate_slice.reducer,
};
