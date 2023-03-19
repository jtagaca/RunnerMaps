import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getBuildings } from "../redux_store/actions/Building_Locations";
import { getIndoorLocationsById } from "../redux_store/actions/Indoor_Locations";
import tw from "../tailwind/CustomTailwind";
import { CustomDropdown } from "../utilities/Indoor_Navigation/Components/Custom_Dropdown";
import {
  indoor_locations_actions,
  indoor_navigation_properties_actions,
  setCurrentGeolocationProperties,
} from "../redux_store/reducers";
import SegmentedControlTab from "react-native-segmented-control-tab";

import Screen_Functions, {
  getWallsByFloorId,
  getMarkersByFloorId,
} from "../utilities/Indoor_Navigation/Library/Screen_Functions";
import { solveTheGrid } from "../utilities/Indoor_Navigation/Library/Algorithm_Functions";
import * as Location from "expo-location";
const Decimal = require("decimal.js");
import {
  Button,
  Alert,
  Modal,
  StyleSheet,
  Text,
  Pressable,
  View,
  ScrollView,
} from "react-native";

export default function IndoorNavigation({ navigation }) {
  const [modalVisible, setModalVisible] = useState(false);
  const [
    isStartAndDestinationOnDifferentFloors,
    setIsStartAndDestinationOnDifferentFloors,
  ] = useState(false);
  const [geolocationProperties, setGeolocationProperties] = useState(null);
  const dispatch = useDispatch();
  const [nearest_elevator_or_stairs, set_nearest_elevator_or_stairs] =
    useState(null);

  const {
    handleSelectionBuilding,
    handleSelectionStartLocation,
    handleSelectionDestinationLocation,
    handleClearIndoorNavigationProperties,
  } = Screen_Functions();
  const buildings = useSelector((state) => state.buildings.data);
  const status = useSelector((state) => state.buildings.status);
  const error = useSelector((state) => state.buildings.error);
  const haversineDistance = require("geodetic-haversine-distance");
  const indoor_locations = useSelector((state) => state.indoor_locations.data);
  const indoor_locations_map = useSelector(
    (state) => state.indoor_locations.map
  );
  const indoor_locations_elevators = useSelector(
    (state) => state.indoor_locations.elevators
  );
  const indoor_locations_stairs = useSelector(
    (state) => state.indoor_locations.stairs
  );
  const indoor_status = useSelector((state) => state.indoor_locations.status);
  const indoor_error = useSelector((state) => state.indoor_locations.error);

  const indoor_navigation_properties = useSelector(
    (state) => state.indoor_navigation_properties
  );
  useEffect(() => {
    // this needs to have a checker do not use run this useState if the user is not in this page
    // needs redux
    const updateLocation = async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setErrorMsg("Permission to access location was denied");
        return;
      }

      let location = await Location.getCurrentPositionAsync({
        enableHighAccuracy: true,
        accuracy: Location.Accuracy.Highest,
      });
      setGeolocationProperties(location.coords);
    };

    updateLocation();
    const interval_id = setInterval(updateLocation, 5000);
    return () => clearInterval(interval_id);
  }, []);

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

  useEffect(() => {
    if (indoor_locations.length > 0) {
      dispatch(indoor_locations_actions.buildIndoorLocationLookUpMap());
    }
  }, [indoor_locations]);
  const data = buildings.map((building) => ({
    title: building.buildingName,
    id: building.buildingID.toString(),
  }));

  const indoor_locations_data = indoor_locations.map((location) => {
    let title = location.name;
    if (
      location.name === "elevator" ||
      location.name === "stairs" ||
      location.name == "restroom" ||
      location.name === "entrance" ||
      location.name === "door"
    ) {
      title = `floor ${location.floorID} ${location.name}`;
    } else if (/^\d/.test(location.name)) {
      title = `room ${location.name} `;
    }
    return {
      title: title,
      id: [location.floorID, location.row, location.col].join(","),
    };
  });

  const ways_to_navigate_between_floors = ["Elevator", "Stairs"];
  const empty_query_result = "Please select a building to populate.";
  const [selectedIndex, setSelectedIndex] = useState(0);

  const handleIndexChange = (index) => {
    setSelectedIndex(index);
    dispatch(
      indoor_navigation_properties_actions.setChosenMethodToNavigateBetweenFloors(
        ways_to_navigate_between_floors[index]
      )
    );
    let floor_id =
      indoor_locations_map[
        String(indoor_navigation_properties.start_location_id)
      ].floorID;
    findNearestElevatorOrStairs(null, index, floor_id);
  };
  useEffect(() => console.log("modal state" + modalVisible), [modalVisible]);
  const handleStartNavigation = () => {
    changeModalVisibility();
    if (
      indoor_locations_map[
        String(indoor_navigation_properties.start_location_id)
      ].floorID !=
      indoor_locations_map[
        String(indoor_navigation_properties.destination_location_id)
      ].floorID
    ) {
      setIsStartAndDestinationOnDifferentFloors(true);
    }
    let floor_id =
      indoor_locations_map[
        String(indoor_navigation_properties.start_location_id)
      ].floorID;

    findNearestElevatorOrStairs(null, 0, floor_id);
    return;
  };

  const findNearestElevatorOrStairs = (start_point, index, floor_id) => {
    // find elevators in the indoor_locations.elevators array using the floorid
    let locations = [];
    if (ways_to_navigate_between_floors[index] == "Elevator") {
      locations = indoor_locations_elevators.filter(
        (elevator) => elevator.floorID == floor_id
      );
    } else if (ways_to_navigate_between_floors[index] == "Stairs") {
      locations = indoor_locations_stairs.filter(
        (stairs) => stairs.floorID == floor_id
      );
    }
    let current_geolocation_temp;
    if (start_point == null) {
      current_geolocation_temp = {
        latitude: parseFloat(geolocationProperties.latitude),
        longitude: parseFloat(geolocationProperties.longitude),
      };
    } else {
      current_geolocation_temp = {
        latitude: parseFloat(start_point.latitude),
        longitude: parseFloat(start_point.longitude),
      };
    }

    for (let i = 0; i < locations.length; i++) {
      const locationWithDistance = {
        ...locations[i],
        distance: haversineDistance(current_geolocation_temp, {
          latitude: parseFloat(locations[i].latitude),
          longitude: parseFloat(locations[i].longitude),
        }),
      };
      locations[i] = locationWithDistance;
    }

    let sorted_locations_via_haversine_distance = locations.sort(
      (a, b) => a.distance - b.distance
    );
    set_nearest_elevator_or_stairs(sorted_locations_via_haversine_distance[0]);
    return sorted_locations_via_haversine_distance[0];
  };
  const handleStartNavigationConfirmed = async () => {
    // todo rename change the variable
    // add a variable for this and change it indoor_locations_map[String(indoor_navigation_properties.start_location_id)]
    //   .floorID;

    // selected index bug
    let gridStartRowLength = parseInt(
      indoor_locations_map[
        String(indoor_navigation_properties.start_location_id)
      ].gridRowLength
    );
    let gridStartColumnLength = parseInt(
      indoor_locations_map[
        String(indoor_navigation_properties.start_location_id)
      ].gridColumnLength
    );
    let start_location_row_index = parseInt(
      indoor_locations_map[
        String(indoor_navigation_properties.start_location_id)
      ].row
    );
    let start_location_column_index = parseInt(
      indoor_locations_map[
        String(indoor_navigation_properties.start_location_id)
      ].col
    );

    if (isStartAndDestinationOnDifferentFloors == false) {
      let floor_id =
        indoor_locations_map[
          String(indoor_navigation_properties.start_location_id)
        ].floorID;
      let destination_location_row_index = parseInt(
        indoor_locations_map[
          String(indoor_navigation_properties.destination_location_id)
        ].row
      );
      let destination_location_column_index = parseInt(
        indoor_locations_map[
          String(indoor_navigation_properties.destination_location_id)
        ].col
      );

      let initializedPosition = {
        startRowIndex: parseInt(start_location_row_index),
        startColIndex: parseInt(start_location_column_index),
        endRowIndex: parseInt(destination_location_row_index),
        endColIndex: parseInt(destination_location_column_index),
      };

      let grid = [];
      for (let i = 0; i < gridStartRowLength; i++) {
        grid[i] = [];
        for (let j = 0; j < gridStartColumnLength; j++) {
          grid[i][j] = -1;
        }
      }
      let walls = await getWallsByFloorId(
        indoor_locations_map[
          String(indoor_navigation_properties.start_location_id)
        ].floorID
      );
      let markers = await getMarkersByFloorId(
        indoor_locations_map[
          String(indoor_navigation_properties.start_location_id)
        ].floorID
      );
      let map_of_markers = {};

      for (let i = 0; i < walls.length; i++) {
        grid[walls[i].row][walls[i].col] = "WALL";
      }
      for (let i = 0; i < markers.length; i++) {
        map_of_markers[[markers[i].row, markers[i].col]] = markers[i];
      }
      let path = [];
      path.push({
        key: -1,
        row: start_location_row_index,
        col: start_location_column_index,
        locationName: indoor_navigation_properties.start_location,
        image:
          indoor_locations_map[
            String(indoor_navigation_properties.start_location_id)
          ].image,
        userDirection: "",
        latitude:
          indoor_locations_map[
            String(indoor_navigation_properties.start_location_id)
          ].latitude,
        longitude:
          indoor_locations_map[
            String(indoor_navigation_properties.start_location_id)
          ].longitude,
      });
      let shortest_path = solveTheGrid(
        grid,
        initializedPosition,
        map_of_markers,
        indoor_locations_map,
        floor_id
      );
      if (shortest_path.length == 0) {
        Alert.alert("No path found");
        return;
      }
      // add the shortest_path to the path array
      for (let i = 0; i < shortest_path.length; i++) {
        if (
          shortest_path[i].userDirection == "" &&
          shortest_path[i].latitude == null &&
          shortest_path[i].longitude == null
        ) {
          continue;
        }
        path.push(shortest_path[i]);
      }
      // add the destination to the path array
      path.push({
        key: shortest_path[shortest_path.length - 1].key + 1,
        row: destination_location_row_index,
        col: destination_location_column_index,
        locationName: indoor_navigation_properties.destination_location,
        image:
          indoor_locations_map[
            String(indoor_navigation_properties.destination_location_id)
          ].image,
        userDirection: "",
        latitude:
          indoor_locations_map[
            String(indoor_navigation_properties.destination_location_id)
          ].latitude,
        longitude:
          indoor_locations_map[
            String(indoor_navigation_properties.destination_location_id)
          ].longitude,
      });
      dispatch(
        indoor_navigation_properties_actions.setShortestPathDirections(path)
      );
      if (modalVisible == true) {
        changeModalVisibility();
      }
      navigation.push("Indoor Navigation");
      return;
    }
    if (isStartAndDestinationOnDifferentFloors == true) {
      gridStartRowLength = parseInt(
        indoor_locations_map[
          String(indoor_navigation_properties.start_location_id)
        ].gridRowLength
      );
      gridStartColumnLength = parseInt(
        indoor_locations_map[
          String(indoor_navigation_properties.start_location_id)
        ].gridColumnLength
      );
      // nearest_elevator_or_stairs;
      let floor_id =
        indoor_locations_map[
          String(indoor_navigation_properties.start_location_id)
        ].floorID;
      start_location_row_index = parseInt(
        indoor_locations_map[
          String(indoor_navigation_properties.start_location_id)
        ].row
      );
      start_location_column_index = parseInt(
        indoor_locations_map[
          String(indoor_navigation_properties.start_location_id)
        ].col
      );
      let destination_location_row_index = parseInt(
        nearest_elevator_or_stairs.row
      );
      let destination_location_column_index = parseInt(
        nearest_elevator_or_stairs.col
      );

      let initializedPosition = {
        startRowIndex: parseInt(start_location_row_index),
        startColIndex: parseInt(start_location_column_index),
        endRowIndex: parseInt(destination_location_row_index),
        endColIndex: parseInt(destination_location_column_index),
      };

      let grid = [];
      for (let i = 0; i < gridStartRowLength; i++) {
        grid[i] = [];
        for (let j = 0; j < gridStartColumnLength; j++) {
          grid[i][j] = -1;
        }
      }
      const walls = await getWallsByFloorId(
        indoor_locations_map[
          String(indoor_navigation_properties.start_location_id)
        ].floorID
      );
      let markers = await getMarkersByFloorId(
        indoor_locations_map[
          String(indoor_navigation_properties.start_location_id)
        ].floorID
      );
      let map_of_markers = {};

      for (let i = 0; i < walls.length; i++) {
        grid[walls[i].row][walls[i].col] = "WALL";
      }
      for (let i = 0; i < markers.length; i++) {
        map_of_markers[[markers[i].row, markers[i].col]] = markers[i];
      }
      let path = [];
      path.push({
        key: -1,
        row: start_location_row_index,
        col: start_location_column_index,
        locationName: indoor_navigation_properties.start_location,
        image:
          indoor_locations_map[
            String(indoor_navigation_properties.start_location_id)
          ].image,
        userDirection: "",
        latitude:
          indoor_locations_map[
            String(indoor_navigation_properties.start_location_id)
          ].latitude,
        longitude:
          indoor_locations_map[
            String(indoor_navigation_properties.start_location_id)
          ].longitude,
      });
      let shortest_path = solveTheGrid(
        grid,
        initializedPosition,
        map_of_markers,
        indoor_locations_map,
        floor_id
      );
      if (shortest_path.length == 0) {
        Alert.alert("No path found");
        return;
      }
      // add the shortest_path to the path array
      for (let i = 0; i < shortest_path.length; i++) {
        if (
          shortest_path[i].userDirection == "" &&
          shortest_path[i].latitude == null &&
          shortest_path[i].longitude == null
        ) {
          continue;
        }
        path.push(shortest_path[i]);
      }
      // add the destination to the path array
      path.push({
        key: shortest_path[shortest_path.length - 1].key + 1,
        row: destination_location_row_index,
        col: destination_location_column_index,
        locationName: nearest_elevator_or_stairs.name,
        image: nearest_elevator_or_stairs.image,
        userDirection: "",
        latitude: nearest_elevator_or_stairs.latitude,
        longitude: nearest_elevator_or_stairs.longitude,
      });

      let destination_floor_id =
        indoor_locations_map[
          String(indoor_navigation_properties.destination_location_id)
        ].floorID;
      let current_index = nearest_elevator_or_stairs.name == "elevator" ? 0 : 1;
      let new_destination_elevator_or_stairs = findNearestElevatorOrStairs(
        nearest_elevator_or_stairs,
        current_index,
        destination_floor_id
      );
      destination_location_row_index =
        indoor_locations_map[
          String(indoor_navigation_properties.destination_location_id)
        ].row;
      destination_location_column_index =
        indoor_locations_map[
          String(indoor_navigation_properties.destination_location_id)
        ].col;

      const initializedPosition2 = {
        startRowIndex: parseInt(new_destination_elevator_or_stairs.row),
        startColIndex: parseInt(new_destination_elevator_or_stairs.col),
        endRowIndex: parseInt(destination_location_row_index),
        endColIndex: parseInt(destination_location_column_index),
      };

      const gridStartRowLength2 =
        indoor_locations_map[
          String(indoor_navigation_properties.destination_location_id)
        ].gridRowLength;
      const gridStartColumnLength2 =
        indoor_locations_map[
          String(indoor_navigation_properties.destination_location_id)
        ].gridColumnLength;

      const grid2 = [];
      for (let i = 0; i < gridStartRowLength2; i++) {
        grid2[i] = [];
        for (let j = 0; j < gridStartColumnLength2; j++) {
          grid2[i][j] = -1;
        }
      }
      const walls2 = await getWallsByFloorId(
        indoor_locations_map[
          String(indoor_navigation_properties.destination_location_id)
        ].floorID
      );
      const markers2 = await getMarkersByFloorId(
        indoor_locations_map[
          String(indoor_navigation_properties.destination_location_id)
        ].floorID
      );
      const map_of_markers2 = {};

      for (let i = 0; i < walls2.length; i++) {
        grid2[walls2[i].row][walls2[i].col] = "WALL";
      }
      for (let i = 0; i < markers2.length; i++) {
        map_of_markers2[[markers2[i].row, markers2[i].col]] = markers2[i];
      }
      const shortest_path2 = solveTheGrid(
        grid2,
        initializedPosition2,
        map_of_markers2,
        indoor_locations_map,
        destination_floor_id
      );
      if (shortest_path2.length == 0) {
        Alert.alert("No path found");
        return;
      }

      // add the shortest_path2 to the path array
      for (let i = 0; i < shortest_path2.length; i++) {
        if (
          shortest_path2[i].userDirection == "" &&
          shortest_path2[i].latitude == null &&
          shortest_path2[i].longitude == null
        ) {
          continue;
        }
        shortest_path2[i].key += 100;
        path.push(shortest_path2[i]);
      }
      // add the destination to the path array
      path.push({
        key: path[path.length - 1].key + 1,
        row: destination_location_row_index,
        col: destination_location_column_index,
        locationName:
          indoor_locations_map[
            String(indoor_navigation_properties.destination_location_id)
          ].name,
        image:
          indoor_locations_map[
            String(indoor_navigation_properties.destination_location_id)
          ].image,
        userDirection: "",
        latitude:
          indoor_locations_map[
            String(indoor_navigation_properties.destination_location_id)
          ].name.latitude,
        longitude:
          indoor_locations_map[
            String(indoor_navigation_properties.destination_location_id)
          ].name.longitude,
      });

      dispatch(
        indoor_navigation_properties_actions.setShortestPathDirections(path)
      );
      if (modalVisible == true) {
        changeModalVisibility();
      }

      setSelectedIndex(0);
      navigation.push("Indoor Navigation");
    }
  };
  const changeModalVisibility = () => {
    setModalVisible(!modalVisible);
  };

  useEffect(() => {
    console.log("selected index: " + selectedIndex);
  }, [selectedIndex]);

  return (
    <>
      <ScrollView
        style={styles.container}
        contentContainerStyle={{ flex: 1, padding: 24 }}
        keyboardShouldPersistTaps="handled"
      >
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => {
            Alert.alert("Modal has been closed.");
            changeModalVisibility();
          }}
        >
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              {isStartAndDestinationOnDifferentFloors == true ? (
                <>
                  <Text>
                    Your start location and destination location are on
                    different floors{" "}
                  </Text>
                  <Text>Choose your preferred method</Text>
                  <SegmentedControlTab
                    values={ways_to_navigate_between_floors}
                    selectedIndex={selectedIndex}
                    onTabPress={handleIndexChange}
                  />
                </>
              ) : null}

              <Pressable
                style={[styles.button, styles.buttonClose]}
                onPress={changeModalVisibility}
              >
                <Text style={styles.textStyle}>Cancel</Text>
              </Pressable>

              <Pressable
                style={[styles.button, styles.buttonClose]}
                onPress={() => {
                  handleStartNavigationConfirmed();
                }}
              >
                <Text style={styles.textStyle}>Start</Text>
              </Pressable>
            </View>
          </View>
        </Modal>
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
          empty_query_result={empty_query_result}
        />
        <Text>Destination Location:</Text>
        <CustomDropdown
          data={indoor_locations_data}
          handleSelection={handleSelectionDestinationLocation}
          handleClear={handleClearIndoorNavigationProperties}
          type={"destination_location"}
          empty_query_result={empty_query_result}
        />

        <Button
          disabled={
            indoor_navigation_properties.start_location_id == null ||
            indoor_navigation_properties.destination_location_id == null ||
            indoor_navigation_properties.start_location_id ==
              indoor_navigation_properties.destination_location_id
          }
          title="Start Navigation"
          onPress={
            indoor_navigation_properties != null &&
            indoor_locations_map[
              String(indoor_navigation_properties.start_location_id)
            ]?.floorID !=
              indoor_locations_map[
                String(indoor_navigation_properties.destination_location_id)
              ]?.floorID
              ? handleStartNavigation
              : handleStartNavigationConfirmed
          }
        ></Button>
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },
  buttonOpen: {
    backgroundColor: "#F194FF",
  },
  buttonClose: {
    backgroundColor: "#2196F3",
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center",
  },
});
