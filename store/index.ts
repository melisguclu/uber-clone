import { LocationStore, DriverStore, MarkerData } from '@/types/type';
import { create } from 'zustand';
import { Driver } from '@/types/type';
import { fetchAPI } from '@/lib/fetch';

export const useLocationStore = create<LocationStore>((set) => ({
  userLatitude: null,
  userLongitude: null,
  userAddress: null,
  destinationLatitude: null,
  destinationLongitude: null,
  destinationAddress: null,
  setUserLocation: ({
    latitude,
    longitude,
    address,
  }: {
    latitude: number;
    longitude: number;
    address: string;
  }) => {
    set(() => ({
      userLatitude: latitude,
      userLongitude: longitude,
      userAddress: address,
    }));
  },

  setDestinationLocation: ({
    latitude,
    longitude,
    address,
  }: {
    latitude: number;
    longitude: number;
    address: string;
  }) => {
    set(() => ({
      destinationLatitude: latitude,
      destinationLongitude: longitude,
      destinationAddress: address,
    }));
  },
}));

interface DriverState {
  drivers: Driver[] | undefined;
  selectedDriver: string | null;
  setSelectedDriver: (id: string) => void;
  fetchDrivers: () => Promise<void>;
}

export const useDriverStore = create<DriverState>((set) => ({
  drivers: [],
  selectedDriver: null,
  setDrivers: (drivers) => set(() => ({ drivers })),
  setSelectedDriver: (id) => set({ selectedDriver: id }),
  fetchDrivers: async () => {
    try {
      const response = await fetchAPI('/(api)/driver');
      set({ drivers: response.data });
      console.log('Stored Drivers:', response.data);
    } catch (error) {
      console.error('Error fetching drivers:', error);
    }
  },
}));
