import NavigationButton from '@/components/ui/NavigationButton';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import Ionicons from '@expo/vector-icons/Ionicons';
import { Stack, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { Image, Linking, SafeAreaView, Switch, Text, View } from "react-native";
import { Camera, CameraPermissionStatus } from "react-native-vision-camera";

const PermissionsScreen = () => {
  const [cameraPermissionStatus, setCameraPermissionStatus] = useState<CameraPermissionStatus>("not-determined")
  const permissionGranted = cameraPermissionStatus === "granted"
  const router = useRouter()

  const requestCameraPermissions = async () => {
    const permission = await Camera.requestCameraPermission()
    console.log(permission)
    setCameraPermissionStatus(permission)
  }

  const openSettings = () => {
    Linking.openURL('app-settings:');
  }

  const handleContinue = () => {
    if (!permissionGranted) return
    router.replace("/")
  }


  useEffect(() => {
    const checkInitialPermission = async () => {
      const status = await Camera.getCameraPermissionStatus();
      setCameraPermissionStatus(status);
    };
    
    checkInitialPermission();
  }, []);
  

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <SafeAreaView className="flex-1 bg-slate-900">
        <View className="flex flex-col items-center flex-1 p-16">
          <Image className='w-full h-24' source={require("@/assets/images/logo2.png")} />

          <View className="flex justify-center h-3/4 gap-y-8">
            {(cameraPermissionStatus === "not-determined" || cameraPermissionStatus === "granted") && (
              <View className='flex-row items-center'>
                <View className='flex-row items-center flex-1 gap-x-2'>
                  <Ionicons name="camera" size={48} color="#6b1bf5" />
                  <Text className='text-2xl font-bold text-white '>Allow Camera</Text>
                </View>
                {cameraPermissionStatus === "granted" ? (
                  <FontAwesome6 name="circle-check" size={30} color="green" />
                ) : (
                  <Switch
                  trackColor={{ true: "#6b1bf5" }}
                  value={permissionGranted}
                  onValueChange={requestCameraPermissions}
                  accessibilityRole="switch"
                  accessibilityLabel="Allow Camera"
                />
                )}
                
              </View>

            )}
            <Text className="font-bold text-center text-white">This app requires access to your camera to work properly. {cameraPermissionStatus === "not-determined" && "Please select allow when prompted."}</Text>

          </View>

          <View className='w-full h-1/4'>
            
            {cameraPermissionStatus === "denied" ? (
              <NavigationButton
              text='Open Settings'
              onPress={openSettings}
              accessibilityLabel="Open Settings"
            />
            ) : (
              <NavigationButton
              text='Continue'
              disabled={!permissionGranted}
              onPress={handleContinue}
              accessibilityLabel="Continue"
            />
            )} 

            
          </View>

        </View>

      </SafeAreaView>
    </>
  )
}

export default PermissionsScreen
