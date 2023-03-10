import { configureStore } from "@reduxjs/toolkit";
import reducers from "./reducers";

const store = configureStore({
  reducer: {
    closestLocations: reducers.closestLocations,
    targetLocations: reducers.targetLocations,
    buildingLocations: reducers.buildingLocations,
    currentLocations: reducers.currentLocation,
    current_building_to_indoor_navigate:
      reducers.current_building_to_indoor_navigate_slice,
  },
});

export default store;
