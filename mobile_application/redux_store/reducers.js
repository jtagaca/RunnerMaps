import { createSlice } from "@reduxjs/toolkit";
import { getBuildings } from "./actions/Building_Locations";
import { getIndoorLocationsById } from "./actions/Indoor_Locations";

// to be edited
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
    map: {},
  },
  reducers: {
    clearIndoorLocationData: (state) => {
      state.data = [];
      state.status = "idle";
      state.error = null;
    },
    buildIndoorLocationLookUpMap: (state) => {
      state.map = {};
      state.data.forEach((location) => {
        state.map[location.locationID] = location;
      });
    },
  },
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

const indoor_navigation_properties_slice = createSlice({
  name: "indoor_navigation_properties",
  initialState: {
    building_id: null,
    building_name: null,
    start_location: null,
    destination_location: null,
  },
  reducers: {
    setSelectedBuildingToIndoorNavigate: (state, action) => {
      state.building_id = action.payload.id;
      state.building_name = action.payload.title;
    },
    setSelectedStartLocationToIndoorNavigate: (state, action) => {
      state.start_location = action.payload.title;
    },
    setSelectedDestinationLocationToIndoorNavigate: (state, action) => {
      state.destination_location = action.payload.title;
    },
  },
});

// to be edited
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
export const indoor_locations_actions = indoor_locations_slice.actions;
export const indoor_navigation_properties_actions =
  indoor_navigation_properties_slice.actions;

export default {
  closestLocations: closestLocationsSlice.reducer,
  indoor_locations: indoor_locations_slice.reducer,
  buildings: buildings_slice.reducer,
  currentLocation: currentLocationSlice.reducer,
  indoor_navigation_properties: indoor_navigation_properties_slice.reducer,
};
