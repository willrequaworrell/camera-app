import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Redirect } from 'expo-router';
import React, { useRef, useState } from 'react';
import { SafeAreaView, StyleSheet, TouchableOpacity, View } from 'react-native';
import { Camera, TakePhotoOptions, useCameraDevice, useCameraPermission } from 'react-native-vision-camera';



const HomeScreen = () => {
  const { hasPermission } = useCameraPermission()
  const [photoSettings, setPhotoSettings] = useState<TakePhotoOptions>({
    flash: "auto"
  })
  const camera = useCameraDevice('front')
  const cameraRef = useRef<Camera | null>(null)

  const takePhoto = async () => {

    try {
      if (!cameraRef) throw new Error("Failed to access camera!")
      console.log("Taking photo")
      const photo = await cameraRef.current?.takePhoto(photoSettings)
      console.log("photo path:", photo!.path )
    } catch (error) {
      console.log(error)
    }
    
  }

  if (!hasPermission) {
    return <Redirect href="/permissions" />
  }

  if (!camera) {
    return <SafeAreaView className='flex-1 bg-slate-900'/>
  }


  return (
    <SafeAreaView className='flex-1 bg-slate-900'>
      <View className='p-4 h-full'>
        <View className='relative h-[85%] rounded-2xl overflow-hidden'>
          <Camera
            ref={cameraRef}
            device={camera}
            isActive={true}
            photo={true}                     
            style={StyleSheet.absoluteFill}  
          />
        </View>
        <View className='flex-row justify-center items-center flex-1 '>
          <TouchableOpacity onPress={takePhoto}>
            <View className='flex justify-center items-center border-white border-2 rounded-full size-24'>
              <FontAwesome name="circle" size={72} color="#7E22CD" />
            </View>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  )
}

export default HomeScreen
