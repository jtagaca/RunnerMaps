import React, { useState, useEffect } from "react";
import {
  Alert,
  StyleSheet,
  Text,
  View,
  Linking,
  ActivityIndicator,
} from "react-native";
import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps";
import * as Location from "expo-location";
import MapViewDirections from "react-native-maps-directions";
import apiKey from "./config_dev.js";
import { getDistance } from "geolib";
import tw from "../../tailwind/CustomTailwind";
import { Button } from "react-native-paper";
import { useDispatch, useSelector } from "react-redux";
import CustomDropdown from "../../utilities/Indoor_Navigation/Components/CustomDropdown";
import Screen_Functions from "./Screen_Functions";
import { getBuildings } from "../../redux_store/actions/Building_Locations";
export default function Maps() {
  const [region, setRegion] = useState(null);
  const [destination, setDestination] = useState(null);
  const [polyline, setPolyline] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [mapReady, setMapReady] = useState(false);

  const home_screen_entrances = useSelector(
    (state) => state.all_indoor_locations.entrances
  );
  const home_screen_selected_building = useSelector(
    (state) => state.all_indoor_locations.chosen_building
  );

  const { actions, getBuildingEntrancesByBuildingID } = Screen_Functions();
  const {
    handleSelectionBuilding,
    handleClearOutdoorNavigationProperties,
    handleClearChosenBuilding,
  } = actions;
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getBuildings());
  }, [dispatch]);
  const accessibility = useSelector((state) => state.accessibility);
  const buildings = useSelector((state) => state.buildings.data);
  const data = buildings.map((building) => ({
    label: building.buildingName,
    value: building.buildingID.toString(),
  }));
  const buildingSelected = useSelector(
    (state) => state.outdoor_navigation_properties
  );

  useEffect(() => {
    const fetchData = async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      let entrances = [];

      if (buildingSelected) {
        entrances = getBuildingEntrancesByBuildingID(buildingSelected);
      } else if (home_screen_entrances && home_screen_entrances != null) {
        entrances = home_screen_entrances;
      }
      if (status !== "granted") {
        console.log("Permission to access location was denied");
        return;
      }
      const location = await Location.getCurrentPositionAsync({});
      const origin = {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      };
      setRegion({
        latitude: origin.latitude,
        longitude: origin.longitude,
        latitudeDelta: 0.015,
        longitudeDelta: 0.015,
      });
      let destinations = [];

      for (let i = 0; i < entrances.length; i++) {
        let lat = parseFloat(entrances[i].latitude);
        let long = parseFloat(entrances[i].longitude);
        destinations.push({ latitude: lat, longitude: long });
      }

      const closestDestination = (obj) => {
        let minDistance = Infinity;
        let closestDest = obj[0];
        Object.keys(obj).forEach(function (key) {
          let distance = getDistance(origin, obj[key]);
          if (distance < minDistance) {
            minDistance = distance;
            closestDest = obj[key];
          }
        });
        setIsLoading(false);
        return closestDest;
      };
      let destination = closestDestination(destinations);
      setDestination(destination);
    };
    if (
      (home_screen_entrances &&
        home_screen_entrances != null &&
        home_screen_entrances.length > 0) ||
      (buildingSelected.building_id && buildingSelected.building_id != null)
    ) {
      setIsLoading(false);

      fetchData();
    }
  }, [home_screen_entrances, buildingSelected]);

  useEffect(() => {
    console.log("buildingSelected", buildingSelected);
  }, [buildingSelected]);

  const handleGetDirections = async () => {
    const location = await Location.getCurrentPositionAsync({});
    const origin = {
      latitude: location.coords.latitude,
      longitude: location.coords.longitude,
    };
    const destinationStr = `${destination.latitude},${destination.longitude}`;
    const originStr = `${origin.latitude},${origin.longitude}`;
    const directionsUrl = `https://maps.googleapis.com/maps/api/directions/json?origin=${originStr}&destination=${destinationStr}&key=${apiKey}`;
    try {
      const response = await fetch(directionsUrl);
      const result = await response.json();
      if (result.status === "OK" && result.routes.length > 0) {
        const newPolyline = result.routes[0].overview_polyline.points;
        setPolyline(newPolyline);
        const url = `https://www.google.com/maps/dir/?api=1&destination=${destinationStr}&travelmode=walking&dir_action=navigate&polyline=${polyline}`;
        Linking.openURL(url);
      } else {
        Alert.alert("Error", "Directions not found");
      }
    } catch (error) {
      Alert.alert("Error", error.message);
    }
  };
  return (
    <View
      style={[
        {
          backgroundColor: accessibility.selected_background_color.primaryColor,
        },
        styles.container,
      ]}
    >
      <View style={tw`flex-col flex-1 my-3`}>
        <CustomDropdown
          data={data}
          handleSelection={handleSelectionBuilding}
          handleClear={handleClearOutdoorNavigationProperties}
          type={"building"}
          default_selected_item={
            home_screen_selected_building &&
            home_screen_selected_building != null
              ? {
                  label: home_screen_selected_building.buildingName,
                  value: home_screen_selected_building.buildingID.toString(),
                }
              : null
          }
          handleClearHomeScreenData={handleClearChosenBuilding}
        />
      </View>
      {region ? (
        <>
          <MapView
            style={styles.map}
            region={region}
            provider={PROVIDER_GOOGLE}
          >
            <Marker coordinate={region} title="You are here" />
            <Marker coordinate={destination} title="Destination" />
            <MapViewDirections
              origin={region}
              destination={destination}
              apikey={apiKey}
              strokeWidth={3}
              mode="WALKING"
              strokeColor="red"
            />
          </MapView>
          <Button
            style={[
              tw`mt-3`,
              {
                backgroundColor:
                  accessibility.selected_background_color.secondaryColor,
              },
            ]}
            labelStyle={tw`text-lg text-white `}
            onPress={handleGetDirections}
          >
            Start Live Navigation
          </Button>
        </>
      ) : (
        <ActivityIndicator
          animating={true}
          size="large"
          color={accessibility.selected_background_color.secondaryColor}
          style={tw`self-center`} // Center the activity indicator
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 40,
    paddingBottom: 10,
  },
  map: {
    margin: 0,
    zoom: 0,
    width: "100%",
    height: "80%",
  },
});
