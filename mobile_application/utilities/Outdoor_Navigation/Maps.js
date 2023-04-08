import React, { useState, useEffect } from 'react';
import { Alert, StyleSheet, View, Text, Button, Linking } from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import * as Location from 'expo-location';
import MapViewDirections from 'react-native-maps-directions';
import apiKey from './config_dev.js';
import {getDistance} from 'geolib';

export default function Maps () {
    const [region, setRegion] = useState(null);
    const [destination, setDestination] = useState(null);
    const [polyline, setPolyline] = useState(null);
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
        const location = await Location.getCurrentPositionAsync({});
        const origin = {
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
        };
        const destinations = {
          1: { latitude: 35.348883, longitude: -119.103437 },
          2: { latitude: 35.348886, longitude: -119.103911 },
          3: { latitude: 35.348957, longitude: -119.104085 }
        };

        const closestDestination = (obj) => {
          let minDistance = Infinity;
          let closestDest = obj[0];
          Object.keys(obj).forEach(function(key) {
            let distance = getDistance(origin, obj[key]);
            if (distance < minDistance) {
              minDistance = distance;
              closestDest = obj[key];
            }
          });
          return closestDest;
        }
        let destination = closestDestination(destinations);
        setDestination(destination);
        
        const destinationStr = `${destination.latitude},${destination.longitude}`;
        const originStr = `${origin.latitude},${origin.longitude}`;
        const directionsUrl = `https://maps.googleapis.com/maps/api/directions/json?origin=${originStr}&destination=${destinationStr}&key=${apiKey}`;
        try {
          const response = await fetch(directionsUrl);
          const result = await response.json();
          if (result.status === 'OK' && result.routes.length > 0) {
            const newPolyline = result.routes[0].overview_polyline.points;
            setPolyline(newPolyline);
            const url = `https://www.google.com/maps/dir/?api=1&destination=${destinationStr}&travelmode=walking&dir_action=navigate&polyline=${polyline}`;
            Linking.openURL(url);
          } else {
            Alert.alert('Error', 'Directions not found');
          }
        } 
        catch (error) {
          Alert.alert('Error', error.message);
        }
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
                apikey={apiKey}
                strokeWidth={3}
                strokeColor="red"
                polyline={polyline}
              />
            </MapView>
          ) : (
            <Text>Loading...</Text>
          )}
          <Button color="#FFFF00" title="Get directions" onPress={handleGetDirections} />
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
        zoom: 0,
        width: '100%',
        height: '50%',
    },
});
