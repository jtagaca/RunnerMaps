import { NavigationContainer } from "@react-navigation/native";
import { Provider } from "react-redux";
import store from "./redux_store/store";

import React, { useState } from "react";
import { Provider as PaperProvider } from "react-native-paper";
// import Icon from "react-native-vector-icons/AntDesign";
import OutdoorNavigationScreen from "./screens/Outdoor_Navigation";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import IndoorNavigationScreen from "./screens/Indoor_Navigation";
const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <SafeAreaProvider>
      <PaperProvider>
        <Provider store={store}>
          <NavigationContainer>
            <Tab.Navigator>
              <Tab.Screen
                name="Indoor Navigation"
                component={IndoorNavigationScreen}
              />
              <Tab.Screen
                name="Outdoor Navigation"
                component={OutdoorNavigationScreen}
              />
            </Tab.Navigator>
          </NavigationContainer>
        </Provider>
      </PaperProvider>
    </SafeAreaProvider>
  );
}
