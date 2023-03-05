import { configureStore } from "@reduxjs/toolkit";
import reducers from "./reducers";

const store = configureStore({
  reducer: {
    closestLocations: reducers.closestLocations,
    targetLocations: reducers.targetLocations,
    buildingLocations: reducers.buildingLocations,
    currentLocation: reducers.currentLocation,
  },
});

export default store;
