import { View, Text } from "react-native";
import React, { useEffect, useState } from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import IndoorNavigationHomeScreen from "../../screens/Indoor_Navigation_Home_Screen";
import HomeScreen from "../../screens/Home_Screen";
import SettingScreen from "../../screens/SettingScreen";

import OutdoorNavigationScreen from "../../screens/Outdoor_Navigation";
import Icon from "react-native-vector-icons/FontAwesome";
const Tab = createBottomTabNavigator();
import tw from "../../tailwind/CustomTailwind";
import LoadingScreen from "../Components/LoadingScreen.js";

export default function NavigationBar() {
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 3000);
  });
  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <Tab.Navigator
      initialRouteName="Home"
      screenOptions={{
        tabBarStyle: { backgroundColor: "#f7db69" },
        tabBarActiveTintColor: "#003594",
        tabBarLabelStyle: { fontWeight: "bold" },
        headerTitleAlign: "center",
        headerStyle: { backgroundColor: "#f7db69" },
        headerTintColor: "#003594",
        headerShown: false,
      }}
    >
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
        name="Indoor Navigation"
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
      <Tab.Screen
        name="Settings"
        component={SettingScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Icon name="gear" color={color} size={size} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}
