import React, { useRef, useState, useEffect } from "react";
import { View, Text, ScrollView, Platform } from "react-native";
import Swiper from "react-native-deck-swiper";
import cloneDeep from "lodash/cloneDeep";
import { useSelector } from "react-redux";
import tw from "../../../tailwind/CustomTailwind";
import CardComponent from "./CardComponent";
import Icon from "react-native-vector-icons/FontAwesome";
import { Audio } from "expo-av";
import { formatTitle } from "../Library/Screen_Functions";

const soundObject = new Audio.Sound();

import ButtonGroup from "./ButtonGroup";
import { buildText } from "../Library/FormatText";

import * as Speech from "expo-speech";

export default function CustomSwiper() {
  const haversineDistance = require("geodetic-haversine-distance");
  const shortest_path = useSelector(
    (state) => state.indoor_navigation_properties.shortest_path_directions
  );
  const swiperRef = useRef(null);

  const carousel_data = cloneDeep(shortest_path);
  const accessibility = useSelector((state) => state.accessibility);

  const sorted_shortest_path = carousel_data.sort((a, b) => {
    return a.key - b.key;
  });

  useEffect(() => {
    const enableSound = async () => {
      try {
        if (Platform.OS === "ios") {
          await Audio.setAudioModeAsync({
            playsInSilentModeIOS: true,
          });
          await soundObject.loadAsync(require("../Extra/soundFile.mp3"));
          await soundObject.playAsync();
        }
      } catch (error) {
        console.error("Error enabling sound:", error);
        alert("Error loading sound");
      }
    };
    enableSound();

    // Unload the sound file when the component is unmounted
    return () => {
      soundObject.unloadAsync();
    };
  }, []);
  sorted_shortest_path.forEach((element, index) => {
    element.index = index;
    element.checkpoint = element.latitude && element.longitude ? true : false;
  });

  const [current_index_of_swiper, set_current_index_of_swiper] = useState(0);

  const [current_start, setCurrentStart] = useState(null);
  const [current_end, setCurrentEnd] = useState(null);
  const [current_path, setCurrentPath] = useState([]);
  const [previous_swiper_index, setPreviousSwiperIndex] = useState(0);
  const [current_array_of_checkpoints, setCurrentArrayOfCheckpoints] = useState(
    []
  );
  const [
    current_difference_index_between_start_and_end,
    setCurrentDifferenceIndexBetweenStartAndEnd,
  ] = useState(0);
  const [current_index_of_checkpoints, setCurrentIndexOfCheckpoints] =
    useState(0);
  const [current_render_count, setCurrentRenderCount] = useState(0);
  const [
    current_distance_between_start_and_end,
    setCurrentDistanceBetweenStartAndEnd,
  ] = useState(0);
  const [current_multiple_of_percentage, setCurrentMultipleOfPercentage] =
    useState(1);
  const [
    previous_distance_between_current_and_end,
    setPreviousCurrentDistanceBetweenCurrentAndEnd,
  ] = useState(null);

  const handleSwipeLeft = () => {
    swiperRef.current.swipeLeft();
    set_current_index_of_swiper(current_index_of_swiper + 1);
  };

  const handleSwipeRight = () => {
    swiperRef.current.swipeRight();
    set_current_index_of_swiper(current_index_of_swiper - 1);
  };
  const handleSpeech = (word_to_speak) => {
    Speech.speak(word_to_speak, {
      language: "en-US",
      pitch: 1,
      rate: 0.7,
      onError: (e) =>
        alert(
          e.message +
            "\n" +
            "there was an issue with voice enabled speech, please make sure you have allowed the app to use dictation "
        ),
    });
  };
  useEffect(() => {
    if (current_render_count === 0) {
      let temp_counter_index = 0;
      let temp_array_of_checkpoints = [];
      let temp_current_start = null;
      for (let i = 0; i < sorted_shortest_path.length; i++) {
        if (i == 0) {
          setCurrentStart(sorted_shortest_path[i]);
          temp_current_start = sorted_shortest_path[i];
          temp_counter_index += 1;
        } else if (
          sorted_shortest_path[i].latitude &&
          sorted_shortest_path[i].longitude
        ) {
          temp_array_of_checkpoints.push(sorted_shortest_path[i]);
          temp_counter_index += 1;
        }
      }
      setCurrentEnd(temp_array_of_checkpoints[0]);
      setCurrentIndexOfCheckpoints(0);
      setCurrentRenderCount(1);

      const harvestine_geolocation_propery_of_current_start = {
        latitude: parseFloat(temp_current_start.latitude),
        longitude: parseFloat(temp_current_start.longitude),
      };
      const harvestine_geolocation_propery_of_current_end = {
        latitude: parseFloat(temp_array_of_checkpoints[0].latitude),
        longitude: parseFloat(temp_array_of_checkpoints[0].longitude),
      };
      let distance_between_start_and_end = haversineDistance(
        harvestine_geolocation_propery_of_current_start,
        harvestine_geolocation_propery_of_current_end
      );
      setCurrentDistanceBetweenStartAndEnd(distance_between_start_and_end);
      setCurrentArrayOfCheckpoints([...temp_array_of_checkpoints]);
      let temp_difference =
        parseInt(temp_array_of_checkpoints[0].index) -
        parseInt(temp_current_start.index);
      setCurrentDifferenceIndexBetweenStartAndEnd(temp_difference);
      // let temp_current_path = loop from the start to temp_array_of_checkpoints[0].index +1
      let temp_current_path = [];
      for (
        let i = parseInt(temp_current_start.index) + 1;
        i < parseInt(temp_array_of_checkpoints[0].index) + 1;
        i++
      ) {
        temp_current_path.push(sorted_shortest_path[i]);
      }
      setCurrentPath([...temp_current_path]);
    }
  }, []);
  // use useEffect to console log current start and current end
  useEffect(() => {
    if (current_start && current_end) {
      // debugger;
      console.log("current start", current_start);
      console.log("current end", current_end);
    }
  }, [current_start, current_end]);

  useEffect(() => {
    if (current_start && current_end) {
      if (current_index_of_swiper < sorted_shortest_path.length) {
        let card = sorted_shortest_path[current_index_of_swiper];

        if (
          accessibility.voice_enabled &&
          accessibility.voice_enabled == true
        ) {
          let text_to_speak = buildText(
            card,
            current_index_of_swiper,
            sorted_shortest_path,
            card.image && card.image != null && card.image != ""
              ? null
              : "noImage"
          );
          handleSpeech(text_to_speak);
        }
      }
      if (current_index_of_swiper >= sorted_shortest_path.length - 1) {
        setCurrentPath([]);
        setCurrentDifferenceIndexBetweenStartAndEnd(0);
        setCurrentDistanceBetweenStartAndEnd(0);
        return;
      }

      const isSwipedRight = current_index_of_swiper < previous_swiper_index;
      const isSwipedLeft = current_index_of_swiper > previous_swiper_index;

      if (isSwipedRight) {
        setCurrentDifferenceIndexBetweenStartAndEnd(
          current_difference_index_between_start_and_end + 1
        );
        setPreviousSwiperIndex(current_index_of_swiper);

        setCurrentPath((prevPath) => {
          const newPath = [
            sorted_shortest_path[current_index_of_swiper + 1],
            ...prevPath,
          ];
          return newPath;
        });
      } else if (isSwipedLeft) {
        setCurrentDifferenceIndexBetweenStartAndEnd(
          current_difference_index_between_start_and_end - 1
        );
        setPreviousSwiperIndex(current_index_of_swiper);

        setCurrentPath((prevPath) => {
          const newPath = prevPath.slice(1);
          return newPath;
        });
      }

      // debugger;
      if (current_index_of_swiper == current_end.index) {
        let new_start = current_end;
        let new_end =
          current_array_of_checkpoints[current_index_of_checkpoints + 1];

        const harvestine_geolocation_propery_of_current_start = {
          latitude: parseFloat(new_start.latitude),
          longitude: parseFloat(new_start.longitude),
        };
        const harvestine_geolocation_propery_of_current_end = {
          latitude: parseFloat(new_end.latitude),
          longitude: parseFloat(new_end.longitude),
        };
        let distance_between_start_and_end = haversineDistance(
          harvestine_geolocation_propery_of_current_start,
          harvestine_geolocation_propery_of_current_end
        );
        setCurrentIndexOfCheckpoints(current_index_of_checkpoints + 1);
        setCurrentStart(new_start);
        setCurrentEnd(new_end);
        // setCurrentMultipleOfPercentage(1);
        setCurrentDifferenceIndexBetweenStartAndEnd(
          parseInt(new_end.index) - parseInt(new_start.index)
        );

        let temp_current_path = [];
        for (
          let i = parseInt(new_start.index) + 1;
          i < parseInt(new_end.index) + 1;
          i++
        ) {
          temp_current_path.push(sorted_shortest_path[i]);
        }
        setCurrentPath([...temp_current_path]);
        setCurrentDistanceBetweenStartAndEnd(distance_between_start_and_end);
      }
    }
  }, [current_index_of_swiper]);

  return (
    <>
      {sorted_shortest_path.length > 0 ? (
        <>
          {/* <ButtonGroup
            onSwipeLeft={handleSwipeLeft}
            onSwipeRight={handleSwipeRight}
            disabled={current_index_of_swiper === 0}
          /> */}
          <View
            style={[
              tw`flex-col justify-center mt-0 py-2 rounded-lg `,
              {
                backgroundColor:
                  accessibility.selected_background_color.secondaryColor,
              },
            ]}
          >
            <View style={tw`mx-10`}>
              <Text
                style={[
                  tw`font-bold text-lg mb-1 text-center`,
                  accessibility.selected_font_color != "#d4b3b3"
                    ? {
                        color: accessibility.selected_font_color,
                      }
                    : tw`text-white`,
                ]}
              >
                Upcoming Paths
              </Text>
              <ScrollView style={tw`h-25`}>
                {current_path.map((item, index) => {
                  return (
                    <View
                      key={index}
                      style={[
                        tw`m-1 p-1 rounded-lg shadow-lg`,
                        item.checkpoint
                          ? tw`bg-green-300`
                          : {
                              backgroundColor:
                                accessibility.selected_background_color
                                  .darkerPrimaryColor,
                            },
                      ]}
                    >
                      <Text
                        style={[
                          tw`text-center`,
                          accessibility.selected_font_color != "#d4b3b3"
                            ? {
                                color: accessibility.selected_font_color,
                              }
                            : tw`text-black`,
                        ]}
                      >
                        {buildText(
                          item,
                          item.index,
                          sorted_shortest_path,
                          item.image && item.image != null && item.image != ""
                            ? null
                            : "noImage"
                        )}
                        {item.checkpoint && (
                          <>
                            {" "}
                            <Icon name="star" size={14} color="black" />
                          </>
                        )}
                      </Text>
                    </View>
                  );
                })}
              </ScrollView>
            </View>
            <View
              style={[
                tw`flex-col justify-center mt-1 p-2 mx-10 rounded-lg shadow-lg`,
                {
                  backgroundColor:
                    accessibility.selected_background_color.darkerPrimaryColor,
                },
              ]}
            >
              <Text
                style={[
                  tw`font-bold text-lg text-center mb-2`,
                  accessibility.selected_font_color != "#d4b3b3"
                    ? {
                        color: accessibility.selected_font_color,
                      }
                    : tw`text-black`,
                ]}
              >
                Information
              </Text>
              {current_start && current_end ? (
                <View style={tw`text-center flex-col items-center`}>
                  <Text
                    style={[
                      tw`text-center`,
                      accessibility.selected_font_color != "#d4b3b3"
                        ? {
                            color: accessibility.selected_font_color,
                          }
                        : tw`text-black`,
                    ]}
                  >
                    CURRENT START:{"\n"}
                    <Text style={tw`font-semibold `}>
                      {buildText(
                        current_start,
                        current_start.index,
                        sorted_shortest_path,
                        current_start.image &&
                          current_start.image != null &&
                          current_start.image != ""
                          ? null
                          : "noImage"
                      )}
                    </Text>
                  </Text>
                  <Text
                    style={[
                      tw`text-center`,
                      accessibility.selected_font_color != "#d4b3b3"
                        ? {
                            color: accessibility.selected_font_color,
                          }
                        : tw`text-black`,
                    ]}
                  >
                    CURRENT CHECKPOINT:{"\n"}
                    <Text style={tw`font-semibold `}>
                      {buildText(
                        current_end,
                        current_end.index,
                        sorted_shortest_path,
                        current_end.image &&
                          current_end.image != null &&
                          current_end.image != ""
                          ? null
                          : "noImage"
                      )}
                    </Text>
                  </Text>
                </View>
              ) : null}

              <Text
                style={[
                  tw`text-center`,
                  accessibility.selected_font_color != "#d4b3b3"
                    ? {
                        color: accessibility.selected_font_color,
                      }
                    : tw`text-black`,
                ]}
              >
                Distance of current start and current checkpoint:{"\n"}
                <Text style={tw`font-semibold text-center`}>
                  {current_distance_between_start_and_end.toFixed(2)} meters
                </Text>
              </Text>
            </View>
          </View>

          <View
            style={[
              tw`flex-row justify-center  m-0 h-32/40 w-20/20 content-center`,
              {
                backgroundColor:
                  accessibility.selected_background_color.primaryColor,
              },
            ]}
          >
            <Swiper
              style={[
                tw`m-0 `,
                {
                  backgroundColor:
                    accessibility.selected_background_color.primaryColor,
                },
              ]}
              cards={sorted_shortest_path}
              containerStyle={{
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                height: "100%", // Change this to the percentage you prefer
                width: "100%", // Change this to the percentage you prefer
                shadowColor: "#000",
                shadowOffset: {
                  width: 0,
                  height: 2,
                },
                shadowOpacity: 0.25,
                shadowRadius: 3.84,
                elevation: 5,
                backgroundColor:
                  accessibility.selected_background_color.primaryColor,
              }}
              cardVerticalMargin={0}
              cardStyle={{
                flexDirection: "column",
                height: "50%",
                marginBottom: 5,
                backgroundColor:
                  accessibility.selected_background_color.primaryColor,
              }}
              ref={swiperRef}
              renderCard={(card, index) => {
                return (
                  <CardComponent
                    card={card}
                    index={index}
                    sorted_shortest_path={sorted_shortest_path}
                  />
                );
              }}
              onSwipedRight={(cardIndex) => {
                set_current_index_of_swiper(cardIndex - 1);
              }}
              onSwipedLeft={(cardIndex) => {
                set_current_index_of_swiper(cardIndex + 1);
              }}
              onSwipedAll={() => {
                alert("Congratulations! You have reached your destination");
              }}
              cardIndex={0}
              stackSize={3}
              showSecondCard={false}
              goBackToPreviousCardOnSwipeRight={true}
              disableRightSwipe={current_index_of_swiper === 0 ? true : false}
            ></Swiper>
          </View>
        </>
      ) : null}
    </>
  );
}
