import { ActivityIndicator, Alert, Image, Platform, Text, TextInput, TouchableOpacity, View } from "react-native";
import { useState } from "react";
import { FontAwesome } from "@expo/vector-icons";
import { Link, useRouter } from "expo-router";
import { KeyboardAvoidingView } from "react-native";
import useAuthStore from "../../store/useAuthStore";
export default function Index() {

  const [email, setEmail] = useState("");
  const router = useRouter()
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const {isLoggingIn, Login} = useAuthStore()
  const handleLogin = async () => {
    if(!email || !password){
      Alert.alert("Please fill in All fields");
    }
    const response = await Login(email, password)
    if(response.error){
      Alert.alert("Error:", response.error)
    }
    else if(response.success) {
      Alert.alert("Logged In Successfully")
      router.push('/')
    }
  } 


  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      className="flex-1"
    >
    <View className="bg-[#d896ff] w-full h-full flex justify-center">
      <Image
        source={require("../../assets/images/i.png")}
        className="w-full h-64 mt-6"
        resizeMode="contain"
      />
      <View className="flex bg-[#efbbff] m-7 pl-2 pr-2 h-auto pb-10 mb-8 rounded-xl">
        <Text className="text-2xl text-[#800080] text-center mt-10 font-bold">Movies Addict</Text>
        <Text className="text-lg text-gray-800 text-center mt-2">Discover the latest movies and TV shows</Text>
        <View className="flex flex-col mt-2">
          <Text className="text-gray-800  mb-1 text-lg font-bold m-4">
            Email
          </Text>
          <View className="flex flex-row items-center bg-white ml-4 mr-4 p-2 h-16 rounded-lg">
            <FontAwesome name="envelope" size={24} color="#800080" className="pl-2" />
            <TextInput
              value={email}
              onChangeText={setEmail}
              className="bg-white ml-4 mr-4 p-2 h-16 rounded-lg  "
              placeholder="Enter your name"
              keyboardType="email-address"

              autoCapitalize="none"
              autoCorrect={false}
            />
          </View>
        </View>
        <View className="flex flex-col mt-2">
          <Text className="text-gray-800  mb-1 text-lg font-bold m-4">
            Password
          </Text>
          <View className="flex flex-row items-center bg-white ml-4 mr-4 p-2 h-16 rounded-lg">
            <FontAwesome name="lock" size={24} color="#800080" className="pl-2" />
            <View className="flex flex-row items-center flex-1 bg-white ml-4 mr-4 h-16 rounded-lg">
              <TextInput
                value={password}
                onChangeText={setPassword}
                className="flex-1 p-2"
                placeholder="Enter your password"
                keyboardType="default"
                secureTextEntry={!showPassword}
                autoCapitalize="none"
                autoCorrect={false}
              />
              <TouchableOpacity
               onPress={() => setShowPassword(!showPassword)}>
                <FontAwesome
                  name={showPassword ? "eye-slash" : "eye"}
                  size={24}
                  color="#800080"
                />
              </TouchableOpacity>
            </View>
          </View>
        </View>

        <View className="flex flex-col mt-6">
          <TouchableOpacity
          disabled={isLoggingIn}
            onPress={handleLogin}
            className={`ml-5 mr-5 p-4 rounded-xl items-center ${
              isLoggingIn ? "bg-[#800080]/50" : "bg-[#800080]"
            }`}
          >
            {isLoggingIn ? (<ActivityIndicator color="white" size={24} />) : (<Text className="text-white text-lg font-bold">Login</Text>) }
          </TouchableOpacity>
        </View>
        <View className="flex flex-row justify-center mt-4">
          <Text className="text-gray-800 text-lg">Already have an account?</Text>
          <Link 
href="/(auth)/Signup" className="text-[#800080] text-lg ml-2 font-bold">
            Sign Up
          </Link>
          </View>
      </View>

    </View>   
    </KeyboardAvoidingView>
  );
}