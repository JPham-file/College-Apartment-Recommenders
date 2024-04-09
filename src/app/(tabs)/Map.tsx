import { Text, StyleSheet, View, TouchableOpacity, Dimensions, Image } from 'react-native';
import { useNavigation } from "@react-navigation/native";
import * as Location from "expo-location";
import React, {useEffect, useState} from 'react'
import MapView, {Marker, PROVIDER_GOOGLE} from 'react-native-maps';
import {ApartmentUnitRecommendation} from "@/src/types";
import {useAuth} from "@clerk/clerk-expo";

interface MapPageProps {}

const MapPage = ({}: MapPageProps) => {
  const [userLocation, setUserLocation] = useState<any>(null)
  const [initialRegion, setinitialRegion] = useState<any>();
  const [token, setToken] = useState<string | null>(null);
  const [apartmentData, setApartmentData] = useState<ApartmentUnitRecommendation[]>([]);

  const { getToken } = useAuth();

  const fetchUserPreferences = async () => {
    const newToken = await getToken();
    setToken(newToken);
    try {
      const apiURL = `${process.env.EXPO_PUBLIC_RECOMMENDATION_API_URL}/get_recommendations`;
      const response = await fetch(apiURL, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${newToken}`,
        },
      });
      if (!response.ok) {
        console.error(response)
        throw new Error('Network response failure: make sure to change IP to your machine IP');
      }
      const data = await response.json();
      // console.log(data)
      setApartmentData(data)
    } catch (error) {
      console.error('There was an error fetching the user preferences:', error);
    }
  };

  console.log(apartmentData)

  useEffect(() => {
    fetchUserPreferences();
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
        <MapView
          style={styles.map}
          initialRegion={initialRegion}
          provider={PROVIDER_GOOGLE}
        >
          {userLocation && (
            <Marker
              coordinate={{
                latitude: userLocation.latitude,
                longitude: userLocation.longitude,
              }}
              title="Your Location"
            />
          )}
          {apartmentData.map((location) => (
            <Marker
              key={location.propertyId}
              coordinate={{ latitude: location.apt_latitude, longitude: location.apt_longitude }}
              title={location.name}
            />
          ))}
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