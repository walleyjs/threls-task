"use client"

import { Colors } from "@/constants/Colors"
import type { Product } from "@/services/products"
import { useRouter } from "expo-router"
import type React from "react"
import { Image, Platform, Pressable, StyleSheet, View, useWindowDimensions } from "react-native"
import { ThemedText } from "./ThemedText"
import { CartIcon } from "./ui/CartIcon"
import { HeartIcon } from "./ui/Heart"

interface ProductCardProps {
  product: Product
  onPress?: () => void
  onWishlistPress?: () => void
  onQuickAdd?: () => void
  isWishlisted?: boolean
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onPress,
  onWishlistPress,
  onQuickAdd,
  isWishlisted = false,
}) => {
  const router = useRouter()
  const { width } = useWindowDimensions()
  const image = product.media[0]?.conversions?.["medium-square"] || product.media[0]?.url
  const price = product.product_variants[0]?.price.formatted || ""
  const isWeb = Platform.OS === "web"


  const getCardWidth = () => {
    if (isWeb) {
      if (width > 1100) return (width - 120) / 4 - 24 
      if (width > 800) return (width - 96) / 3 - 24
      return (width - 72) / 2 - 24 
    }
    return (width - 48) / 2 - 8
  }

  const cardWidth = getCardWidth()

  const handlePress = () => {
    if (onPress) {
      onPress()
    } else {
      router.push(`/product/${product.slug}`)
    }
  }

  const handleWishlistPress = (e: any) => {
    e.stopPropagation()
    onWishlistPress?.()
  }

  const handleQuickAdd = (e: any) => {
    e.stopPropagation()
    onQuickAdd?.()
  }

  return (
    <Pressable
      onPress={handlePress}
      style={({ pressed }) => [styles.card, { width: cardWidth }, pressed && { opacity: 0.95 }]}
      accessibilityRole="button"
      accessibilityLabel={`View details for ${product.title}`}
    >
      <View style={styles.imageContainer}>

        {
         Platform.OS === "web" &&  (
                  <View style={styles.buttonContainer}>
                  <Pressable
                    onPress={handleWishlistPress}
                    style={styles.wishlistButton}
                    accessibilityRole="button"
                    accessibilityLabel={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
                  >
                    <ThemedText style={[styles.iconText, isWishlisted && styles.iconTextActive]}>
                      {isWishlisted ? "♥" : <HeartIcon/>}
                    </ThemedText>
                  </Pressable>
                  <Pressable
                    onPress={handleQuickAdd}
                    style={styles.quickAddButton}
                    accessibilityRole="button"
                    accessibilityLabel="Quick add to cart"
                  >
                    <ThemedText style={styles.iconText}> <CartIcon /></ThemedText>
                  </Pressable>
                  </View>
         )
        }
       
       

        {image ? (
          <Image source={{ uri: image }} style={styles.image} resizeMode="contain" accessibilityLabel={product.title} />
        ) : (
          <View style={[styles.image, styles.placeholder]}>
            <ThemedText style={styles.placeholderIcon}>📦</ThemedText>
            <ThemedText style={styles.placeholderText}>No Image</ThemedText>
          </View>
        )}
      </View>

      <View style={styles.info}>
        <ThemedText variant="text-xs-semibold" numberOfLines={2} style={styles.title}>
          {product.title}
        </ThemedText>
        <ThemedText variant="text-sm-bold" style={styles.price}>
          {price}
        </ThemedText>
      </View>
    </Pressable>
  )
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.light.background,
    marginBottom: 16,
    overflow: "visible",
    ...Platform.select({
      web: {
        cursor: "pointer",
      },
    }),
  },
  imageContainer: {
    width: "100%",
    aspectRatio: 1,
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
    marginBottom: 8,
    borderWidth: 1.5,
    borderColor: Colors.light.gray200,
    borderRadius: 10,
  },
  image: {
    width: "90%",
    height: "90%",
  },
  placeholder: {
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 4,
  },
  placeholderIcon: {
    fontSize: 40,
    color: Colors.light.gray400,
    marginBottom: 8,
  },
  placeholderText: {
    fontSize: 12,
    color: Colors.light.gray500,
    fontWeight: "500",
    textAlign: "center",
  },
  wishlistButton: {
    position: "absolute",
    zIndex: 2,
    width: 24,
    height: 24,
    alignItems: "center",
    justifyContent: "center",
  },
  quickAddButton: {
    position: "absolute",
   
    top: 30,
    zIndex: 2,
    width: 24,
    height: 24,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonContainer:{
         display:"flex",
         flexDirection:"column",
         position: "absolute",
         top: 8,
         right: 8,
         zIndex: 2,
         width: 24,
  },
  iconText: {
    fontSize: 25,
    color: Colors.light.gray600,
  },
  iconTextActive: {
    color: Colors.light.error500,
  },
  info: {
    paddingHorizontal: 0,
    gap: 6,
    minHeight: 60,
    justifyContent: "flex-start",
  },
  title: {
    color: Colors.light.text,
    lineHeight: 16,
    fontWeight: "500",
  },
  price: {
    color: Colors.light.primary400,
    fontWeight: "600",
  },
})
