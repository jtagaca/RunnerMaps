import { StatusBar } from "expo-status-bar";
import { StyleSheet, View, Button, Text } from "react-native";
import React, { useState, useEffect } from "react";
import * as Location from "expo-location";
import { useSelector, useDispatch } from "react-redux";
import { setCurrentLocation } from "./redux_store/reducers";

export default function Test() {
  const dispatch = useDispatch();

  const handleGetCurrentLocation = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        Alert.alert("Permission to access location was denied");
        return;
      }

      const location = await Location.getCurrentPositionAsync({});
      const { latitude, longitude } = location.coords;
      dispatch(setCurrentLocation({ latitude, longitude }));
    } catch (error) {
      Alert.alert(`Error getting location: ${error.message}`);
    }
  };

  return (
    <View className="flex-1 items-center justify-center bg-white">
      {currentLocation && (
        <Text>
          Current location: {currentLocation.latitude},{" "}
          {currentLocation.longitude}
        </Text>
      )}
      <Button title="Get Current Location" onPress={handleGetCurrentLocation} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
  },
  text: {
    fontSize: 20,
    marginBottom: 20,
    backgroundColor: "black",
    color: "white",
  },
});
