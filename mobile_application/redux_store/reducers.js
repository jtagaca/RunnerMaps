import { createSlice } from "@reduxjs/toolkit";
import { getBuildings } from "./actions/Building_Locations";
import { getIndoorLocationsById } from "./actions/Indoor_Locations";
import { getAllIndoorLocations } from "./actions/All_Indoor_Locations";

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
    floors: [],
  },
  reducers: {
    clearIndoorLocationData: (state) => {
      state.data = [];
      state.status = "idle";
      state.error = null;
      state.map = {};
    },
    buildIndoorLocationLookUpMap: (state) => {
      state.map = {};
      state.stairs = [];
      state.elevators = [];
      const floors = new Map();
      state.data.forEach((location) => {
        state.map[[location.floorID, location.row, location.col].join(",")] =
          location;

        if (location.name === "stairs") {
          state.stairs.push(location);
          return;
        }
        if (location.name === "elevator") {
          state.elevators.push(location);
          return;
        }
        if (!floors.has(location.floorID)) {
          floors.set(location.floorID, location.floorNumber);
        }
        state.floors = Array.from(floors, ([key, value]) => ({
          floorID: key,
          floorNumber: value,
        }));
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
      state.building_id = action.payload.value;
      state.building_name = action.payload.label;
    },
    setSelectedStartLocationToIndoorNavigate: (state, action) => {
      state.start_location = action.payload.label;
      state.start_location_id = action.payload.value;
    },
    setSelectedDestinationLocationToIndoorNavigate: (state, action) => {
      state.destination_location = action.payload.label;
      state.destination_location_id = action.payload.value;
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

const outdoor_navigation_properties_slice = createSlice({
  name: "outdoor_navigation_properties",
  initialState: {
    building_id: null,
    building_name: null,
  },
  reducers: {
    setSelectedBuildingToOutdoorNavigate: (state, action) => {
      state.building_id = action.payload.value;
      state.building_name = action.payload.label;
    },
  },
});

const accessibility_slice = createSlice({
  name: "accessibility",
  initialState: {
    voice_enabled: false,
    selected_background_color: {
      primaryColor: "#fefce8",
      secondaryColor: "#003594",
      darkerPrimaryColor: "#fde047",
    },
    selected_font_color: "default",
    selected_font_size: "default",
  },
  reducers: {
    setVoiceEnabled: (state, action) => {
      state.voice_enabled = action.payload;
    },
    setSelectedBackgroundColor: (state, action) => {
      state.selected_background_color = action.payload;
    },
    setSelectedFontColor: (state, action) => {
      state.selected_font_color = action.payload;
    },
    setSelectedFontSize: (state, action) => {
      state.selected_font_size = action.payload;
    },
    resetSettings: (state) => {
      state.voice_enabled = false;
      state.selected_background_color = {
        primaryColor: "#fefce8",
        secondaryColor: "#003594",
        darkerPrimaryColor: "#fde047",
      };
      state.selected_font_color = "default";
      state.selected_font_size = "default";
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

const all_indoor_locations_slice = createSlice({
  name: "all_indoor_locations",
  initialState: {
    data: [],
    status: "idle",
    error: null,
    chosen_building: null,
    destination_location: null,
    buildings: [],
    services: [],
    entrances: [],
  },
  reducers: {
    setChosenBuilding: (state, action) => {
      state.chosen_building = action.payload;
      state.entrances = state.data.filter(
        (location) =>
          location.buildingID === parseInt(action.payload.buildingID) &&
          location.name === "entrance"
      );
    },
    setDestinationLocation: (state, action) => {
      state.destination_location = action.payload;
    },
    setBuildings: (state, action) => {
      state.buildings = action.payload;
    },
    deleteChosenBuilding: (state) => {
      state.chosen_building = null;
    },
    deleteDestinationLocation: (state) => {
      state.destination_location = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getAllIndoorLocations.pending, (state) => {
        state.status = "pending";
      })
      .addCase(getAllIndoorLocations.fulfilled, (state, action) => {
        state.status = "fulfilled";
        state.data = action.payload;
        const buildingsMap = new Map();
        const servicesMap = new Map();
        action.payload.forEach((location) => {
          if (
            location.buildingID !== null &&
            !buildingsMap.has(location.buildingID)
          ) {
            buildingsMap.set(location.buildingID, location.buildingName);
          }
          if (
            location.categoryID !== null &&
            !servicesMap.has(location.categoryID)
          ) {
            servicesMap.set(location.categoryID, location.services);
          }
        });
        state.buildings = Array.from(
          buildingsMap,
          ([buildingID, buildingName]) => ({
            buildingID,
            buildingName,
          })
        );
        state.services = Array.from(
          servicesMap,
          ([serviceID, serviceName]) => ({
            serviceID,
            serviceName,
          })
        );
      })
      .addCase(getAllIndoorLocations.rejected, (state, action) => {
        state.status = "rejected";
        state.error = action.error.message;
      });
  },
});

export const accessibility_actions = accessibility_slice.actions;
export const all_indoor_locations_actions = all_indoor_locations_slice.actions;
export const { setClosestLocations } = closestLocationsSlice.actions;
export const { setCurrentGeolocationProperties } =
  current_geolocation_slice.actions;
export const indoor_locations_actions = indoor_locations_slice.actions;
export const indoor_navigation_properties_actions =
  indoor_navigation_properties_slice.actions;
export const outdoor_navigation_properties_actions =
  outdoor_navigation_properties_slice.actions;

export default {
  closestLocations: closestLocationsSlice.reducer,
  indoor_locations: indoor_locations_slice.reducer,
  buildings: buildings_slice.reducer,
  currentLocation: current_geolocation_slice.reducer,
  indoor_navigation_properties: indoor_navigation_properties_slice.reducer,
  outdoor_navigation_properties: outdoor_navigation_properties_slice.reducer,
  all_indoor_locations: all_indoor_locations_slice.reducer,
  accessibility: accessibility_slice.reducer,
};
