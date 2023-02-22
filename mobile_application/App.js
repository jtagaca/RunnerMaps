import { StatusBar } from "expo-status-bar";
import { Button, Image, StyleSheet, Text, TextInput, View } from "react-native";
import React, { useState, useEffect } from "react";

export default class App extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      classroom: null,
    };
  }
  getDirections = () => {
    alert(`You entered ${this.state.classroom}`);
  }
  // const [classroom, setClassroom] = useState(" ");

  render() {
    return (
      <View style={styles.container}>
        <Text>RUNNER MAPS </Text>
        <Image source={require('./images/runner.png')} style={{width: 200, height: 200}} />
        <TextInput
          style={{height: 40}}
          placeholder="Class Room Number"
          onChangeText={newclassroom => this.state.classroom}
          defaultValue={this.state.classroom}
        />
        {/* <Button title="Get Directions" onSubmit={this.getDirections()} /> */}
        <StatusBar style="auto" />
      </View>
      
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",

  },
});
