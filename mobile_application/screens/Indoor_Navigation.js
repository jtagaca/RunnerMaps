import {
  View,
  Text,
  Dimensions,
  Button,
  StyleSheet,
  Image,
} from "react-native";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Swiper from "react-native-deck-swiper";
import cloneDeep from "lodash/cloneDeep";

export default function Indoor_Navigation() {
  const dispatch = useDispatch();
  const shortest_path = useSelector(
    (state) => state.indoor_navigation_properties.shortest_path_directions
  );

  const carousel_data = cloneDeep(shortest_path);

  const sorted_shortest_path = carousel_data.sort((a, b) => {
    return a.key - b.key;
  });

  useEffect(() => {
    console.log("carousel_data" + carousel_data);
  }, [carousel_data]);
  // handle the back button by changing the state of the modal to false

  // each rerender see if the previous index is - 2 and you are at the start then the state of the
  // swipe left should be true
  // disableLeftSwipe	bool	disable left swipe	false

  const [is_left_swipe_possible, set_is_left_swipe_possible] =
    React.useState(true);
  const width = Dimensions.get("window").width;
  return (
    <View style={styles.container}>
      <Swiper
        cards={sorted_shortest_path}
        renderCard={(card, index) => {
          return (
            <View style={styles.card}>
              <Text style={styles.text}>{card.locationName}</Text>
              <Text style={styles.text}>{card.userDirection}</Text>
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
        goBackToPreviousCardOnSwipeLeft={true}
        onSwiped={(cardIndex) => {
          console.log("card index" + cardIndex);
        }}
        showSecondCard={false}
        onSwipedAll={() => {
          console.log("onSwipedAll");
        }}
        cardIndex={0}
        backgroundColor={"#4FD0E9"}
        stackSize={3}
      >
        <Button
          onPress={() => {
            console.log("oulala");
          }}
          title="Press me"
        >
          You can press me
        </Button>
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
