import { Card, FeaturedCard } from "@/components/Cards";
import Filters from "@/components/Filters";
import Search from "@/components/Search";
import icons from "@/constants/icons";
import { useGlobalContext } from "@/lib/global-provider";
import { Image, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Index() {
  const { isLoggedIn, loading } = useGlobalContext();
  const { user } = useGlobalContext();
  // OPTIONAL: If you want logged-in users to skip this page and go straight to Profile
  // if (!loading && isLoggedIn) return <Redirect href="/profile" />;

  return (
    <SafeAreaView className="bg-white h-full">
      <View className="px-5">
        <View className="flex flex-row items-center justify-between mt-5">
          <View className="flex flex-row items-center">
            <Image 
              source={{ uri: user?.avatar || "" }}
              className="size-12 rounded-full" 
            />
            <View className="flex flex-col items-start ml-2 justify-center">
              <Text className="text-black-300 font-rubikMedium">
                Hello, {user?.name.split(" ")[0] || "Guest"} 👋
              </Text>
            </View>
          </View>
          <Image source={icons.bell} className="size-6" />
        </View>

        <Search />

        <View className="my-2">
          <View className="flex flex-row items-center justify-between">
            <Text className="text-xl text-black-300 font-rubikBold">Featured</Text>
            <TouchableOpacity>
              <Text className="text-base text-primary-300 font-rubikBold">See All</Text>
            </TouchableOpacity>
          </View>
          
          <View className="flex flex-row gap-5 mt-3">
            <FeaturedCard />
            <FeaturedCard />
          </View>

        </View>
        

        <View className="flex flex-row items-center justify-between">
            <Text className="text-xl text-black-300 font-rubikBold">Our Recommendations</Text>
            <TouchableOpacity>
              <Text className="text-base text-primary-300 font-rubikBold">See All</Text>
            </TouchableOpacity>
        </View>

        <Filters />

        <View className="flex flex-row gap-5 mt-1">
          <Card />
          <Card />
        </View>

      </View>

    </SafeAreaView>
  );
}