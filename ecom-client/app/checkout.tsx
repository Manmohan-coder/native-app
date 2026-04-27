import { View, Text, ActivityIndicator, ScrollView, TouchableOpacity } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useCart } from '@/context/CartContext'
import { useRouter } from 'expo-router';
import { Address } from '@/constants/types';
import { dummyAddress } from '@/assets/assets';
import Toast from 'react-native-toast-message';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS } from '@/constants';
import Header from '@/components/Header';
import { Ionicons } from '@expo/vector-icons';

export default function Checkout() {
    const { cartTotal } = useCart()
    const router = useRouter();

    const [loading, setLoading] = useState(false);
    const [pageLoading, setPageLoading] = useState(true);

    const [selectedAddress, setSelectedAddress] = useState<Address | null>(null);
    const [paymentMethod, setPaymentMethod] = useState<'cash' | 'stripe'>('cash');

    const shipping = 2.00;
    const tax = 0.00;
    const total = cartTotal + shipping + tax;

    const fetchAddress = async () => {
        const addrList = dummyAddress
        if (addrList.length > 0) {
            const def = addrList.find((a: any) => a.isDefault) || addrList[0]
            setSelectedAddress(def as Address);
        }
        setPageLoading(false);

    }
    const handlePlaceOrder = async () => {
        if (!selectedAddress) {
            Toast.show({
                type: 'error',
                text1: 'Please select a delivery address',
            });
            return;
        }
        if (paymentMethod === 'stripe') {
            Toast.show({
                type: 'error',
                text1: 'Stripe payment not implemented yet',
            });
            return;
        }
        router.push('/orders');
    }
    useEffect(() => {
        fetchAddress();
    }, [])

    if (pageLoading) {
        return (
            <SafeAreaView className='flex-1 bg-surface justify-center items-center'>
                <ActivityIndicator size='large' color={COLORS.primary} />
            </SafeAreaView>
        )
    }



    return (
        <SafeAreaView className='flex-1 bg-surface' edges={['top']}>
            <Header title='Checkout' showBack />

            <ScrollView className='flex-1 px-4 mt-4' showsVerticalScrollIndicator={false}>
                {/* address section */}
                <View className='bg-white rounded-xl p-4 mb-4 shadow-sm'>
                    <Text className='text-lg font-medium mb-2 text-primary'>Shipping Address</Text>
                    {selectedAddress ? (
                        <View className='bg-white p-4 rounded-xl mb-6 shadow-sm'>
                            <View className='flex-row items-center justify-between space-x-4'>
                                <Text className='text-base font-semibold'>{selectedAddress.type}</Text>
                                <TouchableOpacity
                                    onPress={() => router.push('/addresses')} className='text-sm font-medium'>
                                    <Text className='text-accent font-bold'>Change</Text>
                                </TouchableOpacity>
                            </View>
                            <Text className='text-sm text-gray-600 leading-5'>{selectedAddress.street}, {selectedAddress.city}
                                {'\n'}
                                {selectedAddress.state} - {selectedAddress.zipCode}
                                {'\n'}
                                {selectedAddress.country}
                            </Text>
                        </View>
                    )
                        : (
                            <TouchableOpacity
                                onPress={() => router.push('/addresses')}
                                className='bg-white p-4 rounded-xl mb-6 border-2 border-dashed border-gray-300 items-center justify-center'>
                                <Text className='text-primary font-bold'>Add Address</Text>
                            </TouchableOpacity>
                        )}

                </View>
                {/* payment section */}
                <Text className='text-lg font-bold mb-2 text-primary'>Payment Method</Text>
                <View className='bg-slate-300 rounded-xl p-4 mb-4 shadow-sm'>
                    {/* COD method */}
                    <TouchableOpacity onPress={()=>setPaymentMethod('cash')} className={`bg-white p-4 rounded-xl mb-4 shadow-sm flex-row items-center border-2 ${paymentMethod === 'cash' ? 'border-primary' : 'border-transparent'}`}>

                        <Ionicons name="cash-outline" size={24} color={COLORS.primary} className='mr-3' />
                        <View className='ml-3 flex-1'>
                            <Text className='text-base font-semibold'>Cash on Delivery</Text>
                        </View>
                        {paymentMethod === 'cash' && <Ionicons name="checkmark-circle" size={24} color={COLORS.primary} />}

                    </TouchableOpacity>
                    {/* stripe method */}
                    <TouchableOpacity onPress={()=>setPaymentMethod('stripe')} className={`bg-white p-4 rounded-xl mb-4 shadow-sm flex-row items-center border-2 ${paymentMethod === 'stripe' ? 'border-primary' : 'border-transparent'}`}>

                        <Ionicons name="card-outline" size={24} color={COLORS.primary} className='mr-3' />
                        <View className='ml-3 flex-1'>
                            <Text className='text-base font-semibold'>Stripe (Card Payment)</Text>
                        </View>
                        {paymentMethod === 'stripe' && <Ionicons name="checkmark-circle" size={24} color={COLORS.primary} />}
                    </TouchableOpacity>
                </View>
            </ScrollView>
            
            {/* order summary */}
                <View className='p-4 bg-amber-300 rounded-t-xl shadow-lg border-t-4 border-zinc-600'>
                    <Text className='text-lg font-bold mb-4 text-primary'>Order Summary</Text>
                    {/* subtotal */}
                    <View className='flex-row justify-between mb-2'>
                        <Text className='text-base font-medium text-secondary'>Subtotal</Text>
                        <Text className='text-base font-medium text-primary'>${cartTotal.toFixed(2)}</Text>
                    </View>
                    {/* shipping */}
                    <View className='flex-row justify-between mb-2'>
                        <Text className='text-base font-medium text-secondary'>Shipping</Text>
                        <Text className='text-base font-medium text-primary'>${shipping.toFixed(2)}</Text>
                    </View>
                    {/* tax */}
                    <View className='flex-row justify-between mb-2'>
                        <Text className='text-base font-medium text-secondary'>Tax</Text>
                        <Text className='text-base font-medium text-primary'>${tax.toFixed(2)}</Text>
                    </View>
                    {/* total */}
                    <View className='flex-row justify-between mb-2'>
                        <Text className='text-base font-medium text-primary'>Total</Text>
                        <Text className='text-base font-medium text-primary'>${total.toFixed(2)}</Text>
                    </View>

                    {/* placed order */}
                    <TouchableOpacity onPress={handlePlaceOrder} disabled={loading}
                        className={`bg-primary py-3 rounded-xl mt-4 items-center justify-center ${loading ? 'opacity-70' : ''}`}>
                        {loading ? (
                            <ActivityIndicator size='small' color='#fff' />
                        ) : (
                            <Text className='text-white font-bold text-lg'>Place Order</Text>
                        )}
                    </TouchableOpacity> 

                </View>

        </SafeAreaView>
    )
}