import { View, Text, ScrollView, TouchableOpacity, Image } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import Header from '@/components/Header'
import { dummyUser } from '@/assets/assets'
import { useRouter } from 'expo-router'
import { Ionicons } from '@expo/vector-icons'
import { COLORS, PROFILE_MENU } from '@/constants'


export default function Profile() {
    const { user } = { user: dummyUser }
    const router = useRouter()

    const handleLogout = async() => {
        // Implement your logout logic here (e.g., clear user session, tokens, etc.)
        console.log('User logged out');
        // After logout, navigate to the sign-in page
        router.replace('/sign-in');
    }

    return (
        <SafeAreaView className='flex-1 bg-surface' edges={['top']}>
            <Header title='My Profile' showBack />
            <ScrollView className='flex-1 px-4' contentContainerStyle={!user ? { flex: 1, justifyContent: 'center', alignItems: 'center' } : { paddingTop: 16 }} >
                {!user ? (

                    // guest view when user data is not available
                    <View className='items-center w-full'>
                        <View className='w-24 h-24 rounded-full bg-gray-200 items-center justify-center mb-6'>
                            <Ionicons name='person' size={40} color={COLORS.secondary} />
                        </View>
                        <Text className='text-secondary text-lg'>Guest User</Text>
                        <Text className='text-secondary text-lg'>Login to View your Profile</Text>
                        <TouchableOpacity onPress={() => router.push('/sign-in')} className='mt-4 px-4 py-2 bg-primary rounded-full w-3/5 shoadow-lg items-center'>
                            <Text className='text-white text-base'>Log-in / Sign-Up</Text>
                        </TouchableOpacity>
                    </View>
                ) : (
                    <>
                        {/* Profile Info */}
                        <View className='items-center mb-8'>
                            <View className='relative'>
                                <View className='mb-3'>
                                    <Image source={{ uri: user.imageUrl }} className='size-20 border-2 border-green-400 shadow-sm rounded-full' />
                                </View>

                            </View>
                            <Text className='text-primary text-lg font-medium'>{user.name}</Text>
                            <Text className='text-primary text-sm'>{user.email}</Text>

                            {/* admin panel button if admin */}
                            {user.publicMetadata?.role === 'admin' && (
                                <TouchableOpacity onPress={() => router.push('/admin')} className='mt-4 px-4 py-2 bg-accent rounded-full w-3/5 shadow-lg items-center'>
                                    <Text className='text-white text-base'>Admin Panel</Text>
                                </TouchableOpacity>
                            )}
                        </View>

                        {/* Menu*/}
                        <View className='bg-white rounded-xl border border-gray-100/75 p-2 mb-4 shadow-sm'>
                            {PROFILE_MENU.map((item, index) => (
                                <TouchableOpacity
                                    key={item.id}
                                    className={`flex-row items-center px-4 py-3 ${index !== PROFILE_MENU.length - 1 ? 'border-b border-gray-100' : ''}`}
                                    onPress={() => router.push(item.route)} activeOpacity={0.7}>

                                    <View className='w-10 h-10 rounded-full bg-surface items-center justify-center mr-4'>
                                        <Ionicons name={item.icon as any} size={20} color={COLORS.primary} />
                                    </View>

                                    <Text className='flex-1 text-primary text-base'>{item.title}</Text>
                                    
                                    <Ionicons name='chevron-forward' size={20} color={COLORS.primary} />
                                </TouchableOpacity>
                            ))}
                        </View>
                        {/* logout button */}
                        <TouchableOpacity onPress={handleLogout} className='mt-4 px-4 py-2 bg-white rounded-full w-full shadow-lg items-center'>
                            <Text className='text-red-500 text-bold'>Logout</Text>
                        </TouchableOpacity>
                    </>
                )}
            </ScrollView>
        </SafeAreaView>
    )
}