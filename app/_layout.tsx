import { useEffect, useState } from "react";
import { Stack, router } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { Platform } from "react-native";
import { StatusBar } from "expo-status-bar";
import { useTheme } from "@/utils/theme";
import { ErrorBoundary } from "./error-boundary";
import { useAuthStore } from "@/store/useAuthStore";
import { AppProvider } from "@/context/AppContext";

export const unstable_settings = {
  initialRouteName: "(tabs)",
};

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const { colors, isDark } = useTheme();
  const { setUser } = useAuthStore();
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    // Hide splash screen after a short delay
    const hideSplash = async () => {
      await new Promise(resolve => setTimeout(resolve, 500));
      await SplashScreen.hideAsync();
      setIsReady(true);
    };
    
    hideSplash();
    
    return () => {
      // Cleanup
    };
  }, []);

  if (!isReady) {
    return null;
  }

  return (
    <AppProvider>
      <ErrorBoundary>
        <StatusBar style={isDark ? 'light' : 'dark'} />
        <RootLayoutNav />
      </ErrorBoundary>
    </AppProvider>
  );
}

function RootLayoutNav() {
  const { colors } = useTheme();
  
  return (
    <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor: colors.background,
        },
        headerTintColor: colors.text,
        headerShadowVisible: false,
        headerTitle: "",
        animation: "slide_from_right",
      }}
    >
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen 
        name="login" 
        options={{ 
          headerShown: false,
          presentation: 'modal'
        }} 
      />
      <Stack.Screen 
        name="signup" 
        options={{ 
          headerShown: false,
          presentation: 'modal'
        }} 
      />
      <Stack.Screen 
        name="account" 
        options={{ 
          headerShown: false,
          presentation: 'card'
        }} 
      />
      <Stack.Screen 
        name="category" 
        options={{ 
          headerShown: true,
          presentation: 'card',
          headerTitle: "Category"
        }} 
      />
      <Stack.Screen 
        name="forgot-password" 
        options={{ 
          headerShown: false,
          presentation: 'modal'
        }} 
      />
      <Stack.Screen 
        name="chat" 
        options={{ 
          headerShown: false,
          presentation: 'card'
        }} 
      />
      <Stack.Screen 
        name="personality-test" 
        options={{ 
          headerShown: false,
          presentation: 'card'
        }} 
      />
      <Stack.Screen 
        name="achievements" 
        options={{ 
          headerShown: false,
          presentation: 'card'
        }} 
      />
      <Stack.Screen 
        name="premium" 
        options={{ 
          headerShown: false,
          presentation: 'card'
        }} 
      />
      <Stack.Screen 
        name="dev-tools" 
        options={{ 
          headerShown: false,
          presentation: 'card'
        }} 
      />
    </Stack>
  );
}
