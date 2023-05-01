import React from 'react';
import { View, Image, Text, StyleSheet, SafeAreaView } from 'react-native';

export default function LoadingScreen(){
  return (
    <SafeAreaView style={styles.safeAreaContainer}>
      <View style={styles.container}>
        <Image source={require('../../images/csub.png')} style={styles.image} />
        <Text style={styles.title}>Runner Maps</Text>
      </View>
    </SafeAreaView>
  );
};
const styles = StyleSheet.create({
  safeAreaContainer: {
    flex: 1,
    backgroundColor: '#003594',
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'column',
  },
  image: {
    width: 300,
    height: 300,
    resizeMode: 'contain',
  },
  title: {
    marginTop: 20,
    fontSize: 50,
    fontWeight: 'bold',
    color: '#FFC72C',
  },
});

  

