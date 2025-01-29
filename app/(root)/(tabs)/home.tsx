import React, { useEffect, useState } from 'react';
import * as Location from 'expo-location';
import { SignedIn, SignedOut, useUser, useAuth } from '@clerk/clerk-expo';
import { Link, router } from 'expo-router';
import {
  Text,
  View,
  FlatList,
  Image,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import RideCard from '@/components/RideCard';
import { images } from '@/constants';
import { icons } from '@/constants';
import GoogleTextInput from '@/components/GoogleTextInput';
import Map from '@/components/Map';
import { useLocationStore } from '@/store';
import { useFetch } from '@/lib/fetch';

export default function Page() {
  const { user } = useUser();
  const { setUserLocation, setDestinationLocation } = useLocationStore();
  const { data: recentRides, loading } = useFetch<Ride[]>(
    `/(api)/ride/${user?.id}`,
  );

  const [hasPermissions, setHasPermissions] = useState(false);
  useEffect(() => {
    const requestLocation = async () => {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          console.warn('Permission to access location was denied');
          setHasPermissions(false);
          return;
        }
        setHasPermissions(true);

        const location = await Location.getCurrentPositionAsync({});
        const address = await Location.reverseGeocodeAsync({
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
        });

        setUserLocation({
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
          address: `${address[0]?.name || 'Unknown'}, ${address[0]?.region || 'Unknown'}`,
        });
      } catch (error) {
        console.error('Error fetching location:', error);
      }
    };

    requestLocation();
  }, [setUserLocation]);

  useEffect(() => {
    const fetchLocation = async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status === 'granted') {
        const location = await Location.getCurrentPositionAsync({});
        console.log('Location fetched:', location);
      } else {
        console.warn('Location permission denied');
      }
    };

    fetchLocation();
  }, []);

  const handleDestinationPress = (location: {
    latitude: number;
    longitude: number;
    address: string;
  }) => {
    setDestinationLocation(location);
    router.push('/(root)/find-ride');
  };
  // const handleSignOut = () => {
  //   signOut();
  //   router.push('/(root)/sign-in');
  // };

  return (
    <SafeAreaView className="flex-1 px-5 ">
      <FlatList
        data={recentRides?.slice(0, 5)}
        renderItem={({ item }) => <RideCard ride={item} />}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{
          paddingBottom: 100,
        }}
        ListEmptyComponent={() => (
          <View className="flex flex-col items-center justify-center">
            {!loading ? (
              <>
                <Image
                  source={images.noResult}
                  className="w-40 h-40"
                  alt="No recent rides found"
                  resizeMode="contain"
                />
                <Text className="text-sm">No recent rides found</Text>
              </>
            ) : (
              <ActivityIndicator size="small" color="#000" />
            )}
          </View>
        )}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          <>
            <View className="flex flex-row items-center justify-between my-5">
              <Text className="text-2xl font-JakartaExtraBold">
                Welcome {user?.firstName}👋
              </Text>
              {/* <TouchableOpacity
                onPress={handleSignOut}
                className="justify-center items-center w-10 h-10 rounded-full bg-white"
              >
                <Image source={icons.out} className="w-4 h-4" />
              </TouchableOpacity> */}
            </View>

            <GoogleTextInput
              icon={icons.search}
              containerStyle="bg-white shadow-md shadow-neutral-300"
              handlePress={handleDestinationPress}
            />

            <>
              <Text className="text-xl font-JakartaBold mt-5 mb-3">
                Your current location
              </Text>
              <View className="flex flex-row items-center bg-transparent h-[300px]">
                <Map />
              </View>
            </>

            <Text className="text-xl font-JakartaBold mt-5 mb-3">
              Recent Rides
            </Text>
          </>
        }
      />
    </SafeAreaView>
  );
}
