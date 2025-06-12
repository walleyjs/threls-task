"use client"

import { useCart } from "@/components/CartContext"
import { ThemedText } from "@/components/ThemedText"
import { ThemedView } from "@/components/ThemedView"
import { Header } from "@/components/ui/Header"
import { Colors } from "@/constants/Colors"
import { getProductBySlug, type Product, type ProductVariant } from "@/services/products"
import { Image as ExpoImage } from "expo-image"
import { useLocalSearchParams } from "expo-router"
import { useEffect, useState } from "react"
import { ActivityIndicator, Platform, Pressable, ScrollView, StyleSheet, useWindowDimensions, View } from "react-native"

export default function ProductDetailsScreen() {
  const { slug } = useLocalSearchParams<{ slug: string }>()
  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedImageIdx, setSelectedImageIdx] = useState(0)
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(null)
  const [selectedColor, setSelectedColor] = useState<string | null>(null)
  const [selectedSize, setSelectedSize] = useState<string | null>(null)
  const [quantity, setQuantity] = useState(1)
  const [isWishlisted, setIsWishlisted] = useState(false)
  const { dispatch, state } = useCart()
  const cartCount = state.items.reduce((sum, item) => sum + item.quantity, 0)
  const { width } = useWindowDimensions()
  const isWeb = Platform.OS === "web"
  const isWide = isWeb && width > 900

  useEffect(() => {
    if (!slug) {
      setError("Product slug is missing")
      setLoading(false)
      return
    }
    setLoading(true)
    setError(null)
    getProductBySlug(slug)
      .then((res) => {
        setProduct(res)
        setSelectedVariant(res.product_variants[0] || null)
        const colorOpt = res.product_variants[0]?.variant_type_options.find(
          (opt) => opt.variant_type.name.toLowerCase() === "color",
        )
        const sizeOpt = res.product_variants[0]?.variant_type_options.find(
          (opt) => opt.variant_type.name.toLowerCase() === "size",
        )
        setSelectedColor(colorOpt?.value || null)
        setSelectedSize(sizeOpt?.value || null)
      })
      .catch((e) => setError(e.message || "Failed to load product details"))
      .finally(() => setLoading(false))
  }, [slug])

  useEffect(() => {
    if (!product) return
    const match = product.product_variants.find((v) => {
      const color = v.variant_type_options.find((opt) => opt.variant_type.name.toLowerCase() === "color")?.value
      const size = v.variant_type_options.find((opt) => opt.variant_type.name.toLowerCase() === "size")?.value
      return (selectedColor ? color === selectedColor : true) && (selectedSize ? size === selectedSize : true)
    })
    if (match) setSelectedVariant(match)
  }, [selectedColor, selectedSize, product])

  const handleAddToCart = () => {
    if (selectedVariant) {
      dispatch({ type: "ADD_ITEM", product: product!, variant: selectedVariant, quantity })
    }
  }

  const handleWishlistToggle = () => {
    setIsWishlisted(!isWishlisted)
  }

  if (loading) {
    return (
      <ThemedView style={styles.centered}>
        <ActivityIndicator size="large" color={Colors.light.primary400} />
        <ThemedText variant="text-lg-semibold" style={{ marginTop: 16, color: Colors.light.gray500 }}>
          Loading product details…
        </ThemedText>
      </ThemedView>
    )
  }

  if (error) {
    return (
      <ThemedView style={styles.centered}>
        <ThemedText variant="text-lg-bold" style={{ color: Colors.light.error500 }}>
          {error}
        </ThemedText>
        <ThemedText variant="text-base-regular" style={{ marginTop: 8, color: Colors.light.gray500 }}>
          Please check your connection or try again later.
        </ThemedText>
        <Pressable
          onPress={() => {
            setLoading(true)
            setError(null)
            getProductBySlug(slug)
              .then((res) => setProduct(res))
              .catch((e) => setError(e.message || "Failed to load product details"))
              .finally(() => setLoading(false))
          }}
          accessibilityRole="button"
          style={({ pressed }) => [styles.retryButton, pressed && { opacity: 0.8 }]}
        >
          <ThemedText variant="text-base-bold" style={styles.retryButtonText}>
            Retry
          </ThemedText>
        </Pressable>
      </ThemedView>
    )
  }

  if (!product) {
    return (
      <ThemedView style={styles.centered}>
        <ThemedText variant="text-lg-bold">Product not found.</ThemedText>
      </ThemedView>
    )
  }

  const images = product.media.filter((m) => m.type === "image")
  const mainImage = images[selectedImageIdx]?.conversions?.["medium-square"] || images[selectedImageIdx]?.url
  const allColors = Array.from(
    new Set(
      product.product_variants.flatMap((v) =>
        v.variant_type_options.filter((opt) => opt.variant_type.name.toLowerCase() === "color").map((opt) => opt.value),
      ),
    ),
  )
  const allSizes = Array.from(
    new Set(
      product.product_variants.flatMap((v) =>
        v.variant_type_options.filter((opt) => opt.variant_type.name.toLowerCase() === "size").map((opt) => opt.value),
      ),
    ),
  )
  const price = selectedVariant?.price.formatted || product.product_variants[0]?.price.formatted || ""

  if (isWide) {
    return (
      <View style={styles.webContainer}>
        <Header />
        <ScrollView contentContainerStyle={styles.webScrollContent} showsVerticalScrollIndicator={false}>
          <View style={styles.webContentWrapper}>
            <View style={styles.webProductCard}>
              <View style={styles.webImageSection}>
                <View style={styles.webMainImageContainer}>
                  {mainImage ? (
                    <ExpoImage
                      source={{ uri: mainImage }}
                      style={styles.webMainImage}
                      contentFit="contain"
                      accessibilityLabel={product.title}
                    />
                  ) : (
                    <View style={[styles.webMainImage, styles.imagePlaceholder]}>
                      <ThemedText style={styles.placeholderText}>📦</ThemedText>
                    </View>
                  )}
                </View>

                <View style={styles.webThumbnailRow}>
                  {images.slice(0, 4).map((img, idx) => {
                    const thumb = img.conversions?.["medium-square"] || img.url
                    return (
                      <Pressable
                        key={img.uuid || img.url || idx}
                        onPress={() => setSelectedImageIdx(idx)}
                        style={[styles.webThumbnail, selectedImageIdx === idx && styles.webThumbnailSelected]}
                        accessibilityRole="button"
                        accessibilityLabel={`View image ${idx + 1}`}
                      >
                        {thumb ? (
                          <ExpoImage source={{ uri: thumb }} style={styles.webThumbnailImage} contentFit="contain" />
                        ) : (
                          <View style={styles.thumbnailPlaceholder}>
                            <ThemedText style={styles.thumbnailPlaceholderText}>📦</ThemedText>
                          </View>
                        )}
                      </Pressable>
                    )
                  })}
                </View>
              </View>

              <View style={styles.webInfoSection}>
                <ThemedText variant="text-xl-semibold" style={styles.webTitle}>
                  {product.title}
                </ThemedText>

                <ThemedText variant="text-xl-medium" style={styles.webPrice}>
                  {price}
                </ThemedText>

                <ThemedText variant="text-sm-regular" style={styles.webDescription}>
                  {product.description ||
                    "Discover the joy of farm-fresh asparagus – tender, flavorful, and oh-so-versatile! Whether lightly roasted, grilled to perfection, or simply sautéed, let this vibrant veggie elevate your meals with its delicious taste and nutritional goodness."}
                </ThemedText>

                <View style={styles.webQuantitySection}>
                  <ThemedText variant="text-base-semibold" style={styles.webQuantityLabel}>
                    Quantity
                  </ThemedText>
                  <View style={styles.webQuantityControls}>
                    <Pressable
                      onPress={() => setQuantity((q) => Math.max(1, q - 1))}
                      style={styles.webQuantityButton}
                      accessibilityRole="button"
                      accessibilityLabel="Decrease quantity"
                    >
                      <ThemedText style={styles.webQuantityButtonText}>▲</ThemedText>
                    </Pressable>
                    <Pressable
                      onPress={() => setQuantity((q) => q + 1)}
                      style={styles.webQuantityButton}
                      accessibilityRole="button"
                      accessibilityLabel="Increase quantity"
                    >
                      <ThemedText style={styles.webQuantityButtonText}>▼</ThemedText>
                    </Pressable>
                  </View>
                </View>

                {/* Action Buttons */}
                <View style={styles.webActionRow}>
                  <Pressable
                    onPress={handleAddToCart}
                    style={({ pressed }) => [styles.webAddToBagButton, pressed && { opacity: 0.9 }]}
                    accessibilityRole="button"
                    accessibilityLabel="Add to bag"
                  >
                    <ThemedText variant="text-base-bold" style={styles.webAddToBagText}>
                      Add to bag
                    </ThemedText>
                  </Pressable>

                  <Pressable
                    onPress={handleWishlistToggle}
                    style={styles.webWishlistButton}
                    accessibilityRole="button"
                    accessibilityLabel={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
                  >
                    <ThemedText style={[styles.webWishlistIcon, isWishlisted && styles.webWishlistIconActive]}>
                      {isWishlisted ? "♥" : "♡"}
                    </ThemedText>
                  </Pressable>
                </View>
              </View>
            </View>
          </View>
        </ScrollView>
      </View>
    )
  }

  return (
    <ScrollView style={styles.mobileContainer} showsVerticalScrollIndicator={false}>
      <Header />
      <View style={styles.mobileContent}>
        {mainImage ? (
          <ExpoImage
            source={{ uri: mainImage }}
            style={styles.mobileMainImage}
            contentFit="cover"
            accessibilityLabel={product.title}
          />
        ) : (
          <View style={[styles.mobileMainImage, styles.imagePlaceholder]}>
            <ThemedText style={styles.placeholderText}>📦</ThemedText>
          </View>
        )}

        <View style={styles.mobileThumbnailRow}>
          {images.map((img, idx) => {
            const thumb = img.conversions?.["medium-square"] || img.url
            return (
              <Pressable
                key={img.uuid || img.url || idx}
                onPress={() => setSelectedImageIdx(idx)}
                style={[styles.mobileThumbnail, selectedImageIdx === idx && styles.mobileThumbnailSelected]}
                accessibilityRole="button"
                accessibilityLabel={`View image ${idx + 1}`}
              >
                {thumb ? (
                  <ExpoImage source={{ uri: thumb }} style={styles.mobileThumbnailImage} contentFit="cover" />
                ) : (
                  <View style={styles.thumbnailPlaceholder}>
                    <ThemedText style={styles.thumbnailPlaceholderText}>📦</ThemedText>
                  </View>
                )}
              </Pressable>
            )
          })}
        </View>

        <View style={styles.mobileInfoSection}>
          <ThemedText variant="text-xl-semibold" style={styles.mobileTitle}>
            {product.title}
          </ThemedText>
          <ThemedText variant="text-xl-medium" style={styles.mobilePrice}>
            {price}
          </ThemedText>
          <ThemedText variant="text-sm-regular" style={styles.mobileDescription}>
            {product.description}
          </ThemedText>

          <View style={styles.mobileQuantitySection}>
            <ThemedText variant="text-base-semibold" style={styles.mobileQuantityLabel}>
              Quantity
            </ThemedText>
            <View style={styles.mobileQuantityRow}>
              <Pressable
                onPress={() => setQuantity((q) => Math.max(1, q - 1))}
                style={styles.mobileQuantityButton}
                accessibilityRole="button"
                accessibilityLabel="Decrease quantity"
              >
                <ThemedText variant="text-base-bold">−</ThemedText>
              </Pressable>
              <View style={styles.mobileQuantityDisplay}>
                <ThemedText variant="text-base-regular">{quantity}</ThemedText>
              </View>
              <Pressable
                onPress={() => setQuantity((q) => q + 1)}
                style={styles.mobileQuantityButton}
                accessibilityRole="button"
                accessibilityLabel="Increase quantity"
              >
                <ThemedText variant="text-base-bold">+</ThemedText>
              </Pressable>
            </View>
          </View>

          <Pressable
            onPress={handleAddToCart}
            style={({ pressed }) => [styles.mobileAddToBagButton, pressed && { opacity: 0.9 }]}
            accessibilityRole="button"
            accessibilityLabel="Add to bag"
          >
            <ThemedText variant="text-base-bold" style={styles.mobileAddToBagText}>
              Add to bag
            </ThemedText>
          </Pressable>
        </View>
      </View>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  centered: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 32,
    backgroundColor: Colors.light.background,
  },
  retryButton: {
    marginTop: 24,
    backgroundColor: Colors.light.primary400,
    borderRadius: 8,
    paddingHorizontal: 28,
    paddingVertical: 12,
    alignItems: "center",
    alignSelf: "center",
  },
  retryButtonText: {
    color: Colors.light.background,
    letterSpacing: 0.5,
  },
  imagePlaceholder: {
    backgroundColor: Colors.light.gray100,
    alignItems: "center",
    justifyContent: "center",
  },
  placeholderText: {
    fontSize: 40,
    color: Colors.light.gray400,
  },
  thumbnailPlaceholder: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Colors.light.gray100,
  },
  thumbnailPlaceholderText: {
    fontSize: 20,
    color: Colors.light.gray400,
  },

  webContainer: {
    flex: 1,
    backgroundColor: Colors.light.background,
  },
  webScrollContent: {
    flexGrow: 1,
  },
  webContentWrapper: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingLeft:50,
    paddingRight:200
  },
  webProductCard: {
    flexDirection: "row",
    backgroundColor: Colors.light.background,
    justifyContent:"space-between",
    width: "100%",
    gap: 100,
    alignItems: "flex-start",
  },
  webImageSection: {
    flex: 1,
    alignItems: "center",
    gap: 20,
  },
  webMainImageContainer: {
    width: "100%",
    height: 400,
    borderWidth: 2,
    borderColor: Colors.light.gray50,
    borderRadius: 8,
    padding: 20,
    backgroundColor: Colors.light.background,
  },
  webMainImage: {
    width: "100%",
    height: "100%",
    borderRadius: 4,
  },
  webThumbnailRow: {
    flexDirection: "row",
    gap: 12,
    justifyContent: "center",
  },
  webThumbnail: {
    width: 80,
    height: 80,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: Colors.light.gray200,
    overflow: "hidden",
    backgroundColor: Colors.light.background,
  },
  webThumbnailSelected: {
    borderColor: Colors.light.secondary300,
    backgroundColor: Colors.light.warning50,
  },
  webThumbnailImage: {
    width: "100%",
    height: "100%",
  },
  webInfoSection: {
    flex: 1,
    width: "100%",
    gap: 24,
  },
  webTitle: {
    color: Colors.light.text,
    lineHeight: 36,
    textAlign: "left",
  },
  webPrice: {
    color: Colors.light.primary400,
    textAlign: "left",
  },
  webDescription: {
  
    lineHeight: 24,
    color: Colors.light.gray600,
    textAlign: "left",
  },
  webQuantitySection: {
    gap: 12,
  },
  webQuantityLabel: {
    fontSize: 16,
    fontWeight: "600",
    color: Colors.light.text,
  },
  webQuantityControls: {
    alignItems: "flex-start",
    gap: 4,
  },
  webQuantityButton: {
    width: 24,
    height: 24,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Colors.light.gray100,
    borderRadius: 4,
  },
  webQuantityButtonText: {
    fontSize: 12,
    color: Colors.light.gray600,
    fontWeight: "600",
  },
  webActionRow: {
    flexDirection: "row",
    gap: 16,
    alignItems: "center",
    marginTop: 8,
  },
  webAddToBagButton: {
    flex: 1,
    backgroundColor: Colors.light.primary400,
    borderRadius: 8,
    paddingVertical: 16,
    alignItems: "center",
  },
  webAddToBagText: {
    color: Colors.light.background,
    fontSize: 16,
    fontWeight: "700",
    letterSpacing: 0.5,
  },
  webWishlistButton: {
    width: 48,
    height: 48,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.light.gray300,
    backgroundColor: Colors.light.background,
    alignItems: "center",
    justifyContent: "center",
  },
  webWishlistIcon: {
    fontSize: 20,
    color: Colors.light.gray600,
  },
  webWishlistIconActive: {
    color: Colors.light.error500,
  },

  mobileContainer: {
    flex: 1,
    backgroundColor: Colors.light.background,
  },
  mobileContent: {
    padding: 20,
  },
  mobileMainImage: {
    width: "100%",
    height: 300,
    borderRadius: 12,
    backgroundColor: Colors.light.gray100,
    marginBottom: 16,
  },
  mobileThumbnailRow: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 24,
  },
  mobileThumbnail: {
    width: 60,
    height: 60,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: "transparent",
    overflow: "hidden",
    backgroundColor: Colors.light.gray100,
  },
  mobileThumbnailSelected: {
    borderColor: Colors.light.primary400,
    backgroundColor: Colors.light.primary50,
  },
  mobileThumbnailImage: {
    width: "100%",
    height: "100%",
  },
  mobileInfoSection: {
    gap: 20,
  },
  mobileTitle: {
    color: Colors.light.text,
    lineHeight: 36,
  },
  mobilePrice: {
    color: Colors.light.primary400,
  },
  mobileDescription: {
    lineHeight: 24,
    color: Colors.light.gray600,
  },
  mobileQuantitySection: {
    gap: 12,
  },
  mobileQuantityLabel: {
    fontSize: 16,
    fontWeight: "600",
    color: Colors.light.text,
  },
  mobileQuantityRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  mobileQuantityButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.light.gray100,
    borderWidth: 1,
    borderColor: Colors.light.gray300,
    alignItems: "center",
    justifyContent: "center",
  },
  mobileQuantityDisplay: {
    minWidth: 36,
    alignItems: "center",
  },
  mobileAddToBagButton: {
    backgroundColor: Colors.light.primary400,
    borderRadius: 8,
    paddingVertical: 16,
    alignItems: "center",
    marginTop: 12,
  },
  mobileAddToBagText: {
    color: Colors.light.background,
    fontSize: 16,
    fontWeight: "700",
    letterSpacing: 0.5,
  },
})
