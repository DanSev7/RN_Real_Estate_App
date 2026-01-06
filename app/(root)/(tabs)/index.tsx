import { Link, Redirect } from "expo-router";
import { Text, View } from "react-native";
import { useGlobalContext } from "@/lib/global-provider";

export default function Index() {
  const { isLoggedIn, loading } = useGlobalContext();

  // OPTIONAL: If you want logged-in users to skip this page and go straight to Profile
  // if (!loading && isLoggedIn) return <Redirect href="/profile" />;

  return (
    <View className="flex-1 justify-center items-center bg-white p-4">
      <Text className="text-3xl font-rubikBold my-10 text-black-300">Welcome to ReState</Text>
      
      {!isLoggedIn ? (
        <Link className="text-primary-300 font-rubikMedium text-lg mb-4" href="/sign-in">
          Login to get started
        </Link>
      ) : (
        <Text className="text-green-500 font-rubikMedium mb-4">You are logged in!</Text>
      )}

      <View className="gap-y-4">
        <Link className="text-blue-500 font-rubik" href="/explore">Go to explore page</Link>
        <Link className="text-blue-500 font-rubik" href="/profile">Go to profile page</Link>
        <Link className="text-blue-500 font-rubik" href="/properties/1">Go to property page</Link> 
      </View>
    </View>
  );
}