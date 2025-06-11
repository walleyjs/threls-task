import { Colors } from '@/constants/Colors';
import { Product } from '@/services/products';
import { useRouter } from 'expo-router';
import React from 'react';
import { Image, Platform, Pressable, StyleSheet, View } from 'react-native';
import { ThemedText } from './ThemedText';
import { ThemedView } from './ThemedView';

interface ProductCardProps {
  product: Product;
  onPress?: () => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onPress }) => {
  const router = useRouter();
  const image = product.media[0]?.conversions?.['medium-square'] || product.media[0]?.url;
  const price = product.product_variants[0]?.price.formatted || '';
  const colorScheme = Platform.OS === 'web' ? 'light' : undefined;

  return (
    <Pressable
      onPress={() => {
        if (onPress) {
          onPress();
        } else {
          router.push(`/product/${product.slug}`);
        }
      }}
      style={({ pressed }) => [
        styles.card,
        pressed && { opacity: 0.92 },
        { backgroundColor: Colors.light.background },
      ]}
      accessibilityRole="button"
      accessibilityLabel={`View details for ${product.name}`}
    >
      <ThemedView style={styles.imageContainer}>
        {image ? (
          <Image
            source={{ uri: image }}
            style={styles.image}
            resizeMode="contain"
            accessibilityLabel={product.title}
          />
        ) : (
          <View style={[styles.image, styles.placeholder]} />
        )}
      </ThemedView>
      <View style={styles.info}>
        <ThemedText
          variant="text-base-semibold"
          numberOfLines={2}
          style={styles.title}
        >
          {product.title}
        </ThemedText>
        <ThemedText
          variant="text-lg-bold"
          style={styles.price}
        >
          {price}
        </ThemedText>
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
    margin: 4,
    width: 180,
    backgroundColor: Colors.light.background,
    ...Platform.select({
      web: { cursor: 'pointer' },
    }),
  },
  imageContainer: {
    width: '100%',
    aspectRatio: 1,
    backgroundColor: Colors.light.gray100,
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    width: '90%',
    height: '90%',
    borderRadius: 8,
  },
  placeholder: {
    backgroundColor: Colors.light.gray200,
  },
  info: {
    padding: 12,
    gap: 4,
  },
  title: {
    marginBottom: 2,
  },
  price: {
    color: Colors.light.primary700,
  },
}); 