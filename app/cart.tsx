"use client"

import { useCart } from "@/components/CartContext"
import { ThemedText } from "@/components/ThemedText"
import { CloseIcon } from "@/components/ui/CloseIcon"
import { Footer } from "@/components/ui/Footer"
import { Header } from "@/components/ui/Header"
import { Colors } from "@/constants/Colors"
import { useRouter } from "expo-router"
import { Image, Platform, Pressable, ScrollView, StyleSheet, useWindowDimensions, View } from "react-native"

export default function CartScreen() {
  const { state, dispatch } = useCart()
  const items = state.items
  const { width } = useWindowDimensions()
  const isWide = width >= 900
  const router = useRouter()

  const subtotal = items.reduce((sum, item) => sum + item.variant.price.amount * item.quantity, 0)
  const shipping = items.length ? 2.5 : 0
  const tax = items.length ? 0.5 : 0
  const total = subtotal + shipping + tax

  const increaseQuantity = (productId: number, variantId: number, currentQuantity: number) => {
    dispatch({
      type: "UPDATE_QUANTITY",
      productId,
      variantId,
      quantity: currentQuantity + 1,
    })
  }

  const decreaseQuantity = (productId: number, variantId: number, currentQuantity: number) => {
    if (currentQuantity > 1) {
      dispatch({
        type: "UPDATE_QUANTITY",
        productId,
        variantId,
        quantity: currentQuantity - 1,
      })
    }
  }

  const QuantitySelector = ({ item }: { item: any }) => {
    return (
      <View style={styles.quantitySelector}>
        <Pressable
          style={styles.quantityButton}
          onPress={() => decreaseQuantity(item.product.id, item.variant.id, item.quantity)}
          disabled={item.quantity <= 1}
        >
          <ThemedText style={[styles.quantityButtonText, item.quantity <= 1 && styles.quantityButtonTextDisabled]}>
            -
          </ThemedText>
        </Pressable>

        <View style={styles.quantityValueContainer}>
          <ThemedText style={styles.quantityValue}>{item.quantity}</ThemedText>
        </View>

        <Pressable
          style={styles.quantityButton}
          onPress={() => increaseQuantity(item.product.id, item.variant.id, item.quantity)}
        >
          <ThemedText style={styles.quantityButtonText}>+</ThemedText>
        </Pressable>
      </View>
    )
  }

  if (isWide) {
    return (
      <View style={styles.webContainer}>
        <Header />
        <ScrollView
          style={styles.webScrollView}
          contentContainerStyle={styles.webScrollContent}
          showsVerticalScrollIndicator={true}
        >
          <View style={styles.webContent}>
            <View style={styles.webInnerContent}>
              <ThemedText variant="text-xl-semibold" style={styles.webTitle}>
                My Cart
              </ThemedText>

              <View style={styles.webLayout}>
                <View style={styles.webCartSection}>
                  {items.length === 0 ? (
                    <View style={styles.webEmptyState}>
                      <ThemedText variant="text-lg-regular" style={styles.webEmptyText}>
                        Your cart is empty.
                      </ThemedText>
                    </View>
                  ) : (
                    <View style={styles.webCartTable}>
                      <View style={styles.webTableHeader}>
                        <ThemedText
                          variant="text-xs-medium"
                          style={[styles.webHeaderCell, styles.webProductColumn]}
                        >
                          Product
                        </ThemedText>
                        <ThemedText
                          variant="text-xs-medium"
                          style={[styles.webHeaderCell, styles.webQuantityColumn]}
                        >
                          Quantity
                        </ThemedText>
                        <ThemedText
                          variant="text-xs-medium"
                          style={[styles.webHeaderCell, styles.webSubtotalColumn]}
                        >
                          Subtotal
                        </ThemedText>
                     
                      </View>

                      {items.map((item) => (
                        <View key={`${item.product.id}-${item.variant.id}`} style={styles.webTableRow}>
                          <View style={[styles.webTableCell, styles.webProductColumn]}>
                            <View style={styles.webProductImageContainer}>
                              <Image
                                source={{
                                  uri:
                                    item.product.media[0]?.conversions?.["medium-square"] || item.product.media[0]?.url,
                                }}
                                style={styles.webProductImage}
                                resizeMode="contain"
                              />
                            </View>
                            <View style={styles.webProductInfo}>
                              <ThemedText variant="text-xs-medium" numberOfLines={2} style={styles.webProductTitle}>
                                {item.product.title}
                              </ThemedText>
                              <ThemedText variant="text-xs-medium" style={styles.webPricePerItem}>
                                €{item.variant.price.amount.toFixed(2)}
                              </ThemedText>
                              <ThemedText variant="text-xs-medium" style={styles.webVariantText}>
                                {item.variant.variant_type_options.map((opt) => `${opt.value}`).join(" | ")}
                              </ThemedText>
                            
                            </View>
                          </View>

                          <View style={[styles.webTableCell, styles.webQuantityColumn]}>
                            <QuantitySelector item={item} />
                          </View>

                          <View style={[styles.webTableCell, styles.webSubtotalColumn]}>
                            <ThemedText variant="text-sm-medium" style={styles.webSubtotalPrice}>
                              €{(item.variant.price.amount * item.quantity).toFixed(2)}
                            </ThemedText>
                            <Pressable
                              onPress={() =>
                                dispatch({
                                  type: "REMOVE_ITEM",
                                  productId: item.product.id,
                                  variantId: item.variant.id,
                                })
                              }
                              style={styles.webRemoveButton}
                              accessibilityRole="button"
                              accessibilityLabel="Remove item"
                            >
                              <ThemedText>
                              <CloseIcon/>
                              </ThemedText>
                            </Pressable>
                          </View>
                        </View>
                      ))}
                    </View>
                  )}
                </View>

                <View style={styles.webSummarySection}>
                  <ThemedText variant="text-lg-semibold" style={styles.webSummaryTitle}>
                    Summary
                  </ThemedText>

                  <View style={styles.webSummaryContent}>
                    <View style={styles.webSummaryRow}>
                      <ThemedText variant="text-sm-medium" style={styles.webSummaryLabel}>
                        Subtotal
                      </ThemedText>
                      <ThemedText variant="text-sm-medium" style={styles.webSummaryValue}>
                        €{subtotal.toFixed(2)}
                      </ThemedText>
                    </View>

                    <View style={styles.webSummaryRow}>
                      <ThemedText variant="text-sm-medium" style={styles.webSummaryLabel}>
                        Shipping estimate
                      </ThemedText>
                      <ThemedText variant="text-sm-medium" style={styles.webSummaryValue}>
                        €{shipping.toFixed(2)}
                      </ThemedText>
                    </View>

                    <View style={styles.webSummaryRow}>
                      <ThemedText variant="text-sm-medium" style={styles.webSummaryLabel}>
                        Tax estimate
                      </ThemedText>
                      <ThemedText variant="text-sm-medium" style={styles.webSummaryValue}>
                        €{tax.toFixed(2)}
                      </ThemedText>
                    </View>

                    <View style={[styles.webSummaryRow, styles.webTotalRow]}>
                      <ThemedText variant="text-sm-medium" style={styles.webTotalLabel}>
                        Total
                      </ThemedText>
                      <ThemedText variant="text-sm-medium" style={styles.webTotalValue}>
                        €{total.toFixed(2)}
                      </ThemedText>
                    </View>
                  </View>

                  <Pressable
                    style={[styles.webCheckoutButton, items.length === 0 && styles.checkoutButtonDisabled]}
                    accessibilityRole="button"
                    accessibilityLabel="Checkout"
                    onPress={() => router.push("/checkout")}
                    disabled={items.length === 0}
                  >
                    <ThemedText variant="text-base-bold" style={styles.webCheckoutText}>
                      Checkout
                    </ThemedText>
                  </Pressable>
                </View>
              </View>
            </View>
          </View>
          <Footer />
        </ScrollView>
       
      </View>
    )
  }

  return (
    <View style={styles.mobileContainer}>
      <Header />
      <ScrollView
        style={styles.mobileScrollView}
        contentContainerStyle={styles.mobileScrollContent}
        showsVerticalScrollIndicator={true}
        scrollEnabled={true}
      >
        <View style={styles.mobileContent}>
          <ThemedText variant="text-xl-semibold" style={styles.mobileTitle}>
            My Cart
          </ThemedText>

          {items.length === 0 ? (
            <View style={styles.mobileEmptyState}>
              <ThemedText variant="text-lg-regular" style={styles.mobileEmptyText}>
                Your cart is empty.
              </ThemedText>
            </View>
          ) : (
            <View style={styles.mobileCartCard}>
              <ThemedText variant="text-xs-medium" style={styles.mobileProductHeader}>
                Product
              </ThemedText>

              <View style={styles.mobileItemsList}>
                {items.map((item) => (
                  <View key={`${item.product.id}-${item.variant.id}`} style={styles.mobileCartItem}>
                    <View style={styles.mobileProductRow}>
                      <View style={styles.mobileProductImageContainer}>
                        <Image
                          source={{
                            uri: item.product.media[0]?.conversions?.["medium-square"] || item.product.media[0]?.url,
                          }}
                          style={styles.mobileProductImage}
                          resizeMode="contain"
                        />
                      </View>

                      <View style={styles.mobileProductInfo}>
                        <View style={styles.mobileProductTop}>
                          <ThemedText variant="text-xs-medium" numberOfLines={2} style={styles.mobileProductTitle}>
                            {item.product.title}
                          </ThemedText>
                          <Pressable
                            onPress={() =>
                              dispatch({
                                type: "REMOVE_ITEM",
                                productId: item.product.id,
                                variantId: item.variant.id,
                              })
                            }
                            style={styles.mobileRemoveButton}
                            accessibilityRole="button"
                            accessibilityLabel="Remove item"
                          >
                           
                             <CloseIcon/>
                          
                          </Pressable>
                        </View>

                        <ThemedText variant="text-xs-semibold" style={styles.mobilePricePerItem}>
                          €{item.variant.price.amount.toFixed(2)}
                        </ThemedText>

                        <ThemedText variant="text-xs-regular" style={styles.mobileVariantText}>
                          {item.variant.variant_type_options.map((opt) => `${opt.value}`).join(" | ")}
                        </ThemedText>
                      </View>
                    </View>

                    <View style={styles.mobileControlsRow}>
                      <QuantitySelector item={item} />
                      <ThemedText variant="text-base-medium" style={styles.mobileSubtotalPrice}>
                        €{(item.variant.price.amount * item.quantity).toFixed(2)}
                      </ThemedText>
                    </View>
                  </View>
                ))}
              </View>
            </View>
          )}

          <View style={styles.mobileSummaryCard}>
            <ThemedText variant="text-base-semibold" style={styles.mobileSummaryTitle}>
              Summary
            </ThemedText>

            <View style={styles.mobileSummaryContent}>
              <View style={styles.mobileSummaryRow}>
                <ThemedText variant="text-xs-medium" style={styles.mobileSummaryLabel}>
                  Subtotal
                </ThemedText>
                <ThemedText variant="text-xs-medium" style={styles.mobileSummaryValue}>
                  €{subtotal.toFixed(2)}
                </ThemedText>
              </View>

              <View style={styles.mobileSummaryRow}>
                <ThemedText variant="text-xs-medium" style={styles.mobileSummaryLabel}>
                  Shipping estimate
                </ThemedText>
                <ThemedText variant="text-xs-medium" style={styles.mobileSummaryValue}>
                  €{shipping.toFixed(2)}
                </ThemedText>
              </View>

              <View style={styles.mobileSummaryRow}>
                <ThemedText variant="text-xs-medium" style={styles.mobileSummaryLabel}>
                  Tax estimate
                </ThemedText>
                <ThemedText variant="text-xs-medium" style={styles.mobileSummaryValue}>
                  €{tax.toFixed(2)}
                </ThemedText>
              </View>

              <View style={[styles.mobileSummaryRow, styles.mobileTotalRow]}>
                <ThemedText variant="text-sm-medium" style={styles.mobileTotalLabel}>
                  Total
                </ThemedText>
                <ThemedText variant="text-sm-medium" style={styles.mobileTotalValue}>
                  €{total.toFixed(2)}
                </ThemedText>
              </View>
            </View>

            <Pressable
              style={[styles.mobileCheckoutButton, items.length === 0 && styles.checkoutButtonDisabled]}
              accessibilityRole="button"
              accessibilityLabel="Checkout"
              onPress={() => router.push("/checkout")}
              disabled={items.length === 0}
            >
              <ThemedText variant="text-sm-semibold" style={styles.mobileCheckoutText}>
                Checkout
              </ThemedText>
            </Pressable>
          </View>
        </View>
      </ScrollView>
      {/* <Footer /> */}
    </View>
  )
}

