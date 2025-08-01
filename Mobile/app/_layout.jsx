import { SplashScreen, Stack, useRouter, useSegments, useRootNavigationState } from "expo-router";
import '../global.css';
import { SafeAreaProvider } from "react-native-safe-area-context";
import SafeScreen from "@/components/SafeScreen"; // Restoring your SafeScreen component
import { StatusBar } from "react-native";
import { use, useEffect } from "react";
import useAuthStore from "../store/useAuthStore";


export default function RootLayout() {

  const {CheckAuth, user, token} = useAuthStore()
  const segments = useSegments()
  const router = useRouter()

  useEffect(()=> {
    CheckAuth()
  }, []);

  useEffect(() =>{
    const isLoggedIn = user && token
    const isTabsRoute = segments[0] === '(tabs)'

    if(!isLoggedIn && isTabsRoute){
      router.replace('/(auth)')
    }
    else if( isLoggedIn && !isTabsRoute){
      router.replace('/(tabs)');
    }

  }, [segments, user, token])



  return (
    <SafeAreaProvider>
      <SafeScreen>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="(tabs)" />
          <Stack.Screen name="(auth)" />
        </Stack>
      </SafeScreen>
      <StatusBar barStyle="dark-content" />
    </SafeAreaProvider>
  );
}
