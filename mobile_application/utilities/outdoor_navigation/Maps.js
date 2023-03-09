import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, Button } from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import * as Location from 'expo-location';
import MapViewDirections from 'react-native-maps-directions';

export default function Maps () {
    const [region, setRegion] = useState(null);
    const [destination, setDestination] = useState({
        //Icardo Center parking lot
        latitude: 35.346847,
        longitude: -119.102904,
    });
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
      const handleGetDirections = async () => {
        const apiKey = "AIzaSyAJVYqFZxP1cE040AZVjzRHNVAX10jUORI";
        const location = await Location.getCurrentPositionAsync({});
        const origin = {
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
        };
        const destinationStr = `${destination.latitude},${destination.longitude}`;
        const directionsUrl = `https://maps.googleapis.com/maps/api/directions/json?origin=${origin.latitude},
        ${origin.longitude}&destination=${destinationStr}&key=${apiKey}`;
        const response = await fetch(directionsUrl);
        const result = await response.json();
        const points = MapViewDirections.processPolyline(result.routes[0].overview_polyline.points);
        setDestination({
          latitude: result.routes[0].legs[0].end_location.lat,
          longitude: result.routes[0].legs[0].end_location.lng,
        });
        this.map.fitToCoordinates(points.coordinates, {
          edgePadding: { top: 20, right: 20, bottom: 20, left: 20 },
          animated: true,
        });

      }
      return (
        <View style={styles.container}>
        <Text style={styles.titleText}>Runner Maps</Text>
          {region ? (
            <MapView style={styles.map} region={region} provider={PROVIDER_GOOGLE}>
              <Marker coordinate={region} title="You are here" />
              <Marker coordinate={destination} title="Destination" />
              <MapViewDirections
                origin={region}
                destination={destination}
                apikey="AIzaSyAJVYqFZxP1cE040AZVjzRHNVAX10jUORI"
                strokeWidth={3}
                strokeColor="hotpink"
              />
            </MapView>
          ) : (
            <Text>Loading...</Text>
          )}
          <Button style={styles.getDirections}title="Get directions" onPress={handleGetDirections} />
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
    getDirections: {
      color: "#FFFF00",
    }
});