const styles = StyleSheet.create({
  webContainer: {
    flex: 1,
    backgroundColor: Colors.light.background,
  },
  webScrollView: {
    flex: 1,
  },
  webScrollContent: {
    flexGrow: 1,
  },
  webContent: {
    flex: 1,
    width: "100%",
    paddingVertical: 40,
    paddingHorizontal: 60,
  },
  webInnerContent: {
    width: "100%",
  },
  webTitle: {
  
    color: "#001D14",
    marginBottom: 24,
  },
  webLayout: {
    flexDirection: "row",
    gap: 32,
    width: "100%",
    alignItems: "flex-start",
  },
  webCartSection: {
    flex: 3,
    backgroundColor: Colors.light.background,
    borderRadius: 12,
    borderWidth: 1,
    maxWidth:"65%",
    borderColor: Colors.light.gray200,
    overflow: "hidden",
  },
  webEmptyState: {
    paddingVertical: 60,
    alignItems: "center",
  },
  webEmptyText: {
    color: Colors.light.gray500,
    fontSize: 18,
  },
  webCartTable: {
    width: "100%",
  },
  webTableHeader: {
    flexDirection: "row",
    backgroundColor: Colors.light.background,
    paddingVertical: 16,
    paddingHorizontal: 20,
    paddingLeft:40,
    borderBottomWidth: 1,
    borderBottomColor: Colors.light.gray200,
  },
  webHeaderCell: {
    color: Colors.light.gray500,
    fontWeight: "600",
  },
  webProductColumn: {
    flex: 2,
    flexDirection: "row",
  },
  webQuantityColumn: {
    flex: 1,
    justifyContent: "center",
  },
  webSubtotalColumn: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  webTableRow: {
    flexDirection: "row",
    paddingVertical: 50,
    marginHorizontal:30,

    borderBottomWidth: 1,
    borderBottomColor: Colors.light.gray200,
    alignItems: "center",
  },
  webTableCell: {
    justifyContent: "center",
  },
  webProductImageContainer: {
    width: 80,
    height: 80,
    backgroundColor: Colors.light.gray50,
    borderRadius: 4,
    overflow: "hidden",
    marginRight: 16,
    padding: 8,
  },
  webProductImage: {
    width: "100%",
    height: "100%",
  },
  webProductInfo: {
    flex: 1,
    gap: 4,
  },
  webProductTitle: {
    color: Colors.light.gray600,
    lineHeight: 20,
  },
  webVariantText: {
    fontSize: 14,
    color: Colors.light.gray500,
    marginTop: 4,
  },
  webPricePerItem: {
 
    color: Colors.light.gray600,

  },
  webSubtotalPrice: {
   
    color: Colors.light.primary400,
  },
  webRemoveButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  webSummarySection: {
    flex: 1,
    backgroundColor: Colors.light.gray50,
    borderRadius: 8,
    paddingHorizontal:30,
    paddingVertical:30,
    maxWidth:"100%",
  },
  webSummaryTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: Colors.light.text,
    marginBottom: 20,
  },
  webSummaryContent: {
    gap: 30,
    marginBottom: 44,
  },
  webSummaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  webSummaryLabel: {
    color: Colors.light.gray500,
  },
  webSummaryValue: {
    color: Colors.light.gray700,
    fontWeight: "500",
  },
  webTotalRow: {
    paddingVertical: 30,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderTopColor: Colors.light.gray200,
    borderBottomColor: Colors.light.gray200,
    marginTop: 8,
  },
  webTotalLabel: {
    color: Colors.light.gray700,
  },
  webTotalValue: {

    color: Colors.light.gray700,
  },
  webCheckoutButton: {
    backgroundColor: "#2A3990",
    borderRadius: 8,
    paddingVertical: 16,
    alignItems: "center",
  },
  webCheckoutText: {
    color: Colors.light.background,
    fontSize: 16,
    fontWeight: "700",
  },

  mobileContainer: {
    flex: 1,
    backgroundColor: Colors.light.background,
  },
  mobileScrollView: {
    flex: 1,
  },
  mobileScrollContent: {
    flexGrow: 1,
    paddingBottom: 20,
  },
  mobileContent: {
    padding: 20,
    gap: 24,
    width: "100%",
  },
  mobileTitle: {
   
    color: "#001D14",
    marginBottom: 20,
  },
  mobileEmptyState: {
    paddingVertical: 40,
    alignItems: "center",
  },
  mobileEmptyText: {
    color: Colors.light.gray500,
    fontSize: 16,
  },
  mobileCartCard: {
    borderWidth: 1,
    borderColor: Colors.light.gray200,
    borderRadius: 8,
    overflow: "hidden",
  },
  mobileProductHeader: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.light.gray200,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  mobileProductTop: {
   
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  mobileItemsList: {
    width: "100%",
  },
  mobileCartItem: {
    borderBottomWidth: 1,
    borderBottomColor: Colors.light.gray200,
    margin: 16,
    gap: 16,
  },
  mobileProductRow: {
    flexDirection: "row",
    gap: 12,
  },
  mobileProductImageContainer: {
    width: 60,
    height: 60,
    backgroundColor: Colors.light.gray50,
    borderRadius: 4,
    overflow: "hidden",
    padding: 4,
  },
  mobileProductImage: {
    width: "100%",
    height: "100%",
  },
  mobileProductInfo: {
    flex: 1,
    gap: 4,
  },

  mobileProductTitle: {
    flex: 1,
   
    color: Colors.light.gray500,
    lineHeight: 20,
  },
  mobileVariantText: {
    color: Colors.light.gray500,
  },
  mobilePricePerItem: {
    color: Colors.light.gray600,
  },
  mobileRemoveButton: {
  },
  mobileRemoveText: {
    color: Colors.light.gray400,
    fontSize: 1,
  },
  mobileControlsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical:20
  },
  mobileSubtotalPrice: {

    color: Colors.light.primary400,
  },
  mobileSummaryCard: {
    backgroundColor: Colors.light.gray50,
    borderRadius: 8,
    padding: 20,
  },
  mobileSummaryTitle: {
    
    color: Colors.light.gray700,
    marginBottom: 16,
  },
  mobileSummaryContent: {
    gap:20,
    marginBottom: 20,
  },
  mobileSummaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  mobileSummaryLabel: {

    color: Colors.light.gray500,
  },
  mobileSummaryValue: {
  
    color: Colors.light.gray700,
  },
  mobileTotalRow: {
    paddingVertical: 25,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderTopColor: Colors.light.gray200,
    borderBottomColor: Colors.light.gray200,
    marginTop: 8,
  },
  mobileTotalLabel: {

    color: Colors.light.gray700,
  },
  mobileTotalValue: {
   
    color: Colors.light.gray700,
  },
  mobileCheckoutButton: {
    backgroundColor: "#2A3990", 
    borderRadius: 8,
    paddingVertical: 16,
    alignItems: "center",
  },
  mobileCheckoutText: {
    color: Colors.light.background,
  },
  checkoutButtonDisabled: {
    backgroundColor: Colors.light.gray300,
  },

  quantitySelector: {
    flexDirection: "row",
    alignItems: "center",
    height: 36,
    width: 100,
  },
  quantityButton: {
    width: 30,
    height: 30,
    borderWidth: 1,
    borderColor: Colors.light.gray300,
    borderRadius: 4,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Colors.light.background,
    ...Platform.select({
      web: {
        cursor: "pointer",
      },
    }),
  },
  quantityButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: Colors.light.text,
  },
  quantityButtonTextDisabled: {
    color: Colors.light.gray400,
  },
  quantityValueContainer: {
    flex: 1,
    height: 30,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: Colors.light.gray300,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Colors.light.background,
  },
  quantityValue: {
    fontSize: 16,
    fontWeight: "500",
    color: Colors.light.text,
  },
})
