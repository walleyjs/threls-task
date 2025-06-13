"use client"

import { useCart } from "@/components/CartContext"
import { ThemedText } from "@/components/ThemedText"
import { ThemedView } from "@/components/ThemedView"
import { Footer } from "@/components/ui/Footer"
import { Header } from "@/components/ui/Header"
import { HeartIcon } from "@/components/ui/Heart"
import { Colors } from "@/constants/Colors"
import { getProductBySlug, type Product, type ProductVariant } from "@/services/products"
import { Image as ExpoImage } from "expo-image"
import { useLocalSearchParams } from "expo-router"
import { useEffect, useState } from "react"
import {
  ActivityIndicator,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  TextInput,
  useWindowDimensions,
  View,
} from "react-native"

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

                {/* Color selection if available */}
                {allColors.length > 0 && (
                  <View style={styles.webColorSection}>
                    <ThemedText variant="text-base-semibold" style={styles.webSectionLabel}>
                      Color
                    </ThemedText>
                    <View style={styles.webColorOptions}>
                      {allColors.map((color) => (
                        <Pressable
                          key={color}
                          style={[styles.webColorOption, selectedColor === color && styles.webColorOptionSelected]}
                          onPress={() => setSelectedColor(color)}
                          accessibilityRole="button"
                          accessibilityLabel={`Select color ${color}`}
                        >
                          <View style={[styles.webColorCircle, { backgroundColor: color.toLowerCase() }]} />
                        </Pressable>
                      ))}
                    </View>
                  </View>
                )}

                {allSizes.length > 0 && (
                  <View style={styles.webSizeSection}>
                    <ThemedText variant="text-base-semibold" style={styles.webSectionLabel}>
                      Size
                    </ThemedText>
                    <View style={styles.webSizeOptions}>
                      {allSizes.map((size) => (
                        <Pressable
                          key={size}
                          style={[styles.webSizeOption, selectedSize === size && styles.webSizeOptionSelected]}
                          onPress={() => setSelectedSize(size)}
                          accessibilityRole="button"
                          accessibilityLabel={`Select size ${size}`}
                        >
                          <ThemedText style={[styles.webSizeText, selectedSize === size && styles.webSizeTextSelected]}>
                            {size}
                          </ThemedText>
                        </Pressable>
                      ))}
                    </View>
                  </View>
                )}

                <View style={styles.webQuantitySection}>
                  <ThemedText variant="text-base-semibold" style={styles.webSectionLabel}>
                    Quantity
                  </ThemedText>
                  <View style={styles.webQuantityContainer}>
                    <Pressable
                      onPress={() => setQuantity((q) => Math.max(1, q - 1))}
                      style={styles.webQuantityButton}
                      accessibilityRole="button"
                      accessibilityLabel="Decrease quantity"
                    >
                      <ThemedText style={styles.webQuantityButtonText}>−</ThemedText>
                    </Pressable>

                    <View style={styles.webQuantityInputContainer}>
                      <TextInput
                        value={quantity.toString()}
                        onChangeText={(text) => {
                          const num = Number.parseInt(text, 10)
                          if (!isNaN(num) && num > 0) {
                            setQuantity(num)
                          } else if (text === "") {
                            setQuantity(1)
                          }
                        }}
                        keyboardType="numeric"
                        style={styles.webQuantityInput}
                        accessibilityLabel="Quantity"
                      />
                      <View style={styles.webQuantityArrows}>
                        <Pressable
                          onPress={() => setQuantity((q) => q + 1)}
                          style={styles.webQuantityArrowButton}
                          accessibilityRole="button"
                          accessibilityLabel="Increase quantity"
                        >
                          <ThemedText style={styles.webQuantityArrowText}>▲</ThemedText>
                        </Pressable>
                        <Pressable
                          onPress={() => setQuantity((q) => Math.max(1, q - 1))}
                          style={styles.webQuantityArrowButton}
                          accessibilityRole="button"
                          accessibilityLabel="Decrease quantity"
                        >
                          <ThemedText style={styles.webQuantityArrowText}>▼</ThemedText>
                        </Pressable>
                      </View>
                    </View>

                    <Pressable
                      onPress={() => setQuantity((q) => q + 1)}
                      style={styles.webQuantityButton}
                      accessibilityRole="button"
                      accessibilityLabel="Increase quantity"
                    >
                      <ThemedText style={styles.webQuantityButtonText}>+</ThemedText>
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
                      {isWishlisted ? "♥" : <HeartIcon />}
                    </ThemedText>
                  </Pressable>
                </View>
              </View>
            </View>
          </View>
          <Footer/>
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

          {/* Color selection if available */}
          {allColors.length > 0 && (
            <View style={styles.mobileColorSection}>
              <ThemedText variant="text-base-semibold" style={styles.mobileSectionLabel}>
                Color
              </ThemedText>
              <View style={styles.mobileColorOptions}>
                {allColors.map((color) => (
                  <Pressable
                    key={color}
                    style={[styles.mobileColorOption, selectedColor === color && styles.mobileColorOptionSelected]}
                    onPress={() => setSelectedColor(color)}
                    accessibilityRole="button"
                    accessibilityLabel={`Select color ${color}`}
                  >
                    <View style={[styles.mobileColorCircle, { backgroundColor: color.toLowerCase() }]} />
                  </Pressable>
                ))}
              </View>
            </View>
          )}

          {allSizes.length > 0 && (
            <View style={styles.mobileSizeSection}>
              <ThemedText variant="text-base-semibold" style={styles.mobileSectionLabel}>
                Size
              </ThemedText>
              <View style={styles.mobileSizeOptions}>
                {allSizes.map((size) => (
                  <Pressable
                    key={size}
                    style={[styles.mobileSizeOption, selectedSize === size && styles.mobileSizeOptionSelected]}
                    onPress={() => setSelectedSize(size)}
                    accessibilityRole="button"
                    accessibilityLabel={`Select size ${size}`}
                  >
                    <ThemedText style={[styles.mobileSizeText, selectedSize === size && styles.mobileSizeTextSelected]}>
                      {size}
                    </ThemedText>
                  </Pressable>
                ))}
              </View>
            </View>
          )}

          <View style={styles.mobileQuantitySection}>
            <ThemedText variant="text-base-semibold" style={styles.mobileSectionLabel}>
              Quantity
            </ThemedText>
            <View style={styles.mobileQuantityContainer}>
              <View style={styles.mobileQuantityInputWrapper}>
                <TextInput
                  value={quantity.toString()}
                  onChangeText={(text) => {
                    const num = Number.parseInt(text, 10)
                    if (!isNaN(num) && num > 0) {
                      setQuantity(num)
                    } else if (text === "") {
                      setQuantity(1)
                    }
                  }}
                  keyboardType="numeric"
                  style={styles.mobileQuantityInput}
                  accessibilityLabel="Quantity"
                />
                <View style={styles.mobileQuantityArrows}>
                  <Pressable
                    onPress={() => setQuantity((q) => q + 1)}
                    style={styles.mobileQuantityArrowButton}
                    accessibilityRole="button"
                    accessibilityLabel="Increase quantity"
                  >
                    <ThemedText style={styles.mobileQuantityArrowText}>▲</ThemedText>
                  </Pressable>
                  <Pressable
                    onPress={() => setQuantity((q) => Math.max(1, q - 1))}
                    style={styles.mobileQuantityArrowButton}
                    accessibilityRole="button"
                    accessibilityLabel="Decrease quantity"
                  >
                    <ThemedText style={styles.mobileQuantityArrowText}>▼</ThemedText>
                  </Pressable>
                </View>
              </View>
            </View>
          </View>

          <View style={styles.mobileActionRow}>
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
            <Pressable
              onPress={handleWishlistToggle}
              style={styles.mobileWishlistButton}
              accessibilityRole="button"
              accessibilityLabel={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
            >
              <ThemedText style={[styles.mobileWishlistIcon, isWishlisted && styles.mobileWishlistIconActive]}>
                {isWishlisted ? "♥" : <HeartIcon />}
              </ThemedText>
            </Pressable>
          </View>
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
    paddingLeft: 50,
    paddingRight: 200,
    paddingBottom:100,
  },
  webProductCard: {
    flexDirection: "row",
    backgroundColor: Colors.light.background,
    justifyContent: "space-between",
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
  webSectionLabel: {
    fontSize: 16,
    fontWeight: "600",
    color: Colors.light.text,
    marginBottom: 12,
  },
  webColorSection: {
    marginBottom: 8,
  },
  webColorOptions: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  webColorOption: {
    padding: 4,
    borderRadius: 50,
    borderWidth: 2,
    borderColor: "transparent",
  },
  webColorOptionSelected: {
    borderColor: Colors.light.primary400,
  },
  webColorCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.light.gray300,
  },
  webSizeSection: {
    marginBottom: 8,
  },
  webSizeOptions: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  webSizeOption: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: Colors.light.gray300,
    backgroundColor: Colors.light.background,
  },
  webSizeOptionSelected: {
    borderColor: Colors.light.primary400,
    backgroundColor: Colors.light.primary50,
  },
  webSizeText: {
    color: Colors.light.text,
    fontSize: 14,
  },
  webSizeTextSelected: {
    color: Colors.light.primary400,
    fontWeight: "600",
  },
  webQuantitySection: {
    marginBottom: 8,
  },
  webQuantityContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  webQuantityButton: {
    width: 36,
    height: 36,
    borderRadius: 4,
    backgroundColor: Colors.light.background,
    borderWidth: 1,
    borderColor: Colors.light.gray300,
    alignItems: "center",
    justifyContent: "center",
  },
  webQuantityButtonText: {
    fontSize: 18,
    color: Colors.light.text,
    fontWeight: "600",
  },
  webQuantityInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: Colors.light.gray300,
    borderRadius: 4,
    overflow: "hidden",
    height: 36,
  },
  webQuantityInput: {
    width: 40,
    height: "100%",
    textAlign: "center",
    color: Colors.light.text,
    fontSize: 16,
    paddingHorizontal: 4,
  },
  webQuantityArrows: {
    height: "100%",
    borderLeftWidth: 1,
    borderLeftColor: Colors.light.gray300,
  },
  webQuantityArrowButton: {
    height: "50%",
    width: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  webQuantityArrowText: {
    fontSize: 10,
    color: Colors.light.gray600,
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
    fontSize: 25,
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
  mobileSectionLabel: {
    fontSize: 16,
    fontWeight: "600",
    color: Colors.light.text,
    marginBottom: 12,
  },
  mobileColorSection: {
    marginBottom: 8,
  },
  mobileColorOptions: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  mobileColorOption: {
    padding: 4,
    borderRadius: 50,
    borderWidth: 2,
    borderColor: "transparent",
  },
  mobileColorOptionSelected: {
    borderColor: Colors.light.primary400,
  },
  mobileColorCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.light.gray300,
  },
  mobileSizeSection: {
    marginBottom: 8,
  },
  mobileSizeOptions: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  mobileSizeOption: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: Colors.light.gray300,
    backgroundColor: Colors.light.background,
  },
  mobileSizeOptionSelected: {
    borderColor: Colors.light.primary400,
    backgroundColor: Colors.light.primary50,
  },
  mobileSizeText: {
    color: Colors.light.text,
    fontSize: 14,
  },
  mobileSizeTextSelected: {
    color: Colors.light.primary400,
    fontWeight: "600",
  },
  mobileQuantitySection: {
    marginBottom: 8,
  },
  mobileQuantityContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  mobileQuantityInputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: Colors.light.gray300,
    borderRadius: 4,
    overflow: "hidden",
    height: 40,
  },
  mobileQuantityInput: {
    width: 60,
    height: "100%",
    textAlign: "center",
    color: Colors.light.text,
    fontSize: 16,
    paddingHorizontal: 4,
  },
  mobileQuantityArrows: {
    height: "100%",
    borderLeftWidth: 1,
    borderLeftColor: Colors.light.gray300,
  },
  mobileQuantityArrowButton: {
    height: "50%",
    width: 24,
    alignItems: "center",
    justifyContent: "center",
  },
  mobileQuantityArrowText: {
    fontSize: 10,
    color: Colors.light.gray600,
  },
  mobileActionRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginTop: 16,
  },
  mobileAddToBagButton: {
    flex: 1,
    backgroundColor: Colors.light.primary400,
    borderRadius: 8,
    paddingVertical: 16,
    alignItems: "center",
  },
  mobileAddToBagText: {
    color: Colors.light.background,
    fontSize: 16,
    fontWeight: "700",
    letterSpacing: 0.5,
  },
  mobileWishlistButton: {
    width: 48,
    height: 48,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.light.gray300,
    backgroundColor: Colors.light.background,
    alignItems: "center",
    justifyContent: "center",
  },
  mobileWishlistIcon: {
    fontSize: 25,
    color: Colors.light.gray600,
  },
  mobileWishlistIconActive: {
    color: Colors.light.error500,
  },
})
