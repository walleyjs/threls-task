import { Colors } from '@/constants/Colors';
import { usePathname, useRouter } from 'expo-router';
import React from 'react';
import { Pressable, StyleSheet, View, ViewProps } from 'react-native';
import { useCart } from '../CartContext';
import { ThemedText } from '../ThemedText';
import { CartIcon } from './CartIcon';
import { LogoImage } from './LogoImage';

interface HeaderProps extends ViewProps {}

export const Header: React.FC<HeaderProps> = ({ style, ...rest }) => {
  const { state } = useCart();
  const cartCount = state.items.reduce((sum, item) => sum + item.quantity, 0);
  const router = useRouter();
  const pathname = usePathname();
  const isCartPage = pathname === '/cart' || pathname === '/cart/';
  return (
    <View style={[styles.header, style]} {...rest}>
      <Pressable
        onPress={() => router.push('/')}
        accessibilityRole="button"
        accessibilityLabel="Go to home"
        style={{}}
      >
        <LogoImage />
      </Pressable>
      <Pressable
        style={[styles.cartIcon, isCartPage && { opacity: 0.5 }]}
        accessibilityRole="button"
        accessibilityLabel="View cart"
        onPress={() => {
          if (!isCartPage) router.push('/cart');
        }}
        disabled={isCartPage}
      >
        <CartIcon />
        {cartCount > 0 && (
          <View style={styles.cartBadge}>
            <ThemedText variant="text-xs-bold" style={styles.cartBadgeText}>{cartCount}</ThemedText>
          </View>
        )}
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 8,
    backgroundColor: Colors.light.background,
  },
  cartIcon: {
    padding: 4,
    position: 'relative',
  },
  cartBadge: {
    position: 'absolute',
    top: -4,
    right: -4,
    minWidth: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: Colors.light.warning500,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1,
    paddingHorizontal: 4,
    borderWidth: 2,
    borderColor: Colors.light.background,
  },
  cartBadgeText: {
    color: Colors.light.background,
    fontSize: 12,
    fontWeight: 'bold',
    textAlign: 'center',
  },
}); 