import React from 'react'
import { Tabs } from 'expo-router'
import { FontAwesome } from '@expo/vector-icons'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

const TabsLayout = () => {
    const insets = useSafeAreaInsets()
    return (
        <Tabs

            screenOptions={{
                tabBarActiveTintColor: "#800080",
                tabBarInactiveTintColor: "#535354",
                tabBarStyle: {
                    backgroundColor: "#e1c9f0",
                    height: insets.bottom + 60,
                    borderTopWidth: 1,
                }
            }}
        >
    

            <Tabs.Screen
                name="index"
                options={{
                    title: 'Home',
                    headerShown: false,
                    tabBarIcon: ({ color }) => (
                        <FontAwesome name="home" size={24} color={color} />
                    ),
                }}
            />

            <Tabs.Screen
                name="create"
                options={{
                    title: 'Create',
                    headerShown: false,
                    tabBarIcon: ({ color }) => (
                        <FontAwesome name="plus-circle" size={24} color={color} />
                    ),
                }}
            />
                    <Tabs.Screen
                name="profile"
                options={{
                    title: 'Profile',
                    headerShown: false,
                    tabBarIcon: ({ color }) => (
                        <FontAwesome name='user' size={24} color={color} />
                    ),
                }}
            />

        </Tabs>
    )
}

export default TabsLayout