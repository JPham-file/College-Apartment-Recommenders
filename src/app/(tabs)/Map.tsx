import { FlatList, Modal, Text, StyleSheet, View, TouchableOpacity, Dimensions, Image } from 'react-native';
import { useNavigation } from "@react-navigation/native";
import * as Location from "expo-location";
import React, {useEffect, useState} from 'react'
import MapView, {Callout, Marker, PROVIDER_GOOGLE} from 'react-native-maps';
import MapViewDirections from 'react-native-maps-directions';
import {ApartmentUnitRecommendation} from "@/src/types";
import {useAuth} from "@clerk/clerk-expo";
import ApartmentItem from '@/src/components/ApartmentItem';


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
      const maxScore = data[0].score;
      let transformedApartments = data.map((apartment: ApartmentUnitRecommendation) => ({
        ...apartment,
        match: Number((apartment.score / maxScore) * 100).toFixed(0).toString(),
      }));
      setApartmentData(transformedApartments)

      if (Array.isArray(transformedApartments)) { // Check if data is an array
        transformedApartments.forEach((item, index) => {
          console.log(`Item ${index}:`, item['apt_latitude'], item['apt_longitude']);
        });
      } else {
        console.log(transformedApartments); // If not an array, log the whole response
      }


    } catch (error) {
      console.error('There was an error fetching the user preferences:', error);
    }
  };

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

  const [coordinates] = useState([
    {
      latitude: 30.61876,
      longitude: -96.35037,
    },
    {
      latitude:30.6187,
      longitude:-96.3365,
    },
  ]);

  const [showModal, setShowModal] = useState(false);
  const [selectedApartmentData, setSelectedApartmentData] = useState<ApartmentUnitRecommendation[]>([]);
  const handleMarkerPress = (aptPropertyID : any) => {
    const aptUnit : any = [];
    apartmentData.forEach((item, index) => {
      if (item.propertyId === aptPropertyID) {
        aptUnit.push(item)
      }
    });
    setSelectedApartmentData(aptUnit);
    setShowModal(true);
  }

  return (
    <View className="flex flex-row justify-center items-center h-full">
      {initialRegion && (
        <MapView
          style={styles.map}
          initialRegion={initialRegion}
          provider={PROVIDER_GOOGLE}
        >

          <MapViewDirections
            origin={coordinates[0]}
            destination={coordinates[1]}
            apikey={''} // insert your API Key here
            strokeWidth={4}
            strokeColor="#111111"
            precision={'high'}
          />


          {userLocation && (
            <Marker
              coordinate={{
                latitude: userLocation.latitude,
                longitude: userLocation.longitude,
              }}
              title="Your Location"
            />
          )}

          <Marker
            coordinate={{
              latitude:30.6187,
              longitude:-96.3365,
            }}
            title="Texas A&M University"
          />

          {apartmentData.map((apartmentUnit, index) => (
            <Marker
              key={apartmentUnit.propertyId + index}
              coordinate={{ latitude: apartmentUnit.apt_latitude, longitude: apartmentUnit.apt_longitude }}
              title={apartmentUnit.name}
            >
              <Callout tooltip style={styles.callout} onPress={ () => handleMarkerPress(apartmentUnit.propertyId) }>
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
        transparent={true}
        visible={showModal}
        onRequestClose={() => setShowModal(!showModal)}
      >
        <View style={styles.modalView}>
          <FlatList
            data={selectedApartmentData}
            keyExtractor={(item) => item.propertyId.toString()}
            renderItem={({ item }) => (
              <ApartmentItem apartment={item} token={token} isSkeletonLoading={false} showScore={true} />
            )}
          />
          <TouchableOpacity style={styles.closeButton} onPress={() => setShowModal(false)}>
            <Text style={styles.closeButtonText}>Close</Text>
          </TouchableOpacity>
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
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
    backgroundColor: 'white', // Set a background color for better visibility
    borderRadius: 20,
    padding: 20,
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