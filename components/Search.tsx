import icons from '@/constants/icons';
import { useLocalSearchParams, usePathname, useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Image, TextInput, TouchableOpacity, View } from 'react-native';
import { useDebouncedCallback } from 'use-debounce';

const Search = () => {
    const path = usePathname();
    const params = useLocalSearchParams<{query?: string}>();
    const [search, setSearch] = useState(params.query);
    const router = useRouter();
    const debouncedSearch = useDebouncedCallback((text: string) =>
        router.setParams({query: text}), 500
    );

    const handleSearch = (text: string) => {
        setSearch(text);
        debouncedSearch(text);
    }

  return (
    <View className='flex flex-row items-center justify-between w-full px-4 rounded-lg border border-primary-100 bg-accent-100 mt-5 py-2'>
      <View className='flex-1 flex-row items-center justify-start z-50 bg-gray-100 rounded-lg px-2 h-10'>
        <Image 
          source={icons.search} 
          className='size-5 ml-1' 
          resizeMode="contain" 
        />
        <TextInput 
          placeholder='Search for anything'
          value={search}
          onChangeText={handleSearch}
          cursorColor={'#000'} // Optional: matches your theme
          className='ml-2 text-sm text-black-300 font-rubik flex-1 py-0'
          style={{ includeFontPadding: false, textAlignVertical: 'center' }}
        />
     </View>

      <TouchableOpacity className='mr-1'>
        <Image source={icons.filter} className='size-5 ml-1' resizeMode="contain" />
     </TouchableOpacity>
    </View>
  )
}

export default Search