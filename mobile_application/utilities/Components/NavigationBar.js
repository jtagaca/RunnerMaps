import { View, Text } from "react-native";
import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import IndoorNavigationHomeScreen from "../../screens/Indoor_Navigation_Home_Screen";
import HomeScreen from "../../screens/Home_Screen";

import OutdoorNavigationScreen from "../../screens/Outdoor_Navigation";
import Icon from "react-native-vector-icons/FontAwesome";
const Tab = createBottomTabNavigator();
import tw from "../../tailwind/CustomTailwind";
export default function NavigationBar() {
  return (
    <Tab.Navigator
      initialRouteName="Home"
      screenOptions={{
        tabBarStyle: { backgroundColor: "#f7db69" },
        tabBarActiveTintColor: "#3B82F6",
        tabBarLabelStyle: { fontWeight: "bold" },
        headerTitleAlign: "center",
        headerStyle: { backgroundColor: "#f7db69" },
        headerTintColor: "#3B82F6",
        headerShown: false,
      }}
    >
      <Tab.Screen
        name="Indoor Navigation"
        component={IndoorNavigationHomeScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Icon name="street-view" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Icon name="home" color={color} size={size} />
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
    </Tab.Navigator>
  );
}
