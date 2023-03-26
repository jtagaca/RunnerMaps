import { View, Text } from "react-native";
import React, { useEffect } from "react";
import { getAllIndoorLocations } from "../redux_store/actions/All_Indoor_Locations";
import { useDispatch, useSelector } from "react-redux";

export default function HomeScreen() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getAllIndoorLocations());
  }, [dispatch]);
  return (
    <View>
      <Text>Home_Screen</Text>
    </View>
  );
}
