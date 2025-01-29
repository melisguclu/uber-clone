import React from 'react';
import { Text, View, Image, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Swiper from 'react-native-swiper';
import { useState } from 'react';
import { onboarding } from '@/constants';
import { router } from 'expo-router';
import CustomButton from '@/components/customButton';
import { useRef } from 'react';

const Onboarding = () => {
  const swiperRef = useRef<Swiper>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const isLastSlide = activeIndex === onboarding.length - 1;

  return (
    <SafeAreaView
      edges={['bottom']}
      className="flex h-full items-center justify-between bg-white"
    >
      <TouchableOpacity
        onPress={() => {
          router.replace('/(root)/(auth)/sign-up');
        }}
        className="w-full flex justify-end items-end p-5"
      >
        <Text className="text-black text-md font-JakartaBold">Skip</Text>
      </TouchableOpacity>

      <Swiper
        ref={swiperRef}
        loop={false}
        dot={
          <View className="w-[32px] h-[4px] mx-1 bg-[#E2E8F0] rounded-full" />
        }
        activeDot={
          <View className="w-[32px] h-[4px] mx-1 bg-[black] rounded-full" />
        }
        onIndexChanged={(index) => setActiveIndex(index)}
      >
        {onboarding.map((item) => (
          <View key={item.id} className="flex p-5 items-center justify-center">
            <Image
              source={item.image}
              className="w-full h-[300px]"
              resizeMode="contain"
            />
            <View className="flex flex-row items-center justify-center w-full mt-10">
              <Text className="text-black text-3xl font-bold mx-10 text-center">
                {item.title}
              </Text>
            </View>
            <Text className="text-md font-JakartaSemiBold mx-10 mt-3 text-center text-[#858585]">
              {item.description}
            </Text>
          </View>
        ))}
      </Swiper>

      <CustomButton
        title={isLastSlide ? 'Get Started' : 'Next'}
        onPress={() =>
          isLastSlide
            ? router.replace('/(root)/(auth)/sign-up')
            : swiperRef.current?.scrollBy(1)
        }
        className="w-3/4 mt-10 shadow-none"
      />
    </SafeAreaView>
  );
};

export default Onboarding;
