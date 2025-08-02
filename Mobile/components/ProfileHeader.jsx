import { View, Text, Image } from 'react-native'
import React from 'react'
import useAuthStore from '../store/useAuthStore'
import { formatProfileDate } from '../util/formatDate'
const ProfileHeader = () => {

const {user} = useAuthStore()
console.log(user)
 const date = formatProfileDate(user.createdAt)

if(!user) {
    return null;
}
  return (
    <View className="flex flex-row rounded-2xl h-auto w-auto m-5 p-5 bg-white">
        <Image 
            source={{ uri: user.profilePicture }} 
            className="w-16 h-16 rounded-full bg-red-400"
        />
        <View className="ml-4 flex flex-col">
            <Text className="text-lg font-bold text-[#800080]">{user.username}</Text>
            <Text className="text-gray-600">{user.email}</Text>
            <Text className="text-gray-600 pt-1">{`Member Since ${date}`}</Text>
        </View>
        
    </View>
  )
}

export default ProfileHeader