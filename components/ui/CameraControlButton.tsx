import React, { ReactElement, useState } from 'react';
import { TouchableOpacity, View } from 'react-native';

interface CameraControlButtonProps {
  type?: "button" | "toggle"
  icon: ReactElement 
  toggledIcon?: ReactElement
  onPress: () => void
  accessibilityLabel: string
}

const CameraControlButton = ({type="button", icon, toggledIcon, onPress, accessibilityLabel }: CameraControlButtonProps) => {
  const [toggled, setToggled] = useState<boolean>(false)
  
  if (type === "button") {

    return (
      <TouchableOpacity onPress={onPress} accessibilityLabel={accessibilityLabel}>
        <View  className='flex items-center justify-center bg-white rounded-full size-12'>
          {icon}
        </View>
      </TouchableOpacity>
    )
  } else {
    
    return (
      <TouchableOpacity 
        onPress={() => {
          onPress()
          setToggled(prev => !prev)
        }}
        accessibilityLabel={accessibilityLabel}
      >
        <View  className='flex items-center justify-center bg-white rounded-full size-12'>
          {toggled ? toggledIcon : icon}
        </View>
      </TouchableOpacity>
    )

  }
}

export default CameraControlButton
