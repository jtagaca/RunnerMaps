import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  Dimensions,
  Button,
  StyleSheet,
  Image,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import Swiper from "react-native-deck-swiper";
import cloneDeep from "lodash/cloneDeep";

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

  const [is_left_swipe_possible, set_is_left_swipe_possible] = useState(true);
  const [current_index_of_swiper, set_current_index_of_swiper] = useState(0);

  const width = Dimensions.get("window").width;

  return (
    // maybe percentage of how much slides are still there
    // as well as the current speed of the user and estimated time
    // a button to enable auto navigation by going to the next slide if the user is at checkpoint
    <View style={styles.container}>
      <Swiper
        cards={sorted_shortest_path}
        ref={swiperRef}
        renderCard={(card, index) => {
          return (
            <View style={styles.card}>
              <Text style={styles.text}>{card.locationName}</Text>
              {card.userDirection &&
              card.userDirection != null &&
              card.userDirection != "" ? (
                <>
                  <Text style={styles.text}>{card.userDirection}</Text>
                  {card.userDirection !== "enter" ? (
                    card.is_outside && card.is_outside !== false ? (
                      <Text style={styles.text}>
                        You are outside, follow the road path
                      </Text>
                    ) : (
                      <Text style={styles.text}>In the Hallway</Text>
                    )
                  ) : null}
                </>
              ) : null}
              {card.image && card.image != null && card.image != "" ? (
                <Image
                  source={{ uri: card.image }}
                  style={{
                    width: 300,
                    height: 500,
                    borderRadius: 10,
                    resizeMode: "cover",
                  }}
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
        backgroundColor={"#4FD0E9"}
        stackSize={3}
        showSecondCard={false}
        goBackToPreviousCardOnSwipeLeft={true}
        disableLeftSwipe={current_index_of_swiper === 0 ? true : false}
      >
        <Button
          onPress={() => {
            swiperRef.current.swipeRight();
          }}
          title="Swipe Right"
        ></Button>
        <Button
          onPress={() => {
            swiperRef.current.swipeLeft();
          }}
          title="Swipe Left"
          disabled={current_index_of_swiper === 0 ? true : false}
        />
      </Swiper>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5FCFF",
  },
  card: {
    flex: 1,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: "#E8E8E8",
    justifyContent: "center",
    backgroundColor: "white",
  },
  text: {
    textAlign: "center",
    fontSize: 20,
    backgroundColor: "transparent",
  },
  done: {
    textAlign: "center",
    fontSize: 10,
    color: "white",
    backgroundColor: "transparent",
  },
});
