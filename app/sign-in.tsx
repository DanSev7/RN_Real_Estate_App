import icons from '@/constants/icons'
import images from '@/constants/images'
import { login } from '@/lib/appwrite'
import { useGlobalContext } from '@/lib/global-provider'
import { Redirect, useRouter } from 'expo-router'
import React from 'react'
import { Alert, Image, ScrollView, Text, TouchableOpacity, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

const SignIn = () => {
  const router = useRouter();
  const { refetch, loading, isLoggedIn } = useGlobalContext();

  if (!loading && isLoggedIn) return <Redirect href="/" />;

  const handleLogin = async () => {
    const result = await login();

    if (result) {
      refetch();
      // After login, send them to the main Index page
      // router.replace('/');
    } else {
      Alert.alert('Error', 'Login failed. Please try again.');
    }
  };

  return (
    <SafeAreaView className='bg-white h-full'>
      <ScrollView contentContainerClassName='h-full'>
        <Image 
          source={images.onboarding}
          className='w-full h-4/6'
          resizeMode='contain'
        />
        <View className='px-10'>
          <Text className='text-base font-rubik text-center uppercase text-black-200'>Welcome to ReState</Text>
          <Text className='text-3xl font-rubikBold text-center text-black-300 mt-2'> 
            Let's Get You Closer to {"\n"}
            <Text className='text-primary-300'>Your Ideal Home</Text>
          </Text>
          <Text className='text-lg font-rubik text-black-200 text-center mt-12'>Login to ReState with Google</Text>

          <TouchableOpacity
            onPress={handleLogin}
            className='bg-white shadow-md shadow-zinc-300 rounded-full w-full py-4 mt-5'
          >
            <View className='flex flex-row items-center justify-center'>
              <Image source={icons.google} className='w-5 h-5' resizeMode='contain' />
              <Text className='text-lg font-rubikMedium text-black-300 ml-2'>Continue with Google</Text>
            </View>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

export default SignIn;