import { Colors } from "@/constants/Colors"
import { usePathname, useRouter } from "expo-router"
import type React from "react"
import { Pressable, StyleSheet, useWindowDimensions, View, type ViewProps } from "react-native"
import { useCart } from "../CartContext"
import { ThemedText } from "../ThemedText"
import { CartIcon } from "./CartIcon"
import { LogoImage } from "./LogoImage"

interface HeaderProps extends ViewProps {}

export const Header: React.FC<HeaderProps> = ({ style, ...rest }) => {
  const { state } = useCart()
  const cartCount = state.items.reduce((sum, item) => sum + item.quantity, 0)
  const router = useRouter()
  const pathname = usePathname()
  const { width } = useWindowDimensions()

  const isCartPage = pathname === "/cart" || pathname === "/cart/"
  const isWide = width >= 768
  const isHome = pathname === "/" || pathname === "/index"

  return (
    <View style={[styles.header, isWide && styles.headerWide, style]} {...rest}>
      <View style={styles.leftSection}>
        {isWide ? (
          <Pressable
            onPress={() => router.push("/")}
            accessibilityRole="button"
            accessibilityLabel="View products"
            style={styles.productsLink}
          >
            <ThemedText variant="text-base-semibold" style={styles.productsText}>
              Products
            </ThemedText>
          </Pressable>
        ) : (
          <Pressable onPress={() => router.push("/")} accessibilityRole="button" accessibilityLabel="Go to home">
            <LogoImage />
          </Pressable>
        )}
      </View>

      {/* Center section - Logo on web only */}
      {isWide && (
        <View style={styles.centerSection}>
          <Pressable onPress={() => router.push("/")} accessibilityRole="button" accessibilityLabel="Go to home">
            <LogoImage style={styles.webLogo} />
          </Pressable>
        </View>
      )}

      {/* Right section - Cart icon */}
      <View style={styles.rightSection}>
        <Pressable
          style={[styles.cartIcon, isCartPage && styles.cartIconDisabled]}
          accessibilityRole="button"
          accessibilityLabel="View cart"
          onPress={() => {
            if (!isCartPage) router.push("/cart")
          }}
          disabled={isCartPage}
        >
          <CartIcon />
          {cartCount > 0 && (
            <View style={styles.cartBadge}>
              <ThemedText variant="text-xs-bold" style={styles.cartBadgeText}>
                {cartCount}
              </ThemedText>
            </View>
          )}
        </Pressable>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: Colors.light.background,
    paddingTop:30
  },
  headerWide: {
    paddingHorizontal: 60,
    paddingVertical: 20,
  },
  leftSection: {
    flex: 1,
    alignItems: "flex-start",
    justifyContent: "center",
  },
  centerSection: {
    flex: 2,
    alignItems: "center",
    justifyContent: "center",
  },
  rightSection: {
    flex: 1,
    alignItems: "flex-end",
    justifyContent: "center",
  },
  productsLink: {
    paddingVertical: 8,
    paddingHorizontal: 4,
  },
  productsText: {
    color: Colors.light.gray700,
    fontSize: 16,
  },
  webLogo: {
  },
  mobileLogo: {
  },
  cartIcon: {
    padding: 8,
    position: "relative",
  },
  cartIconDisabled: {
    opacity: 0.5,
  },
  cartBadge: {
    position: "absolute",
    top: 5,
    right: 2,
    minWidth: 14,
    height: 14,
    borderRadius: 8,
    backgroundColor: Colors.light.secondary400,
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1,
    paddingHorizontal: 4,
    borderWidth: 1.5,
    borderColor: Colors.light.secondary400,
  },
  cartBadgeText: {
    color: Colors.light.primary400,
    fontSize: 8,
    fontWeight: "600",
    textAlign: "center",
    lineHeight: 10,
  },
})
