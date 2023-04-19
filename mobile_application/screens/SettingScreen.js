import {
  View,
  SafeAreaView,
  Modal,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";

import React, { useState, useEffect } from "react";
import { Text, Switch, Button } from "react-native-paper";
import DropDownPicker from "react-native-dropdown-picker";
import tw from "../tailwind/CustomTailwind";
import { useSelector, useDispatch } from "react-redux";
import { accessibility_actions } from "../redux_store/reducers";
import { TriangleColorPicker, fromHsv } from "react-native-color-picker";
import { Dropdown } from "react-native-element-dropdown";
import Slider from "@react-native-community/slider";
import { makeHexColorDarker } from "../utilities/Indoor_Navigation/Library/Screen_Functions";
export default function SettingScreen() {
  const [
    indoor_navigation_result_voice_enabled,
    setIndoorNavigationResultVoiceEnabled,
  ] = useState(false);
  const [modalVisibleBackgroundColor, setmodalVisibleBackgroundColor] =
    useState(false);
  const [modalVisibleFontColor, setmodalVisibleFontColor] = useState(false);
  const [modalVisibleFontSize, setmodalVisibleFontSize] = useState(false);
  const [font_size, setFontSize] = useState("default");

  const accessibility = useSelector((state) => state.accessibility);
  const [background_color, setbackgroundColor] = useState({
    primaryColor: accessibility.selected_background_color.primaryColor,
    secondaryColor: accessibility.selected_background_color.secondaryColor,
    darkerPrimaryColor:
      accessibility.selected_background_color.darkerPrimaryColor,
  });
  const [font_color, setfontColor] = useState("default");
  const dispatch = useDispatch();
  const available_font_sizes = [
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
  const changeModalVisibleFontSize = () => {
    setmodalVisibleFontSize(!modalVisibleFontSize);
  };
  const handleSelectedFontSize = (selected_font_size) => {
    setFontSize(selected_font_size);
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
  const onCloseVisibleFontSize = () => {
    setmodalVisibleFontSize(false);
    dispatch(accessibility_actions.setSelectedFontSize(font_size.value));
  };

  const handleResetSettings = () => {
    dispatch(accessibility_actions.resetSettings());
    setIndoorNavigationResultVoiceEnabled(false);
    setFontSize("default");
    setbackgroundColor({
      primaryColor: "#fefce8",
      secondaryColor: "#003594",
      darkerPrimaryColor: "#fde047",
    });
    setfontColor("default");
  };

  const renderItem = (item) => {
    return (
      <View style={styles.item}>
        <Text style={styles.textItem}>{item.label}</Text>
      </View>
    );
  };
  return (
    <SafeAreaView
      style={[
        tw`flex-1`,
        {
          backgroundColor: accessibility.selected_background_color.primaryColor,
        },
      ]}
    >
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisibleBackgroundColor}
        onRequestClose={changeModalVisibleBackgroundColor}
      >
        <View style={tw`flex-col content-center justify-center flex-1`}>
          <View
            style={[
              tw`m-[20px] bg-white rounded-2xl p-3 items-center shadow-md flex-col`,
              { minHeight: 600 },
            ]}
          >
            <TouchableOpacity
              onPress={onCloseVisibleBackgroundColor}
              style={tw`absolute top-5 right-5`}
            >
              <Icon name="times" size={24} color="black" />
            </TouchableOpacity>
            <Text style={tw`text-xl`}>Background Color</Text>
            <Text style={tw`text-xl`}>Primary Color: default yellow</Text>
            <TriangleColorPicker
              hideSliders={true}
              color={background_color.primaryColor}
              style={{ flex: 1, width: "100%" }}
              onColorChange={(color) => {
                setbackgroundColor({
                  primaryColor: fromHsv(color),
                  secondaryColor: background_color.secondaryColor,
                  darkerPrimaryColor: makeHexColorDarker(fromHsv(color))
                    .darker_hex_color,
                });
              }}
              sliderComponent={Slider}
              hideControls={true}
            />
            <Text style={tw`text-xl`}>Secondary Color: default navy</Text>

            <TriangleColorPicker
              hideSliders={true}
              color={background_color.secondaryColor}
              style={{ flex: 1, width: "100%" }}
              onColorChange={(color) => {
                setbackgroundColor({
                  primaryColor: background_color.primaryColor,
                  secondaryColor: fromHsv(color),
                  darkerPrimaryColor: background_color.darkerPrimaryColor,
                });
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
        onRequestClose={changeModalVisibleFontColor}
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
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisibleFontColor}
        onRequestClose={() => {
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

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisibleFontSize}
        onRequestClose={() => {
          setmodalVisibleBackgroundColor(!modalVisibleBackgroundColor);
        }}
      >
        <View style={tw`flex-col content-center justify-center flex-1`}>
          <View
            style={tw`m-[20px] bg-white rounded-2xl p-3 items-center h-1/2 shadow-md flex-col `}
          >
            <TouchableOpacity
              onPress={onCloseVisibleFontSize}
              style={tw`absolute top-5 right-5`}
            >
              <Icon name="times" size={24} color="black" />
            </TouchableOpacity>
            <Text style={tw`text-xl`}>Font Size</Text>
            <View style={tw`my-10`}>
              <Text
                style={[
                  font_size === "default"
                    ? tw`text-lg`
                    : { fontSize: parseInt(font_size.value, 10) },
                ]}
              >
                "Example of font"
              </Text>
            </View>
            <View
              style={[
                tw` bg-red-500 w-48 justify-center items-center mt-[50px]`,
                {
                  backgroundColor:
                    accessibility.selected_background_color.secondaryColor,
                },
              ]}
            >
              <Dropdown
                dropdownPosition="auto"
                showsVerticalScrollIndicator={true}
                style={(styles.dropdown, tw`w-8/10 my-4 mr-0 h-2/30 `)}
                placeholderStyle={tw`text-white`}
                placeholder="Select Font Size"
                data={available_font_sizes}
                search={false}
                searchField="label"
                iconColor="white"
                autoScroll={false}
                selectedTextStyle={tw`text-white`}
                maxHeight={300}
                labelField="label"
                valueField="value"
                onChange={(item) => handleSelectedFontSize(item)}
                value={font_size}
                renderItem={renderItem}
              />
            </View>
          </View>
        </View>
      </Modal>
      <View style={tw`items-center justify-center flex-1`}>
        <View
          style={[
            tw`flex-col items-center justify-center p-2 rounded-lg`,
            {
              backgroundColor:
                accessibility.selected_background_color.secondaryColor,
            },
          ]}
        >
          <View style={tw`items-center justify-center my-3`}>
            <View style={tw`my-3`}>
              <Text style={tw`text-lg text-center text-white`}>
                Enable Indoor Navigation Result Voice
              </Text>
            </View>
            <View
              style={[
                tw`justify-center p-1 rounded-lg`,

                {
                  backgroundColor:
                    accessibility.selected_background_color.darkerPrimaryColor,
                },
              ]}
            >
              <Switch
                value={indoor_navigation_result_voice_enabled}
                onValueChange={toggleSwitch}
                color={accessibility.selected_background_color.secondaryColor}
              />
            </View>
          </View>
          <View style={tw`items-center justify-center my-3`}>
            <Button
              style={[
                tw`justify-center p-1 rounded-lg`,

                {
                  backgroundColor:
                    accessibility.selected_background_color.darkerPrimaryColor,
                },
              ]}
              onPress={changeModalVisibleBackgroundColor}
            >
              Change Background Color
            </Button>
          </View>
          <View style={tw`items-center justify-center my-3`}>
            <Button
              onPress={changeModalVisibleFontColor}
              style={[
                tw`justify-center p-1 rounded-lg`,

                {
                  backgroundColor:
                    accessibility.selected_background_color.darkerPrimaryColor,
                },
              ]}
            >
              Change Text Color
            </Button>
          </View>
          <View style={tw`items-center justify-center my-3`}>
            <Button
              onPress={changeModalVisibleFontSize}
              style={[
                tw`justify-center p-1 rounded-lg`,

                {
                  backgroundColor:
                    accessibility.selected_background_color.darkerPrimaryColor,
                },
              ]}
            >
              Change Font Size
            </Button>
          </View>
          <View style={tw`items-center justify-center my-3`}>
            <Button
              onPress={handleResetSettings}
              style={[
                tw`justify-center p-1 rounded-lg`,

                {
                  backgroundColor:
                    accessibility.selected_background_color.darkerPrimaryColor,
                },
              ]}
            >
              Reset settings
            </Button>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  placeholderStyle: {
    color: "white",
    fontSize: 25,
    paddingHorizontal: 5, // Add padding to the placeholder text
  },

  dropdown: {
    borderRadius: 12,
    padding: 12,
    backgroundColor: "#003594",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
  },
  icon: {
    marginRight: 5,
  },
  item: {
    padding: 17,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  textItem: {
    flex: 1,
    fontSize: 16,
  },
  placeholderStyle: {
    color: "white",
    fontSize: 16,
  },
  selectedTextStyle: {
    fontSize: 16,
    color: "white",
  },
  iconStyle: {
    width: 20,
    height: 20,
    color: "white",
  },
  inputSearchStyle: {
    height: 40,
    fontSize: 16,
  },
});
