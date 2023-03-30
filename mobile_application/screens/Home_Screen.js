import {
  View,
  SafeAreaView,
  TouchableHighlight,
  StyleSheet,
  TouchableOpacity,
  Image,
} from "react-native";
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
import LoadingImage from "../utilities/Components/Loading_Image";
export default function HomeScreen() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getAllIndoorLocations());
  }, [dispatch]);

  const [is_loading, setIsLoading] = useState(false);
  const all_indoor_locations_data = useSelector(
    (state) => state.all_indoor_locations.data
  );
  return (
    <SafeAreaView style={tw`flex flex-1 bg-yellow-100`}>
      <FadeInFlatList
        initialDelay={0}
        durationPerItem={500}
        parallelItems={5}
        itemsToFadeIn={10}
        data={all_indoor_locations_data}
        renderItem={({ item, index, separators }) => (
          <View>
            <Card style={(styles.card, styles.spacing)}>
              <Card.Content>
                <Title>{item.name}</Title>
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
              <Card.Actions style={styles.actionContainer}>
                <View style={{ flexDirection: "row" }}>
                  <View
                    style={{
                      flexDirection: "row",
                      marginRight: 40,
                      // backgroundColor: "grey",
                    }}
                  >
                    <View
                      style={{
                        marginRight: 20,
                        marginLeft: 10,
                        padding: 10,
                      }}
                    >
                      <TouchableOpacity
                        style={
                          (styles.buttonContainer,
                          {
                            borderWidth: 2,

                            // backgroundColor: theme.colors.primary,
                            borderRadius: 20,
                            // borderColor: theme.colors.primary,
                          })
                        }
                      >
                        <IconButton
                          icon="phone"
                          // color={theme.colors.background}
                          onPress={() => CallNum(item.display_phone)}
                        >
                          {/* <Icon
                          style={{ color: theme.colors.background }}
                          name="phone"
                          size={19}
                        /> */}
                        </IconButton>
                      </TouchableOpacity>
                    </View>
                    <View
                      style={{
                        marginLeft: 20,
                        marginRight: 10,
                        padding: 10,
                      }}
                    >
                      <TouchableOpacity
                        style={
                          (styles.buttonContainer,
                          {
                            borderWidth: 2,
                            borderRadius: 20,
                            // backgroundColor: theme.colors.primary,
                            // borderColor: theme.colors.primary,
                          })
                        }
                      >
                        <IconButton
                          onPress={() =>
                            openMap({
                              end:
                                item.location.address1 +
                                ", " +
                                item.location.city,
                            })
                          }
                          // color={theme.colors.background}
                          icon="directions"
                        ></IconButton>
                      </TouchableOpacity>
                    </View>
                    {/* need to move  */}
                    <View style={styles.buttonContainer}></View>
                  </View>
                  <View
                    style={{
                      flexDirection: "row",
                      alignSelf: "center",
                    }}
                  ></View>
                </View>
              </Card.Actions>
            </Card>
          </View>
        )}
        keyExtractor={(item) => item.locationID}
      />
    </SafeAreaView>
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
    borderRadius: 1,
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
