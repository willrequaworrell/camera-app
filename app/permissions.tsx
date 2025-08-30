import Ionicons from '@expo/vector-icons/Ionicons';
import { Stack, useRouter } from "expo-router";
import { useState } from "react";
import { Alert, Image, SafeAreaView, Switch, Text, TouchableOpacity, View } from "react-native";
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
    if (!permissionGranted) {
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
          <Image className='h-24 w-full' source={require("@/assets/images/logo2.png")}/>
          <View className="flex justify-center h-3/4 gap-y-8">
            <View className='flex-row items-center'>
              <View className='flex-row items-center gap-x-2 flex-1'>
                <Ionicons name="camera" size={48} color="#7E22CD" />
                <Text className='text-white text-2xl'>Allow Camera</Text>
              </View>
              <Switch 
                trackColor={{true: "#7E22CD"}}
                value={permissionGranted}
                onChange={requestCameraPermissions}
              />

            </View>
            <Text className="text-white">This app requires access to your camera to work properly. Please select allow when prompted.</Text>

          </View>
          <View className='h-1/4 w-full'>
            <TouchableOpacity onPress={handleContinue} disabled={!permissionGranted}>
              <View className={`flex-row items-center justify-center py-4  ${permissionGranted ? "bg-accent" : "bg-slate-500"} rounded-lg`}>
                  <Text className={`${permissionGranted ? "text-white" : "text-slate-700"}`}>Continue</Text>
              </View>
            </TouchableOpacity>

          </View>

        </View>

      </SafeAreaView>
      </>
  )
}

export default PermissionsScreen
