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
                  <View style={tw`m-1`}>
                    <Card mode="elevated" style={(styles.card, styles.spacing)}>
                      <LinearGradient
                        colors={["#3B82F6", "#f7db69"]}
                        style={styles.background}
                      >
                        <Card.Content
                          style={tw`flex-row items-center justify-center mt-2 mb-3 `}
                        >
                          <Title
                            style={tw`p-2 bg-yellow-300 rounded-md shadow-2xl`}
                          >
                            {formatTitle(item)}
                          </Title>
                        </Card.Content>
                        <TouchableOpacity
                        // onPress={() =>
                        //   props.navigation.navigate("RestaurantDetails", {
                        //     name: item.name,
                        //     restaurant: item,
                        //   })
                        // }
                        >
                          <LoadingImage uri={item.image ? item.image : null} />
                        </TouchableOpacity>
                        <View
                          style={tw`flex-row items-center justify-center py-2 mx-5 my-2 justify-evenly`}
                        >
                          <TouchableOpacity
                            style={tw`flex-row items-center p-1 mx-4 bg-blue-500 rounded-2xl justify-evenly w-5/10`}
                            onPress={() => handleIndoorNavigate(item)}
                          >
                            <Text style={tw`text-white`}>Indoor Navigate</Text>
                            <Icon
                              name="street-view"
                              color="white"
                              size={25}
                            ></Icon>
                          </TouchableOpacity>
                          <TouchableOpacity
                            style={tw`flex-row items-center p-1 mx-4 bg-blue-500 rounded-2xl justify-evenly w-5/10`}
                            onPress={() => CallNum(item.display_phone)}
                          >
                            <Text style={tw`text-white`}>Outdoor Navigate</Text>
                            <Icon name="compass" color="white" size={25}></Icon>
                          </TouchableOpacity>
                        </View>
                      </LinearGradient>
                    </Card>
                  </View>
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

const styles = StyleSheet.create({
  container: {
    backgroundColor: "black",
  },
  invcontainer: {
    backgroundColor: "white",
    opacity: 0.7,
  },
  text: {},
  spacing: {
    marginTop: 20,
    paddingLeft: 0,
    paddingRight: 0,
    paddingBottom: 0,
  },
  allign: {
    textAlign: "left",
    alignSelf: "stretch",
    marginRight: 300,
    marginLeft: 0,
  },
  actionContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    height: 65,
  },
  card: {
    flexDirection: "row",
    height: 30,
    width: 10,
    borderRadius: 10,
    alignSelf: "center",
    marginBottom: 3,
    marginTop: 3,
    borderLeftWidth: 5,
    shadowColor: "#000",
    shadowOffset: {
      width: 1,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  rating: {
    flex: 1,
  },
  appButtonContainer: {
    elevation: 8,
    backgroundColor: "white",
    borderRadius: 30,
    paddingVertical: 0,
    paddingHorizontal: 0,
  },
  buttonContainer: {
    borderRadius: 25,
    paddingTop: 0,
    paddingBottom: 0,
    marginRight: 1.8,
    marginLeft: 1.8,
    flex: 1,
  },
  appButtonText: {
    fontSize: 14,
    color: "#FFFFFF",
    fontWeight: "bold",
    alignSelf: "center",
    padding: 0,
    margin: 0,
  },
  phone: {
    height: 30,
    width: 30,
    backgroundColor: "#329df4",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 5,
  },
  fabStyle: {
    position: "absolute",
    margin: 16,
    right: 0,
    bottom: 0,
    backgroundColor: "lightblue",
  },
  olStyle: {
    position: "absolute",
    top: 50,
    bottom: 180,
    left: 50,
    right: 50,
  },
  leftContainer: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "flex-start",
  },
  rightContainer: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "flex-end",
  },
  popupmodal: {
    margin: 20,
  },
});
