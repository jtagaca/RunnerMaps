import { View, Text } from "react-native";
import React from "react";
import tw from "../tailwind/CustomTailwind";
export default function IndoorNavigation() {
  const custom_style = tw`text-center text-white border-solid border-2 border-sky-500 text-black  `;
  return (
    <View>
      <Text style={custom_style}>indoor_navigation</Text>
    </View>
  );
}
