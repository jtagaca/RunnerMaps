import {
  View,
  SafeAreaView,
  TouchableHighlight,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
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
  const filteredData = selectedItem
    ? all_indoor_locations_data.filter(
        (item) =>
          [item.floorID, item.row, item.col].join(",") === selectedItem.value
      )
    : all_indoor_locations_data;

  return (
    <AllIndoorLocationContext.Provider
      value={{ selectedItem, setSelectedItem }}
    >
      <SafeAreaView style={tw`flex-col flex-1 bg-yellow-100`}>
        {all_indoor_locations_data && all_indoor_locations_data.length > 0 ? (
          <>
            <View style={tw`mx-1 mt-10 `}>
              <CustomDropdownForAllIndoorLocations data={data} />
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
