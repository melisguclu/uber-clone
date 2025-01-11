import React, { useState } from 'react';
import { Text, ScrollView, Image} from  'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {icons, images} from "@/constants"
import InputField from "@/components/inputField"
import CustomButton from '@/components/customButton';
import { Link } from 'expo-router';
import OAuth from '@/components/OAuth';
import { View } from 'react-native';

const SignUp = () => {
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
  })

  const onSignUpPress = async () => {}

  return(
    <ScrollView className='flex-1 bg-white'>
      <View className='flex-1 bg-white'>
        <View>
          <Image source={images.signUpCar} className='z-0 h-[250px] w-full' />
          <Text className='text-2xl text-black font-JakartaSemiBold absolute bottom-5 left-5'>Sign Up</Text>

        </View>
        <View className='p-5'>
          <InputField label='Name' placeholder='Enter your  name' icon={icons.person} value={form.name} onChangeText ={()=> setForm({...form, name: value})} />
          <InputField label='Email' placeholder='Enter your email' icon={icons.email} value={form.email} onChangeText ={()=> setForm({...form, name: value})} />
          <InputField label='Password' placeholder='Enter your password' secureTextEntry={true} icon={icons.person} value={form.name} onChangeText ={()=> setForm({...form, name: value})} />
          <CustomButton title='Sign Up' onPress={()=> {onSignUpPress}} className="mt-6" />
          <OAuth/>
          <Link
            href="/sign-in"
            className="text-lg text-center text-general-200 mt-10"
          >
            Already have an account?{" "}
            <Text className="text-primary-500">Log In</Text>
          </Link>
          {/*verification modal*/}

        </View>
      </View>
   
    </ScrollView>

  )

}

export default SignUp;