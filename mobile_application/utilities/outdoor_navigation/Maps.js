import React, { useState, useEffect } from 'react';
import { Alert, Linking, StyleSheet, View, Text, Button } from 'react-native';
import MapView, {Polyline, Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import * as Location from 'expo-location';
import MapViewDirections from 'react-native-maps-directions';

export default function Maps () {
    const [region, setRegion] = useState(null);
    const [destination, setDestination] = useState({
        //Science 3 Entrance 1
        latitude: 35.348883,
        longitude: -119.103437,
    });
    const [routeCoordinates, setRouteCoordinates] = useState([]);
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
        const originStr = `${origin.latitude},${origin.longitude}`;
        const directionsUrl = `https://maps.googleapis.com/maps/api/directions/json?
        origin=${originStr}&destination=${destinationStr}&key=${apiKey}`;
        const directions1 = "https://maps.googleapis.com/maps/api/directions/json?origin=35.3500328,-119.126109&destination=35.348883,-119.103437&key=AIzaSyAJVYqFZxP1cE040AZVjzRHNVAX10jUORI"
        try {
          const response = await fetch(directionsUrl);
          const result = await response.json();
          if (result.status === 'OK' && result.routes.length > 0) {
            const polyline = result.routes[0].overview_polyline.points;
            const url = `https://www.google.com/maps/dir/?api=1&destination=${destination}&travelmode=driving&dir_action=navigate&polyline=${polyline}`;
            Linking.openURL(url);
          } else {
            Alert.alert('Error', 'Directions not found');
          }
        } 
        catch (error) {
          Alert.alert('Error', error.message);
        }
        // const points = MapViewDirections.processPolyline(result.routes[0].overview_polyline.points);
        // setDestination({
        //   latitude: result.routes[0].legs[0].end_location.lat,
        //   longitude: result.routes[0].legs[0].end_location.lng,
        // });
        // this.map.fitToCoordinates(points.coordinates, {
        //   edgePadding: { top: 20, right: 20, bottom: 20, left: 20 },
        //   animated: true,
        // });
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
                strokeColor="red"
              />
              <Polyline coordinates={routeCoordinates} strokeColor="#FF0000" strokeWidth={3} />
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
