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
import CustomDropdownForAllIndoorLocations from "../utilities/Indoor_Navigation/Components/CustomDropdownForAllIndoorLocations";
import CardComponentForHomeScreen from "../utilities/Indoor_Navigation/Components/CardComponentForHomeScreen";

import LoadingImage from "../utilities/Components/LoadingImage";
import { formatTitle } from "./../utilities/Indoor_Navigation/Library/Screen_Functions";

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

  const data = all_indoor_locations_data.map((location) => {
    return {
      label: formatTitle(location),
      value: [location.floorID, location.row, location.col].join(","),
    };
  });
  const buildings = useSelector(
    (state) => state.all_indoor_locations.buildings
  );
  const services = useSelector((state) => state.all_indoor_locations.services);
  useEffect(() => {
    if (buildings && buildings.length > 0) {
      console.log("buildings", buildings);
    }
  }, [buildings]);
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

  const services_data = services.map((service) => {
    return {
      label: service.serviceName,
      value: service.serviceID,
    };
  });

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
  const toggleModal = () => {
    setModalVisible(!modalVisible);
  };

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
      <SafeAreaView style={tw`flex-col flex-1 bg-yellow-100`}>
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
                <CustomDropdownForAllIndoorLocations
                  data={filteredBuildingsData}
                  type="building"
                  placeholder="Filter by building"
                />
                <CustomDropdownForAllIndoorLocations
                  data={filteredServicesData}
                  type="services"
                  placeholder="Filter by service"
                />
              </View>
            </View>
          ) : null}
        </Modal>

        {all_indoor_locations_data && all_indoor_locations_data.length > 0 ? (
          <>
            <View style={tw`mx-1 mt-10 flex-row justify-center items-center`}>
              <View style={tw`w-8/10`}>
                <CustomDropdownForAllIndoorLocations
                  data={data}
                  type="all"
                  placeholder="Select destination"
                />
              </View>
              <View style={tw`w-2/10 mt-10 justify-center items-center`}>
                <FAB
                  icon="filter-plus"
                  size={30}
                  onPress={() => toggleModal()}
                  onBackdropPress={() => toggleModal()}
                  style={tw`bg-yellow-300`}
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
