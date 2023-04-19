import React from "react";
import CustomSwiper from "../utilities/Indoor_Navigation/Components/CustomSwiper";
import tw from "../tailwind/CustomTailwind";
import { SafeAreaView } from "react-native-safe-area-context";

import { useSelector } from "react-redux";

export default function Indoor_Navigation({ navigation }) {
  const accessibility = useSelector((state) => state.accessibility);

  return (
    <SafeAreaView
      style={{
        backgroundColor: accessibility.selected_background_color.primaryColor,
      }}
      edges={[]}
    >
      <CustomSwiper />
    </SafeAreaView>
  );
}
