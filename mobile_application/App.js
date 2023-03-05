import { StatusBar } from "expo-status-bar";
import { View, Button, Text } from "react-native";
import React, { useState, useEffect } from "react";

import { Provider } from "react-redux";
import store from "./redux_store/store";
import Test from "./test";
export default function App() {
  return (
    <Provider store={store}>
      {/* <Test /> */}
      <View>
        <Text>Open up App.js to start working on your app!</Text>
        <StatusBar style="auto" />
      </View>
    </Provider>
  );
}
