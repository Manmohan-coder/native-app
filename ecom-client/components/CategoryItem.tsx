import { View, Text, TouchableOpacity } from 'react-native'
import React from 'react'
import { CategoryItemProps } from '@/constants/types'
import { Ionicons } from '@expo/vector-icons'
import { COLORS } from '@/constants'

export default function CategoryItem({ item, isSelected, onPress }: CategoryItemProps) {
    return (
        <TouchableOpacity className={`w-24 h-24 rounded-xl mr-4 items-center justify-center ${isSelected ? 'bg-primary' : 'bg-gray-200'}`} onPress={onPress}>
            <View className={`w-14 h-14 rounded-full items-center justify-center ${isSelected ? 'bg-primary' : 'bg-gray-300'}`}>
                <Ionicons name={item.icon as any} size={24} color={isSelected ? 'white' : COLORS.primary} />
            </View>
            <Text className={`mt-1 text-sm font-medium ${isSelected ? 'text-primary' : 'text-secondary'}`}>{item.name}</Text>
        </TouchableOpacity>
    )
}