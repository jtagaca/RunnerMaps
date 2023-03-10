import { createSlice } from "@reduxjs/toolkit";
import { getBuildings } from "./actions/Building_Locations";
import { getIndoorLocationsById } from "./actions/Indoor_Locations";

const closestLocationsSlice = createSlice({
  name: "closestLocations",
  initialState: [],
  reducers: {
    setClosestLocations: (state, action) => {
      return action.payload;
    },
  },
});

const indoor_locations_slice = createSlice({
  name: "indoor_locations",
  initialState: {
    data: [],
    status: "idle",
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getIndoorLocationsById.pending, (state) => {
        state.status = "pending";
      })
      .addCase(getIndoorLocationsById.fulfilled, (state, action) => {
        state.status = "fulfilled";
        state.data = action.payload;
      })
      .addCase(getIndoorLocationsById.rejected, (state, action) => {
        state.status = "rejected";
      });
  },
});

const buildings_slice = createSlice({
  name: "buildings",
  initialState: {
    data: [],
    status: "idle",
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getBuildings.pending, (state) => {
        state.status = "loading";
      })
      .addCase(getBuildings.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.data = action.payload;
      })
      .addCase(getBuildings.rejected, (state, action) => {
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

const selected_building_to_indoor_navigate_slice = createSlice({
  name: "selected_building_to_indoor_navigate",
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
  selected_building_to_indoor_navigate_slice.actions;

export default {
  closestLocations: closestLocationsSlice.reducer,
  indoor_locations: indoor_locations_slice.reducer,
  buildings: buildings_slice.reducer,
  currentLocation: currentLocationSlice.reducer,
  selected_building_to_indoor_navigate:
    selected_building_to_indoor_navigate_slice.reducer,
};
