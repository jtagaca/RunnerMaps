import { StatusBar } from "expo-status-bar";
import { View, Button, Text } from "react-native";
import React, { useState, useEffect } from "react";

import { Provider } from "react-redux";
import store from "./redux_store/store";
import Test from "./test";
import tw from "twrnc";
export default function App() {
  return (
    <Provider store={store}>
      {/* <Test /> */}
      <View style={tw`bg-blue-100`}>
        <Text style={tw.style("text-xl", "text-red-500")}>Hello</Text>
      </View>
    </Provider>
  );
}
