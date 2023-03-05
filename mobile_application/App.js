import React from "react";
import { Provider } from "react-redux";
import store from "./redux_store/store";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import OutdoorNavigationScreen from "./screens/outdoor_navigation";
import IndoorNavigationScreen from "./screens/indoor_navigation";

export default function App() {
  const Stack = createNativeStackNavigator();
  return (
    <Provider store={store}>
      <NavigationContainer>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name="Home" component={IndoorNavigationScreen} />
          <Stack.Screen
            name="Outdoor_Navigation"
            component={OutdoorNavigationScreen}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </Provider>
  );
}
