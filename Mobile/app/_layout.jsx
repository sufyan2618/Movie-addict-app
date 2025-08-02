import { SplashScreen, Stack, useRouter, useSegments, useRootNavigationState } from "expo-router";
import '../global.css';
import { SafeAreaProvider } from "react-native-safe-area-context";
import SafeScreen from "@/components/SafeScreen"; // Restoring your SafeScreen component
import { StatusBar } from "react-native";
import { useEffect } from "react";
import useAuthStore from "../store/useAuthStore";


export default function RootLayout() {
  SplashScreen.preventAutoHideAsync()

  const {CheckAuth, user, token, isCheckingAuth} = useAuthStore()
  const segments = useSegments()
  const router = useRouter()

  useEffect(()=> {
    CheckAuth()
  }, []);

  setTimeout(() => {
    const isLoggedIn = user && token
    const isTabsRoute = segments[0] === '(tabs)'
    
    if(!isLoggedIn && isTabsRoute){
      router.replace('/(auth)')
    }
    else if( isLoggedIn && !isTabsRoute){
      router.replace('/(tabs)');
    }
    
  }, 2000);

     




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
