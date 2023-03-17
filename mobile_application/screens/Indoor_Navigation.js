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

export default function Indoor_Navigation() {
  const dispatch = useDispatch();
  const shortest_path = useSelector(
    (state) => state.indoor_navigation_properties.shortest_path_directions
  );
  const swiperRef = useRef(null);

  const carousel_data = cloneDeep(shortest_path);

  const sorted_shortest_path = carousel_data.sort((a, b) => {
    return a.key - b.key;
  });
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
