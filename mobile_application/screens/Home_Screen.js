import {
  View,
  SafeAreaView,
  TouchableHighlight,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
  Modal,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import React, { useEffect, useState } from "react";
import { getAllIndoorLocations } from "../redux_store/actions/All_Indoor_Locations";
import { useDispatch, useSelector } from "react-redux";
import tw from "../tailwind/CustomTailwind";
import { FadeInFlatList } from "@ja-ka/react-native-fade-in-flatlist";
import { all_indoor_locations_actions } from "./../redux_store/reducers";
import {
  Text,
  Button,
  Card,
  Title,
  ActivityIndicator,
  Searchbar,
  IconButton,
  FAB,
} from "react-native-paper";
import Icon from "react-native-vector-icons/FontAwesome";
import { useNavigation } from "@react-navigation/native";
import CustomDropdownWithSelectorFromParent from "../utilities/Indoor_Navigation/Components/CustomDropdownWithSelectorFromParent";
import CardComponentForHomeScreen from "../utilities/Indoor_Navigation/Components/CardComponentForHomeScreen";
import tinycolor from "tinycolor2";

import LoadingImage from "../utilities/Components/LoadingImage";
import {
  formatTitle,
  makeHexColorDarker,
} from "./../utilities/Indoor_Navigation/Library/Screen_Functions";

import AllIndoorLocationContext from "./../utilities/Indoor_Navigation/Contexts/AllIndoorLocations";
import Screen_Functions from "./../utilities/Indoor_Navigation/Library/Screen_Functions";

export default function HomeScreen() {
  const dispatch = useDispatch();
  const [selectedItem, setSelectedItem] = useState(null);
  const [buildingSelectedItem, setBuildingSelectedItem] = useState(null);
  const [serviceSelectedItem, setServiceSelectedItem] = useState(null);

  const [modalVisible, setModalVisible] = useState(false);

  const navigation = useNavigation();
  useEffect(() => {
    dispatch(getAllIndoorLocations());
  }, [dispatch]);

  const all_indoor_locations_data = useSelector(
    (state) => state.all_indoor_locations.data
  );

  const handleIndoorNavigate = (location) => {
    dispatch(
      all_indoor_locations_actions.setChosenBuilding({
        buildingName: location.buildingName,
        buildingID: location.buildingID,
      })
    );
    dispatch(all_indoor_locations_actions.setDestinationLocation(location));
    navigation.navigate("Indoor Navigation");
  };
  const handleOutdoorNavigate = (location) => {
    dispatch(
      all_indoor_locations_actions.setChosenBuilding({
        buildingName: location.buildingName,
        buildingID: location.buildingID,
      })
    );
    dispatch(all_indoor_locations_actions.setDestinationLocation(location));
    navigation.navigate("Outdoor Navigation");
  };

  const buildings = useSelector(
    (state) => state.all_indoor_locations.buildings
  );
  const services = useSelector((state) => state.all_indoor_locations.services);

  const filterBuildingsByService = () => {
    if (serviceSelectedItem) {
      const filteredLocations = all_indoor_locations_data.filter(
        (item) => item.categoryID === serviceSelectedItem.value
      );
      const filteredBuildingIds = [
        ...new Set(filteredLocations.map((item) => item.buildingID)),
      ];
      return buildings.filter((building) =>
        filteredBuildingIds.includes(building.buildingID)
      );
    }
    return buildings;
  };

  const filteredBuildings = filterBuildingsByService();

  const filterServicesByBuilding = () => {
    if (buildingSelectedItem) {
      const filteredLocations = all_indoor_locations_data.filter(
        (item) => item.buildingID === buildingSelectedItem.value
      );
      const filteredCategoryIds = [
        ...new Set(filteredLocations.map((item) => item.categoryID)),
      ];
      return services.filter((service) =>
        filteredCategoryIds.includes(service.serviceID)
      );
    }
    return services;
  };

  const filteredServices = filterServicesByBuilding();

  const filteredServicesData = filteredServices.map((service) => {
    return {
      label: service.serviceName,
      value: service.serviceID,
    };
  });

  const filteredBuildingsData = filteredBuildings.map((building) => {
    return {
      label: building.buildingName,
      value: building.buildingID,
    };
  });
  const accessibility = useSelector((state) => state.accessibility);

  const filterData = () => {
    return all_indoor_locations_data.filter((item) => {
      let allFilter = true;
      let buildingFilter = true;
      let serviceFilter = true;

      if (selectedItem) {
        allFilter =
          [item.floorID, item.row, item.col].join(",") === selectedItem.value;
      }

      if (buildingSelectedItem) {
        buildingFilter = item.buildingID === buildingSelectedItem.value;
      }

      if (serviceSelectedItem) {
        serviceFilter = item.categoryID === serviceSelectedItem.value;
      }

      return allFilter && buildingFilter && serviceFilter;
    });
  };

  const filteredData = filterData();
  const filteredDataForAllDropdown = filteredData.map((location) => {
    return {
      label: formatTitle(location),
      value: [location.floorID, location.row, location.col].join(","),
    };
  });
  const toggleModal = () => {
    setModalVisible(!modalVisible);
  };

  //! todo
  // there must be two ways to handle the background color
  // one for bg - yellow - 100 and one for the bg - yellow - 300
  // for the bg-yellow-300 if the hex color is dark then the text color should be white

  // just use backgroundColor instead of tailwind

  // if (current_color === default ) {
  // darker_color = makeHexColorDarker(default_color, 0.2)
  // if (darker_color is dark) {
  // text_color = white
  // }
  //!

  return (
    <AllIndoorLocationContext.Provider
      value={{
        selectedItem,
        setSelectedItem,
        buildingSelectedItem,
        setBuildingSelectedItem,
        serviceSelectedItem,
        setServiceSelectedItem,
      }}
    >
      <SafeAreaView
        style={[
          tw`flex-col flex-1`,
          accessibility.selected_background_color.primaryColor === "default"
            ? tw`bg-yellow-100`
            : {
                backgroundColor:
                  accessibility.selected_background_color.primaryColor,
              },
        ]}
        edges={[]}
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
          {filteredBuildingsData && filteredBuildingsData != null ? (
            <View style={tw`flex-col content-center justify-center flex-1`}>
              <View
                style={tw`m-[20px] bg-white rounded-2xl p-10 items-center h-1/2 shadow-md flex-col justify-start`}
              >
                <TouchableOpacity
                  onPress={() => setModalVisible(!modalVisible)}
                  style={tw`absolute top-5 right-5`}
                >
                  <Icon name="times" size={24} color="black" />
                </TouchableOpacity>
                <CustomDropdownWithSelectorFromParent
                  data={filteredBuildingsData}
                  placeholder="Filter by building"
                  selectedItem={buildingSelectedItem}
                  setSelectedItem={setBuildingSelectedItem}
                />
                <CustomDropdownWithSelectorFromParent
                  data={filteredServicesData}
                  placeholder="Filter by service"
                  selectedItem={serviceSelectedItem}
                  setSelectedItem={setServiceSelectedItem}
                />
              </View>
            </View>
          ) : null}
        </Modal>

        {all_indoor_locations_data && all_indoor_locations_data.length > 0 ? (
          <>
            <View style={tw`mx-1 flex-row justify-center items-center`}>
              <View style={tw`w-8/10`}>
                <CustomDropdownWithSelectorFromParent
                  data={filteredDataForAllDropdown}
                  placeholder="Select destination"
                  selectedItem={selectedItem}
                  setSelectedItem={setSelectedItem}
                />
              </View>
              <View style={tw`w-2/10 mt-10 justify-center items-center`}>
                <FAB
                  icon="filter-plus"
                  size={30}
                  onPress={() => toggleModal()}
                  onBackdropPress={() => toggleModal()}
                  style={[
                    accessibility.selected_background_color.primaryColor ===
                    "default"
                      ? tw`bg-yellow-300`
                      : {
                          backgroundColor: makeHexColorDarker(
                            accessibility.selected_background_color.primaryColor
                          ),
                        },
                  ]}
                  color="black"
                />
              </View>
            </View>

            <View>
              <FadeInFlatList
                initialDelay={0}
                durationPerItem={500}
                parallelItems={5}
                itemsToFadeIn={10}
                data={filteredData}
                renderItem={({ item, index, separators }) => (
                  <CardComponentForHomeScreen
                    item={item}
                    handleIndoorNavigate={handleIndoorNavigate}
                    handleOutdoorNavigate={handleOutdoorNavigate}
                    formatTitle={formatTitle}
                  />
                )}
                keyExtractor={(item) => item.locationID}
              />
            </View>
          </>
        ) : null}
      </SafeAreaView>
    </AllIndoorLocationContext.Provider>
  );
}
