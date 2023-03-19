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
    elevators: [],
    stairs: [],
  },
  reducers: {
    clearIndoorLocationData: (state) => {
      state.data = [];
      state.status = "idle";
      state.error = null;
    },
    buildIndoorLocationLookUpMap: (state) => {
      state.map = {};
      state.stairs = [];
      state.elevators = [];

      state.data.forEach((location) => {
        state.map[[location.floorID, location.row, location.col].join(",")] =
          location;

        if (location.name === "stairs") {
          state.stairs.push(location);
        }
        if (location.name === "elevator") {
          state.elevators.push(location);
        }
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
    start_location_id: null,
    destination_location: null,
    destination_location_id: null,
    chosen_method_to_navigate_between_floors: null,
    shortest_path_directions: [],
  },
  reducers: {
    setSelectedBuildingToIndoorNavigate: (state, action) => {
      state.building_id = action.payload.id;
      state.building_name = action.payload.title;
    },
    setSelectedStartLocationToIndoorNavigate: (state, action) => {
      state.start_location = action.payload.title;
      state.start_location_id = action.payload.id;
    },
    setSelectedDestinationLocationToIndoorNavigate: (state, action) => {
      state.destination_location = action.payload.title;
      state.destination_location_id = action.payload.id;
    },
    setChosenMethodToNavigateBetweenFloors: (state, action) => {
      state.chosen_method_to_navigate_between_floors = action.payload;
    },
    deleteChooserMethodToNavigateBetweenFloors: (state) => {
      state.chosen_method_to_navigate_between_floors = null;
    },
    setShortestPathDirections: (state, action) => {
      state.shortest_path_directions = action.payload;
    },
    deleteShortestPathDirections: (state) => {
      state.shortest_path_directions = [];
      state.chosen_method_to_navigate_between_floors = null;
    },
  },
});

// to be edited
const current_geolocation_slice = createSlice({
  name: "current_geolocation",
  initialState: {},
  reducers: {
    setCurrentGeolocationProperties: (state, action) => {
      return action.payload;
    },
  },
});

export const { setClosestLocations } = closestLocationsSlice.actions;
export const { setCurrentGeolocationProperties } =
  current_geolocation_slice.actions;
export const indoor_locations_actions = indoor_locations_slice.actions;
export const indoor_navigation_properties_actions =
  indoor_navigation_properties_slice.actions;

export default {
  closestLocations: closestLocationsSlice.reducer,
  indoor_locations: indoor_locations_slice.reducer,
  buildings: buildings_slice.reducer,
  currentLocation: current_geolocation_slice.reducer,
  indoor_navigation_properties: indoor_navigation_properties_slice.reducer,
};
