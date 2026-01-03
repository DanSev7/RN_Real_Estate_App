import { View, Text } from 'react-native'
import React from 'react'
import { useLocalSearchParams } from 'expo-router'

const Property = () => {
 const { id } = useLocalSearchParams();
 console.log("ID : ", id);
  return (
    <View>
      <Text>Property {id}</Text>
    </View>
  )
}

export default Property