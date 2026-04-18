import { View, Text, TextInput, TouchableOpacity, ActivityIndicator, FlatList } from 'react-native'
import React, { useEffect, useState } from 'react'
import { Product } from '@/constants/types';
import { dummyProducts } from '@/assets/assets';
import { SafeAreaView } from 'react-native-safe-area-context';
import Header from '@/components/Header';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '@/constants';
import ProductCard from '@/components/ProductCard';

export default function Shop() {
    const [produts, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [loadingMore, setLoadingMore] = useState(false);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);

    const fetchProducts = async (pageNumber = 1) => {
        if (pageNumber === 1) {
            setLoading(true);
        } else {
            setLoadingMore(true);
        }
        try {
            const start = (pageNumber - 1) * 10;
            const end = start + 10;
            const pageData = dummyProducts.slice(start, end);
            if (pageNumber === 1) {
                setProducts(pageData);
            } else {
                setProducts(prev => [...prev, ...pageData]);
            }
            setHasMore(end < dummyProducts.length);
            setPage(pageNumber);
        } catch (error) {
            console.error("Error fetching products:", error);
        } finally {
            setLoading(false);
            setLoadingMore(false);
        }
    }
    const loadMore = () => {
        if (!loadingMore && !loading && hasMore) {
            fetchProducts(page + 1);
        }
    }
    useEffect(() => {
        fetchProducts(1);
    }, [])

    return (
        <SafeAreaView className='flex-1 bg-surface' edges={['top']}>
            <Header title='Shop' showBack showLogo showCart />
            <View className='flex-row gap-2 mb-3 mx-4 my-2 items-center'>
                {/* search bar */}
                <View className='flex-1 flex-row items-center bg-white rounded-xl border border-gray-100 '>
                    <Ionicons name='search' size={20} color={COLORS.secondary} />
                    <TextInput className='flex-1 ml-2 text-primary px-4 py-3' placeholder='Search products...' placeholderTextColor={COLORS.secondary} returnKeyType='Search' />
                </View>
                {/* filter button */}
                <TouchableOpacity className='bg-gray-800 w-12 h-12 items-center justify-center rounded-xl'>
                    <Ionicons name='options-outline' size={20} color='#fff' />
                </TouchableOpacity>

            </View>
            {loading ? (
                <View className='flex-1 items-center justify-center'>
                    <ActivityIndicator size='large' color={COLORS.primary} />
                </View>
            ) : (
                <FlatList data={produts}
                    keyExtractor={(item) => item._id} numColumns={2}
                    contentContainerStyle={{ padding: 16, paddingBottom: 100 }}
                    columnWrapperStyle={{ justifyContent: 'space-between', paddingHorizontal: 16 }}
                    onEndReached={loadMore} onEndReachedThreshold={0.5}
                    ListFooterComponent={() => loadingMore ? <ActivityIndicator size='small' color={COLORS.primary} className='my-4' /> : null}
                    renderItem={({ item }) => (<ProductCard product={item} />)}
                    ListEmptyComponent={!loading && (
                        <View className='flex-1 items-center justify-center py-20'>
                            <Text className='text-secondary'>No Product Found</Text>
                        </View>
                    )} />
            )}
        </SafeAreaView>
    )
}