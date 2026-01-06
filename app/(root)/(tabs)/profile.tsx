import icons from '@/constants/icons';
import { logout } from '@/lib/appwrite';
import { useGlobalContext } from '@/lib/global-provider';
import { useRouter } from 'expo-router';
import React from 'react';
import { Alert, Image, SafeAreaView, ScrollView, Text, TouchableOpacity, View } from 'react-native';

const Profile = () => {
  const { user, refetch } = useGlobalContext();
  const router = useRouter();
  const handleLogout = async () => {
    const result = await logout();
    if (result) {
      Alert.alert("Success", "You have been logged out");
      refetch(); // Auth Guard in (root)/_layout.tsx will now redirect to sign-in
      router.replace('/');
    } else {
      Alert.alert("Error", "An error occurred while logging out");
    }
  };

  return (
    <SafeAreaView className="h-full bg-white">
      <ScrollView showsVerticalScrollIndicator={false} contentContainerClassName="pb-32 px-7">
        <View className="flex flex-row items-center justify-between mt-5">
          <Text className="text-xl font-rubikBold">Profile</Text>
          <Image source={icons.bell} className="w-5 h-5" />
        </View>

        <View className="flex-row justify-center flex mt-5">
          <View className="flex flex-col items-center relative mt-5">
            <Image
              source={{ uri: user?.avatar }}
              className="size-44 relative rounded-full"
            />
            <TouchableOpacity className="absolute bottom-11 right-2">
              <Image source={icons.edit} className="size-9" />
            </TouchableOpacity>
            <Text className="text-2xl font-rubikBold mt-2">{user?.name}</Text>
          </View>
        </View>

        <View className="flex flex-col mt-10">
            <TouchableOpacity 
              onPress={handleLogout}
              className="flex flex-row items-center justify-center w-full py-4 mt-5 bg-red-50 rounded-xl"
            >
              <Text className="text-lg font-rubikMedium text-red-500">Logout</Text>
            </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Profile;