import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getBuildings } from "../redux_store/actions/Building_Locations";
import { getIndoorLocationsById } from "../redux_store/actions/Indoor_Locations";
import tw from "../tailwind/CustomTailwind";
import CustomDropdownWithSelectorFromParent from "../utilities/Indoor_Navigation/Components/CustomDropdownWithSelectorFromParent";
import CustomDropdown from "../utilities/Indoor_Navigation/Components/CustomDropdown";

import {
  indoor_locations_actions,
  indoor_navigation_properties_actions,
} from "../redux_store/reducers";
import SegmentedControlTab from "react-native-segmented-control-tab";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import Screen_Functions, {
  getWallsByFloorId,
  getMarkersByFloorId,
  formatTitleForIndoorNavigationHome,
  makeHexColorDarker,
} from "../utilities/Indoor_Navigation/Library/Screen_Functions";
import { solveTheGrid } from "../utilities/Indoor_Navigation/Library/Algorithm_Functions";
import * as Location from "expo-location";
import { SafeAreaView } from "react-native-safe-area-context";
import { Button } from "react-native-paper";

import {
  Modal,
  StyleSheet,
  Text,
  Pressable,
  View,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";

import { Linking, Alert, Platform } from "react-native";
export default function IndoorNavigation({ navigation }) {
  const [modalVisible, setModalVisible] = useState(false);
  const [
    isStartAndDestinationOnDifferentFloors,
    setIsStartAndDestinationOnDifferentFloors,
  ] = useState(false);
  const [selected_floor, setSelectedFloor] = useState(null);

  const [closest_location_near_user, setClosestLocationNearUser] =
    useState(null);
  const [
    closest_location_near_user_confirmed,
    setClosestLocationNearUserConfirmed,
  ] = useState(null);
  const dispatch = useDispatch();
  const [nearest_elevator_or_stairs, set_nearest_elevator_or_stairs] =
    useState(null);

  const {
    handleSelectionBuilding,
    handleSelectionStartLocation,
    handleSelectionDestinationLocation,
    handleClearIndoorNavigationProperties,
    handleClearChosenBuilding,
    handleClearChosenDestinationLocation,
  } = Screen_Functions();
  const [is_loading, set_is_loading] = useState(false);
  const [modal_for_closest_location, setModalForClosestLocation] =
    useState(false);

  const buildings = useSelector((state) => state.buildings.data);
  const floors = useSelector((state) => state.indoor_locations.floors);
  const [geolocationProperties, setGeolocationProperties] = useState(null);
  const haversineDistance = require("geodetic-haversine-distance");
  const indoor_locations = useSelector((state) => state.indoor_locations.data);
  const indoor_locations_map = useSelector(
    (state) => state.indoor_locations.map
  );
  const [is_find_loading, set_is_find_loading] = useState(false);
  const home_screen_selected_building = useSelector(
    (state) => state.all_indoor_locations.chosen_building
  );
  const home_screen_selected_destination_location = useSelector(
    (state) => state.all_indoor_locations.destination_location
  );
  const indoor_locations_elevators = useSelector(
    (state) => state.indoor_locations.elevators
  );
  const indoor_locations_stairs = useSelector(
    (state) => state.indoor_locations.stairs
  );

  const indoor_navigation_properties = useSelector(
    (state) => state.indoor_navigation_properties
  );
  const updateLocation = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      const openSettings = async () => {
        if (Platform.OS === "ios") {
          if (await Linking.canOpenURL("app-settings:")) {
            await Linking.openURL("app-settings:");
          } else {
            console.log("Unable to open app settings");
          }
        } else if (Platform.OS === "android") {
          await Linking.openSettings();
        }
      };

      Alert.alert(
        "It seems that permission wasn't granted please try again",
        "Please enable location permission in the app settings to use all features.",
        [
          { text: "Cancel", onPress: () => console.log("Canceled") },
          { text: "Open Settings", onPress: openSettings },
        ]
      );

      return;
    }

    let location = await Location.getCurrentPositionAsync({
      enableHighAccuracy: true,
      accuracy: Location.Accuracy.Highest,
    });
    setGeolocationProperties(location.coords);
  };
  useEffect(() => {
    updateLocation();
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
    label: building.buildingName,
    value: building.buildingID.toString(),
  }));

  const indoor_locations_data = indoor_locations.map((location) => {
    return {
      label: formatTitleForIndoorNavigationHome(location),
      value: [location.floorID, location.row, location.col].join(","),
    };
  });

  const ways_to_navigate_between_floors = ["Elevator", "Stairs"];
  const empty_query_result = "Please select a building";
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
    if (modalVisible == true) {
      changeModalVisibility();
    }
    set_is_loading(true);

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
    let isOnDifferentFloors =
      indoor_locations_map[
        String(indoor_navigation_properties.start_location_id)
      ].floorID !=
      indoor_locations_map[
        String(indoor_navigation_properties.destination_location_id)
      ].floorID;

    if (isOnDifferentFloors == false) {
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

      set_is_loading(false);
      navigation.push("Result");
      return;
    }
    if (isOnDifferentFloors == true) {
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
          ].latitude,
        longitude:
          indoor_locations_map[
            String(indoor_navigation_properties.destination_location_id)
          ].longitude,
      });

      dispatch(
        indoor_navigation_properties_actions.setShortestPathDirections(path)
      );

      set_is_loading(false);

      setSelectedIndex(0);
      navigation.push("Result");
    }
  };
  const changeModalVisibility = () => {
    setModalVisible(!modalVisible);
  };
  const floor_data_dropdown = floors.map((floor) => ({
    label: "floor " + floor.floorNumber.toString(),
    value: floor.floorID.toString(),
  }));
  const useNearestLocationForStartLocation = () => {
    let copy = { ...closest_location_near_user };

    setClosestLocationNearUserConfirmed(copy);
    setModalForClosestLocation(false);
  };
  const handleClearStartLocationInModal = () => {
    setClosestLocationNearUser(null);
    setClosestLocationNearUserConfirmed(null);
    setSelectedFloor(null);
  };
  const handleFindClosestLocation = async () => {
    // use the indoor_location and filter via the selected_floor.value
    set_is_find_loading(true);
    let filtered_indoor_locations = indoor_locations.filter(
      (indoor_location) => {
        return indoor_location.floorID == parseInt(selected_floor.value);
      }
    );
    let current_geolocation_temp;
    await updateLocation();
    current_geolocation_temp = {
      latitude: parseFloat(geolocationProperties.latitude),
      longitude: parseFloat(geolocationProperties.longitude),
    };

    for (let i = 0; i < filtered_indoor_locations.length; i++) {
      const locationWithDistance = {
        ...filtered_indoor_locations[i],
        distance: haversineDistance(current_geolocation_temp, {
          latitude: parseFloat(filtered_indoor_locations[i].latitude),
          longitude: parseFloat(filtered_indoor_locations[i].longitude),
        }),
      };
      filtered_indoor_locations[i] = locationWithDistance;
    }

    let sorted_locations_via_haversine_distance =
      filtered_indoor_locations.sort((a, b) => a.distance - b.distance);
    setClosestLocationNearUser(sorted_locations_via_haversine_distance[0]);
    set_is_find_loading(false);
  };

  const accessibility = useSelector((state) => state.accessibility);

  return (
    <SafeAreaView
      style={[
        tw`flex flex-1`,
        {
          backgroundColor: accessibility.selected_background_color.primaryColor,
        },
      ]}
    >
      <ScrollView
        style={[tw`flex-col`, { opacity: is_loading ? 0 : 1 }]}
        contentContainerStyle={{ padding: 24 }}
        keyboardShouldPersistTaps="handled"
      >
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          style={[{ opacity: is_loading ? 0 : 1 }]}
          onRequestClose={() => {
            changeModalVisibility();
          }}
        >
          <View style={tw`flex-col content-center justify-center flex-1`}>
            <View
              style={tw`m-[20px] bg-white rounded-2xl p-10 items-center h-6/10 shadow-md flex-col justify-start`}
            >
              {isStartAndDestinationOnDifferentFloors == true ? (
                <>
                  <View style={tw`w-full my-3`}>
                    <Text
                      style={[
                        tw`text-left`,
                        accessibility.selected_font_color != "#d4b3b3"
                          ? {
                              color: accessibility.selected_font_color,
                            }
                          : null,
                        {
                          fontSize: parseInt(
                            accessibility.selected_font_size,
                            10
                          ),
                        },
                      ]}
                    >
                      Your start location and destination location are on
                      different floors{" "}
                    </Text>
                  </View>
                  <View style={tw`w-full my-3`}>
                    <Text
                      style={[
                        tw`text-left`,
                        accessibility.selected_font_color != "#d4b3b3"
                          ? {
                              color: accessibility.selected_font_color,
                            }
                          : null,
                        {
                          fontSize: parseInt(
                            accessibility.selected_font_size,
                            10
                          ),
                        },
                      ]}
                    >
                      Choose your preferred method
                    </Text>
                  </View>
                  <SegmentedControlTab
                    tabsContainerStyle={[
                      tw`my-3`,
                      {
                        backgroundColor:
                          accessibility.selected_background_color
                            .secondaryColor,
                      },
                    ]}
                    tabTextStyle={[
                      tw`text-lg`,
                      accessibility.selected_font_color != "#d4b3b3"
                        ? {
                            color: accessibility.selected_font_color,
                          }
                        : null,
                    ]}
                    values={ways_to_navigate_between_floors}
                    selectedIndex={selectedIndex}
                    onTabPress={handleIndexChange}
                  />
                </>
              ) : null}
              <View
                style={tw`flex-row flex-wrap items-center justify-center justify-between flex-1 m-3`}
              >
                <Button
                  style={tw`mx-2 bg-red-500 w-4/10`}
                  labelStyle={[
                    tw`text-lg`,
                    accessibility.selected_font_color != "#d4b3b3"
                      ? {
                          color: accessibility.selected_font_color,
                        }
                      : tw`text-white`,
                  ]}
                  onPress={changeModalVisibility}
                >
                  Cancel
                </Button>
                <Button
                  style={tw`mx-2 bg-green-700 w-4/10`}
                  labelStyle={[
                    tw`text-lg `,
                    accessibility.selected_font_color != "#d4b3b3"
                      ? {
                          color: accessibility.selected_font_color,
                        }
                      : tw`text-white`,
                  ]}
                  onPress={handleStartNavigationConfirmed}
                >
                  Start
                </Button>
              </View>
            </View>
          </View>
        </Modal>

        <Modal
          animationType="slide"
          transparent={true}
          visible={modal_for_closest_location}
          onRequestClose={() => {
            changeModalVisibility();
          }}
        >
          <View style={tw`flex-col content-center justify-center flex-1 `}>
            <View
              style={tw`m-[20px] bg-white rounded-2xl p-5 items-center h-3/4 shadow-md flex-col`}
            >
              <View
                style={tw`flex-col items-center justify-center justify-between flex-1 m-3`}
              >
                <CustomDropdownWithSelectorFromParent
                  given_style={[
                    tw`h-12/10`,
                    accessibility.selected_font_color != "#d4b3b3"
                      ? {
                          color: accessibility.selected_font_color,
                        }
                      : tw`text-white`,
                  ]}
                  data={floor_data_dropdown}
                  placeholder="Which floor are you in?"
                  selectedItem={selected_floor}
                  setSelectedItem={setSelectedFloor}
                />
                <View
                  style={[
                    tw`flex-col m-1 justify-center items-center rounded-lg p-4 mt-3`,
                    {
                      backgroundColor:
                        accessibility.selected_background_color
                          .darkerPrimaryColor,
                    },
                  ]}
                >
                  <Text
                    style={[
                      tw`text-center `,
                      {
                        fontSize: parseInt(
                          accessibility.selected_font_size,
                          10
                        ),
                      },
                    ]}
                  >
                    Closest location near you
                  </Text>
                  {is_find_loading ? (
                    <ActivityIndicator
                      animating={true}
                      size="large"
                      color={
                        accessibility.selected_background_color.secondaryColor
                      }
                      style={tw`self-center`} // Center the activity indicator
                    />
                  ) : (
                    <Text
                      style={[
                        tw`text-center `,
                        {
                          fontSize: parseInt(
                            accessibility.selected_font_size,
                            10
                          ),
                        },
                      ]}
                    >
                      {closest_location_near_user &&
                        formatTitleForIndoorNavigationHome(
                          closest_location_near_user
                        )}
                    </Text>
                  )}
                </View>
                <View style={tw`flex-row justify-center items-center mt-3`}>
                  <Button
                    style={tw`mx-2 bg-red-500 w-4/10`}
                    labelStyle={[
                      tw`text-lg`,
                      accessibility.selected_font_color != "#d4b3b3"
                        ? {
                            color: accessibility.selected_font_color,
                          }
                        : tw`text-white`,
                    ]}
                    onPress={() => {
                      handleClearStartLocationInModal();
                      setModalForClosestLocation(false);
                    }}
                  >
                    Cancel
                  </Button>
                  <Button
                    style={[
                      tw`mx-2 w-4/10`,
                      selected_floor == null
                        ? tw`bg-gray-300`
                        : tw`bg-green-700`,
                    ]}
                    disabled={selected_floor == null}
                    labelStyle={[
                      tw`text-lg`,
                      selected_floor == null
                        ? tw`text-gray-500`
                        : accessibility.selected_font_color != "#d4b3b3"
                        ? {
                            ...tw`font-bold text-[1rem]`,
                            color: accessibility.selected_font_color,
                          }
                        : tw`font-bold text-[1rem] text-white`,
                    ]}
                    onPress={handleFindClosestLocation}
                  >
                    Find
                  </Button>
                </View>
                <View
                  style={tw`flex-row justify-center items-center mt-3 mb-10`}
                >
                  <Button
                    style={[
                      closest_location_near_user == null
                        ? tw`bg-gray-300`
                        : tw`bg-green-700`,
                    ]}
                    disabled={closest_location_near_user == null}
                    labelStyle={[
                      tw`text-lg`,

                      closest_location_near_user == null
                        ? tw`text-gray-500`
                        : tw`font-bold text-[1rem] text-white`,
                    ]}
                    onPress={useNearestLocationForStartLocation}
                  >
                    Use location as start location
                  </Button>
                </View>
              </View>
            </View>
          </View>
        </Modal>
        {data.length == 0 ? null : (
          <>
            <View style={tw`flex-col flex-1 my-3`}>
              <Text
                style={[
                  tw`px-1 py-2 my-1 font-bold text-left rounded-md shadow-md w-5/10`,
                  { fontSize: parseInt(accessibility.selected_font_size, 10) },
                  {
                    backgroundColor:
                      accessibility.selected_background_color
                        .darkerPrimaryColor,
                  },
                  accessibility.selected_font_color != "#d4b3b3"
                    ? {
                        color: accessibility.selected_font_color,
                      }
                    : null,
                ]}
              >
                Building Selected:
              </Text>
              <CustomDropdown
                data={data}
                handleSelection={handleSelectionBuilding}
                handleClear={handleClearIndoorNavigationProperties}
                type={"building"}
                default_selected_item={
                  home_screen_selected_building &&
                  home_screen_selected_building != null
                    ? {
                        label: home_screen_selected_building.buildingName,
                        value:
                          home_screen_selected_building.buildingID.toString(),
                      }
                    : null
                }
                handleClearHomeScreenData={handleClearChosenBuilding}
              />
            </View>
            <View style={tw`flex-col flex-1 my-3`}>
              <Text
                style={[
                  tw`px-1 py-2 my-1 text-lg font-bold text-left rounded-md shadow-md w-4/10`,
                  {
                    backgroundColor:
                      accessibility.selected_background_color
                        .darkerPrimaryColor,
                  },
                  accessibility.selected_font_color != "#d4b3b3"
                    ? {
                        color: accessibility.selected_font_color,
                      }
                    : null,
                  {
                    fontSize: accessibility.selected_font_size,
                  },
                ]}
              >
                Start Location:
              </Text>
              <View style={tw`flex-row`}>
                <CustomDropdown
                  given_style={[
                    tw`h-12/10`,
                    accessibility.selected_font_color != "#d4b3b3"
                      ? {
                          color: accessibility.selected_font_color,
                        }
                      : tw`text-white`,
                  ]}
                  data={indoor_locations_data}
                  handleSelection={handleSelectionStartLocation}
                  handleClear={handleClearIndoorNavigationProperties}
                  type={"start_location"}
                  empty_query_result={empty_query_result}
                  default_selected_item={
                    closest_location_near_user_confirmed &&
                    closest_location_near_user_confirmed != null
                      ? {
                          label: formatTitleForIndoorNavigationHome(
                            closest_location_near_user_confirmed
                          ),
                          value: [
                            closest_location_near_user_confirmed.floorID,
                            closest_location_near_user_confirmed.row,
                            closest_location_near_user_confirmed.col,
                          ].join(","),
                        }
                      : null
                  }
                  handleClearHomeScreenData={handleClearStartLocationInModal}
                />
                <View style={tw`w-2/10  justify-center items-center `}>
                  <TouchableOpacity
                    style={[
                      tw`rounded-full p-2`,
                      indoor_locations_data.length &&
                      indoor_locations_data.length > 0
                        ? {
                            backgroundColor:
                              accessibility.selected_background_color
                                .secondaryColor,
                          }
                        : tw`bg-gray-300`,
                    ]}
                    disabled={indoor_locations_data.length == 0}
                    onPress={() => setModalForClosestLocation(true)}
                  >
                    <Icon
                      name="crosshairs-gps"
                      color={
                        indoor_locations_data.length &&
                        indoor_locations_data.length > 0
                          ? accessibility.selected_font_color != "#d4b3b3"
                            ? accessibility.selected_font_color
                            : "white"
                          : "grey"
                      }
                      size={40}
                    />
                  </TouchableOpacity>
                </View>
              </View>
            </View>
            <View style={tw`flex-col flex-1 my-3`}>
              <Text
                style={[
                  tw`px-1 py-2 my-1 font-bold text-left rounded-md shadow-md w-6/10`,
                  {
                    backgroundColor:
                      accessibility.selected_background_color
                        .darkerPrimaryColor,
                  },
                  accessibility.selected_font_color != "#d4b3b3"
                    ? {
                        color: accessibility.selected_font_color,
                      }
                    : null,
                  { fontSize: parseInt(accessibility.selected_font_size, 10) },
                ]}
              >
                Destination Location:
              </Text>

              <CustomDropdown
                data={indoor_locations_data}
                handleSelection={handleSelectionDestinationLocation}
                handleClear={handleClearIndoorNavigationProperties}
                type={"destination_location"}
                empty_query_result={empty_query_result}
                default_selected_item={
                  home_screen_selected_destination_location &&
                  home_screen_selected_destination_location != null
                    ? {
                        label: formatTitleForIndoorNavigationHome(
                          home_screen_selected_destination_location
                        ),
                        value: [
                          home_screen_selected_destination_location.floorID,
                          home_screen_selected_destination_location.row,
                          home_screen_selected_destination_location.col,
                        ].join(","),
                      }
                    : null
                }
                handleClearHomeScreenData={handleClearChosenDestinationLocation}
              />
            </View>
            <View style={tw`flex items-center justify-center`}>
              <Button
                style={tw`w-5/10 ${
                  indoor_locations_data == null ||
                  indoor_locations_data.length == 0 ||
                  indoor_navigation_properties.start_location_id == null ||
                  indoor_navigation_properties.destination_location_id ==
                    null ||
                  indoor_navigation_properties.start_location_id ==
                    indoor_navigation_properties.destination_location_id
                    ? "bg-gray-300"
                    : "bg-green-700"
                } `}
                labelStyle={[
                  indoor_locations_data == null ||
                  indoor_locations_data.length == 0 ||
                  indoor_navigation_properties.start_location_id == null ||
                  indoor_navigation_properties.destination_location_id ==
                    null ||
                  indoor_navigation_properties.start_location_id ==
                    indoor_navigation_properties.destination_location_id
                    ? tw`text-gray-500`
                    : {
                        ...tw`font-bold text-[1rem]`,
                        color:
                          accessibility.selected_font_color != "#d4b3b3"
                            ? accessibility.selected_font_color
                            : "white",
                      },
                ]}
                disabled={
                  indoor_locations_data == null ||
                  indoor_locations_data.length == 0 ||
                  indoor_navigation_properties.start_location_id == null ||
                  indoor_navigation_properties.destination_location_id ==
                    null ||
                  indoor_navigation_properties.start_location_id ==
                    indoor_navigation_properties.destination_location_id
                }
                onPress={
                  indoor_navigation_properties != null &&
                  indoor_locations_map[
                    String(indoor_navigation_properties.start_location_id)
                  ]?.floorID !=
                    indoor_locations_map[
                      String(
                        indoor_navigation_properties.destination_location_id
                      )
                    ]?.floorID
                    ? handleStartNavigation
                    : handleStartNavigationConfirmed
                }
              >
                Start Navigation
              </Button>
            </View>
          </>
        )}
      </ScrollView>
      {(is_loading || data.length === 0) && (
        <View style={[tw`absolute inset-0 flex items-center justify-center`]}>
          <ActivityIndicator
            animating={true}
            size="large"
            color={accessibility.selected_background_color.secondaryColor}
          />
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    // marginTop: 22,
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    height: "50%",
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
