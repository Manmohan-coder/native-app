import { View, Text, ActivityIndicator, ScrollView, Image, Dimensions, TouchableOpacity } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Product } from '@/constants/types';
import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext';
import { dummyProducts } from '@/assets/assets';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS } from '@/constants';
import { Ionicons } from '@expo/vector-icons';
import Toast from 'react-native-toast-message';
const { width } = Dimensions.get('window');

export default function ProductDetails() {
    const { id } = useLocalSearchParams();
    const router = useRouter();
    const [product, setProduct] = useState<Product | null>(null);
    const [loading, setLoading] = useState(true);
    const { addToCart, cartItems, itemCount } = useCart();
    const { toggleWishlist, isInWishlist } = useWishlist();
    const [selectedSize, setSelectedSize] = useState<string | null>(null);
    const [activeImageIndex, setActiveImageIndex] = useState(0);

    const fetchProduct = async () => {
        setProduct(dummyProducts.find(p => p._id === id) || null);
        setLoading(false);
    }

    useEffect(() => {
        fetchProduct();
    }, [id]);

    if (loading) {
        return (
            <SafeAreaView className='flex-1 justify-center items-center'>
                <ActivityIndicator size='large' color={COLORS.primary} />
            </SafeAreaView>
        )
    }
    if (!product) {
        return (
            <SafeAreaView className='flex-1 justify-center items-center'>
                <Text className='text-lg font-semibold'>Product not found</Text>
            </SafeAreaView>
        )
    }

    const isLiked = isInWishlist(product._id);

    const handleAddToCart = () => {
        if (!selectedSize) {
            Toast.show({
                type: 'info',
                text1: 'Please select a size',
            });
            return
        } addToCart(product, selectedSize || "")
    }

    return (
        <View className='flex-1 bg-white'>
            <ScrollView contentContainerStyle={{ paddingBottom: 100 }}>
                {/* image carousel */}
                <View className='relative h-[450px] bg-gray-100 mb-6'>
                    <ScrollView
                        horizontal pagingEnabled
                        showsHorizontalScrollIndicator={false} scrollEventThrottle={16}
                        onScroll={(e) => {
                            const index = Math.ceil(e.nativeEvent.contentOffset.x / e.nativeEvent.layoutMeasurement.width);
                            setActiveImageIndex(index);
                        }}
                    >
                        {product.images?.map((img, index) => (
                            <Image key={index} source={{ uri: img }}
                                style={{ width: width, height: 450 }} resizeMode='cover' />
                        ))}
                    </ScrollView>

                    {/* header actions */}
                    <View className='absolute top-12 left-4 right-4 flex-row justify-between items-center z-10'>
                        <TouchableOpacity onPress={() => router.back()} className='w-10 h-10 bg-white/80 rounded-full items-center justify-center'>
                            <Ionicons name='arrow-back' size={24} color={COLORS.primary} onPress={() => router.back()} />
                        </TouchableOpacity>

                        <TouchableOpacity onPress={() => toggleWishlist(product)} className='w-10 h-10 bg-white/80 rounded-full items-center justify-center'>
                            <Ionicons name={isLiked ? 'heart' : 'heart-outline'} size={24} color={isLiked ? COLORS.accent : COLORS.primary} />
                        </TouchableOpacity>
                    </View>
                    {/* pagination dots */}
                    <View className='absolute bottom-2 left-0 right-0 flex-row justify-center items-center space-x-2'>
                        {product.images?.map((_, index) => (
                            <View key={index} className={`w-2 h-2 rounded-full ${activeImageIndex === index ? 'bg-primary w-6' : 'bg-gray-400 w-2'}`} />
                        ))}
                    </View>
                </View>
                {/* product info */}
                <View className='px-4'>
                    {/* title & rating */}
                    <View className='flex-row justify-between items-start mb-2'>
                        <Text className='text-2xl font-bold text-primary flex-1 mr-4'>{product.name}</Text>
                        <View className='flex-row items-center bg-green-100 px-2 py-1 rounded'>
                            <Ionicons name='star' size={16} color='#FFD700' />
                            <Text className='ml-1 text-sm font-bold text-green-800'>4.6</Text>
                            <Text className='ml-1 text-xs font-secondary text-green-800'>(85)</Text>
                        </View>
                    </View>
                    {/* price */}
                    <Text className='text-xl font-bold text-primary mb-4'>${product.price.toFixed(2)}</Text>
                    {/* size */}
                    {product.sizes && product.sizes.length > 0 && (
                        <><Text className='text-gray-700 font-semibold text-base mb-2'>Select Size</Text>
                            <ScrollView horizontal showsHorizontalScrollIndicator={false} className='mb-6'>
                                {product.sizes.map((size) => (
                                    <TouchableOpacity key={size} onPress={() => setSelectedSize(size)}
                                        className={`px-4 py-2 mr-3 rounded-full items-center justify-center ${selectedSize === size ? 'border-primary bg-primary' : 'border-gray-100 bg-white'}`}>

                                        <Text className={`text-sm font-medium ${selectedSize === size ? 'text-white' : 'text-gray-800'}`}>{size}</Text>
                                    </TouchableOpacity>
                                ))}
                            </ScrollView>
                        </>
                    )}
                    {/* description */}
                    <Text className='text-gray-700 mb-6'>{product.description}</Text>
                </View>
            </ScrollView>
            {/* footer  */}
            <View className='absolute bottom-0 left-0 right-0 bg-white border-t p-4 flex-row items-center justify-between'>
                <TouchableOpacity onPress={handleAddToCart} className='w-4/5 bg-primary py-4 rounded-full items-center shadow-lg flex-row justify-center'>
                    <Ionicons name='bag-outline' size={20} color='white' className='mb-1' />
                    <Text className='text-white font-bold text-sm ml-2'>Add to Cart</Text>
                </TouchableOpacity>

                <TouchableOpacity onPress={() => router.push("/(tabs)/cart")} className='w-1/5 py-3 relative flex-row justify-center'>
                    <Ionicons name='cart-outline' size={24} color='gray' className='mb-1' />
                    <View className='absolute top-2 right-4 bg-amber-500 size-4  rounded-full items-center justify-center'>
                        <Text className='text-white text-xs font-bold text-[9px]'>{itemCount}</Text>
                    </View>
                </TouchableOpacity>
            </View>

        </View >
    )
}