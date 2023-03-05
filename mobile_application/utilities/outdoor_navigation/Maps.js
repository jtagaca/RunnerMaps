import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';
import MapViewDirections from 'react-native-maps-directions';

export default function Maps () {
    const [region, setRegion] = useState(null);
    // const [destination, setDestination] = useState({
    //     //Icardo Center parking lot
    //     latitude: 35.346847,
    //     longitude: -119.102904,
    // });
    useEffect(() => {
        (async () => {
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== "granted") {
            console.log("Permission to access location was denied");
            return;
        }
        const location = await Location.getCurrentPositionAsync({});
        setRegion({
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
            latitudeDelta: 0.015,
            longitudeDelta: 0.0121,
          });
        })();
      }, []);
      return (
        <View style={styles.container}>
        <Text style={styles.titleText}>Runner Maps</Text>
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
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        alignItems: 'center',
        backgroundColor: '#0000FF',
        justifyContent: 'center',
    },
    titleText: {
        color:"#FFFF00",
        fontSize: 40,
        fontWeight: 'bold',
        paddingBottom: 20
    },
    map: {
        width: '100%',
        height: '50%',
    },
});
