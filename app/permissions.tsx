import { useState } from "react"
import { Text } from "react-native"
import { CameraPermissionStatus } from "react-native-vision-camera"

const PermissionsScreen = () => {
  const [cameraPermissionStatus, setCameraPermisstionStatus] = useState<CameraPermissionStatus>("not-determined")
  
  return (
    <Text>Permissions Screen</Text>
  )
}

export default PermissionsScreen
