import { Redirect } from 'expo-router';
import React from 'react';
import { Text } from  'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const Home = () => {
  return(
    <Redirect href="/(root)/(auth)/welcome" />

  )

}

export default Home;