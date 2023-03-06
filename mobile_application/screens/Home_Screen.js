import { View, Text } from "react-native";
import React from "react";
import WaveBottomBar from "rn-wave-bottom-bar";

const Tab = createBottomTabNavigator();

export default function Home_Screen() {
  return (
    <View>
      <Tab.Navigator
        screenOptions={{
          tabBarActiveTintColor: "#5F0B65",
          tabBarActiveBackgroundColor: "#5F0B65",
          tabBarInactiveBackgroundColor: "red",
        }}
        tabBar={(props) => (
          <BottomFabBar
            mode={"square" | "default"}
            isRtl={false}
            // Add Shadow for active tab bar button
            focusedButtonStyle={{
              shadowColor: "#000",
              shadowOffset: {
                width: 0,
                height: 7,
              },
              shadowOpacity: 0.41,
              shadowRadius: 9.11,
              elevation: 14,
            }}
            // - You can add the style below to show screen content under the tab-bar
            // - It will makes the "transparent tab bar" effect.
            bottomBarContainerStyle={{
              position: "absolute",
              bottom: 0,
              left: 0,
              right: 0,
            }}
            {...props}
          />
        )}
      >
        <Tab.Screen
          options={{
            tabBarIcon: tabBarIcon("aliwangwang-o1"),
          }}
          name="Home"
          component={generateScreen("Home")}
        />
      </Tab.Navigator>
    </View>
  );
}
