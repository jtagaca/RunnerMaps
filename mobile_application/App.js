import "react-native-gesture-handler";

import { NavigationContainer } from "@react-navigation/native";
import { Provider } from "react-redux";
import store from "./redux_store/store";

import React, { useState, useEffect } from "react";
import { Provider as PaperProvider, Button } from "react-native-paper";
import { SafeAreaProvider } from "react-native-safe-area-context";
import HomeScreen from "./screens/Home_Screen";
import IndoorNavigation from "./screens/Indoor_Navigation";
import { useDispatch } from "react-redux";

import OutdoorNavigationScreen from "./screens/Outdoor_Navigation";
import TestScreen from "./test";
import { createStackNavigator } from "@react-navigation/stack";
import { deleteShortestPathDirections } from "./redux_store/reducers";
const Stack = createStackNavigator();
import CustomHeader from "./utilities/Indoor_Navigation/Components/Custom_BackButton";

export default function App() {
  const [location, setLocation] = useState(null);

  return (
    <SafeAreaProvider>
      <PaperProvider>
        <Provider store={store}>
          <NavigationContainer>
            <Stack.Navigator>
              <Stack.Screen
                options={{ headerShown: false }}
                name="Home"
                component={HomeScreen}
              />
              <Stack.Screen
                name="Indoor Navigation"
                component={IndoorNavigation}
                options={({ navigation }) => ({
                  headerLeft: () => <CustomHeader navigation={navigation} />,
                })}
              />
            </Stack.Navigator>
          </NavigationContainer>
        </Provider>
      </PaperProvider>
    </SafeAreaProvider>
  );
}
