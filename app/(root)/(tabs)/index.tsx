import { Card, FeaturedCard } from "@/components/Cards";
import Filters from "@/components/Filters";
import NoResults from "@/components/NoResults";
import Search from "@/components/Search";
import icons from "@/constants/icons";
import { getLatestProperties, getProperties } from "@/lib/appwrite";
import { useGlobalContext } from "@/lib/global-provider";
import { PropertyDocument } from "@/lib/types";
import { useAppwrite } from "@/lib/useAppwrite";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect } from "react";
import { ActivityIndicator, FlatList, Image, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

// ScrollView (for scrollable areas)
// FlatList (for lists of items)

export default function Index() {
  const { isLoggedIn, loading: globalLoading } = useGlobalContext();
  const params = useLocalSearchParams<{query?: string; filter?: string;}>();

  const { 
    data: latestProperties, 
    loading: latestPropertiesLoading
  } = useAppwrite<PropertyDocument[], Record<string, string | number>>({fn: getLatestProperties})

  const {
    data: properties, 
    loading,
    refetch
  } = useAppwrite<PropertyDocument[], {filter: string; query: string; limit: number}>({fn: getProperties,
    params: {
      filter: params.filter!,
      query: params.query!,
      limit: 6
    },
    skip: true,
  })
  
  const handleCardPress = (id: string) => router.push(`/properties/${id}`)

  useEffect(()=>{
    refetch({
      filter: params.filter!,
      query: params.query!,
      limit: 6
    });
  }, [params.filter, params.query])

  const { user } = useGlobalContext();
  // OPTIONAL: If you want logged-in users to skip this page and go straight to Profile
  // if (!loading && isLoggedIn) return <Redirect href="/profile" />;

  return (
    <SafeAreaView className="bg-white h-full">
      <FlatList 
        data={properties}
        renderItem={({ item }) => 
          <Card item={item} onPress={() => handleCardPress(item.$id)} key={item.$id} />
        }
        keyExtractor={(item) => item.toString()}
        numColumns={2}
        contentContainerClassName="pb-32"
        columnWrapperClassName="flex gap-5 px-5"
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          loading ? (
            <ActivityIndicator size="large" className="text-primary-300 mt-5" />
          ) : 
            <NoResults />
        }
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
            {latestPropertiesLoading ? 
              <ActivityIndicator size="large" className="text-primary-300" /> : 
              !latestProperties || latestProperties.length === 0 ? <NoResults /> : (
              <FlatList 
              data={latestProperties|| []}
              renderItem={({ item }) => 
                <FeaturedCard item={item} onPress={() => handleCardPress(item.$id)} />
            }
            keyExtractor={(item) => item.$id}
            horizontal
            bounces={false}
            showsHorizontalScrollIndicator={false}
            contentContainerClassName="flex gap-5 mt-5"
            // numColumns={2}
            // columnWrapperClassName="flex gap-5"
            />
          )}
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