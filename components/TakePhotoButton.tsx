import FontAwesome from '@expo/vector-icons/FontAwesome'
import React from 'react'
import { TouchableOpacity, View } from 'react-native'

interface TakePhotoButtonProps {
  disabled: boolean
  onPress: () => void
}

const TakePhotoButton = ({disabled, onPress}: TakePhotoButtonProps) => {
  return (
    <TouchableOpacity onPress={onPress} disabled={disabled}>
      <View className='flex justify-center items-center border-white border-2 rounded-full size-24'>
        <FontAwesome name="circle" size={72} color="#7E22CD" />
      </View>
    </TouchableOpacity>
  )
}

export default TakePhotoButton
