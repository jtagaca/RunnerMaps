import React, { useState, useRef, useEffect } from "react";
import { View } from "react-native";
import { AutocompleteDropdown } from "react-native-autocomplete-dropdown";
import { useDispatch } from "react-redux";
import { setCurrentIndoorNavigationBuilding } from "../../../redux_store/reducers";
export const CustomDropdown = ({ data }) => {
  const [selectedItem, setSelectedItem] = useState(null);

  useEffect(() => {
    if (selectedItem != null) {
      console.log("selecteditem " + selectedItem.id);
    }
  }, [selectedItem]);
  const dispatch = useDispatch();
  const handleSelection = (building) => {
    dispatch(setCurrentIndoorNavigationBuilding(building));
    setSelectedItem(building);
  };
  return (
    <AutocompleteDropdown
      clearOnFocus={false}
      onSelectItem={(selected_building) =>
        selected_building && handleSelection(selected_building)
      }
      dataSet={data}
      textInputProps={{
        placeholder: "What building are you in?",
        autoCorrect: false,
        autoCapitalize: "none",
        style: {
          borderRadius: 25,
          color: "black",
          paddingLeft: 18,
        },
      }}
      ItemSeparatorComponent={
        <View
          style={{ height: 1, width: "100%", backgroundColor: "#d8e1e6" }}
        />
      }
      getItemLayout={(data, index) => ({
        length: 50,
        offset: 50 * index,
        index,
      })}
    />
  );
};
