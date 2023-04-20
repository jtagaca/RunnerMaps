import React, { useState, useEffect, useRef } from "react";
import { StyleSheet, View, Text } from "react-native";
import { Dropdown } from "react-native-element-dropdown";
import Ionicons from "@expo/vector-icons/Ionicons";
import { Button } from "react-native-paper";
import tw from "../../../tailwind/CustomTailwind";
import { useSelector } from "react-redux";
const CustomDropdown = ({
  given_style,
  data,
  handleSelection,
  handleClear,
  type,
  empty_query_result,
  default_selected_item,
  handleClearHomeScreenData,
}) => {
  const [selectedItem, setSelectedItem] = useState(null);
  const accessibility = useSelector((state) => state.accessibility);
  const handleSelectionLocal = (item) => {
    handleSelection(item);
    setSelectedItem(item);
  };

  const handleClearLocal = () => {
    handleClear(type);
    setSelectedItem(null);
  };

  useEffect(() => {
    if (default_selected_item && default_selected_item != null) {
      handleSelectionLocal(default_selected_item);
      if (handleClearHomeScreenData) {
        handleClearHomeScreenData();
      }
    }
  }, [default_selected_item]);

  const renderItem = (item) => {
    return (
      <View style={styles.item}>
        <Text style={styles.textItem}>{item.label}</Text>
        {item.value === selectedItem?.value && (
          <Ionicons
            style={styles.icon}
            color="white"
            name="location"
            size={20}
          />
        )}
      </View>
    );
  };

  return (
    <View
      style={[
        tw`flex flex-row items-center content-center justify-center p-2 my-2 rounded-lg `,
        {
          backgroundColor:
            accessibility.selected_background_color.secondaryColor,
        },
        accessibility.selected_font_color != "#d4b3b3"
          ? {
              color: accessibility.selected_font_color,
            }
          : tw`text-white`,
      ]}
    >
      <Dropdown
        dropdownPosition="auto"
        showsVerticalScrollIndicator={true}
        style={(styles.dropdown, tw`my-4 mr-0 w-8/10  `)}
        placeholderStyle={
          given_style && data && data.length === 0
            ? given_style
            : accessibility.selected_font_color != "#d4b3b3"
            ? {
                color: accessibility.selected_font_color,
              }
            : tw`text-white`
        }
        selectedTextStyle={
          accessibility.selected_font_color != "#d4b3b3"
            ? {
                color: accessibility.selected_font_color,
              }
            : tw`text-white`
        }
        inputSearchStyle={[styles.inputSearchStyle]}
        iconStyle={[
          styles.iconStyle,
          accessibility.selected_font_color != "#d4b3b3"
            ? {
                color: accessibility.selected_font_color,
              }
            : null,
        ]}
        data={data}
        search
        searchField="label"
        iconColor={
          accessibility.selected_font_color != "#d4b3b3"
            ? accessibility.selected_font_color
            : "white"
        }
        autoScroll={false}
        maxHeight={300}
        labelField="label"
        valueField="value"
        placeholder={
          data && data.length === 0
            ? "Please select a building first"
            : type == "building"
            ? "Select Building"
            : "Select Location"
        }
        searchPlaceholder="Search..."
        value={selectedItem}
        onChange={(item) => handleSelectionLocal(item)}
        renderLeftIcon={() => (
          <Ionicons
            style={styles.icon}
            color={
              accessibility.selected_font_color != "#d4b3b3"
                ? accessibility.selected_font_color
                : "white"
            }
            name="location"
            size={20}
          />
        )}
        renderItem={renderItem}
      />
      <View style={tw`items-center justify-center flex-1 `}>
        <Button
          textColor={
            accessibility.selected_font_color != "#d4b3b3"
              ? accessibility.selected_font_color
              : "white"
          }
          onPress={handleClearLocal}
        >
          Clear
        </Button>
      </View>
    </View>
  );
};

export default CustomDropdown;

const styles = StyleSheet.create({
  dropdown: {
    borderRadius: 12,
    padding: 12,
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
