import NavigationButton from '@/components/ui/NavigationButton';
import Ionicons from '@expo/vector-icons/Ionicons';
import { Stack, useRouter } from "expo-router";
import { useState } from "react";
import { Image, SafeAreaView, Switch, Text, View } from "react-native";
import { Camera, CameraPermissionStatus } from "react-native-vision-camera";

const PermissionsScreen = () => {
  const [cameraPermissionStatus, setCameraPermisstionStatus] = useState<CameraPermissionStatus>("not-determined")
  const permissionGranted = cameraPermissionStatus === "granted"
  const router = useRouter()

  const requestCameraPermissions = async () => {
    
    const permission = await Camera.requestCameraPermission()
    console.log(permission)
    setCameraPermisstionStatus(permission)
  }

  const handleContinue = () => {
    if (!permissionGranted) return
    router.replace("/")
  }
  
  return (
    <>
      <Stack.Screen options={{headerShown: false}}/>
      <SafeAreaView className="flex-1 bg-slate-900">
        <View className="flex flex-col items-center flex-1 p-16">
          <Image className='w-full h-24' source={require("@/assets/images/logo2.png")}/>
          <View className="flex justify-center h-3/4 gap-y-8">
            <View className='flex-row items-center'>
              <View className='flex-row items-center flex-1 gap-x-2'>
                <Ionicons name="camera" size={48} color="#7E22CD" />
                <Text className='text-2xl font-bold text-white'>Allow Camera</Text>
              </View>
              <Switch 
                trackColor={{true: "#7E22CD"}}
                value={permissionGranted}
                onValueChange={requestCameraPermissions}
                accessibilityRole="switch"
                accessibilityLabel="Allow Camera"
              />

            </View>
            <Text className="font-bold text-white">This app requires access to your camera to work properly. Please select allow when prompted.</Text>

          </View>
          <View className='w-full h-1/4'>
            <NavigationButton 
              text='Continue'
              disabled={!permissionGranted} 
              onPress={handleContinue}
              accessibilityLabel="Continue"
            />
          </View>

        </View>

      </SafeAreaView>
      </>
  )
}

export default PermissionsScreen
