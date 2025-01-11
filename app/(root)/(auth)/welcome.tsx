import React from 'react';
import { Text, Touchable, TouchableOpacity} from  'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Swiper from 'react-native-swiper';

const Onboarding = () => {

  const swiperRef = React.useRef(null);


  return(
    <SafeAreaView className='flex h-full items-center justify-between bg-white'>
      <TouchableOpacity
        onPress={() => {
          console.log('Skip');
        }
      }
      className= 'w-full flex justify-end items-end p-5'>
        <Text className='text-black text-md font-JakartaBold'>Skip</Text>
      </TouchableOpacity>

      <Swiper
        ref={swiperRef}
        loop={false}
        showsPagination={false}
        showsButtons={false}
        index={0}
        onIndexChanged={(index) => {
          console.log('Index:', index);
        }}
      >
        <Text className='text-black text-2xl font-JakartaBold'>Welcome to the App</Text>
        <Text className='text-black text-2xl font-JakartaBold'>Welcome to the App</Text>
        <Text className='text-black text-2xl font-JakartaBold'>Welcome to the App</Text>
      </Swiper>

    </SafeAreaView>

  )
}

export default Onboarding;