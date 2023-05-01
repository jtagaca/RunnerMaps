import React from "react";
import { View } from "react-native";
import { Button } from "react-native-paper";
import tw from "../../../tailwind/CustomTailwind";

export default function ButtonGroup({ onSwipeLeft, onSwipeRight, disabled }) {
  return (
    <View
      style={tw`flex-row justify-center mx-3 justify-between mt-5 h-3/50 content-center items-center`}
    >
      <Button
        style={tw`rounded-lg bg-blue-500 text-center p-1`}
        onPress={onSwipeLeft}
        uppercase={true}
        textColor="white"
        disabled={disabled}
      >
        Swipe Left
      </Button>
      <Button
        style={tw`rounded-lg bg-blue-500 text-center p-1 `}
        onPress={onSwipeRight}
        uppercase={true}
        textColor="white"
        title="Swipe Right"
      >
        Swipe Right
      </Button>
    </View>
  );
}
