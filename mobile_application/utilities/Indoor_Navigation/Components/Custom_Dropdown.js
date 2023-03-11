import React, { useState, useRef, useEffect, useCallback } from "react";
import { View } from "react-native";
import { AutocompleteDropdown } from "react-native-autocomplete-dropdown";
import { useDispatch } from "react-redux";
import { setCurrentIndoorNavigationBuilding } from "../../../redux_store/reducers";

export const CustomDropdown = ({
  data,
  handleSelection,
  handleClear,
  type,
  empty_query_result,
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
  return (
    data != null && (
      <AutocompleteDropdown
        clearOnFocus={false}
        onSelectItem={(item) => item && handleSelectionLocal(item)}
        dataSet={data}
        textInputProps={{
          autoCorrect: false,
          autoCapitalize: "none",
          style: {
            borderRadius: 25,
            color: "black",
            paddingLeft: 18,
          },
        }}
        emptyResultText={empty_query_result}
        onClear={handleClearLocal}
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
    )
  );
};
