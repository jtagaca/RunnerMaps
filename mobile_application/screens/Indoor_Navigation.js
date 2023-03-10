import { View, Text } from "react-native";
import React from "react";
import tw from "../tailwind/CustomTailwind";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchBuildings } from "../redux_store/actions/Building_Locations";
import { fetchTargetLocations } from "../redux_store/actions/Indoor_Locations";

import axios from "axios";
import qs from "qs";
export default function IndoorNavigation() {
  const custom_style = tw`text-center text-white border-solid border-2 border-sky-500 text-black  `;
  const dispatch = useDispatch();
  const buildingLocations = useSelector(
    (state) => state.buildingLocations.data
  );
  const status = useSelector((state) => state.buildingLocations.status);
  const error = useSelector((state) => state.buildingLocations.error);

  const indoor_locations = useSelector((state) => state.targetLocations.data);
  const indoor_status = useSelector((state) => state.targetLocations.status);
  const indoor_error = useSelector((state) => state.targetLocations.error);

  useEffect(() => {
    dispatch(fetchBuildings());
    console.log("Locations" + buildingLocations);
    dispatch(fetchTargetLocations(1));
  }, [dispatch]);

  if (status === "loading") {
    return (
      <View>
        <Text>Loading...</Text>
      </View>
    );
  }

  if (status === "failed") {
    return (
      <View>
        <Text>{error}</Text>
      </View>
    );
  }
  return (
    <View>
      {buildingLocations &&
        buildingLocations.map((building) => (
          <Text key={building.buildingID}>{building.buildingName}</Text>
        ))}
    </View>
  );
}
