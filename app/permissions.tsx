import Ionicons from '@expo/vector-icons/Ionicons';
import { Stack, useRouter } from "expo-router";
import { useState } from "react";
import { Alert, Image, SafeAreaView, Switch, Text, TouchableOpacity, View } from "react-native";
import { Camera, CameraPermissionStatus } from "react-native-vision-camera";

const PermissionsScreen = () => {
  const [cameraPermissionStatus, setCameraPermisstionStatus] = useState<CameraPermissionStatus>("not-determined")
  const router = useRouter()

  const requestCameraPermissions = async () => {
    const permission = await Camera.requestCameraPermission()
    setCameraPermisstionStatus(permission)
  }

  const handleContinue = () => {
    if (cameraPermissionStatus !== "granted") {
      Alert.alert("This app requires camera access. Please go to settings to enable access.")
      return
    } 
    router.replace("/")
  }
  
  return (
    <>
      <Stack.Screen options={{headerShown: false}}/>
      <SafeAreaView className="flex-1 p-8 bg-slate-900">
        <View className="flex flex-col items-center flex-1 p-16">
          {/* <Text className="text-white text-6xl">Identif.ai</Text> */}
          <Image className='h-24 w-full' source={require("@/assets/images/logo2.png")}/>
          <View className="flex justify-center h-3/4 gap-y-8">
            <View className='flex-row items-center'>
              <View className='flex-row items-center gap-x-2 flex-1'>
                <Ionicons name="camera" size={48} color="#7E22CD" />
                <Text className='text-white text-2xl'>Allow Camera</Text>
              </View>
              <Switch 
                trackColor={{true: "#7E22CD"}}
                value={cameraPermissionStatus === "granted"}
                onChange={requestCameraPermissions}
              />

            </View>
            <Text className="text-white">This app requires access to your camera to work properly. Please select allow when prompted.</Text>

          </View>
          <View className='h-1/4 w-full '>
            <TouchableOpacity onPress={handleContinue}>
              <View className='flex-row items-center justify-center py-4 bg-accent rounded-lg'>
                  <Text className='text-white'>Continue</Text>
              </View>
            </TouchableOpacity>

          </View>

        </View>

      </SafeAreaView>
      </>
  )
}

export default PermissionsScreen
