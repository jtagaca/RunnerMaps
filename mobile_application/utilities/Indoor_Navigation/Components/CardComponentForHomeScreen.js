import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import React from "react";
import { Card, Title } from "react-native-paper";
import { LinearGradient } from "expo-linear-gradient";
import tw from "../../../tailwind/CustomTailwind";
import Icon from "react-native-vector-icons/FontAwesome";
import LoadingImage from "../../Components/LoadingImage";
const CardComponentForHomeScreen = React.memo(
  ({ item, handleIndoorNavigate, formatTitle }) => {
    return (
      <View style={tw`m-1`}>
        <Card mode="elevated" style={(styles.card, styles.spacing)}>
          <Card.Content
            style={tw`flex-row items-center justify-center mt-2 mb-3  bg-opacity-50 bg-transparent`}
          >
            <Title style={tw`p-2 bg-yellow-300 rounded-md shadow-2xl`}>
              {formatTitle(item)}
            </Title>
          </Card.Content>
          <TouchableOpacity
          // onPress={() =>
          //   props.navigation.navigate("RestaurantDetails", {
          //     name: item.name,
          //     restaurant: item,
          //   })
          // }
          >
            <LoadingImage uri={item.image ? item.image : null} />
          </TouchableOpacity>
          <View
            style={tw`flex-row items-center justify-center py-2 mx-5 my-2 justify-evenly`}
          >
            <TouchableOpacity
              style={tw`flex-row items-center p-1 mx-4 bg-blue-500 rounded-2xl justify-evenly w-5/10`}
              onPress={() => handleIndoorNavigate(item)}
            >
              <Text style={tw`text-white`}>Indoor Navigate</Text>
              <Icon name="street-view" color="white" size={25}></Icon>
            </TouchableOpacity>
            <TouchableOpacity
              style={tw`flex-row items-center p-1 mx-4 bg-blue-500 rounded-2xl justify-evenly w-5/10`}
              onPress={() => CallNum(item.display_phone)}
            >
              <Text style={tw`text-white`}>Outdoor Navigate</Text>
              <Icon name="compass" color="white" size={25}></Icon>
            </TouchableOpacity>
          </View>
        </Card>
      </View>
    );
  }
);
export default CardComponentForHomeScreen;

const styles = StyleSheet.create({
  container: {
    backgroundColor: "black",
  },
  invcontainer: {
    backgroundColor: "white",
    opacity: 0.7,
  },
  text: {},
  spacing: {
    marginTop: 20,
    paddingLeft: 0,
    paddingRight: 0,
    paddingBottom: 0,
  },
  allign: {
    textAlign: "left",
    alignSelf: "stretch",
    marginRight: 300,
    marginLeft: 0,
  },
  actionContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    height: 65,
  },
  card: {
    flexDirection: "row",
    height: 30,
    width: 10,
    borderRadius: 10,
    alignSelf: "center",
    marginBottom: 3,
    marginTop: 3,
    borderLeftWidth: 5,
    shadowColor: "#000",
    shadowOffset: {
      width: 1,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    opacity: 0.9,
  },
  rating: {
    flex: 1,
  },
  appButtonContainer: {
    elevation: 8,
    backgroundColor: "white",
    borderRadius: 30,
    paddingVertical: 0,
    paddingHorizontal: 0,
  },
  buttonContainer: {
    borderRadius: 25,
    paddingTop: 0,
    paddingBottom: 0,
    marginRight: 1.8,
    marginLeft: 1.8,
    flex: 1,
  },
  appButtonText: {
    fontSize: 14,
    color: "#FFFFFF",
    fontWeight: "bold",
    alignSelf: "center",
    padding: 0,
    margin: 0,
  },
  phone: {
    height: 30,
    width: 30,
    backgroundColor: "#329df4",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 5,
  },
  fabStyle: {
    position: "absolute",
    margin: 16,
    right: 0,
    bottom: 0,
    backgroundColor: "lightblue",
  },
  olStyle: {
    position: "absolute",
    top: 50,
    bottom: 180,
    left: 50,
    right: 50,
  },
  leftContainer: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "flex-start",
  },
  rightContainer: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "flex-end",
  },
  popupmodal: {
    margin: 20,
  },
});
