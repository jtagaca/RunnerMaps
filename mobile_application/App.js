import { StatusBar } from "expo-status-bar";
import { StyleSheet, View } from "react-native";
import React, { useState, useEffect } from "react";
import Maps from './Maps.js';

export default function App () {
  const [classroom, setClassroom] = useState("");

  return (
    <View style={styles.container}>
      <Maps />
      <StatusBar style="auto" />
    </View>
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
