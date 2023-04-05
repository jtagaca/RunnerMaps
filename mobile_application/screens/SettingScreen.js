import { View, SafeAreaView } from "react-native";
import React, { useState } from "react";
import { Text, Switch } from "react-native-paper";
import tw from "../tailwind/CustomTailwind";

import * as Speech from "expo-speech";
export default function SettingScreen() {
  const [
    indoor_navigation_result_voice_enabled,
    setIndoorNavigationResultVoiceEnabled,
  ] = useState(false);

  const toggleSwitch = () => {
    setIndoorNavigationResultVoiceEnabled(
      !indoor_navigation_result_voice_enabled
    );
  };

  return (
    <SafeAreaView style={tw`flex-1 bg-yellow-100`}>
      <View style={tw`flex-1  justify-center items-center`}>
        <View
          style={tw`flex-col justify-center items-center bg-blue-500 p-2 rounded-lg`}
        >
          <View style={tw`my-3`}>
            <Text style={tw`text-center text-white text-lg`}>
              Enable Indoor Navigation Result Voice
            </Text>
          </View>
          <View style={tw`justify-center bg-yellow-300 rounded-lg p-1`}>
            <Switch
              value={indoor_navigation_result_voice_enabled}
              onValueChange={toggleSwitch}
              color="#3B82F6"
            />
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}
