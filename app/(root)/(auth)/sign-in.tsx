import React, { useState } from 'react';
import { Text, ScrollView, Image} from  'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {icons, images} from "@/constants"
import InputField from "@/components/inputField"
import CustomButton from '@/components/customButton';
import { Link } from 'expo-router';
import OAuth from '@/components/OAuth';
import { View } from 'react-native';

const SignIn = () => {
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
  })

  const onSignInPress = async () => {}

  return(
    <ScrollView className='flex-1 bg-white'>
      <View className='flex-1 bg-white'>
        <View>
          <Image source={images.signUpCar} className='z-0 h-[250px] w-full' />
          <Text className='text-2xl text-black font-JakartaSemiBold absolute bottom-5 left-5'>Sign In</Text>

        </View>
        <View className='p-5'>
          <InputField label='email' placeholder='Enter your email' icon={icons.email} value={form.email} onChangeText ={()=> setForm({...form, name: value})} />
          <InputField label='password' placeholder='Enter your password' secureTextEntry={true} icon={icons.person} value={form.name} onChangeText ={()=> setForm({...form, name: value})} />
          <CustomButton title='Sign In' onPress={()=> {onSignInPress}} className="mt-6" />
          <OAuth/>
          <Link
            href="/sign-up"
            className="text-lg text-center text-general-200 mt-10"
          >
            Don't have an account?{" "}
            <Text className="text-primary-500">Sign Up</Text>
          </Link>
          {/*verification modal*/}

        </View>
      </View>
   
    </ScrollView>

  )

}

export default SignIn;