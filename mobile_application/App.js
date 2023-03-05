import { StatusBar } from "expo-status-bar";
import { StyleSheet, View, Button, Text } from "react-native";
import React, { useState, useEffect } from "react";

import { Provider } from "react-redux";
import store from "./redux_store/store";
import Test from "./test";
export default function App() {
  return (
    <Provider store={store}>
      <Test />
    </Provider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
  },
  text: {
    fontSize: 20,
    marginBottom: 20,
  },
});
