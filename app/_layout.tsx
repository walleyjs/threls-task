import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Suspense } from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import 'react-native-reanimated';

import { CartProvider } from '@/components/CartContext';
import { useColorScheme } from '@/hooks/useColorScheme';

const LoadingScreen: React.FC = () => {
  return (
    <View style={styles.loadingContainer}>
      <ActivityIndicator size="large" />
    </View>
  );
};

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    Inter: require('../assets/fonts/Inter-Regular.ttf'),
  });

  if (!loaded) {
    return null;
  }

  return (
    <CartProvider>
      <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
        <Suspense fallback={<LoadingScreen />}>
          <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="index" />
            <Stack.Screen name="cart" />
            <Stack.Screen name="product/[slug]" />
            <Stack.Screen name="checkout" />
            <Stack.Screen name="+not-found" />
          </Stack>
        </Suspense>
        <StatusBar style="auto" />
      </ThemeProvider>
    </CartProvider>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
