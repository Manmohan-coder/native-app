import React, { useEffect, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import Header from '@/components/Header'
import { ActivityIndicator, Dimensions, Image, ScrollView, Text, TouchableOpacity, View } from 'react-native'
import { BANNERS, dummyProducts } from '@/assets/assets'
import { useRouter } from 'expo-router'
import { CATEGORIES } from '@/constants'
import CategoryItem from '@/components/CategoryItem'
import { Product } from '@/constants/types'
import ProductCard from '@/components/ProductCard'

const { width } = Dimensions.get('window');

export default function Home() {
    const router = useRouter();
    const [activeBannerIndex, setActiveBannerIndex] = useState(0);
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const categories = [{ id: 'all', name: 'All', icon: 'grid' }, ...CATEGORIES];
    const fetchProducts = async () => {
        setProducts(dummyProducts)
        setLoading(false);
    }
    useEffect(() => {
        fetchProducts();
    }, [])

    return (
        <SafeAreaView className='flex-1' edges={['top']}>
            <Header title='Forever' showMenu showLogo showCart />

            <ScrollView className='flex-1 px-4' showsHorizontalScrollIndicator={false} >
                {/* banner slider */}
                <View className='mb-6'>


                    <ScrollView horizontal pagingEnabled showsHorizontalScrollIndicator={false} className='w-full h-48 rounded-xl ' scrollEventThrottle={16} onScroll={(e) => {
                        const slide = Math.ceil(e.nativeEvent.contentOffset.x / e.nativeEvent.layoutMeasurement.width)
                        if (slide !== activeBannerIndex) {
                            setActiveBannerIndex(slide)
                        }
                    }}>
                        {BANNERS.map((banner, index) => (
                            <View key={index} className='relative w-full h-48 bg-gray-200 overflow-hidden' style={{ width: width - 32 }}>
                                <Image source={{ uri: banner.image }} className='w-full h-full rounded-xl' resizeMode='cover' />
                                <View className='absolute bottom-4 left-4 z-10'>
                                    <Text className='text-white text-2xl font-bold'>{banner.title}</Text>
                                    <Text className='text-white text-sm font-medium'>{banner.subtitle}</Text>
                                    <TouchableOpacity className='mt-2 px-4 py-2 bg-white rounded-full w-24 items-center justify-center self-start'>
                                        <Text className='text-primary font-bold text-xs'>Get Now</Text>
                                    </TouchableOpacity>
                                </View>
                                <View className='absolute inset-0 bg-black/40' />
                            </View>
                        ))}
                    </ScrollView>
                    {/* pagination dots */}
                    <View className='flex-row items-center justify-center mt-2'>
                        {BANNERS.map((_, index) => (
                            <View key={index} className={`w-2 h-2 rounded-full mx-1 ${index === activeBannerIndex ? 'w-6 bg-primary' : 'w-2 bg-gray-300'}`} style={{ backgroundColor: index === 0 ? '#000' : '#ccc' }} />
                        ))}
                    </View>
                </View>
                {/* categories */}
                <View className='mb-6'>
                    <View className='flex-row justify-between items-center mb-4'>
                        <Text className='text-xl font-bold mb-4 text-primary'>Categories</Text>
                    </View>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false} className='w-full h-32'>
                        {categories.map((cat: any) => (
                            <CategoryItem key={cat.id} item={cat} isSelected={false}
                                onPress={() => router.push({
                                    pathname: '/shop',
                                    params: { category: cat.id === 'all' ? '' : cat.name }
                                })} />
                        ))}
                    </ScrollView>
                </View>
                {/* products */}
                <View className='mb-8'>
                    <View className='flex-row justify-between items-center mb-4'>
                        <Text className='text-xl font-bold text-primary'>Popular</Text>
                        <TouchableOpacity onPress={() => router.push('/shop')}>
                            <Text className='text-base text-secondary'>See All</Text>
                        </TouchableOpacity>
                    </View>
                    {loading ? (
                        <ActivityIndicator size='large' color='#000' className='my-10' />
                    ) : (
                        <View className='flex-row flex-wrap justify-between'>
                            {products.slice(0, 4).map((product) => (
                                <ProductCard key={product._id} product={product} />
                            ))}
                        </View>
                    )}
                </View>

                {/* Newsletter CTA */}
                
                <View className='bg-primary rounded-xl p-6 items-center justify-center mb-8'>
                    <Text className='text-white text-2xl font-bold mb-2'>Join Our Revolution</Text>
                    <Text className='text-white text-center mb-4'>Subscribe to get the latest updates and offers.</Text>
                    <TouchableOpacity className='px-6 py-3 bg-white rounded-full'>
                        <Text className='text-primary font-bold'>Subscribe Now</Text>
                    </TouchableOpacity>
                </View>



            </ScrollView>
        </SafeAreaView>
    )
}