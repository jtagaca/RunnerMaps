// CardComponent.js
import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Card } from "react-native-paper";
import tw from "../../../tailwind/CustomTailwind";

export default function CardComponent({ card, index, sorted_shortest_path }) {
  return (
    <View style={(styles.container, tw`mt-2 shadow-2xl`)}>
      <Card style={styles.card}>
        <Card.Content style={tw`flex flex-col justify-center`}>
          {card.locationName && card.locationName != null ? (
            <View style={tw`flex-col`}>
              {index === 0 ? (
                <Text style={tw`text-center text-2xl `}>
                  START LOCATION {card.locationName.toUpperCase()}
                </Text>
              ) : null}
              {index === sorted_shortest_path.length - 1 ? (
                <Text style={tw`text-center text-2xl`}>
                  DESTINATION LOCATION {card.locationName.toUpperCase()}
                </Text>
              ) : null}
              {card.userDirection == "enter" ||
              card.locationName == "elevator" ||
              card.locationName == "stairs" ? (
                <Text style={tw`text-center text-2xl`}>
                  ENTER {card.locationName.toUpperCase()}
                </Text>
              ) : null}
            </View>
          ) : null}

          {card.image && card.image != null && card.image != "" ? (
            <>
              <Card.Cover
                style={tw`h-8/10 m-5`}
                source={{ uri: card.image }}
                resizeMode="contain"
              />
            </>
          ) : (
            <View style={tw`flex flex-col items-center justify-center h-full`}>
              {card.userDirection &&
              card.userDirection != null &&
              card.userDirection != "" ? (
                <>
                  {card.userDirection != "enter" &&
                  card.userDirection != "keep straight" ? (
                    <Text style={tw`text-3xl text-center`}>
                      TURN {card.userDirection.toUpperCase()}
                    </Text>
                  ) : (
                    <Text style={tw`text-3xl text-center`}>
                      {card.userDirection.toUpperCase()}
                    </Text>
                  )}
                  {card.userDirection !== "enter" ? (
                    card.is_outside && card.is_outside !== false ? (
                      <Text style={tw`text-3xl text-center`}>
                        YOU ARE OUTSIDE, FOLLOW THE ROAD PATH
                      </Text>
                    ) : (
                      <Text style={tw`text-3xl text-center`}>
                        IN THE HALLWAY
                      </Text>
                    )
                  ) : null}
                </>
              ) : null}
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
