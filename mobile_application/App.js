import { StatusBar } from "expo-status-bar";
import { Button, Image, StyleSheet, Text, TextInput, View } from "react-native";
import React, { useState, useEffect } from "react";

export default function App () {
  const [classroom, setClassroom] = useState("");

  function getDirections(){
    alert(`You entered ${classroom}`);
  }

  return (
    <View style={styles.container}>
      <Text>RUNNER MAPS </Text>
      <Image source={require('./images/runner.png')} style={{width: 200, height: 200}} />
      <TextInput
        style={{height: 40}}
        placeholder="Class Room Number"
        onChangeText={newclassroom => setClassroom(newclassroom)}
        defaultValue={classroom}
      />
      <Button title="Get Directions" onSubmit={getDirections()} />
      <StatusBar style="auto" />
    </View>
    
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",

  },
});
