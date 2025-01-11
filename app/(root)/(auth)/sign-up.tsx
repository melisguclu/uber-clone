import React, { useState } from 'react';
import { Text, ScrollView, Image, Alert} from  'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {icons, images} from "@/constants"
import InputField from "@/components/inputField"
import CustomButton from '@/components/customButton';
import { Link, router } from 'expo-router';
import OAuth from '@/components/OAuth';
import { View } from 'react-native';
import { ReactNativeModal } from "react-native-modal";
import { useSignUp } from '@clerk/clerk-expo'

const SignUp = () => {
  const { isLoaded, signUp, setActive } = useSignUp()
  const [showSuccessModal, setShowSuccessModal] = useState(false)
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
  })

  const [verification, setVerification] = useState({
    state: 'default',
    code: '',
    error: '',
  })
  const onSignUpPress = async () => {
    if (!isLoaded) return;
    try {
      await signUp.create({
        emailAddress: form.email,
        password: form.password,
      });
      await signUp.prepareEmailAddressVerification({ strategy: "email_code" });
      setVerification({
        ...verification,
        state: "pending",
      });
    } catch (err: any) {
      // See https://clerk.com/docs/custom-flows/error-handling
      // for more info on error handling
      console.log(JSON.stringify(err, null, 2));
      Alert.alert("Error", err.errors[0].longMessage);
    }
  };

  // Handle submission of verification form
  const onVerifyPress = async () => {
    if (!isLoaded) return

    try {
      // Use the code the user provided to attempt verification
      const signUpAttempt = await signUp.attemptEmailAddressVerification({
        code:verification.code,
      })

      if (signUpAttempt.status === 'complete') {
        //TODO: create a database user
        await setActive({ session: signUpAttempt.createdSessionId })
        setVerification({...verification, error:'Verification Failed', state: 'success'})
        // router.replace('/')
      } else {
        setVerification({...verification, state: 'error'})
        console.error(JSON.stringify(signUpAttempt, null, 2))
      }
    } catch (err) {
      console.error(JSON.stringify(err, null, 2))
      setVerification({...verification, error: 'Verification Failed!!!!!',  state: 'failed'})
    }
  }

  // if (pendingVerification) {
  //   return (
  //     <>
  //       <Text>Verify your email</Text>
  //       <TextInput
  //         value={code}
  //         placeholder="Enter your verification code"
  //         onChangeText={(code)=> setCode(code)}
  //       />
  //       <Button title="Verify" onPress={onVerifyPress} />
  //     </>
  //   )
  // }

  return(
    <ScrollView className='flex-1 bg-white'>
      <View className='flex-1 bg-white'>
        <View>
          <Image source={images.signUpCar} className='z-0 h-[250px] w-full' />
          <Text className='text-2xl text-black font-JakartaSemiBold absolute bottom-5 left-5'>Sign Up</Text>

        </View>
        <View className='p-5'>
          <InputField label='Name' placeholder='Enter your  name' icon={icons.person} value={form.name} onChangeText ={(value)=> setForm({...form, name: value})} />
          <InputField label='Email' placeholder='Enter your email' icon={icons.email} value={form.email} onChangeText={(value) => setForm({ ...form, email: value.trim() })} />
          <InputField label='Password' placeholder='Enter your password' secureTextEntry={true} icon={icons.person} value={form.password} onChangeText ={(value)=> setForm({...form, password: value})} />
          <CustomButton title='Sign Up' onPress={onSignUpPress} className="mt-6" />
          <OAuth/>
          <Link href="/sign-in" className="text-lg text-center text-general-200 mt-10">
            Already have an account?{" "}
            <Text className="text-primary-500">Log In</Text>
          </Link>
          {/*verification modal*/}
          <ReactNativeModal isVisible={verification.state === 'pending'} onModalHide={() => {
            if(verification.state === 'success') {
              setShowSuccessModal(true) 
            }
          }}>
            <View className='bg-white px-7 py-9 rounded-2xl min-h-[300px]'>
              <Text className='mb-3 text-2xl font-JakartaBold'>Verification</Text>
              <Text className='mb-5 text-gray-400 font-Jakarta'>We've sent a verification form to {form.email} </Text>
              <InputField label='Code' placeholder='12345' value={verification.code} icon={icons.lock} keyboardType='numeric' onChangeText={(code) => setVerification({...verification, code})} />

              <CustomButton title="Verify Email"  onPress={onVerifyPress} className="mt-5 bg-success-500 shadow-none"  />
              {verification.error && <Text className='text-red-500 text-center'>{verification.error}</Text>}

            </View>


          </ReactNativeModal>



          <ReactNativeModal isVisible={showSuccessModal}>
            <View className='bg-white px-7 py-9 rounded-2xl min-h-[300px]'>
              <Image source={images.check} className='w-[110px] h-[110px] mx-auto my-5' />
              <Text className='text-3xl text-center font-JakartaBold'>Verified</Text>
              <Text className='text-base text-gray-400 text-center font-Jakarta mt-2'>You have successfully verified your account.</Text>
              <CustomButton title="Browse Home"  onPress={() => {router.push(`/(root)/(tabs)/home`); setShowSuccessModal(false)}} className="mt-6 shadow-none"  />
            </View>
          </ReactNativeModal>
        </View>
      </View>
   
    </ScrollView>
  )
}

export default SignUp;