import React from "react";
import { View, TouchableOpacity, Text } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useDispatch } from "react-redux";
import { indoor_navigation_properties_actions } from "../../../redux_store/reducers";
import { Button } from "react-native-paper";

export default function CustomBackButton({ navigation }) {
  const dispatch = useDispatch();

  const handleBackButton = () => {
    navigation.goBack();
    dispatch(
      indoor_navigation_properties_actions.deleteShortestPathDirections()
    );
  };

  return <Button onPress={handleBackButton}> Back</Button>;
}
