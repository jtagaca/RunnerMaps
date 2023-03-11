import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getBuildings } from "../redux_store/actions/Building_Locations";
import { getIndoorLocationsById } from "../redux_store/actions/Indoor_Locations";
import tw from "../tailwind/CustomTailwind";
import { CustomDropdown } from "../utilities/Indoor_Navigation/Components/Custom_Dropdown";
import { indoor_navigation_properties_actions } from "../redux_store/reducers";
import { indoor_locations_actions } from "../redux_store/reducers";

import { Text, Button } from "react-native";

export default function IndoorNavigation() {
  const dispatch = useDispatch();
  const buildings = useSelector((state) => state.buildings.data);
  const status = useSelector((state) => state.buildings.status);
  const error = useSelector((state) => state.buildings.error);

  const indoor_locations = useSelector((state) => state.indoor_locations.data);
  const indoor_status = useSelector((state) => state.indoor_locations.status);
  const indoor_error = useSelector((state) => state.indoor_locations.error);

  const indoor_navigation_properties = useSelector(
    (state) => state.indoor_navigation_properties
  );

  useEffect(() => {
    dispatch(getBuildings());
  }, [dispatch]);

  useEffect(() => {
    if (indoor_navigation_properties) {
      if (indoor_navigation_properties.building_id != null) {
        dispatch(
          getIndoorLocationsById(indoor_navigation_properties.building_id)
        );
        return;
      }
      dispatch(indoor_locations_actions.clearIndoorLocationData());
    }
  }, [indoor_navigation_properties]);

  const data = buildings.map((building) => ({
    title: building.buildingName,
    id: building.buildingID.toString(),
  }));

  const indoor_locations_data = indoor_locations.map((location) => ({
    title: location.name + " " + location.locationID,
    id: location.locationID.toString(),
  }));

  const handleSelectionBuilding = (building) => {
    dispatch(
      indoor_navigation_properties_actions.setSelectedBuildingToIndoorNavigate(
        building
      )
    );
  };
  const handleSelectionStartLocation = (start_location) => {
    dispatch(
      indoor_navigation_properties_actions.setSelectedStartLocationToIndoorNavigate(
        start_location
      )
    );
  };
  const handleSelectionDestinationLocation = (destination_location) => {
    dispatch(
      indoor_navigation_properties_actions.setSelectedDestinationLocationToIndoorNavigate(
        destination_location
      )
    );
  };
  const handleClearIndoorNavigationProperties = (type) => {
    if (type) {
      if (type == "building") {
        dispatch(
          indoor_navigation_properties_actions.setSelectedBuildingToIndoorNavigate(
            { id: null, title: null }
          )
        );
      } else if (type == "start_location") {
        dispatch(
          indoor_navigation_properties_actions.setSelectedStartLocationToIndoorNavigate(
            { id: null, title: null }
          )
        );
      } else if (type == "destination_location") {
        dispatch(
          indoor_navigation_properties_actions.setSelectedDestinationLocationToIndoorNavigate(
            { id: null, title: null }
          )
        );
      }
    }
  };

  return (
    <>
      <Text>Building Selected:</Text>
      {data.length > 0 ? (
        <CustomDropdown
          data={data}
          handleSelection={handleSelectionBuilding}
          handleClear={handleClearIndoorNavigationProperties}
          type={"building"}
        />
      ) : null}
      <Text>Start Location:</Text>

      <CustomDropdown
        data={indoor_locations_data}
        handleSelection={handleSelectionStartLocation}
        handleClear={handleClearIndoorNavigationProperties}
        type={"start_location"}
      />
      <Text>Destination Location:</Text>
      <CustomDropdown
        data={indoor_locations_data}
        handleSelection={handleSelectionDestinationLocation}
        handleClear={handleClearIndoorNavigationProperties}
        type={"destination_location"}
      />
    </>
  );
}
