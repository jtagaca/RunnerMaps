import { useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  outdoor_navigation_properties_actions,
  all_indoor_locations_actions,
} from "../../redux_store/reducers";

const Screen_Functions = () => {
  const dispatch = useDispatch();
  const all_indoor_locations = useSelector(
    (state) => state.all_indoor_locations
  );

  const getBuildingEntrancesByBuildingID = (building) => {
    let entrances = all_indoor_locations.data.filter(
      (location) =>
        location.buildingID === parseInt(building.building_id) &&
        location.name === "entrance"
    );
    return entrances;
  };

  const actions = useMemo(
    () => ({
      handleSelectionBuilding(building) {
        dispatch(
          outdoor_navigation_properties_actions.setSelectedBuildingToOutdoorNavigate(
            building
          )
        );
      },
      handleClearChosenBuilding() {
        dispatch(all_indoor_locations_actions.deleteChosenBuilding());
      },
      handleClearOutdoorNavigationProperties(type) {
        if (type) {
          if (type === "building") {
            dispatch(
              outdoor_navigation_properties_actions.setSelectedBuildingToOutdoorNavigate(
                { id: null, title: null }
              )
            );
          }
        }
      },
    }),
    [dispatch]
  );

  return { actions, getBuildingEntrancesByBuildingID };
};

export default Screen_Functions;
