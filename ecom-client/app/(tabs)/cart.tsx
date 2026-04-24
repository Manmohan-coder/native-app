import { View, Text, TouchableOpacity, ScrollView } from 'react-native'
import React from 'react'
import { useCart } from '@/context/CartContext';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import Header from '@/components/Header';
import { Ionicons } from '@expo/vector-icons';
import CartItem from '@/components/CartItem';

export default function Cart() {

    const { cartItems, updateQuantity, removeFromCart, cartTotal } = useCart();
    const router = useRouter();
    const shipping = 2.00;
    const total = cartTotal + shipping;

    return (
        <SafeAreaView className='flex-1 bg-surface' edges={['top']}>
            <Header title='My Cart' showBack />

            {cartItems.length > 0 ? (
                <>
                    <ScrollView className='flex-1 px-4 mt-4' showsVerticalScrollIndicator={false}>
                        {cartItems.map((item, index) => (
                            <CartItem key={index} item={item}
                                onRemove={() => removeFromCart(item.id, item.size)}
                                onUpdateQuantity={(q) => updateQuantity(item.id, q, item.size)}
                            />

                        ))}
                        
                    </ScrollView>
                    <View className='p-4 bg-white rounded-t-3xl shadow-sm'>
                        {/* subtotal */}
                        <View className='flex-row justify-between mb-2'>
                            <Text className='text-base font-medium mt-4'>Sub-total</Text>
                            <Text className='text-base font-medium mt-4'>${cartTotal.toFixed(2)}</Text>
                        </View>
                        {/* shipping */}
                        <View className='flex-row justify-between mb-2'>
                            <Text className='text-base font-medium mt-4'>Shipping</Text>
                            <Text className='text-base font-medium mt-4'>+ ${shipping.toFixed(2)}</Text>
                        </View>
                        {/* border */}
                        <View className='border-t border-gray-300 my-2' />
                        {/* total  */}
                        <View className='flex-row justify-between mb-2'>
                            <Text className='text-xl font-semibold mt-4'>Total</Text>
                            <Text className='text-xl font-semibold mt-4'>${total.toFixed(2)}</Text>
                        </View>
                        {/* check=out */}
                        <TouchableOpacity onPress={() => router.push('/checkout')}
                            className='flex-row items-center justify-center mt-4 px-4 py-3 bg-primary rounded-full'>
                            <Ionicons name='card' size={20} color='#fff' />
                            <Text className='text-white font-bold ml-2'>Proceed to Checkout</Text>
                        </TouchableOpacity>

                    </View>
                </>
            ) : (
                <View className='flex-1 items-center justify-center'>
                    <Text className='text-secondary text-lg'>Your cart is empty</Text>
                    <TouchableOpacity onPress={() => router.push('/')}
                        className='flex-row items-center mt-4 px-4 py-2 bg-primary rounded-full'>
                        <Ionicons name='home' size={20} color='#fff' />
                        <Text className='text-white font-bold ml-2'>Start Shopping</Text>
                    </TouchableOpacity>
                </View>
            )}
        </SafeAreaView>
    )
}