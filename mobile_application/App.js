import { NavigationContainer } from "@react-navigation/native";
import { Provider } from "react-redux";
import store from "./redux_store/store";

import React, { useState } from "react";
import { Provider as PaperProvider } from "react-native-paper";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import IndoorNavigationHomeScreen from "./screens/Indoor_Navigation_Home_Screen";
import IndoorNavigation from "./screens/Indoor_Navigation";

import OutdoorNavigationScreen from "./screens/Outdoor_Navigation";
import Icon from "react-native-vector-icons/FontAwesome";
import TestScreen from "./test";
import { createStackNavigator } from "@react-navigation/stack";

const Stack = createStackNavigator();

const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <SafeAreaProvider>
      <PaperProvider>
        <Provider store={store}>
          <NavigationContainer>
            <Stack.Navigator>
              <Stack.Screen
                name="Indoor Navigation"
                component={IndoorNavigation}
              />
            </Stack.Navigator>

            <Tab.Navigator>
              <Tab.Screen
                name="Indoor Navigation Home"
                component={IndoorNavigationHomeScreen}
                options={{
                  tabBarIcon: ({ color, size }) => (
                    <Icon name="street-view" color={color} size={size} />
                  ),
                }}
              />
              <Tab.Screen
                name="Outdoor Navigation"
                component={OutdoorNavigationScreen}
                options={{
                  tabBarIcon: ({ color, size }) => (
                    <Icon name="compass" color={color} size={size} />
                  ),
                }}
              />
              {/* <Tab.Screen
                name="Test Screen Redux"
                component={TestScreen}
                options={{
                  tabBarIcon: ({ color, size }) => (
                    <Icon name="compass" color={color} size={size} />
                  ),
                }}
              /> */}
            </Tab.Navigator>
          </NavigationContainer>
        </Provider>
      </PaperProvider>
    </SafeAreaProvider>
  );
}
