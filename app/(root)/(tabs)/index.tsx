import { Card, FeaturedCard } from "@/components/Cards";
import Filters from "@/components/Filters";
import Search from "@/components/Search";
import icons from "@/constants/icons";
import { useGlobalContext } from "@/lib/global-provider";
import seed from "@/lib/seed";
import { FlatList, Image, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

// ScrollView (for scrollable areas)
// FlatList (for lists of items)

export default function Index() {
  const { isLoggedIn, loading } = useGlobalContext();
  const { user } = useGlobalContext();
  // OPTIONAL: If you want logged-in users to skip this page and go straight to Profile
  // if (!loading && isLoggedIn) return <Redirect href="/profile" />;

  return (
    <SafeAreaView className="bg-white h-full">
      <FlatList 
        data={[1, 2]}
        renderItem={({ item }) => 
          <Card />
        }
        keyExtractor={(item) => item.toString()}
        numColumns={2}
        contentContainerClassName="pb-32"
        columnWrapperClassName="flex gap-5 px-5"
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={

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

            <FlatList 
              data={[4, 5, 6]}
              renderItem={({ item }) => 
                <FeaturedCard />
              }
              keyExtractor={(item) => item.toString()}
              horizontal
              bounces={false}
              showsHorizontalScrollIndicator={false}
              contentContainerClassName="flex gap-5 mt-5"
              // numColumns={2}
              // columnWrapperClassName="flex gap-5"
            />
          </View>
          

          <View className="flex flex-row items-center justify-between">
              <Text className="text-xl text-black-300 font-rubikBold">Our Recommendations</Text>
              <TouchableOpacity>
                <Text className="text-base text-primary-300 font-rubikBold">See All</Text>
              </TouchableOpacity>
          </View>

          <Filters />

        </View>
        }
      />

    </SafeAreaView>
  );
}