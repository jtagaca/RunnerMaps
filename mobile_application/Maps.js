import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';

export default function Maps () {
    const [region, setRegion] = useState(null);
    const [currentLocation, setCurrentLocation] = useState(null);
    useEffect(() => {
        (async () => {
            let { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== "granted") {
              setErrorMsg("Permission to access location was denied");
              return;
            }
        const location = await Location.getCurrentPositionAsync({});
        setCurrentLocation(location)
        setRegion({
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
            latitudeDelta: 0.015,
            longitudeDelta: 0.0121,
          });
        })();
      }, []);
    //   let text = "Waiting..";
    //     if (currentLocation) {
    //         text = JSON.stringify(currentLocation);
    //     }
      return (
        <View style={styles.container}>
          {/* <Text style={styles.paragraph}>{text}</Text> */}
          {region ? (
            <MapView style={styles.map} region={region}>
              <Marker coordinate={region} />
            </MapView>
          ) : (
            <Text>Loading...</Text>
          )}
        </View>
      );
};
    
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
    map: {
        width: '100%',
        height: '100%',
    },
    paragraph: {
        margin: 24,
        fontSize: 18,
        fontWeight: "bold",
        textAlign: "center",
      },
});
