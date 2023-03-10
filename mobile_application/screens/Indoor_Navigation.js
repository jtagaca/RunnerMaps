import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getBuildings } from "../redux_store/actions/Building_Locations";
import { getIndoorLocationsById } from "../redux_store/actions/Indoor_Locations";
import tw from "../tailwind/CustomTailwind";
import { CustomDropdown } from "../utilities/Indoor_Navigation/Components/CustomDropdown";

export default function IndoorNavigation() {
  const dispatch = useDispatch();
  const buildings = useSelector((state) => state.buildings.data);
  const status = useSelector((state) => state.buildings.status);
  const error = useSelector((state) => state.buildings.error);

  const indoor_locations = useSelector((state) => state.indoor_locations.data);
  const indoor_status = useSelector((state) => state.indoor_locations.status);
  const indoor_error = useSelector((state) => state.indoor_locations.error);

  const currenBuildingToNavigateTo = useSelector(
    (state) => state.current_building_to_indoor_navigate
  );

  // useEffect(() => {
  //   console.log(
  //     "use selector for current building" + currenBuildingToNavigateTo
  //   );
  // }, [currenBuildingToNavigateTo]);
  useEffect(() => {
    dispatch(getBuildings());
    if (currenBuildingToNavigateTo && currenBuildingToNavigateTo.id) {
      dispatch(getIndoorLocationsById(currenBuildingToNavigateTo.id));
    }
  }, [dispatch, currenBuildingToNavigateTo]);

  const data = buildings.map((building) => ({
    title: building.buildingName,
    id: building.buildingID.toString(),
  }));

  const indoor_locations_data = indoor_locations.map((location) => ({
    title: location.name + " " + location.locationID,
    id: location.locationID.toString(),
  }));
  return (
    <>
      {data != null ? <CustomDropdown data={data} /> : null}
      {indoor_status == "fulfilled" ? (
        <CustomDropdown data={indoor_locations_data} />
      ) : null}
    </>
  );
}
