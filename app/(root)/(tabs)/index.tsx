import { Link } from "expo-router";
import { Text, View } from "react-native";

export default function Index() {
  return (
    <View className="flex-1 justify-center items-center bg-white p-4">
      <Text className="text-3xl font-rubikBold my-10">Welcome  to ReState</Text>
      <Link className="text-blue-500 font-rubik" href="/sign-in">Go to sign-in page</Link>
      <Link className="text-blue-500 font-rubik" href="/explore">Go to explore page</Link>
      <Link className="text-blue-500 font-rubik" href="/profile">Go to profile page</Link>
      <Link className="text-blue-500 font-rubik" href="/properties/1">Go to property page</Link> 
      
    </View>
  );
}
