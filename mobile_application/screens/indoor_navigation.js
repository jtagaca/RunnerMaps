import { View, Text } from "react-native";
import React from "react";
import tw from "../tailwind/CustomTailwind";
export default function IndoorNavigation() {
  const custom_style = tw`text-center text-white border-b-neutral-400 bg-google-`;
  return (
    <View>
      <Text style={custom_style}>indoor_navigation</Text>
    </View>
  );
}
