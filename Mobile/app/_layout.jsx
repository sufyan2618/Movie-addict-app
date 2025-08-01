import { SplashScreen, Stack, useRouter, useSegments, useRootNavigationState } from "expo-router";
import '../global.css';
import { SafeAreaProvider } from "react-native-safe-area-context";
import SafeScreen from "@/components/SafeScreen";
import { StatusBar } from "react-native";
import { useEffect } from "react";
import useAuthStore from "../store/useAuthStore";

export default function RootLayout() {
  SplashScreen.preventAutoHideAsync();
  const segments = useSegments();
  const { CheckAuth, isCheckingAuth, token, user } = useAuthStore();
  const router = useRouter();
  const navigationState = useRootNavigationState();

  useEffect(() => {
    CheckAuth();
  }, []);

  useEffect(() => {
    if (isCheckingAuth || !navigationState?.key) {
      return;
    }

    const isLoggedIn = !!user && !!token;
    const inAuthGroup = segments[0] === "(auth)";

    if (!isLoggedIn && !inAuthGroup) {
      router.replace("/(auth)/");
    } else if (isLoggedIn && inAuthGroup) {
      router.replace("/(tabs)");
    }
    SplashScreen.hideAsync();

  }, [isCheckingAuth, user, token, segments, navigationState]);

  if (isCheckingAuth || !navigationState?.key) {
    return null;
  }

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
