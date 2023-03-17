import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  Dimensions,
  StyleSheet,
  Image,
  TouchableOpacity,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import Swiper from "react-native-deck-swiper";
import cloneDeep from "lodash/cloneDeep";
import { Switch } from "react-native-switch";
import * as Location from "expo-location";
import tw from "../tailwind/CustomTailwind";
import { Button } from "react-native-paper";
const haversineDistance = require("geodetic-haversine-distance");

export default function Indoor_Navigation() {
  const dispatch = useDispatch();
  const shortest_path = useSelector(
    (state) => state.indoor_navigation_properties.shortest_path_directions
  );
  const swiperRef = useRef(null);
  const [current_start, setCurrentStart] = useState(null);
  const [current_end, setCurrentEnd] = useState(null);
  const [current_distance_between_end, setCurrentDistanceBetweenEnd] =
    useState(0);
  const [current_percentage_of_distance, setCurrentPercentageOfDistance] =
    useState(0);
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

  const carousel_data = cloneDeep(shortest_path);
  let sorted_shortest_path = carousel_data.sort((a, b) => {
    return a.key - b.key;
  });
  sorted_shortest_path.forEach((element, index) => {
    element["index"] = index;
  });
  useEffect(() => {
    if (current_render_count === 0) {
      let temp_array_of_checkpoints = [];
      let temp_current_start = null;
      for (let i = 0; i < sorted_shortest_path.length; i++) {
        if (i == 0) {
          setCurrentStart(sorted_shortest_path[i]);
          temp_current_start = sorted_shortest_path[i];
        } else if (
          sorted_shortest_path[i].latitude &&
          sorted_shortest_path[i].longitude
        ) {
          temp_array_of_checkpoints.push(sorted_shortest_path[i]);
        }
      }
      setCurrentEnd(temp_array_of_checkpoints[0]);
      setCurrentIndexOfCheckpoints(0);
      setCurrentRenderCount(1);
      setCurrentArrayOfCheckpoints([...temp_array_of_checkpoints]);
      setCurrentDifferenceIndexBetweenStartAndEnd(
        parseInt(temp_array_of_checkpoints[0].index) -
          parseInt(temp_current_start.index)
      );
    }
  }, []);

  useEffect(() => {
    if (sorted_shortest_path) {
      console.log("sorted_shortest_path", sorted_shortest_path);
    }
    if (current_start) {
      console.log("current_start", current_start);
    }
    if (current_end) {
      console.log("current_end", current_end);
    }
    if (current_array_of_checkpoints.length > 0) {
      console.log("current_array_of_checkpoints", current_array_of_checkpoints);
    }
    if (current_index_of_checkpoints) {
      debugger;
      console.log("current_index_of_checkpoints", current_index_of_checkpoints);
    }
  }, [
    sorted_shortest_path,
    current_start,
    current_end,
    current_array_of_checkpoints,
    current_index_of_checkpoints,
  ]);

  const [geolocationProperties, setGeolocationProperties] = useState(null);
  const [current_array_of_pathing, setCurrentArrayOfPathing] = useState([]);
  useEffect(() => {
    // this needs to have a checker do not use run this useState if the user is not in this page
    // needs redux
    const updateLocation = async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setErrorMsg("Permission to access location was denied");
        return;
      }

      let location = await Location.getCurrentPositionAsync({
        enableHighAccuracy: true,
        accuracy: Location.Accuracy.Highest,
      });
      setGeolocationProperties(location.coords);
      if (current_start && current_end) {
        const harvestine_geolocation_propery_of_current_start = {
          latitude: parseFloat(current_start.latitude),
          longitude: parseFloat(current_start.longitude),
        };
        const harvestine_geolocation_propery_of_current_end = {
          latitude: parseFloat(current_end.latitude),
          longitude: parseFloat(current_end.longitude),
        };
        let distance_between_start_and_end = haversineDistance(
          harvestine_geolocation_propery_of_current_start,
          harvestine_geolocation_propery_of_current_end
        );
        let percentage_multiple =
          (distance_between_start_and_end /
            current_difference_index_between_start_and_end /
            distance_between_start_and_end) *
          100 *
          current_multiple_of_percentage;

        let current_distance_between_current_location_and_end =
          haversineDistance(
            {
              latitude: location.coords.latitude,
              longitude: location.coords.longitude,
            },
            harvestine_geolocation_propery_of_current_end
          );
        let current_percentage_traveled =
          (Math.round(
            distance_between_start_and_end -
              current_distance_between_current_location_and_end
          ) /
            Math.round(distance_between_start_and_end)) *
          100;

        // if the percentage is 95% or above then move the current index to +1
        // and then set the current start to the current end and the current end to the next checkpoint
      }
    };

    updateLocation();
    const interval_id = setInterval(updateLocation, 5000);
    return () => clearInterval(interval_id);
  }, []);
  const [is_left_swipe_possible, set_is_left_swipe_possible] = useState(true);
  const [current_index_of_swiper, set_current_index_of_swiper] = useState(0);

  const width = Dimensions.get("window").width;

  return (
    // maybe percentage of how much slides are still there
    // as well as the current speed of the user and estimated time
    // a button to enable auto navigation by going to the next slide if the user is at checkpoint
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
      <View style={tw`flex-row justify-center  mt-5 bg-blue-500 p-2 h-2/30`}>
        <Text style={tw`rounded-lg bg-blue-500 p-2 text-white`}>
          Auto Navigation
        </Text>
        <View style={tw`justify-center bg-yellow-100 rounded-lg p-1`}>
          <Switch
            value={true}
            onValueChange={(val) => console.log(val)}
            disabled={false}
            activeText={"On"}
            inActiveText={"Off"}
            circleSize={30}
            barHeight={4}
            circleBorderWidth={3}
            backgroundActive={"black"}
            backgroundInactive={"gray"}
            circleActiveColor={"white"}
            circleInActiveColor={"grey"}
            // renderInsideCircle={() => (
            //   <View>
            //     <Text>Auto Navigation</Text>
            //   </View>
            // )} // custom component to render inside the Switch circle (Text, Image, etc.)
            changeValueImmediately={true} // if rendering inside circle, change state immediately or wait for animation to complete
            innerCircleStyle={{
              alignItems: "center",
              justifyContent: "center",
            }} // style for inner animated circle for what you (may) be rendering inside the circle
            outerCircleStyle={{}} // style for outer animated circle
            renderActiveText={false}
            renderInActiveText={false}
            switchLeftPx={2} // denominator for logic when sliding to TRUE position. Higher number = more space from RIGHT of the circle to END of the slider
            switchRightPx={2} // denominator for logic when sliding to FALSE position. Higher number = more space from LEFT of the circle to BEGINNING of the slider
            switchWidthMultiplier={2} // multiplied by the `circleSize` prop to calculate total width of the Switch
            switchBorderRadius={30} // Sets the border Radius of the switch slider. If unset, it remains the circleSize.
          />
        </View>
      </View>
      <View style={tw`bg-red-100 p-1 h-1/20`}></View>
      <View
        style={tw`flex-row justify-center bg-orange-200 m-0 h-20/20 w-20/20 content-center`}
      >
        <Swiper
          style={tw`bg-yellow-100 m-0`}
          cards={sorted_shortest_path}
          containerStyle={tw`bg-red-100 flex-col justify-center items-center h-20/20 w-20/20 `}
          cardVerticalMargin={0}
          cardStyle={tw`bg-green-100 flex-col  h-10/20 mb-5`}
          ref={swiperRef}
          renderCard={(card, index) => {
            return (
              <View style={tw`bg-green-100 flex-col  h-15/20`}>
                <Text>{card.locationName}</Text>
                {card.userDirection &&
                card.userDirection != null &&
                card.userDirection != "" ? (
                  <>
                    <Text>{card.userDirection}</Text>
                    {card.userDirection !== "enter" ? (
                      card.is_outside && card.is_outside !== false ? (
                        <Text>You are outside, follow the road path</Text>
                      ) : (
                        <Text>In the Hallway</Text>
                      )
                    ) : null}
                  </>
                ) : null}
                {card.image && card.image != null && card.image != "" ? (
                  <Image
                    source={{ uri: card.image }}
                    style={{ width: "100%", height: "100%" }} // Change the height to "100%"
                    resizeMode="contain" // Add resizeMode to maintain aspect ratio
                  />
                ) : null}
              </View>
            );
          }}
          // onSwiped={(prevIndex, nextIndex) => {
          //   handleSwiped(prevIndex, nextIndex);
          // }}
          onSwipedRight={(cardIndex) => {
            set_current_index_of_swiper(cardIndex + 1);
          }}
          onSwipedLeft={(cardIndex) => {
            set_current_index_of_swiper(cardIndex - 1);
          }}
          onSwiped={(cardIndex) => {
            console.log("onSwiped" + cardIndex);
          }}
          onSwipedAll={() => {
            alert("Congratulations! You have reached your destination");
          }}
          cardIndex={0}
          // backgroundColor={}
          stackSize={3}
          showSecondCard={false}
          goBackToPreviousCardOnSwipeLeft={true}
          disableLeftSwipe={current_index_of_swiper === 0 ? true : false}
        ></Swiper>
      </View>
    </View>
  );
}
