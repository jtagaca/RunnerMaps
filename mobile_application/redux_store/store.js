import { configureStore } from "@reduxjs/toolkit";
import reducers from "./reducers";

const store = configureStore({
  reducer: {
    closestLocations: reducers.closestLocations,
    indoor_locations: reducers.indoor_locations,
    buildings: reducers.buildings,
    currentLocations: reducers.currentLocation,
    selected_building_to_indoor_navigate:
      reducers.selected_building_to_indoor_navigate,
  },
});

export default store;
