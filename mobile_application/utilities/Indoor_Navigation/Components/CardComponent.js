import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Card } from "react-native-paper";
import tw from "../../../tailwind/CustomTailwind";
import { buildText } from "../Library/FormatText";

export default function CardComponent({ card, index, sorted_shortest_path }) {
  const buildTextComponent = (card, index, sorted_shortest_path, type) => {
    const text = buildText(card, index, sorted_shortest_path, type);

    if (text) {
      return <Text style={tw`text-3xl text-center`}>{text}</Text>;
    }

    return null;
  };

  const textContent = buildTextComponent(card, index, sorted_shortest_path);
  const hasNoImageTextContent = buildTextComponent(
    card,
    index,
    sorted_shortest_path,
    "noImage"
  );

  return (
    <View style={(styles.container, tw`mt-2 shadow-2xl`)}>
      <Card style={styles.card}>
        <Card.Content style={tw`flex flex-col justify-center`}>
          {textContent}

          {card.image && card.image != null && card.image != "" ? (
            <Card.Cover
              style={tw`h-8/10 `}
              source={{ uri: card.image }}
              resizeMode="contain"
            />
          ) : (
            <View style={tw`flex flex-col items-center justify-center h-full`}>
              {hasNoImageTextContent}
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
