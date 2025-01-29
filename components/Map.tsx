import MapView, { PROVIDER_DEFAULT, Marker } from 'react-native-maps';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Text, View } from 'react-native';
import { useDriverStore, useLocationStore } from '@/store';
import {
  calculateDriverTimes,
  calculateRegion,
  generateMarkersFromData,
} from '@/lib/map';
import { MarkerData } from '@/types/type';
import { icons } from '@/constants';
import { useFetch } from '@/lib/fetch';
import MapViewDirections from 'react-native-maps-directions';

const Map = () => {
  const { data: drivers, loading, error } = useFetch<Driver[]>('/(api)/driver');
  const {
    userLongitude,
    userLatitude,
    destinationLongitude,
    destinationLatitude,
  } = useLocationStore();

  const region = calculateRegion({
    userLongitude,
    userLatitude,
    destinationLatitude,
    destinationLongitude,
  });

  const { selectedDriver, setDrivers } = useDriverStore();
  const [markers, setMarkers] = useState<MarkerData[]>([]);

  useEffect(() => {
    if (
      drivers &&
      Array.isArray(drivers) &&
      userLatitude !== null &&
      userLongitude !== null
    ) {
      try {
        const newMarkers = generateMarkersFromData({
          data: drivers,
          userLatitude,
          userLongitude,
        });
        setMarkers(newMarkers);
      } catch (error) {
        console.error('Error generating markers:', error);
      }
    } else {
      console.log('User location not available or drivers data invalid');
    }
  }, [drivers, userLatitude, userLongitude]);

  useEffect(() => {
    if (
      markers.length > 0 &&
      destinationLatitude !== undefined &&
      destinationLongitude !== undefined
    ) {
      calculateDriverTimes({
        markers,
        userLatitude,
        userLongitude,
        destinationLatitude,
        destinationLongitude,
      }).then((updatedDrivers) => {
        console.log('Updated Drivers with Time and Price:', updatedDrivers);
        if (updatedDrivers) {
          try {
            setDrivers(updatedDrivers);
            console.log('setDrivers called successfully.');
            console.log(
              'Drivers after setDrivers:',
              useDriverStore.getState().drivers,
            );
          } catch (error) {
            console.error('Error after setDrivers:', error);
          }
        } else {
          console.log('No updatedDrivers provided to setDrivers.');
        }
      });
    }
  }, [markers, destinationLatitude, destinationLongitude]);

  if (loading || !userLatitude || !userLongitude) {
    return (
      <View className="flex justify-center items-center w-full">
        <ActivityIndicator size="small" color="#0000" />
      </View>
    );
  }

  if (loading || !userLatitude || !userLongitude) {
    return (
      <View className="flex justify-center items-center w-full">
        <Text>Error: {error} </Text>
      </View>
    );
  }

  return (
    <MapView
      style={{ flex: 1, height: 300, width: '100%' }}
      provider={PROVIDER_DEFAULT}
      className="w-full h-full rounded-2xl"
      tintColor="black"
      mapType="mutedStandard"
      showsPointsOfInterest={false}
      initialRegion={region}
      showsUserLocation={true}
      userInterfaceStyle="light"
    >
      {markers.map((marker, index) => (
        <Marker
          key={marker.id}
          coordinate={{
            latitude: marker.latitude,
            longitude: marker.longitude,
          }}
          title={marker.title}
          image={
            selectedDriver === marker.id ? icons.selectedMarker : icons.marker
          }
        />
      ))}

      {destinationLatitude && destinationLongitude && (
        <>
          <Marker
            key="destination"
            coordinate={{
              latitude: destinationLatitude,
              longitude: destinationLongitude,
            }}
            title="Destination"
            image={icons.pin}
          />
          <MapViewDirections
            origin={{
              latitude: userLatitude!,
              longitude: userLongitude!,
            }}
            destination={{
              latitude: destinationLatitude,
              longitude: destinationLongitude,
            }}
            apikey={process.env.EXPO_PUBLIC_GOOGLE_API_KEY}
            strokeColor="#0286FF"
            strokeWidth={2}
            onError={(errorMessage) => {
              console.error('Directions error:', errorMessage);
            }}
          />
        </>
      )}
    </MapView>
  );
};

export default Map;
