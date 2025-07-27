import { View, Text } from 'react-native'
import React from 'react'
import { Stack } from 'expo-router'

const _layout = () => {
  return (
    <Stack>
        <Stack.Screen name="index" options={
            {title: 'login',
            headerShown: false,
             }} 
             />
        <Stack.Screen name="Signup"options={
            {title: 'Signup',
            headerShown: false,
             }}  />
    </Stack>
  )
}

export default _layout