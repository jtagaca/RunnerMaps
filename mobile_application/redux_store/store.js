import { configureStore } from "@reduxjs/toolkit";
import reducers from "./reducers";

const store = configureStore({
  reducer: {
    closestLocations: reducers.closestLocations,
    indoor_locations: reducers.indoor_locations,
    buildings: reducers.buildings,
    currentLocations: reducers.currentLocation,
    indoor_navigation_properties: reducers.indoor_navigation_properties,
    outdoor_navigation_properties: reducers.outdoor_navigation_properties,
    all_indoor_locations: reducers.all_indoor_locations,
    accessibility: reducers.accessibility,
  },
});

export default store;
