import "react-native-gesture-handler";

import { NavigationContainer } from "@react-navigation/native";
import { Provider } from "react-redux";
import store from "./redux_store/store";

import React from "react";
import { Provider as PaperProvider, Button } from "react-native-paper";
import { SafeAreaProvider } from "react-native-safe-area-context";
import NavigationBar from "./utilities/Components/NavigationBar";
import IndoorNavigation from "./screens/Indoor_Navigation";
import IndoorNavigationHomeScreen from "./screens/Indoor_Navigation_Home_Screen";

import { createStackNavigator } from "@react-navigation/stack";
const Stack = createStackNavigator();
import CustomHeader from "./utilities/Indoor_Navigation/Components/CustomBackButton";

export default function App() {
  return (
    <SafeAreaProvider>
      <PaperProvider>
        <Provider store={store}>
          <NavigationContainer>
            <Stack.Navigator>
              <Stack.Screen
                options={{ headerShown: false }}
                name="Nav Bar"
                component={NavigationBar}
              />
              <Stack.Screen
                name="Result"
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
