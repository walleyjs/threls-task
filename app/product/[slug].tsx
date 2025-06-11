import { useCart } from '@/components/CartContext';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { Colors } from '@/constants/Colors';
import { getProductBySlug, Product, ProductVariant } from '@/services/products';
import { Image as ExpoImage } from 'expo-image';
import { useLocalSearchParams } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, View } from 'react-native';

export default function ProductDetailsScreen() {
  const { slug } = useLocalSearchParams<{ slug: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedImageIdx, setSelectedImageIdx] = useState(0);
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(null);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const { dispatch } = useCart();

  useEffect(() => {
    if (!slug) {
      setError('Product slug is missing');
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    getProductBySlug(slug)
      .then((res) => {
        setProduct(res);
        setSelectedVariant(res.product_variants[0] || null);
        const colorOpt = res.product_variants[0]?.variant_type_options.find(opt => opt.variant_type.name.toLowerCase() === 'color');
        const sizeOpt = res.product_variants[0]?.variant_type_options.find(opt => opt.variant_type.name.toLowerCase() === 'size');
        setSelectedColor(colorOpt?.value || null);
        setSelectedSize(sizeOpt?.value || null);
      })
      .catch((e) => setError(e.message || 'Failed to load product details'))
      .finally(() => setLoading(false));
  }, [slug]);


  useEffect(() => {
         if (!product) return;
       
         const match = product.product_variants.find(v => {
           const color = v.variant_type_options.find(opt => opt.variant_type.name.toLowerCase() === 'color')?.value;
           const size = v.variant_type_options.find(opt => opt.variant_type.name.toLowerCase() === 'size')?.value;
           return (selectedColor ? color === selectedColor : true) && (selectedSize ? size === selectedSize : true);
         });
       
         if (match) setSelectedVariant(match);
       }, [selectedColor, selectedSize, product]);

  const handleAddToCart = () => {
         if (selectedVariant) {
           dispatch({ type: 'ADD_ITEM', product: product!, variant: selectedVariant, quantity });
         }
       };

  if (loading) {
    return (
      <ThemedView style={styles.centered}>
        <ActivityIndicator size="large" color={Colors.light.primary500} />
        <ThemedText variant="text-lg-semibold" style={{ marginTop: 16 }}>
          Loading product details…
        </ThemedText>
      </ThemedView>
    );
  }

  if (error) {
    return (
      <ThemedView style={styles.centered}>
        <ThemedText variant="text-lg-bold" style={{ color: Colors.light.error500 }}>
          {error}
        </ThemedText>
        <ThemedText variant="text-base-regular" style={{ marginTop: 8 }}>
          Please check your connection or try again later.
        </ThemedText>
        <Pressable
          onPress={() => {
            setLoading(true);
            setError(null);
            getProductBySlug(slug)
              .then((res) => setProduct(res))
              .catch((e) => setError(e.message || 'Failed to load product details'))
              .finally(() => setLoading(false));
          }}
          accessibilityRole="button"
          style={({ pressed }) => [
            styles.retryButton,
            pressed && { opacity: 0.8 },
          ]}
        >
          <ThemedText variant="text-base-bold" style={styles.retryButtonText}>
            Retry
          </ThemedText>
        </Pressable>
      </ThemedView>
    );
  }

  if (!product) {
    return (
      <ThemedView style={styles.centered}>
        <ThemedText variant="text-lg-bold">Product not found.</ThemedText>
      </ThemedView>
    );
  }

  const images = product.media.filter((m) => m.type === 'image');
  const mainImage = images[selectedImageIdx]?.conversions?.['medium-square'] || images[selectedImageIdx]?.url;

  const allColors = Array.from(new Set(product.product_variants.flatMap(v => v.variant_type_options.filter(opt => opt.variant_type.name.toLowerCase() === 'color').map(opt => opt.value))));
  const allSizes = Array.from(new Set(product.product_variants.flatMap(v => v.variant_type_options.filter(opt => opt.variant_type.name.toLowerCase() === 'size').map(opt => opt.value))));

       

  const price = selectedVariant?.price.formatted || product.product_variants[0]?.price.formatted || '';



  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <ThemedText variant="text-xl-bold" style={styles.logo}>Pawlu's</ThemedText>
        <Pressable style={styles.cartIcon} accessibilityRole="button" accessibilityLabel="View cart">
          <IconSymbol name="cart" size={28} color={Colors.light.primary700} />
        </Pressable>
      </View>
      <ThemedView style={styles.content}>
        {mainImage && (
          <ExpoImage source={{ uri: mainImage }} style={styles.image} contentFit="cover" accessibilityLabel={product.title} />
        )}
        <View style={styles.thumbnailsRow}>
          {images.map((img, idx) => {
            const thumb = img.conversions?.['medium-square'] || img.url;
            return (
              <Pressable
                key={img.uuid || img.url || idx}
                onPress={() => setSelectedImageIdx(idx)}
                style={[styles.thumbnail, selectedImageIdx === idx && styles.thumbnailSelected]}
                accessibilityRole="button"
                accessibilityLabel={`View image ${idx + 1}`}
              >
                <ExpoImage source={{ uri: thumb }} style={styles.thumbnailImg} contentFit="cover" />
              </Pressable>
            );
          })}
        </View>
        <ThemedText variant="text-2xl-bold" style={styles.name}>{product.title}</ThemedText>
        <ThemedText variant="text-xl-bold" style={styles.price}>{price}</ThemedText>
        <ThemedText variant="text-base-regular" style={styles.description}>{product.description}</ThemedText>
        {allColors.length > 0 && (
          <View style={styles.selectorBlock}>
            <ThemedText variant="text-base-semibold" style={styles.selectorLabel}>Color</ThemedText>
            <View style={styles.colorRow}>
              {allColors.map((color) => (
                <Pressable
                  key={color}
                  onPress={() => setSelectedColor(color)}
                  style={[styles.colorCircle, selectedColor === color && styles.colorCircleSelected]}
                  accessibilityRole="button"
                  accessibilityLabel={`Select color ${color}`}
                >
                  <View style={[styles.colorSwatch, { backgroundColor: color }]} />
                </Pressable>
              ))}
            </View>
          </View>
        )}
        {allSizes.length > 0 && (
          <View style={styles.selectorBlock}>
            <ThemedText variant="text-base-semibold" style={styles.selectorLabel}>Size</ThemedText>
            <View style={styles.sizeRow}>
              {allSizes.map((size) => (
                <Pressable
                  key={size}
                  onPress={() => setSelectedSize(size)}
                  style={[styles.sizeBox, selectedSize === size && styles.sizeBoxSelected]}
                  accessibilityRole="button"
                  accessibilityLabel={`Select size ${size}`}
                >
                  <ThemedText variant="text-base-regular" style={styles.sizeText}>{size}</ThemedText>
                </Pressable>
              ))}
            </View>
          </View>
        )}
        <View style={styles.selectorBlock}>
          <ThemedText variant="text-base-semibold" style={styles.selectorLabel}>Quantity</ThemedText>
          <View style={styles.qtyRow}>
            <Pressable
              onPress={() => setQuantity(q => Math.max(1, q - 1))}
              style={styles.qtyBtn}
              accessibilityRole="button"
              accessibilityLabel="Decrease quantity"
            >
              <ThemedText variant="text-xl-bold">-</ThemedText>
            </Pressable>
            <ThemedText variant="text-base-regular" style={styles.qtyValue}>{quantity}</ThemedText>
            <Pressable
              onPress={() => setQuantity(q => q + 1)}
              style={styles.qtyBtn}
              accessibilityRole="button"
              accessibilityLabel="Increase quantity"
            >
              <ThemedText variant="text-xl-bold">+</ThemedText>
            </Pressable>
          </View>
        </View>
        <Pressable
          onPress={handleAddToCart}
          style={({ pressed }) => [styles.addToBagBtn, pressed && { opacity: 0.85 }]}
          accessibilityRole="button"
          accessibilityLabel="Add to bag"
        >
          <ThemedText variant="text-base-bold" style={styles.addToBagText}>Add to bag</ThemedText>
        </Pressable>
      </ThemedView>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 8,
  },
  logo: {
    fontFamily: 'SpaceMono',
    color: Colors.light.primary700,
  },
  cartIcon: {
    padding: 4,
  },
  content: {
    padding: 24,
    paddingTop: 0,
  },
  image: {
    width: '100%',
    height: 300,
    borderRadius: 12,
    marginBottom: 16,
    backgroundColor: Colors.light.gray100,
  },
  thumbnailsRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 24,
  },
  thumbnail: {
    borderRadius: 8,
    borderWidth: 2,
    borderColor: 'transparent',
    overflow: 'hidden',
    width: 60,
    height: 60,
    backgroundColor: Colors.light.gray100,
  },
  thumbnailSelected: {
    borderColor: Colors.light.primary400,
    backgroundColor: Colors.light.primary50,
  },
  thumbnailImg: {
    width: '100%',
    height: '100%',
  },
  name: {
    marginBottom: 8,
  },
  price: {
    marginBottom: 16,
    color: Colors.light.primary600,
  },
  description: {
    marginBottom: 24,
    lineHeight: 24,
  },
  selectorBlock: {
    marginBottom: 20,
  },
  selectorLabel: {
    marginBottom: 8,
  },
  colorRow: {
    flexDirection: 'row',
    gap: 12,
  },
  colorCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: 'transparent',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  colorCircleSelected: {
    borderColor: Colors.light.primary400,
    backgroundColor: Colors.light.primary50,
  },
  colorSwatch: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: Colors.light.gray300,
  },
  sizeRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  sizeBox: {
    borderWidth: 1,
    borderColor: Colors.light.gray300,
    borderRadius: 6,
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 8,
    marginBottom: 8,
    backgroundColor: Colors.light.background,
  },
  sizeBoxSelected: {
    borderColor: Colors.light.primary400,
    backgroundColor: Colors.light.primary50,
  },
  sizeText: {
    color: Colors.light.text,
  },
  qtyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  qtyBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.light.gray100,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: Colors.light.gray300,
  },
  qtyValue: {
    minWidth: 32,
    textAlign: 'center',
  },
  addToBagBtn: {
    marginTop: 24,
    backgroundColor: Colors.light.primary600,
    borderRadius: 8,
    paddingHorizontal: 28,
    paddingVertical: 14,
    alignItems: 'center',
    alignSelf: 'stretch',
    shadowColor: Colors.light.primary700,
    shadowOpacity: 0.12,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  addToBagText: {
    color: Colors.light.background,
    letterSpacing: 0.5,
  },
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
  },
  retryButton: {
    marginTop: 24,
    backgroundColor: Colors.light.primary600,
    borderRadius: 8,
    paddingHorizontal: 28,
    paddingVertical: 12,
    alignItems: 'center',
    alignSelf: 'center',
    shadowColor: Colors.light.primary700,
    shadowOpacity: 0.12,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  retryButtonText: {
    color: Colors.light.background,
    letterSpacing: 0.5,
  },
}); 