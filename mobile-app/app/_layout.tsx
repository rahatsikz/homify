import '../global.css';

import * as SplashScreen from 'expo-splash-screen';
import { useEffect, useState } from 'react';
import { StatusBar, View } from 'react-native';
import { cn } from '@/lib/utils';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { PortalHost } from '@rn-primitives/portal';
import { Stack } from 'expo-router';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { useColorScheme } from 'nativewind';
import { useAuthStore } from '../hooks/auth-store';
import { DraggableThemeToggler } from '../components/ui/draggable-theme-toggler';

SplashScreen.preventAutoHideAsync();
const queryClient = new QueryClient();

function InnerApp() {
  const [hydrated, setHydrated] = useState(false);
  const { loadAuth } = useAuthStore((state) => state);

  useEffect(() => {
    loadAuth().finally(() => setHydrated(true));
    SplashScreen.hideAsync();
  }, []);

  const { colorScheme } = useColorScheme();

  const isDark = colorScheme === 'dark';

  return (
    <>
      <StatusBar
        barStyle={isDark ? 'light-content' : 'dark-content'}
        backgroundColor={isDark ? '#000' : '#fff'}
      />
      <SafeAreaView
        edges={['bottom', 'top']}
        className={cn(isDark ? 'dark' : '', 'flex-1 bg-background pt-4 px-5')}
      >
        {hydrated && <Stack screenOptions={{ headerShown: false }} />}
        <PortalHost />
        <DraggableThemeToggler />
      </SafeAreaView>
    </>
  );
}

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <QueryClientProvider client={queryClient}>
        <SafeAreaProvider>
          <InnerApp />
        </SafeAreaProvider>
      </QueryClientProvider>
    </GestureHandlerRootView>
  );
}
