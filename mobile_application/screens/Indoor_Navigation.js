import React, { useEffect, useRef, useState } from "react";
import { View, Text, Dimensions, StyleSheet, Image } from "react-native";
import { Card, Title, Paragraph } from "react-native-paper";
import { useDispatch, useSelector } from "react-redux";
import Swiper from "react-native-deck-swiper";
import cloneDeep from "lodash/cloneDeep";
import { Switch } from "react-native-switch";
import * as Location from "expo-location";
import tw from "../tailwind/CustomTailwind";
import { Button } from "react-native-paper";

export default function Indoor_Navigation({ navigation }) {
  const handleImageLoad = () => {
    setIsLoading(false);
  };
  const dispatch = useDispatch();
  const shortest_path = useSelector(
    (state) => state.indoor_navigation_properties.shortest_path_directions
  );
  const swiperRef = useRef(null);

  const carousel_data = cloneDeep(shortest_path);

  const sorted_shortest_path = carousel_data.sort((a, b) => {
    return a.key - b.key;
  });

  const [current_index_of_swiper, set_current_index_of_swiper] = useState(0);

  return (
    <>
      {carousel_data &&
      carousel_data !== undefined &&
      carousel_data !== null ? (
        <View style={tw`bg-yellow-100 `}>
          <View
            style={tw`flex flex-row justify-center mx-3 justify-between mt-5 h-2/40 content-center`}
          >
            <Button
              style={tw`rounded-lg bg-blue-500 text-center p-1`}
              onPress={() => {
                swiperRef.current.swipeLeft();
              }}
              uppercase={true}
              textColor="white"
              disabled={current_index_of_swiper === 0}
            >
              Swipe Left
            </Button>
            <Button
              style={tw`rounded-lg bg-blue-500 text-center p-1 `}
              onPress={() => {
                swiperRef.current.swipeRight();
              }}
              uppercase={true}
              textColor="white"
              title="Swipe Right"
            >
              Swipe Right
            </Button>
          </View>
          <View
            style={tw`flex-row justify-center  mt-5 bg-blue-500 p-2 h-2/30`}
          ></View>
          <View
            style={tw`flex-row justify-center bg-yellow-100 m-0 h-22/20 w-20/20 content-center`}
          >
            <Swiper
              style={tw`bg-yellow-100 m-0 `}
              cards={sorted_shortest_path}
              containerStyle={tw`bg-yellow-100 flex-col justify-center items-center h-20/20 w-20/20 shadow-2xl`}
              cardVerticalMargin={0}
              cardStyle={tw`bg-yellow-100 flex-col  h-10/20 mb-5 `}
              ref={swiperRef}
              renderCard={(card, index) => {
                if (card === undefined || card === null) {
                  return;
                }
                return (
                  <View style={(styles.container, tw`mt-2 shadow-2xl`)}>
                    <Card style={styles.card}>
                      <Card.Content style={tw`flex flex-col justify-center`}>
                        {card.locationName && card.locationName != null ? (
                          <View style={tw`flex-col`}>
                            {index === 0 ? (
                              <Text style={tw`text-center text-2xl `}>
                                START LOCATION {card.locationName.toUpperCase()}
                              </Text>
                            ) : null}
                            {index === sorted_shortest_path.length - 1 ? (
                              <Text style={tw`text-center text-2xl`}>
                                DESTINATION LOCATION{" "}
                                {card.locationName.toUpperCase()}
                              </Text>
                            ) : null}
                            {card.userDirection == "enter" ||
                            card.locationName == "elevator" ||
                            card.locationName == "stairs" ? (
                              <Text style={tw`text-center text-2xl`}>
                                ENTER {card.locationName.toUpperCase()}
                              </Text>
                            ) : null}
                          </View>
                        ) : null}

                        {card.image &&
                        card.image != null &&
                        card.image != "" ? (
                          <>
                            <Card.Cover
                              style={tw`h-8/10 m-5`}
                              source={{ uri: card.image }}
                              resizeMode="contain"
                            />
                          </>
                        ) : (
                          <View
                            style={tw`flex flex-col items-center justify-center h-full`}
                          >
                            {card.userDirection &&
                            card.userDirection != null &&
                            card.userDirection != "" ? (
                              <>
                                {card.userDirection != "enter" &&
                                card.userDirection != "keep straight" ? (
                                  <Text style={tw`text-3xl text-center`}>
                                    TURN {card.userDirection.toUpperCase()}
                                  </Text>
                                ) : (
                                  <Text style={tw`text-3xl text-center`}>
                                    {card.userDirection.toUpperCase()}
                                  </Text>
                                )}
                                {card.userDirection !== "enter" ? (
                                  card.is_outside &&
                                  card.is_outside !== false ? (
                                    <Text style={tw`text-3xl text-center`}>
                                      YOU ARE OUTSIDE, FOLLOW THE ROAD PATH
                                    </Text>
                                  ) : (
                                    <Text style={tw`text-3xl text-center`}>
                                      IN THE HALLWAY
                                    </Text>
                                  )
                                ) : null}
                              </>
                            ) : null}
                          </View>
                        )}
                      </Card.Content>
                    </Card>
                  </View>
                );
              }}
              onSwipedRight={(cardIndex) => {
                set_current_index_of_swiper(cardIndex + 1);
              }}
              onSwipedLeft={(cardIndex) => {
                set_current_index_of_swiper(cardIndex - 1);
              }}
              onSwipedAll={() => {
                alert("Congratulations! You have reached your destination");
              }}
              cardIndex={0}
              stackSize={3}
              showSecondCard={false}
              goBackToPreviousCardOnSwipeLeft={true}
              disableLeftSwipe={current_index_of_swiper === 0 ? true : false}
            ></Swiper>
          </View>
        </View>
      ) : null}
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  card: {
    width: "100%",
    height: "100%",
    marginBottom: 10,
  },
});
