import { StatusBar } from "expo-status-bar";
import { StyleSheet } from "react-native";
import React, { useState } from "react";
import Maps from "../utilities/Outdoor_Navigation/Maps.js";
import { SafeAreaView } from "react-native-safe-area-context";
import tw from "../tailwind/CustomTailwind";

export default function OutdoorNavigation() {
  return (
    <SafeAreaView style={(tw `bg-yellow-100`, styles.container)}>
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

