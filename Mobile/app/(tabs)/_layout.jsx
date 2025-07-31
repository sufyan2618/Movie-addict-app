import React from 'react'
import { Tabs } from 'expo-router'
import { FontAwesome } from '@expo/vector-icons'

const TabsLayout = () => {
  return (
    <Tabs>
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