import { StatusBar } from "expo-status-bar";
import { StyleSheet } from "react-native";
import React, { useState } from "react";
import Maps from "../utilities/Outdoor_Navigation/Maps.js";
import { SafeAreaView } from "react-native-safe-area-context";
import tw from "../tailwind/CustomTailwind";
import { useSelector } from "react-redux";

export default function OutdoorNavigation() {
  const accessibility = useSelector((state) => state.accessibility);
  return (
    <SafeAreaView
      style={[
        {
          backgroundColor: accessibility.selected_background_color.primaryColor,
        },
        styles.container,
      ]}
    >
      <Maps />
      <StatusBar style="auto" />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});
