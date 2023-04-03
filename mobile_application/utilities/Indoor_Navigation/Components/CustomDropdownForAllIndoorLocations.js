import React, { useState, useEffect, useContext } from "react";
import { StyleSheet, View, Text } from "react-native";
import { Dropdown } from "react-native-element-dropdown";
import Ionicons from "@expo/vector-icons/Ionicons";
import { Button } from "react-native-paper";
import tw from "../../../tailwind/CustomTailwind";
import AllIndoorLocationContext from "../Contexts/AllIndoorLocations";
import { Dimensions } from "react-native";

const CustomDropdownForAllIndoorLocations = ({ data, type, placeholder }) => {
  const context = useContext(AllIndoorLocationContext);

  let selectedItem;
  let setSelectedItem;

  switch (type) {
    case "building":
      selectedItem = context.buildingSelectedItem;
      setSelectedItem = context.setBuildingSelectedItem;
      break;
    case "services":
      selectedItem = context.serviceSelectedItem;
      setSelectedItem = context.setServiceSelectedItem;
      break;
    default:
      selectedItem = context.selectedItem;
      setSelectedItem = context.setSelectedItem;
  }

  const handleSelectionLocal = (item) => {
    setSelectedItem(item);
  };

  const handleClearLocal = () => {
    setSelectedItem(null);
  };
  useEffect(() => {
    if (selectedItem === null) {
      return;
    }
    console.log("selectedItem", selectedItem);
  }, [selectedItem]);

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
      style={tw`flex flex-row items-center justify-center content-center bg-blue-500 rounded-lg mt-10 p-4 text-white shadow-2xl`}
    >
      <Dropdown
        dropdownPosition="auto"
        showsVerticalScrollIndicator={true}
        style={(styles.dropdown, tw`w-8/10 my-4 mr-0 h-2/30 `)}
        placeholderStyle={tw`text-white flex-wrap justify-center`}
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

export default CustomDropdownForAllIndoorLocations;

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
