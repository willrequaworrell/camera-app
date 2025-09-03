import React, { ReactElement, useState } from 'react';
import { TouchableOpacity, View } from 'react-native';

interface CameraControlButtonProps {
  type?: "button" | "toggle"
  icon: ReactElement 
  toggledIcon?: ReactElement
  onPress: () => void
}

const CameraControlButton = ({type="button", icon, toggledIcon, onPress }: CameraControlButtonProps) => {
  const [toggled, setToggled] = useState<boolean>(false)
  
  if (type === "button") {

    return (
      <TouchableOpacity onPress={onPress}>
        <View  className='flex justify-center items-center bg-white rounded-full size-12'>
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
      >
        <View  className='flex justify-center items-center bg-white rounded-full size-12'>
          {toggled ? toggledIcon : icon}
        </View>
      </TouchableOpacity>
    )

  }
}

export default CameraControlButton
