import { configureStore } from "@reduxjs/toolkit";
import reducers from "./reducers";

const store = configureStore({
  reducer: {
    closestLocations: reducers.closestLocations,
    indoor_locations: reducers.indoor_locations,
    buildingLocations: reducers.buildingLocations,
    currentLocations: reducers.currentLocation,
    current_building_to_indoor_navigate:
      reducers.current_building_to_indoor_navigate_slice,
  },
});

export default store;
