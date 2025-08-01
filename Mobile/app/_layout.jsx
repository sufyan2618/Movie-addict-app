import { SplashScreen, Stack, useRouter, useSegments } from "expo-router";
import '../global.css';
import { SafeAreaProvider } from "react-native-safe-area-context";
import SafeScreen from "@/components/SafeScreen";
import { StatusBar } from "react-native";
import { useEffect } from "react";
import useAuthStore from "../store/useAuthStore";
export default function RootLayout() {

  SplashScreen.preventAutoHideAsync();
  const segments = useSegments()
  const {CheckAuth, isCheckingAuth, token , user} = useAuthStore()
  const router = useRouter();

  useEffect(() => {
    CheckAuth()
  }, [])

  useEffect(() => {
    const isLoggedIn = user && token;
    const isTabsRoute = segments[0] === "(tabs)" 

    if(!isLoggedIn && isTabsRoute) {
      router.replace("/(auth)");
    }
    else if(isLoggedIn && !isTabsRoute) {
      router.replace("/(tabs)");
    }
  } , [user, token, segments]);

  if(!isCheckingAuth) {
    SplashScreen.hideAsync();
  }

  return (
    <SafeAreaProvider>
      <SafeScreen>
      <Stack
        screenOptions={{
          headerShown: false,
        }}>
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="(auth)" />
      </Stack>
      </SafeScreen>
      <StatusBar barStyle="dark-content" />
    </SafeAreaProvider>
  );
}

