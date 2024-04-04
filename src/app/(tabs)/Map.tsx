import { Text, StyleSheet, View, TouchableOpacity, Dimensions, Image } from 'react-native';
import { useNavigation } from "@react-navigation/native";
import * as Location from "expo-location";
import React, {useEffect, useState} from 'react'
import MapView, {Marker} from 'react-native-maps';

interface MapPageProps {}

const MapPage = ({}: MapPageProps) => {
  const [userLocation, setUserLocation] = useState<any>(null)
  const [initialRegion, setinitialRegion] = useState<any>();

  useEffect(() => {
    const getLocation = async () => {
      let {status} = await Location.requestForegroundPermissionsAsync();
      if ( status !== 'granted') {
        console.log("permission denied")
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      setUserLocation(location.coords);
      setinitialRegion({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        latitudeDelta: 0.05,
        longitudeDelta: 0.05,
      });
    };

    getLocation();

  }, []);


  return (
    <View className="flex flex-row justify-center items-center h-full">
      {initialRegion && (
        <MapView style={styles.map} initialRegion={initialRegion}>
          {userLocation && (
            <Marker
              coordinate={{
                latitude: userLocation.latitude,
                longitude: userLocation.longitude,
              }}
              title="Your Location"
            />
          )}
        </MapView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    width: '100%',
    height: '100%',
  },
});

export default MapPage;