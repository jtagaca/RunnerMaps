import React, { useRef, useState } from "react";
import { View } from "react-native";
import Swiper from "react-native-deck-swiper";
import cloneDeep from "lodash/cloneDeep";
import { useSelector } from "react-redux";
import tw from "../../../tailwind/CustomTailwind";
import CardComponent from "./CardComponent";
import ButtonGroup from "./ButtonGroup";

export default function CustomSwiper() {
  const shortest_path = useSelector(
    (state) => state.indoor_navigation_properties.shortest_path_directions
  );
  const swiperRef = useRef(null);

  const carousel_data = cloneDeep(shortest_path);

  const sorted_shortest_path = carousel_data.sort((a, b) => {
    return a.key - b.key;
  });

  const [current_index_of_swiper, set_current_index_of_swiper] = useState(0);

  const handleSwipeLeft = () => {
    swiperRef.current.swipeLeft();
    set_current_index_of_swiper(current_index_of_swiper - 1);
  };

  const handleSwipeRight = () => {
    swiperRef.current.swipeRight();
    set_current_index_of_swiper(current_index_of_swiper + 1);
  };

  return (
    <>
      {sorted_shortest_path.length > 0 ? (
        <View style={tw`bg-yellow-100 `}>
          <ButtonGroup
            onSwipeLeft={handleSwipeLeft}
            onSwipeRight={handleSwipeRight}
            disabled={current_index_of_swiper === 0}
          />
          <View
            style={tw`flex-row justify-center  mt-5 bg-blue-500 p-2 h-2/30`}
          ></View>
          <View
            style={tw`flex-row justify-center bg-yellow-100 m-0 h-21/20 w-20/20 content-center`}
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
        </View>
      ) : null}
    </>
  );
}
