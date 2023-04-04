import React, { useState, useEffect, useRef } from "react";
import { StyleSheet, View, Text } from "react-native";
import { Dropdown } from "react-native-element-dropdown";
import Ionicons from "@expo/vector-icons/Ionicons";
import { Button } from "react-native-paper";
import tw from "../../../tailwind/CustomTailwind";
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
      style={tw`flex flex-row items-center content-center justify-center p-2 my-2 text-white bg-blue-500 rounded-lg `}
    >
      <Dropdown
        dropdownPosition="auto"
        showsVerticalScrollIndicator={true}
        style={(styles.dropdown, tw`my-4 mr-0 w-8/10  `)}
        placeholderStyle={
          given_style && data && data.length === 0
            ? given_style
            : tw`text-white`
        }
        selectedTextStyle={tw`text-white `}
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
            color="white"
            name="location"
            size={20}
          />
        )}
        renderItem={renderItem}
      />
      <View style={tw`items-center justify-center flex-1 `}>
        <Button textColor="white" onPress={handleClearLocal}>
          Clear
        </Button>
      </View>
    </View>
  );
};

export default CustomDropdown;

const styles = StyleSheet.create({
  placeholderStyle: {
    color: "white",
    fontSize: 25,
    paddingHorizontal: 5, // Add padding to the placeholder text
  },

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
