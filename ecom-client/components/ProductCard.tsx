import { View, Text, TouchableOpacity, Image } from 'react-native'
import React from 'react'
import { ProductCardProps } from '@/constants/types'
import { Link } from 'expo-router'
import { Ionicons } from '@expo/vector-icons'
import { COLORS } from '@/constants'
import { useWishlist } from '@/context/WishlistContext'

export default function ProductCard({ product }: ProductCardProps) {
    const { toggleWishlist, isInWishlist } = useWishlist();
    const isLiked = isInWishlist(product._id); // This should come from your state or props
    return (
        <Link href={`/product/${product._id}`} asChild>
            <TouchableOpacity className='w-[48%] mb-4 bg-white rounded-lg overflow-hidden'>
                <View className='relative w-full h-56 bg-gray-100'>
                    <Image source={{ uri: product.images?.[0] ?? '' }} className='w-full h-full rounded-xl object-cover' resizeMode='cover' />

                    {/* like icon */}
                    <TouchableOpacity className='absolute top-2 right-2 rounded-full z-10 p-2 bg-white shadow-sm' onPress={(e) => { e.stopPropagation(); toggleWishlist(product) }}>
                        <Ionicons name={isLiked ? 'heart' : 'heart-outline'} size={20} color={isLiked ? COLORS.accent : COLORS.primary} />
                    </TouchableOpacity>

                    {/* is featured */}
                    {product.isFeatured && (
                        <View className='absolute top-2 left-2 bg-primary px-2 py-1 rounded-full z-10'>
                            <Text className='text-white text-xs font-bold '>Featured</Text>
                        </View>
                    )}

                </View>

                {/* product info */}
                <View className='p-3'>
                    <Text className='text-sm font-semibold text-gray-800 mb-1' numberOfLines={1}>
                        {product.name}
                    </Text>
                    <View className='flex-row items-center justify-between'>
                        <View className='flex-row items-center'>
                            <Ionicons name='star' size={14} color='#FFD700' />
                            <Text className='text-xs text-secondary font-medium ml-1'>4.6</Text>
                        </View>
                        <Text className='text-sm font-bold text-primary'>
                            ${product.price.toFixed(2)}
                        </Text>
                    </View>
                </View>
            </TouchableOpacity>
        </Link>
    )
}