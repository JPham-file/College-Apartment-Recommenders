import { FlatList, Modal, Text, StyleSheet, View, TouchableOpacity, Dimensions, Image } from 'react-native';
import { useNavigation } from "@react-navigation/native";
import * as Location from "expo-location";
import React, {useCallback, useEffect, useState} from 'react'
import MapView, {Callout, Marker, PROVIDER_GOOGLE} from 'react-native-maps';
import MapViewDirections from 'react-native-maps-directions';
import {ApartmentUnitRecommendation} from "@/src/types";
import {useAuth, useUser} from "@clerk/clerk-expo";
import ApartmentItem from '@/src/components/ApartmentItem';
import {useFilter} from "@/src/components/FilterContext";
import {useFocusEffect} from "expo-router";


interface MapPageProps {}

const MapPage = ({}: MapPageProps) => {

  const { user } = useUser();
  const [userLocation, setUserLocation] = useState<any>(null)
  const [initialRegion, setinitialRegion] = useState<any>();
  const [token, setToken] = useState<string | null>(null);
  const [apartmentData, setApartmentData] = useState<ApartmentUnitRecommendation[]>([]);
  const {filterOption} = useFilter();
  const { getToken } = useAuth();

  const GOOGLE_API_KEY : any = process.env.EXPO_PUBLIC_GOOGLE_API_MAP;

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
      const maxScore = data[0].score;
      let transformedApartments = data.map((apartment: ApartmentUnitRecommendation) => ({
        ...apartment,
        match: Number((apartment.score / maxScore) * 100).toFixed(0).toString(),
      }));
      if (filterOption === 'Currently Available') {
        transformedApartments = transformedApartments.filter(apartment => apartment.hasKnownAvailabilities);
      }
      setApartmentData(transformedApartments)

      // if (Array.isArray(transformedApartments)) { // Check if data is an array
      //   transformedApartments.forEach((item, index) => {
      //     console.log(`Item ${index}:`, item['apt_latitude'], item['apt_longitude']);
      //   });
      // } else {
      //   console.log(transformedApartments); // If not an array, log the whole response
      // }


    } catch (error) {
      console.error('There was an error fetching the user preferences:', error);
    }
  };

  useFocusEffect(
    useCallback(() => {
      if (user) {
        fetchUserPreferences();
      }
    }, [user, filterOption])
  );

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

  const [selectedAptCoords, setSelectedAptCoords] = useState([])
  const [coordinates] = useState([
    // main a&m coords
    {
      latitude:30.6187,
      longitude:-96.3365,
    },

    // Zachry building
    {
      latitude:30.621235399503348,
      longitude:-96.34037796577928,
    },

    // business building
    {
      latitude:30.610724837768895,
      longitude:-96.35093745247472,
    },
  ]);
  const [routesInfo, setRoutesInfo] = useState([
    { destination: coordinates[0], duration: null }, // A&M coords
    { destination: coordinates[1], duration: null }, // Zachry building
    { destination: coordinates[2], duration: null }  // Business building
  ]);

  const [showModal, setShowModal] = useState(false);
  const [selectedApartmentData, setSelectedApartmentData] = useState<ApartmentUnitRecommendation[]>([]);
  const [routeDuration, setRouteDuration] = useState(null);
  // display a new page with apartment unit at that marker
  const handleMarkerPress = (aptPropertyID : any) => {
    const aptUnits : any = [];
    apartmentData.forEach((item, index) => {
      if (item.propertyId === aptPropertyID) {
        aptUnits.push(item);
      }
    });
    setSelectedApartmentData(aptUnits);
    setShowModal(true);
  }

  // highlight the route to one of the coords on campus
  const handleRouteToCampus = (aptPropertyID : any) => {
    let selectedCoords: any = null;
    apartmentData.forEach(item => {
      if (item.propertyId === aptPropertyID && !selectedCoords) {
        selectedCoords = { latitude: item.apt_latitude, longitude: item.apt_longitude };
      }
    });

    if (selectedCoords) {
      const updatedRoutes = routesInfo.map(route => ({
        ...route,
        origin: selectedCoords,
        duration: null // Reset duration when new route is calculated
      }));
      setRoutesInfo(updatedRoutes);
    }
  }

  return (
    <View className="flex flex-row justify-center items-center h-full">
      {initialRegion && (
        <MapView
          style={styles.map}
          initialRegion={initialRegion}
          provider={PROVIDER_GOOGLE}
        >

          {routesInfo.map((route, index) => (
            route.origin && (
              <MapViewDirections
                key={index}
                origin={route.origin}
                destination={route.destination}
                apikey={GOOGLE_API_KEY}
                strokeWidth={4}
                strokeColor={['#FF6347', '#4682B4', '#32CD32'][index % 3]} // Use different colors for each route
                onReady={(result) => {
                  const newRoutesInfo = [...routesInfo];
                  newRoutesInfo[index].duration = result.duration;
                  setRoutesInfo(newRoutesInfo);
                }}
              />
            )
          ))}


          {userLocation && (
            <Marker
              coordinate={{
                latitude: userLocation.latitude,
                longitude: userLocation.longitude,
              }}
              title="Your Location"
            />
          )}

          {coordinates.map((coord, index) => (
            <Marker key={index} coordinate={coord}>
              <Callout tooltip style={styles.callout}>
                <View style={styles.calloutView}>
                  <Text>{['Texas A&M University', 'Zachery Engineering Building', 'Mays Business School'][index]}</Text>
                  {routesInfo[index].duration && <Text>Estimated travel time: {Math.round(routesInfo[index].duration)} minutes</Text>}
                </View>
              </Callout>
            </Marker>
          ))}

          {apartmentData.map((apartmentUnit, index) => (
            <Marker
              key={`${apartmentUnit.propertyId}-${apartmentUnit.key}-${index}`}
              coordinate={{ latitude: apartmentUnit.apt_latitude, longitude: apartmentUnit.apt_longitude }}
              title={apartmentUnit.name}
              onPress={ () => handleRouteToCampus(apartmentUnit.propertyId) }
            >
              <Callout
                tooltip
                style={styles.callout}
                onPress={ () => handleMarkerPress(apartmentUnit.propertyId) }
              >
                <View style={styles.calloutView}>
                  <Text>{apartmentUnit.name}</Text>
                  <Text>{apartmentUnit.address}</Text>
                  <Text>{`Matched: ${apartmentUnit.match}`}</Text>
                  {/*<Text>{`Rent: $${apartmentUnit.rent}.00`}</Text>*/}
                  <Text>{`User Rating: ${apartmentUnit.rating}/5`}</Text>
                  <Text>Tap for more details</Text>
                </View>
              </Callout>
            </Marker>
          ))}


        </MapView>
      )}

      <Modal
        animationType="slide"
        presentationStyle={'pageSheet'}
        visible={showModal}
        onRequestClose={() => setShowModal(!showModal)}
      >
        <View style={styles.modalView}>
          {/*<TouchableOpacity style={styles.closeButton} onPress={() => setShowModal(false)}>*/}
          {/*  <Text style={styles.closeButtonText}>Close</Text>*/}
          {/*</TouchableOpacity>*/}
          <FlatList
            data={selectedApartmentData}
            keyExtractor={( item, index ) => `${item.propertyId}-${item.key}-${index}`}
            renderItem={({ item }) => (
              <ApartmentItem apartment={item} token={token} isSkeletonLoading={false} showScore={true} />
            )}
          />
        </View>
      </Modal>
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
  modalView: {
    flex: 1,
    // marginTop: 100,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 15,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  closeButton: {
    backgroundColor: '#2196F3',
    padding: 10,
    borderRadius: 10,
    marginTop: 20,
    marginBottom: 20,
    marginRight: 300,
  },
  closeButtonText: {
    color: 'white',
    fontSize: 16,
  },
  callout: {
    position: 'absolute',
    minWidth: 250,
    zIndex: 5,
  },
  calloutView: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 6,
    backgroundColor: 'white',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 5,
    borderWidth: 2,
    borderColor: '#000000'
  },
  calloutTitle: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  calloutDescription: {
    fontSize: 14,
  },
  calloutPrice: {
    fontSize: 14,
    color: 'red',
  },
});
export default MapPage;