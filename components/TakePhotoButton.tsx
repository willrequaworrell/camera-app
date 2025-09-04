import FontAwesome from '@expo/vector-icons/FontAwesome'
import React from 'react'
import { TouchableOpacity, View } from 'react-native'

interface TakePhotoButtonProps {
  disabled: boolean
  onPress: () => void
  accessibilityLabel: string
}

const TakePhotoButton = ({disabled, onPress, accessibilityLabel}: TakePhotoButtonProps) => {
  return (
    <TouchableOpacity onPress={onPress} disabled={disabled} accessibilityLabel={accessibilityLabel}>
      <View className='flex items-center justify-center border-2 border-white rounded-full size-24'>
        <FontAwesome name="circle" size={72} color="#7E22CD" />
      </View>
    </TouchableOpacity>
  )
}

export default TakePhotoButton
