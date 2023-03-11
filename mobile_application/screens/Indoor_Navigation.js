import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getBuildings } from "../redux_store/actions/Building_Locations";
import { getIndoorLocationsById } from "../redux_store/actions/Indoor_Locations";
import tw from "../tailwind/CustomTailwind";
import { CustomDropdown } from "../utilities/Indoor_Navigation/Components/Custom_Dropdown";
import { indoor_navigation_properties_actions } from "../redux_store/reducers";
import { indoor_locations_actions } from "../redux_store/reducers";
import SegmentedControlTab from "react-native-segmented-control-tab";

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

export default function IndoorNavigation() {
  const [modalVisible, setModalVisible] = useState(false);
  const [
    isStartAndDestinationOnDifferentFloors,
    setIsStartAndDestinationOnDifferentFloors,
  ] = useState(false);
  const dispatch = useDispatch();
  const buildings = useSelector((state) => state.buildings.data);
  const status = useSelector((state) => state.buildings.status);
  const error = useSelector((state) => state.buildings.error);

  const indoor_locations = useSelector((state) => state.indoor_locations.data);
  const indoor_locations_map = useSelector(
    (state) => state.indoor_locations.map
  );
  let is_start_and_destination_location_different_floors = false;
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

  const [selectedIndex, setSelectedIndex] = useState(0);

  const handleIndexChange = (index) => {
    setSelectedIndex(index);
  };

  const empty_query_result = "Please select a building to populate.";
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
                    values={["Elevator", "Stairs"]}
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
                  setModalVisible(!modalVisible);
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
