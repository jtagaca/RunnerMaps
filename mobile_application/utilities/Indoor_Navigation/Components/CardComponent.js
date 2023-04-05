import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Card } from "react-native-paper";
import tw from "../../../tailwind/CustomTailwind";

export default function CardComponent({ card, index, sorted_shortest_path }) {
  const buildText = (card, index, sorted_shortest_path, type) => {
    let textElement = "";
    let additionalText = "";

    if (type === "hasImage") {
      if (
        card.userDirection &&
        card.userDirection != null &&
        card.userDirection != ""
      ) {
        textElement = card.userDirection.toUpperCase();
        if (card.userDirection !== "enter") {
          textElement = `${
            card.userDirection == "keep straight" ? "" : "TURN"
          } ${card.userDirection.toUpperCase()}`;
        }

        if (card.is_outside && card.is_outside !== false) {
          additionalText = "YOU ARE OUTSIDE, FOLLOW THE ROAD PATH";
        } else {
          additionalText = "IN THE HALLWAY";
        }

        return `${textElement}\n${additionalText}`;
      }
    } else {
      if (card.locationName && card.locationName != null) {
        if (index === 0) {
          return `START LOCATION ${card.locationName.toUpperCase()}`;
        }

        if (index === sorted_shortest_path.length - 1) {
          return `DESTINATION LOCATION ${card.locationName.toUpperCase()}`;
        }

        if (
          card.userDirection === "enter" ||
          card.locationName === "elevator" ||
          card.locationName === "stairs"
        ) {
          return `ENTER ${card.locationName.toUpperCase()}`;
        }
      }
    }

    return "";
  };

  const buildTextComponent = (card, index, sorted_shortest_path, type) => {
    const text = buildText(card, index, sorted_shortest_path, type);

    if (text) {
      return <Text style={tw`text-3xl text-center`}>{text}</Text>;
    }

    return null;
  };

  const textContent = buildTextComponent(card, index, sorted_shortest_path);
  const hasImageTextContent = buildTextComponent(
    card,
    index,
    sorted_shortest_path,
    "hasImage"
  );

  return (
    <View style={(styles.container, tw`mt-2 shadow-2xl`)}>
      <Card style={styles.card}>
        <Card.Content style={tw`flex flex-col justify-center`}>
          {textContent}

          {card.image && card.image != null && card.image != "" ? (
            <Card.Cover
              style={tw`h-7/10 m-5`}
              source={{ uri: card.image }}
              resizeMode="contain"
            />
          ) : (
            <View style={tw`flex flex-col items-center justify-center h-full`}>
              {hasImageTextContent}
            </View>
          )}
        </Card.Content>
      </Card>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  card: {
    width: "100%",
    height: "95%",
    marginBottom: 10,
  },
});
