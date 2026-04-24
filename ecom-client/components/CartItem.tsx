import { View, Text, Image, TouchableOpacity } from 'react-native'
import React from 'react'
import { CartItemProps } from '@/constants/types';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '@/constants';

export default function CartItem({ item, onRemove, onUpdateQuantity }: CartItemProps) {
    const imageUrl = item.product.images[0]

    return (
        <View className='flex-row mb-4 bg-white p-3 rounded-xl'>
            <View className='w-20 h-20 bg-gray-100 rounded-lg overflow-hidden mr-3'>
                <Image source={{ uri: imageUrl }}
                    className='w-full h-full' resizeMode="cover" />
            </View>
            <View className='flex-1 justify-between'>
                {/* product details */}
                <View className='flex-row items-start justify-between'>
                    <View className=''>
                        <Text className='text-primary text-sm font-medium mb-1'>{item.product.name}</Text>
                        <Text className='text-secondary text-xs font-medium'>Size: ${item.size}</Text>
                    </View>
                    <TouchableOpacity onPress={onRemove} className='bg-red-100 rounded-full'>
                        <Ionicons name='trash' size={20} color='#FF4C3B' />
                    </TouchableOpacity>
                </View>
                {/* price & quantity */}
                <View className='flex-row items-center justify-between mt-2'>
                    <Text className='text-primary font-bold'>${(item.product.price * item.quantity).toFixed(2)}</Text>
                    <View className='flex-row items-center border border-gray-300 rounded-full px-2 py-1'>
                        <TouchableOpacity onPress={() => onUpdateQuantity && onUpdateQuantity(item.quantity - 1)} className='px-3 py-1'>
                            <Ionicons name='remove' size={16} color={COLORS.primary} />
                        </TouchableOpacity>

                        <Text className='mx-2 text-sm'>{item.quantity}</Text>
                        
                        <TouchableOpacity onPress={() => onUpdateQuantity && onUpdateQuantity(item.quantity + 1)} className='px-3 py-1'>
                            <Ionicons name='add' size={16} color={COLORS.primary} />
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </View>
    )
}