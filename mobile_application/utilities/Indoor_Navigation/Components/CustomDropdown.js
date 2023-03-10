import React, { useState, useRef, useEffect } from "react";
import { View } from "react-native";
import { AutocompleteDropdown } from "react-native-autocomplete-dropdown";

export const CustomDropdown = ({ data }) => {
  const [selectedItem, setSelectedItem] = useState(null);

  return (
    <AutocompleteDropdown
      clearOnFocus={false}
      closeOnBlur={true}
      onSelectItem={setSelectedItem}
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
