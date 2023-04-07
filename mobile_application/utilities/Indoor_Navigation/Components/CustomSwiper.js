import React, { useRef, useState, useEffect } from "react";
import { View, Text, ScrollView, Platform } from "react-native";
import Swiper from "react-native-deck-swiper";
import cloneDeep from "lodash/cloneDeep";
import { useSelector } from "react-redux";
import tw from "../../../tailwind/CustomTailwind";
import CardComponent from "./CardComponent";
import Icon from "react-native-vector-icons/FontAwesome";
import { Audio } from "expo-av";
const soundObject = new Audio.Sound();

import ButtonGroup from "./ButtonGroup";
import { buildText } from "../Library/FormatText";

import * as Speech from "expo-speech";
export default function CustomSwiper() {
  useEffect(() => {
    const enableSound = async () => {
      if (Platform.OS === "ios") {
        await Audio.setAudioModeAsync({
          playsInSilentModeIOS: true,
        });
        await soundObject.loadAsync(require("../Extra/soundFile.mp3"));
        await soundObject.playAsync();
      }
    };
    enableSound();
  });

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
    set_current_index_of_swiper(current_index_of_swiper - 1);
  };

  const handleSwipeRight = () => {
    swiperRef.current.swipeRight();
    set_current_index_of_swiper(current_index_of_swiper + 1);
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

      const isSwipedRight = current_index_of_swiper > previous_swiper_index;
      const isSwipedLeft = current_index_of_swiper < previous_swiper_index;

      if (isSwipedRight) {
        setCurrentDifferenceIndexBetweenStartAndEnd(
          current_difference_index_between_start_and_end - 1
        );
        setPreviousSwiperIndex(current_index_of_swiper);

        setCurrentPath((prevPath) => {
          const newPath = prevPath.slice(1);
          return newPath;
        });
      } else if (isSwipedLeft) {
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
            style={tw`flex-col justify-center  bg-blue-500 py-2 rounded-lg `}
          >
            <View style={tw`mx-10`}>
              <Text style={tw`text-white font-bold text-lg mb-1 text-center`}>
                Upcoming Paths
              </Text>
              <ScrollView style={tw`h-25`}>
                {current_path.map((item, index) => {
                  return (
                    <View
                      key={index}
                      style={[
                        tw`m-1 p-1 rounded-lg shadow-lg`,
                        item.checkpoint ? tw`bg-green-300` : tw`bg-yellow-300`,
                      ]}
                    >
                      <Text style={tw`text-black text-center`}>
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
              style={tw`flex-col justify-center mt-1 bg-yellow-300 p-2 mx-10 rounded-lg shadow-lg`}
            >
              <Text style={tw`text-black font-bold text-lg text-center mb-2`}>
                Information
              </Text>
              <Text style={tw`text-center`}>
                Cards left til next checkpoint(checkpoints included):{"\n"}
                <Text style={tw`font-semibold text-center`}>
                  {current_difference_index_between_start_and_end}
                </Text>
              </Text>
              <Text style={tw`text-center`}>
                Distance of start checkpoint and next checkpoint:{"\n"}
                <Text style={tw`font-semibold text-center`}>
                  {current_distance_between_start_and_end.toFixed(2)} meters
                </Text>
              </Text>
            </View>
          </View>

          <View
            style={tw`flex-row justify-center bg-yellow-100 m-0 h-18/20 w-20/20 content-center`}
          >
            <Swiper
              style={tw`bg-yellow-100 m-0 `}
              cards={sorted_shortest_path}
              containerStyle={tw`bg-yellow-100 flex-col justify-center items-center h-20/20 w-20/20 shadow-2xl`}
              cardVerticalMargin={0}
              cardStyle={tw`bg-yellow-100 flex-col  h-10/20 mb-5 `}
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
        </>
      ) : null}
    </>
  );
}
