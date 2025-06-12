import { useCart } from '@/components/CartContext';
import { ThemedText } from '@/components/ThemedText';
import { Header } from '@/components/ui/Header';
import { Colors } from '@/constants/Colors';
import { useRouter } from 'expo-router';
import React from 'react';
import { Image, Pressable, ScrollView, StyleSheet, useWindowDimensions, View } from 'react-native';

export default function CartScreen() {
  const { state, dispatch } = useCart();
  const items = state.items;
  const { width } = useWindowDimensions();
  const isWide = width >= 900;
  const router = useRouter();

  const subtotal = items.reduce((sum, item) => sum + item.variant.price.amount * item.quantity, 0);
  const shipping = items.length ? 2.5 : 0;
  const tax = items.length ? 1.5 : 0;
  const total = subtotal + shipping + tax;

  if (isWide) {
    return (
      <View style={styles.webContainer}>
        <Header />
        <View style={styles.webContent}>
          <View style={styles.webLayout}>
            <View style={styles.webCartSection}>
              <View style={styles.webCartCard}>
                <ThemedText variant="text-2xl-bold" style={styles.webTitle}>
                  My Cart
                </ThemedText>
                
                {items.length === 0 ? (
                  <View style={styles.webEmptyState}>
                    <ThemedText variant="text-lg-regular" style={styles.webEmptyText}>
                      Your cart is empty.
                    </ThemedText>
                  </View>
                ) : (
                  <View style={styles.webCartTable}>
                    <View style={styles.webTableHeader}>
                      <ThemedText variant="text-base-semibold" style={[styles.webHeaderCell, styles.webProductColumn]}>
                        Product
                      </ThemedText>
                      <ThemedText variant="text-base-semibold" style={[styles.webHeaderCell, styles.webQuantityColumn]}>
                        Quantity
                      </ThemedText>
                      <ThemedText variant="text-base-semibold" style={[styles.webHeaderCell, styles.webSubtotalColumn]}>
                        Subtotal
                      </ThemedText>
                      <View style={styles.webRemoveColumn} />
                    </View>

                    {items.map((item, idx) => (
                      <View key={`${item.product.id}-${item.variant.id}`} style={styles.webTableRow}>
                        <View style={[styles.webTableCell, styles.webProductColumn]}>
                          <Image
                            source={{ 
                              uri: item.product.media[0]?.conversions?.['medium-square'] || item.product.media[0]?.url 
                            }}
                            style={styles.webProductImage}
                          />
                          <View style={styles.webProductInfo}>
                            <ThemedText variant="text-base-semibold" numberOfLines={2} style={styles.webProductTitle}>
                              {item.product.title}
                            </ThemedText>
                            <ThemedText variant="text-sm-regular" style={styles.webVariantText}>
                              {item.variant.variant_type_options.map(opt => opt.value).join(' | ')}
                            </ThemedText>
                            <ThemedText variant="text-sm-regular" style={styles.webPricePerItem}>
                              €{item.variant.price.amount.toFixed(2)} each
                            </ThemedText>
                          </View>
                        </View>

                        <View style={[styles.webTableCell, styles.webQuantityColumn]}>
                          <View style={styles.webQuantityControls}>
                            <Pressable
                              onPress={() => dispatch({ 
                                type: 'UPDATE_QUANTITY', 
                                productId: item.product.id, 
                                variantId: item.variant.id, 
                                quantity: Math.max(1, item.quantity - 1) 
                              })}
                              style={styles.webQuantityButton}
                              accessibilityRole="button"
                              accessibilityLabel="Decrease quantity"
                            >
                              <ThemedText variant="text-base-bold">−</ThemedText>
                            </Pressable>
                            <View style={styles.webQuantityDisplay}>
                              <ThemedText variant="text-base-regular">{item.quantity}</ThemedText>
                            </View>
                            <Pressable
                              onPress={() => dispatch({ 
                                type: 'UPDATE_QUANTITY', 
                                productId: item.product.id, 
                                variantId: item.variant.id, 
                                quantity: item.quantity + 1 
                              })}
                              style={styles.webQuantityButton}
                              accessibilityRole="button"
                              accessibilityLabel="Increase quantity"
                            >
                              <ThemedText variant="text-base-bold">+</ThemedText>
                            </Pressable>
                          </View>
                        </View>

                        <View style={[styles.webTableCell, styles.webSubtotalColumn]}>
                          <ThemedText variant="text-lg-bold" style={styles.webSubtotalPrice}>
                            €{(item.variant.price.amount * item.quantity).toFixed(2)}
                          </ThemedText>
                        </View>

                        <View style={[styles.webTableCell, styles.webRemoveColumn]}>
                          <Pressable
                            onPress={() => dispatch({ 
                              type: 'REMOVE_ITEM', 
                              productId: item.product.id, 
                              variantId: item.variant.id 
                            })}
                            style={styles.webRemoveButton}
                            accessibilityRole="button"
                            accessibilityLabel="Remove item"
                          >
                            <ThemedText variant="text-lg-bold" style={styles.webRemoveText}>×</ThemedText>
                          </Pressable>
                        </View>
                      </View>
                    ))}
                  </View>
                )}
              </View>
            </View>

            <View style={styles.webSummarySection}>
              <View style={styles.webSummaryCard}>
                <ThemedText variant="text-xl-bold" style={styles.webSummaryTitle}>
                  Summary
                </ThemedText>
                
                <View style={styles.webSummaryContent}>
                  <View style={styles.webSummaryRow}>
                    <ThemedText variant="text-base-regular" style={styles.webSummaryLabel}>
                      Subtotal
                    </ThemedText>
                    <ThemedText variant="text-base-regular" style={styles.webSummaryValue}>
                      €{subtotal.toFixed(2)}
                    </ThemedText>
                  </View>
                  
                  <View style={styles.webSummaryRow}>
                    <ThemedText variant="text-base-regular" style={styles.webSummaryLabel}>
                      Shipping estimate
                    </ThemedText>
                    <ThemedText variant="text-base-regular" style={styles.webSummaryValue}>
                      €{shipping.toFixed(2)}
                    </ThemedText>
                  </View>
                  
                  <View style={styles.webSummaryRow}>
                    <ThemedText variant="text-base-regular" style={styles.webSummaryLabel}>
                      Tax estimate
                    </ThemedText>
                    <ThemedText variant="text-base-regular" style={styles.webSummaryValue}>
                      €{tax.toFixed(2)}
                    </ThemedText>
                  </View>
                  
                  <View style={[styles.webSummaryRow, styles.webTotalRow]}>
                    <ThemedText variant="text-lg-bold" style={styles.webTotalLabel}>
                      Total
                    </ThemedText>
                    <ThemedText variant="text-lg-bold" style={styles.webTotalValue}>
                      €{total.toFixed(2)}
                    </ThemedText>
                  </View>
                </View>

                <Pressable
                  style={styles.webCheckoutButton}
                  accessibilityRole="button"
                  accessibilityLabel="Checkout"
                  onPress={() => router.push('/checkout')}
                >
                  <ThemedText variant="text-base-bold" style={styles.webCheckoutText}>
                    Checkout
                  </ThemedText>
                </Pressable>
              </View>
            </View>
          </View>
        </View>
      </View>
    );
  }

  return (
    <ScrollView style={styles.mobileContainer} showsVerticalScrollIndicator={false}>
      <Header />
      <View style={styles.mobileContent}>
        <View style={styles.mobileCartCard}>
          <ThemedText variant="text-2xl-bold" style={styles.mobileTitle}>
            My Cart
          </ThemedText>
          
          {items.length === 0 ? (
            <View style={styles.mobileEmptyState}>
              <ThemedText variant="text-lg-regular" style={styles.mobileEmptyText}>
                Your cart is empty.
              </ThemedText>
            </View>
          ) : (
            <View style={styles.mobileItemsList}>
              {items.map((item, idx) => (
                <View key={`${item.product.id}-${item.variant.id}`} style={styles.mobileCartItem}>
                  <View style={styles.mobileProductRow}>
                    <Image
                      source={{ 
                        uri: item.product.media[0]?.conversions?.['medium-square'] || item.product.media[0]?.url 
                      }}
                      style={styles.mobileProductImage}
                    />
                    <View style={styles.mobileProductInfo}>
                      <ThemedText variant="text-base-semibold" numberOfLines={2} style={styles.mobileProductTitle}>
                        {item.product.title}
                      </ThemedText>
                      <ThemedText variant="text-sm-regular" style={styles.mobileVariantText}>
                        {item.variant.variant_type_options.map(opt => opt.value).join(' | ')}
                      </ThemedText>
                      <ThemedText variant="text-sm-regular" style={styles.mobilePricePerItem}>
                        €{item.variant.price.amount.toFixed(2)} each
                      </ThemedText>
                    </View>
                    <Pressable
                      onPress={() => dispatch({ 
                        type: 'REMOVE_ITEM', 
                        productId: item.product.id, 
                        variantId: item.variant.id 
                      })}
                      style={styles.mobileRemoveButton}
                      accessibilityRole="button"
                      accessibilityLabel="Remove item"
                    >
                      <ThemedText variant="text-lg-bold" style={styles.mobileRemoveText}>×</ThemedText>
                    </Pressable>
                  </View>

                  <View style={styles.mobileControlsRow}>
                    <View style={styles.mobileQuantityControls}>
                      <Pressable
                        onPress={() => dispatch({ 
                          type: 'UPDATE_QUANTITY', 
                          productId: item.product.id, 
                          variantId: item.variant.id, 
                          quantity: Math.max(1, item.quantity - 1) 
                        })}
                        style={styles.mobileQuantityButton}
                        accessibilityRole="button"
                        accessibilityLabel="Decrease quantity"
                      >
                        <ThemedText variant="text-base-bold">−</ThemedText>
                      </Pressable>
                      <View style={styles.mobileQuantityDisplay}>
                        <ThemedText variant="text-base-regular">{item.quantity}</ThemedText>
                      </View>
                      <Pressable
                        onPress={() => dispatch({ 
                          type: 'UPDATE_QUANTITY', 
                          productId: item.product.id, 
                          variantId: item.variant.id, 
                          quantity: item.quantity + 1 
                        })}
                        style={styles.mobileQuantityButton}
                        accessibilityRole="button"
                        accessibilityLabel="Increase quantity"
                      >
                        <ThemedText variant="text-base-bold">+</ThemedText>
                      </Pressable>
                    </View>
                    
                    <ThemedText variant="text-lg-bold" style={styles.mobileSubtotalPrice}>
                      €{(item.variant.price.amount * item.quantity).toFixed(2)}
                    </ThemedText>
                  </View>
                </View>
              ))}
            </View>
          )}
        </View>

        <View style={styles.mobileSummaryCard}>
          <ThemedText variant="text-xl-bold" style={styles.mobileSummaryTitle}>
            Summary
          </ThemedText>
          
          <View style={styles.mobileSummaryContent}>
            <View style={styles.mobileSummaryRow}>
              <ThemedText variant="text-base-regular" style={styles.mobileSummaryLabel}>
                Subtotal
              </ThemedText>
              <ThemedText variant="text-base-regular" style={styles.mobileSummaryValue}>
                €{subtotal.toFixed(2)}
              </ThemedText>
            </View>
            
            <View style={styles.mobileSummaryRow}>
              <ThemedText variant="text-base-regular" style={styles.mobileSummaryLabel}>
                Shipping estimate
              </ThemedText>
              <ThemedText variant="text-base-regular" style={styles.mobileSummaryValue}>
                €{shipping.toFixed(2)}
              </ThemedText>
            </View>
            
            <View style={styles.mobileSummaryRow}>
              <ThemedText variant="text-base-regular" style={styles.mobileSummaryLabel}>
                Tax estimate
              </ThemedText>
              <ThemedText variant="text-base-regular" style={styles.mobileSummaryValue}>
                €{tax.toFixed(2)}
              </ThemedText>
            </View>
            
            <View style={[styles.mobileSummaryRow, styles.mobileTotalRow]}>
              <ThemedText variant="text-lg-bold" style={styles.mobileTotalLabel}>
                Total
              </ThemedText>
              <ThemedText variant="text-lg-bold" style={styles.mobileTotalValue}>
                €{total.toFixed(2)}
              </ThemedText>
            </View>
          </View>

          <Pressable
            style={styles.mobileCheckoutButton}
            accessibilityRole="button"
            accessibilityLabel="Checkout"
            onPress={() => router.push('/checkout')}
          >
            <ThemedText variant="text-base-bold" style={styles.mobileCheckoutText}>
              Checkout
            </ThemedText>
          </Pressable>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  webContainer: {
    flex: 1,
    backgroundColor: Colors.light.gray50,
  },
  webContent: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 40,
    paddingHorizontal: 20,
  },
  webLayout: {
    flexDirection: 'row',
    gap: 32,
    maxWidth: 1200,
    width: '100%',
    alignItems: 'flex-start',
  },
  webCartSection: {
    flex: 2,
  },
  webCartCard: {
    backgroundColor: Colors.light.background,
    borderRadius: 16,
    padding: 32,
    shadowColor: Colors.light.text,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 8,
  },
  webTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: Colors.light.text,
    marginBottom: 24,
  },
  webEmptyState: {
    paddingVertical: 60,
    alignItems: 'center',
  },
  webEmptyText: {
    color: Colors.light.gray500,
    fontSize: 18,
  },
  webCartTable: {
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.light.gray200,
    overflow: 'hidden',
  },
  webTableHeader: {
    flexDirection: 'row',
    backgroundColor: Colors.light.gray50,
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: Colors.light.gray200,
  },
  webHeaderCell: {
    color: Colors.light.gray500,
    fontSize: 14,
    fontWeight: '600',
  },
  webProductColumn: {
    flex: 3,
  },
  webQuantityColumn: {
    flex: 1,
    alignItems: 'center',
  },
  webSubtotalColumn: {
    flex: 1,
    alignItems: 'flex-end',
  },
  webRemoveColumn: {
    width: 60,
    alignItems: 'center',
  },
  webTableRow: {
    flexDirection: 'row',
    paddingVertical: 20,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: Colors.light.gray100,
    alignItems: 'center',
  },
  webTableCell: {
    justifyContent: 'center',
  },
  webProductImage: {
    width: 64,
    height: 64,
    borderRadius: 8,
    backgroundColor: Colors.light.gray100,
    marginRight: 16,
  },
  webProductInfo: {
    flex: 1,
    gap: 4,
  },
  webProductTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.light.text,
    lineHeight: 20,
  },
  webVariantText: {
    fontSize: 14,
    color: Colors.light.gray500,
  },
  webPricePerItem: {
    fontSize: 14,
    color: Colors.light.gray500,
  },
  webQuantityControls: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  webQuantityButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.light.gray100,
    borderWidth: 1,
    borderColor: Colors.light.gray300,
    alignItems: 'center',
    justifyContent: 'center',
  },
  webQuantityDisplay: {
    minWidth: 32,
    alignItems: 'center',
  },
  webSubtotalPrice: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.light.primary600,
  },
  webRemoveButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  webRemoveText: {
    color: Colors.light.gray400,
    fontSize: 20,
  },
  webSummarySection: {
    flex: 1,
    maxWidth: 360,
  },
  webSummaryCard: {
    backgroundColor: Colors.light.background,
    borderRadius: 16,
    padding: 24,
    shadowColor: Colors.light.text,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 8,
  },
  webSummaryTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: Colors.light.text,
    marginBottom: 20,
  },
  webSummaryContent: {
    gap: 12,
    marginBottom: 24,
  },
  webSummaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  webSummaryLabel: {
    fontSize: 16,
    color: Colors.light.gray500,
  },
  webSummaryValue: {
    fontSize: 16,
    color: Colors.light.text,
  },
  webTotalRow: {
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: Colors.light.gray200,
    marginTop: 8,
  },
  webTotalLabel: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.light.text,
  },
  webTotalValue: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.light.text,
  },
  webCheckoutButton: {
    backgroundColor: Colors.light.primary400,
    borderRadius: 8,
    paddingVertical: 16,
    alignItems: 'center',
  },
  webCheckoutText: {
    color: Colors.light.background,
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.5,
  },

  mobileContainer: {
    flex: 1,
    backgroundColor: Colors.light.background,
  },
  mobileContent: {
    padding: 20,
    gap: 24,
  },
  mobileCartCard: {
    backgroundColor: Colors.light.background,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.light.gray200,
    padding: 20,
  },
  mobileTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: Colors.light.text,
    marginBottom: 20,
  },
  mobileEmptyState: {
    paddingVertical: 40,
    alignItems: 'center',
  },
  mobileEmptyText: {
    color: Colors.light.gray500,
    fontSize: 16,
  },
  mobileItemsList: {
    gap: 20,
  },
  mobileCartItem: {
    borderBottomWidth: 1,
    borderBottomColor: Colors.light.gray100,
    paddingBottom: 20,
    gap: 12,
  },
  mobileProductRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  mobileProductImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
    backgroundColor: Colors.light.gray100,
  },
  mobileProductInfo: {
    flex: 1,
    gap: 4,
  },
  mobileProductTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.light.text,
    lineHeight: 20,
  },
  mobileVariantText: {
    fontSize: 14,
    color: Colors.light.gray500,
  },
  mobilePricePerItem: {
    fontSize: 14,
    color: Colors.light.gray500,
  },
  mobileRemoveButton: {
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  mobileRemoveText: {
    color: Colors.light.gray400,
    fontSize: 18,
  },
  mobileControlsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  mobileQuantityControls: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  mobileQuantityButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.light.gray100,
    borderWidth: 1,
    borderColor: Colors.light.gray300,
    alignItems: 'center',
    justifyContent: 'center',
  },
  mobileQuantityDisplay: {
    minWidth: 32,
    alignItems: 'center',
  },
  mobileSubtotalPrice: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.light.primary600,
  },
  mobileSummaryCard: {
    backgroundColor: Colors.light.background,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.light.gray200,
    padding: 20,
  },
  mobileSummaryTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: Colors.light.text,
    marginBottom: 16,
  },
  mobileSummaryContent: {
    gap: 12,
    marginBottom: 20,
  },
  mobileSummaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  mobileSummaryLabel: {
    fontSize: 16,
    color: Colors.light.gray500,
  },
  mobileSummaryValue: {
    fontSize: 16,
    color: Colors.light.text,
  },
  mobileTotalRow: {
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: Colors.light.gray200,
    marginTop: 8,
  },
  mobileTotalLabel: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.light.text,
  },
  mobileTotalValue: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.light.text,
  },
  mobileCheckoutButton: {
    backgroundColor: Colors.light.primary400,
    borderRadius: 8,
    paddingVertical: 16,
    alignItems: 'center',
  },
  mobileCheckoutText: {
    color: Colors.light.background,
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
});