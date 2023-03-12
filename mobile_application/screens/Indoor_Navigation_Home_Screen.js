import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getBuildings } from "../redux_store/actions/Building_Locations";
import { getIndoorLocationsById } from "../redux_store/actions/Indoor_Locations";
import tw from "../tailwind/CustomTailwind";
import { CustomDropdown } from "../utilities/Indoor_Navigation/Components/Custom_Dropdown";
import {
  indoor_locations_actions,
  indoor_navigation_properties_actions,
} from "../redux_store/reducers";
import SegmentedControlTab from "react-native-segmented-control-tab";

import Screen_Functions, {
  getWallsByFloorId,
  getMarkersByFloorId,
} from "../utilities/Indoor_Navigation/Library/Screen_Functions";
import { solveTheGrid } from "../utilities/Indoor_Navigation/Library/Algorithm_Functions";

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
  const dispatch = useDispatch();

  const {
    handleSelectionBuilding,
    handleSelectionStartLocation,
    handleSelectionDestinationLocation,
    handleClearIndoorNavigationProperties,
  } = Screen_Functions();
  const buildings = useSelector((state) => state.buildings.data);
  const status = useSelector((state) => state.buildings.status);
  const error = useSelector((state) => state.buildings.error);

  const indoor_locations = useSelector((state) => state.indoor_locations.data);
  const indoor_locations_map = useSelector(
    (state) => state.indoor_locations.map
  );
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

  useEffect(() => {
    if (indoor_locations.length > 0) {
      dispatch(indoor_locations_actions.buildIndoorLocationLookUpMap());
    }
  }, [indoor_locations]);
  const data = buildings.map((building) => ({
    title: building.buildingName,
    id: building.buildingID.toString(),
  }));

  const indoor_locations_data = indoor_locations.map((location) => ({
    title: location.name + " " + location.row + " " + location.col,
    id: location.locationID.toString(),
  }));
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
  };
  const handleStartNavigation = () => {
    setModalVisible(true);
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
    return;
  };

  const handleStartNavigationConfirmed = async () => {
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
        startRowIndex: start_location_row_index,
        startColIndex: start_location_column_index,
        endRowIndex: destination_location_row_index,
        endColIndex: destination_location_column_index,
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
        map_of_markers
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
      path.push({
        key: path.length - 1,
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
      navigation.push("Indoor Navigation");
      return;
    }
    if (isStartAndDestinationOnDifferentFloors == true) {
      let gridDestinationRowLength =
        indoor_locations_map[
          String(indoor_navigation_properties.destination_location_id)
        ].gridRowLength;
      let gridDestinationColumnLength =
        indoor_locations_map[
          String(indoor_navigation_properties.destination_location_id)
        ].gridColumnLength;
    }
  };
  function goToIndoorNavigationScreen() {
    navigation.push("Indoor Navigation");
  }
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
            setModalVisible(!modalVisible);
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
                onPress={() => {
                  setModalVisible(!modalVisible);
                }}
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
            indoor_navigation_properties.destination_location_id == null
          }
          title="Start Navigation"
          onPress={handleStartNavigation}
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
