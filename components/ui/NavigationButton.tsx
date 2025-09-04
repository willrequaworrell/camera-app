import React from 'react'
import { Text, TouchableOpacity, View } from 'react-native'

interface NavigationButtonProps {
  text: string
  disabled?: boolean
  onPress: () => void
  accessibilityLabel?: string;
}

const NavigationButton = ({text, disabled=false, onPress, accessibilityLabel}: NavigationButtonProps) => {
  return (
    <TouchableOpacity 
      onPress={onPress} 
      disabled={disabled}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel || text}
      accessibilityState={{ disabled: !!disabled }}
    >
      <View className={`flex-row items-center justify-center py-4  ${disabled ? "bg-slate-500" : "bg-accent"} rounded-lg`}>
        <Text className={`${disabled ? "text-slate-700" : "text-white"} font-bold`}>{text}</Text>
      </View>
    </TouchableOpacity>
  )
}

export default NavigationButton
