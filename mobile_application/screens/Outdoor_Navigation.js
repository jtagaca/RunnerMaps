import { StatusBar } from "expo-status-bar";
import { StyleSheet, View } from "react-native";
import React, { useState, useEffect } from "react";
import Maps from "../utilities/Outdoor_Navigation/Maps.js";
import { SafeAreaView } from "react-native-safe-area-context";

export default function OutdoorNavigation() {
  const [classroom, setClassroom] = useState("");

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={styles.container}>
        <Maps />
        <StatusBar style="auto" />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
  },
});
