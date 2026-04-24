import { View, Text, ScrollView, TouchableOpacity } from 'react-native'
import React from 'react'
import { useWishlist } from '@/context/WishlistContext'
import { useRouter } from 'expo-router'
import { SafeAreaView } from 'react-native-safe-area-context'
import Header from '@/components/Header'
import { Ionicons } from '@expo/vector-icons'
import ProductCard from '@/components/ProductCard'

export default function Favorites() {
    const { wishlist } = useWishlist()
    const router = useRouter()
    return (
        <SafeAreaView className='flex-1 bg-surface' edges={['top']}>
            <Header title='My Favorites' showMenu showCart />
            {wishlist.length > 0 ? (
                <ScrollView className='flex-1 px-4 mt-4' showsVerticalScrollIndicator={false}>

                    <View className='justify-between flex-row flex-wrap'>
                        {wishlist.map((item) => (
                            <ProductCard key={item._id} product={item} />
                        ))}
                    </View>

                </ScrollView>

            ) : (
                <View className='flex-1 items-center justify-center'>
                    <Text className='text-secondary text-lg'>Your favorite products not found.</Text>
                    <TouchableOpacity onPress={() => router.push('/')}
                        className='flex-row items-center mt-4 px-4 py-2 bg-primary rounded-full'>
                        <Ionicons name='home' size={20} color='#fff' />
                        <Text className='text-white font-bold ml-2'>Add Products</Text>
                    </TouchableOpacity>
                </View>
            )}

        </SafeAreaView>
    )
}