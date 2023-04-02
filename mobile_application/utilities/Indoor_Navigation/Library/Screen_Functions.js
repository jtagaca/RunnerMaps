import { useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { indoor_navigation_properties_actions } from "../../../redux_store/reducers";
import { all_indoor_locations_actions } from "../../../redux_store/reducers";

import qs from "qs";
import axios from "axios";

const Screen_Functions = () => {
  const dispatch = useDispatch();
  const indoor_locations_map = useSelector(
    (state) => state.indoor_locations.map
  );

  const actions = useMemo(
    () => ({
      handleSelectionBuilding(building) {
        dispatch(
          indoor_navigation_properties_actions.setSelectedBuildingToIndoorNavigate(
            building
          )
        );
      },
      handleSelectionStartLocation(start_location) {
        dispatch(
          indoor_navigation_properties_actions.setSelectedStartLocationToIndoorNavigate(
            start_location
          )
        );
      },
      handleSelectionDestinationLocation(destination_location) {
        dispatch(
          indoor_navigation_properties_actions.setSelectedDestinationLocationToIndoorNavigate(
            destination_location
          )
        );
      },
      handleClearChosenBuilding() {
        dispatch(all_indoor_locations_actions.deleteChosenBuilding());
      },
      handleClearChosenDestinationLocation() {
        dispatch(all_indoor_locations_actions.deleteDestinationLocation());
      },
      handleClearIndoorNavigationProperties(type) {
        if (type) {
          if (type === "building") {
            dispatch(
              indoor_navigation_properties_actions.setSelectedBuildingToIndoorNavigate(
                { id: null, title: null }
              )
            );
          } else if (type === "start_location") {
            dispatch(
              indoor_navigation_properties_actions.setSelectedStartLocationToIndoorNavigate(
                { id: null, title: null }
              )
            );
          } else if (type === "destination_location") {
            dispatch(
              indoor_navigation_properties_actions.setSelectedDestinationLocationToIndoorNavigate(
                { id: null, title: null }
              )
            );
          }
        }
      },
    }),
    [dispatch]
  );

  return actions;
};

export default Screen_Functions;
const formatTitle = (location) => {
  let title = location.name;
  if (
    location.name === "elevator" ||
    location.name === "stairs" ||
    location.name === "restroom" ||
    location.name === "entrance" ||
    location.name === "door"
  ) {
    title = `floor ${location.floorID} ${location.name}`;
  } else if (/^\d/.test(location.name)) {
    title = `room ${location.name} `;
  }
  return `${location.buildingName} ${title}`;
};
const formatTitleForIndoorNavigationHome = (location) => {
  let title = location.name;
  if (
    location.name === "elevator" ||
    location.name === "stairs" ||
    location.name === "restroom" ||
    location.name === "entrance" ||
    location.name === "door"
  ) {
    title = `floor ${location.floorID} ${location.name}`;
  } else if (/^\d/.test(location.name)) {
    title = `room ${location.name} `;
  }
  return `${title}`;
};
async function getWallsByFloorId(floorId) {
  const parameters = {
    get_walls_by_floor_id: true,
    floor_id_for_walls: floorId,
  };

  try {
    const response = await axios({
      method: "post",
      url: "https://www.cs.csub.edu/~runnermaps/backend/index.php",
      data: qs.stringify(parameters),
      dataType: "JSON",
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    console.error(error);
  }
}
async function getMarkersByFloorId(floorId) {
  try {
    const parameters = {
      get_markers_by_floor_id: true,
      floor_id_for_markers: floorId,
    };

    const response = await axios({
      method: "post",
      url: "https://www.cs.csub.edu/~runnermaps/backend/index.php",
      data: qs.stringify(parameters),
      dataType: "JSON",
      withCredentials: true,
    });

    return response.data;
  } catch (error) {
    console.error(error);
    return null;
  }
}

export {
  getWallsByFloorId,
  getMarkersByFloorId,
  formatTitle,
  formatTitleForIndoorNavigationHome,
};
