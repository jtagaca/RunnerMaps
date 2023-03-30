import React from "react";
import CustomSwiper from "../utilities/Indoor_Navigation/Components/CustomSwiper";
import tw from "../tailwind/CustomTailwind";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Indoor_Navigation({ navigation }) {
  return (
    <SafeAreaView style={tw`bg-yellow-100`} edges={[]}>
      <CustomSwiper />
    </SafeAreaView>
  );
}
