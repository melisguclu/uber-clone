import { router } from 'expo-router';
import { FlatList, View } from 'react-native';
import React, { useEffect } from 'react';

import CustomButton from '@/components/customButton';
import DriverCard from '@/components/DriverCard';
import RideLayout from '@/components/RideLayout';
import { useDriverStore } from '@/store';

const ConfirmRide = () => {
  const { drivers, selectedDriver, setSelectedDriver, fetchDrivers } =
    useDriverStore();

  useEffect(() => {
    fetchDrivers();
  }, [fetchDrivers]);
  const driverList = drivers || [];

  console.log('DRIVERLIST in ConfirmRide FlatList:', driverList);

  return (
    <RideLayout title={'Choose a Rider'} snapPoints={['65%', '85%']}>
      <FlatList
        data={drivers}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <DriverCard
            item={item}
            selected={selectedDriver}
            setSelected={() => setSelectedDriver(item.id)}
          />
        )}
        ListFooterComponent={() => (
          <View className="mx-5 mt-10">
            <CustomButton
              title="Select Ride"
              onPress={() => router.push('/(root)/book-ride')}
            />
          </View>
        )}
      />
    </RideLayout>
  );
};

export default ConfirmRide;
