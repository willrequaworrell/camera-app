import { Redirect } from 'expo-router'
import React from 'react'
import { Text, View } from 'react-native'
import { useCameraDevice, useCameraPermission } from 'react-native-vision-camera'

const HomeScreen = () => {
  const {hasPermission} = useCameraPermission()
  if (!hasPermission) {
    return <Redirect href={"/permissions"}/>
  }

  const camera = useCameraDevice("front")
  return (
    <View className="flex-1 items-center justify-center bg-white">
      <Text className="text-xl font-bold text-blue-500">
        Hello World
      </Text>
    </View>
  )
}

export default HomeScreen
