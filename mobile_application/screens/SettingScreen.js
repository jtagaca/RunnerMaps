import { View, SafeAreaView, Modal, TouchableOpacity } from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";

import React, { useState, useEffect } from "react";
import { Text, Switch, Button, DropDown } from "react-native-paper";
import tw from "../tailwind/CustomTailwind";
import { useSelector, useDispatch } from "react-redux";
import { accessibility_actions } from "../redux_store/reducers";
import { TriangleColorPicker, fromHsv } from "react-native-color-picker";

import Slider from "@react-native-community/slider";

export default function SettingScreen() {
  const [
    indoor_navigation_result_voice_enabled,
    setIndoorNavigationResultVoiceEnabled,
  ] = useState(false);
  const [modalVisibleBackgroundColor, setmodalVisibleBackgroundColor] =
    useState(false);
  const [background_color, setbackgroundColor] = useState("default");
  const [font_color, setfontColor] = useState("default");

  const [modalVisibleFontColor, setmodalVisibleFontColor] = useState(false);
  const dispatch = useDispatch();

  const accessibility = useSelector((state) => state.accessibility);
  useEffect(() => {
    if (accessibility.voice_enabled && accessibility.voice_enabled == true) {
      setIndoorNavigationResultVoiceEnabled(true);
    }
  }, [accessibility]);

  const toggleSwitch = () => {
    dispatch(
      accessibility_actions.setVoiceEnabled(
        !indoor_navigation_result_voice_enabled
      )
    );
    setIndoorNavigationResultVoiceEnabled(
      !indoor_navigation_result_voice_enabled
    );
  };

  const changeModalVisibleBackgroundColor = () => {
    setmodalVisibleBackgroundColor(!modalVisibleBackgroundColor);
  };
  const changeModalVisibleFontColor = () => {
    setmodalVisibleFontColor(!modalVisibleFontColor);
  };

  const onCloseVisibleBackgroundColor = () => {
    setmodalVisibleBackgroundColor(false);
    dispatch(
      accessibility_actions.setSelectedBackgroundColor(background_color)
    );
  };

  const onCloseVisibleFontColor = () => {
    setmodalVisibleFontColor(false);
    dispatch(accessibility_actions.setSelectedFontColor(font_color));
  };

  const available_font_size = [
    { label: "10", value: 10 },
    { label: "12", value: 12 },
    { label: "14", value: 14 },
    { label: "16", value: 16 },
    { label: "18", value: 18 },
    { label: "20", value: 20 },
    { label: "22", value: 22 },
    { label: "24", value: 24 },
    { label: "26", value: 26 },
    { label: "28", value: 28 },
    { label: "30", value: 30 },
    { label: "32", value: 32 },
    { label: "34", value: 34 },
    { label: "36", value: 36 },
  ];
  return (
    <SafeAreaView style={tw`flex-1 bg-yellow-100`}>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisibleBackgroundColor}
        onRequestClose={() => {
          Alert.alert("Modal has been closed.");
          setmodalVisibleBackgroundColor(!modalVisibleBackgroundColor);
        }}
      >
        <View style={tw`flex-col content-center justify-center flex-1`}>
          <View
            style={tw`m-[20px] bg-white rounded-2xl p-3 items-center h-1/2 shadow-md flex-col `}
          >
            <TouchableOpacity
              onPress={onCloseVisibleBackgroundColor}
              style={tw`absolute top-5 right-5`}
            >
              <Icon name="times" size={24} color="black" />
            </TouchableOpacity>
            <Text style={tw`text-xl`}>Background Color</Text>
            <TriangleColorPicker
              hideSliders={true}
              color={background_color}
              style={{ flex: 1, width: "100%" }}
              onColorChange={(color) => {
                setbackgroundColor(fromHsv(color));
              }}
              sliderComponent={Slider}
              hideControls={true}
            />
          </View>
        </View>
      </Modal>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisibleFontColor}
        onRequestClose={() => {
          Alert.alert("Modal has been closed.");
          setmodalVisibleBackgroundColor(!modalVisibleBackgroundColor);
        }}
      >
        <View style={tw`flex-col content-center justify-center flex-1`}>
          <View
            style={tw`m-[20px] bg-white rounded-2xl p-3 items-center h-1/2 shadow-md flex-col `}
          >
            <TouchableOpacity
              onPress={onCloseVisibleFontColor}
              style={tw`absolute top-5 right-5`}
            >
              <Icon name="times" size={24} color="black" />
            </TouchableOpacity>
            <Text style={tw`text-xl`}>Font Color</Text>
            <TriangleColorPicker
              color={font_color}
              hideSliders={true}
              style={{ flex: 1, width: "100%" }}
              onColorChange={(color) => {
                setfontColor(fromHsv(color));
              }}
              sliderComponent={Slider}
              hideControls={true}
            />
          </View>
        </View>
      </Modal>
      <View style={tw`items-center justify-center flex-1`}>
        <View
          style={tw`flex-col items-center justify-center p-2 bg-blue-500 rounded-lg`}
        >
          <View style={tw`items-center justify-center my-3`}>
            <View style={tw`my-3`}>
              <Text style={tw`text-lg text-center text-white`}>
                Enable Indoor Navigation Result Voice
              </Text>
            </View>
            <View style={tw`justify-center p-1 bg-yellow-300 rounded-lg`}>
              <Switch
                value={indoor_navigation_result_voice_enabled}
                onValueChange={toggleSwitch}
                color="#003594"
              />
            </View>
          </View>
          <View style={tw`items-center justify-center my-3`}>
            <Button
              style={tw`justify-center p-1 bg-yellow-300 rounded-lg`}
              onPress={changeModalVisibleBackgroundColor}
            >
              Change Background Color
            </Button>
          </View>
          <View style={tw`items-center justify-center my-3`}>
            <Button
              onPress={changeModalVisibleFontColor}
              style={tw`justify-center p-1 bg-yellow-300 rounded-lg`}
            >
              Change Text Color
            </Button>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}
