import React, { useState , useCallback} from 'react';
import { Text, ScrollView, Image} from  'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { View } from 'react-native';
import {icons, images} from "@/constants"
import InputField from "@/components/inputField"
import CustomButton from '@/components/customButton';
import { Link, useRouter } from 'expo-router'
import OAuth from '@/components/OAuth';
import { useSignIn } from '@clerk/clerk-expo'


const SignIn = () => {
  const { signIn, setActive, isLoaded } = useSignIn()
  const router = useRouter()

  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
  })

  // Handle the submission of the sign-in form
  const onSignInPress = useCallback(async () => {
    if (!isLoaded) return

    // Start the sign-in process using the email and password provided
    try {
      const signInAttempt = await signIn.create({
        identifier: form.email,
        password: form.password,
      })

      // If sign-in process is complete, set the created session as active
      // and redirect the user
      if (signInAttempt.status === 'complete') {
        await setActive({ session: signInAttempt.createdSessionId })
        router.replace('/')
      } else {
        // If the status isn't complete, check why. User might need to
        // complete further steps.
        console.error(JSON.stringify(signInAttempt, null, 2))
      }
    } catch (err) {
      // See https://clerk.com/docs/custom-flows/error-handling
      // for more info on error handling
      console.error(JSON.stringify(err, null, 2))
    }
  }, [isLoaded, form.email, form.password])

  return(
    <ScrollView className='flex-1 bg-white'>
      <View className='flex-1 bg-white'>
        <View>
          <Image source={images.signUpCar} className='z-0 h-[250px] w-full' />
          <Text className='text-2xl text-black font-JakartaSemiBold absolute bottom-5 left-5'>Sign In</Text>

        </View>
        <View className='p-5'>
          <InputField label='email' placeholder='Enter your email' icon={icons.email} value={form.email} onChangeText ={(value)=> setForm({...form, email: value})} />
          <InputField label='password' placeholder='Enter your password' secureTextEntry={true} icon={icons.person} value={form.password} onChangeText ={(value)=> setForm({...form, password: value})} />
          <CustomButton title='Sign In' onPress={onSignInPress} className="mt-6" />
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