import "react-native-gesture-handler";

import { NavigationContainer } from "@react-navigation/native";
import { Provider } from "react-redux";
import store from "./redux_store/store";

import React, { useState, useEffect } from "react";
import { Provider as PaperProvider } from "react-native-paper";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import IndoorNavigationHomeScreen from "./screens/Indoor_Navigation_Home_Screen";
import HomeScreen from "./screens/Home_Screen";
import IndoorNavigation from "./screens/Indoor_Navigation";

import OutdoorNavigationScreen from "./screens/Outdoor_Navigation";
import Icon from "react-native-vector-icons/FontAwesome";
import TestScreen from "./test";

import { createStackNavigator } from "@react-navigation/stack";

const Stack = createStackNavigator();

export default function App() {
  const [location, setLocation] = useState(null);

  return (
    <SafeAreaProvider>
      <PaperProvider>
        <Provider store={store}>
          <NavigationContainer>
            <Stack.Navigator>
              <Stack.Screen name="Home" component={HomeScreen} />
              <Stack.Screen
                name="Indoor Navigation"
                component={IndoorNavigation}
              />
            </Stack.Navigator>
          </NavigationContainer>
        </Provider>
      </PaperProvider>
    </SafeAreaProvider>
  );
}
