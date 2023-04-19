import React, { useState, useEffect, useContext } from "react";
import { StyleSheet, View, Text } from "react-native";
import { Dropdown } from "react-native-element-dropdown";
import Ionicons from "@expo/vector-icons/Ionicons";
import { Button } from "react-native-paper";
import tw from "../../../tailwind/CustomTailwind";
import AllIndoorLocationContext from "../Contexts/AllIndoorLocations";
import { Dimensions } from "react-native";
import { useSelector } from "react-redux";

const CustomDropdownWithSelectorFromParent = ({
  given_style,
  data,
  placeholder,
  selectedItem,
  setSelectedItem,
}) => {
  const handleSelectionLocal = (item) => {
    setSelectedItem(item);
  };

  const handleClearLocal = () => {
    setSelectedItem(null);
  };
  const accessibility = useSelector((state) => state.accessibility);
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
        tw`flex flex-row items-center justify-center content-center rounded-lg mt-10 p-4 text-white shadow-2xl`,
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
        placeholderStyle={given_style ? given_style : tw`text-white`}
        selectedTextStyle={tw`text-white`}
        inputSearchStyle={styles.inputSearchStyle}
        iconStyle={styles.iconStyle}
        data={data}
        search
        searchField="label"
        iconColor="white"
        autoScroll={false}
        maxHeight={300}
        labelField="label"
        valueField="value"
        placeholder={data && data.length === 0 ? "Error happened" : placeholder}
        searchPlaceholder="Search..."
        value={selectedItem}
        onChange={(item) => handleSelectionLocal(item)}
        renderLeftIcon={() => (
          <Ionicons
            style={styles.icon}
            color="white"
            name="location"
            size={20}
          />
        )}
        renderItem={renderItem}
      />
      <View style={tw`flex-1 items-center justify-center `}>
        <Button textColor="white" onPress={handleClearLocal}>
          Clear
        </Button>
      </View>
    </View>
  );
};

export default CustomDropdownWithSelectorFromParent;

const styles = StyleSheet.create({
  dropdown: {
    borderRadius: 12,
    padding: 15,
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
    color: "black",
  },
});
