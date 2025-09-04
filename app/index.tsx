import TakePhotoButton from '@/components/TakePhotoButton';
import CameraControlButton from '@/components/ui/CameraControlButton';
import Ionicons from '@expo/vector-icons/Ionicons';
import { Redirect, useRouter } from 'expo-router';
import React, { useRef, useState } from 'react';
import { SafeAreaView, StyleSheet, Text, View } from 'react-native';
import { Camera, CameraPosition, TakePhotoOptions, useCameraDevice, useCameraPermission } from 'react-native-vision-camera';



const HomeScreen = () => {
  const { hasPermission } = useCameraPermission()
  const [cameraPosition, setCameraPosition] = useState<CameraPosition>('back')
  const [photoSettings, setPhotoSettings] = useState<TakePhotoOptions>({
    flash: "off"
  })
  const [photoInProgress, setPhotoInProgress] = useState<boolean>(false)
  const camera = useCameraDevice(cameraPosition)
  const cameraRef = useRef<Camera | null>(null)
  const router = useRouter()

  const takePhoto = async () => {

    try {
      if (!cameraRef) throw new Error("Failed to access camera!")
      setPhotoInProgress(true)
      const photo = await cameraRef.current?.takePhoto(photoSettings)
      router.push({
        pathname: "/analyze",
        params: {media: photo?.path}
      })
    } catch (error) {
      console.log(error)
    } finally {
      setPhotoInProgress(false)
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
      <View className='h-full p-4'>
        <View className='relative h-[75%] rounded-2xl overflow-hidden'>
          <Camera
            ref={cameraRef}
            device={camera}
            isActive={true}
            photo={true}   
            enableZoomGesture                  
            style={StyleSheet.absoluteFill}  
          />
        </View>
        <View className='flex-col flex-1'>
          <Text className='mt-6 text-2xl font-bold text-center text-white'>Snap a photo. <Text className='text-accent'>Let AI analyze it!</Text></Text>
          <View className='flex-row items-center justify-around flex-1 px-12'>
            <CameraControlButton 
              icon={<Ionicons name="camera-reverse-outline" size={24} color="#7E22CD" />}
              onPress={() => setCameraPosition(prev => (prev === "back" ? "front" : "back"))}
              accessibilityLabel={"Flip Camera"}
            />
            <TakePhotoButton
              disabled={photoInProgress}
              onPress={takePhoto}
              accessibilityLabel="Take Photo"
            />
            <CameraControlButton 
              type='toggle'
              icon={<Ionicons name="flash-off-outline" size={24} color="#7E22CD" />}
              toggledIcon={<Ionicons name="flash" size={24} color="#7E22CD" />}
              onPress={() => setPhotoSettings(prev => ({
                flash: prev.flash === "off" ? "on" : "off"
              }))}
              accessibilityLabel="Toggle Flash"
            />
          </View>
        </View>
      </View>
    </SafeAreaView>
  )
}

export default HomeScreen
