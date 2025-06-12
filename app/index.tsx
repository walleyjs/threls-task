"use client"

import { useCart } from "@/components/CartContext"
import { ProductCard } from "@/components/ProductCard"
import { ThemedText } from "@/components/ThemedText"
import { ThemedView } from "@/components/ThemedView"
import { Footer } from "@/components/ui/Footer"
import { Header } from "@/components/ui/Header"
import { PaginationLeftIcon } from "@/components/ui/PaginationLeftIcon"
import { PaginationRightIcon } from "@/components/ui/PaginationRightIcon"
import { Colors } from "@/constants/Colors"
import { getProducts, type Product } from "@/services/products"
import { useEffect, useMemo, useState } from "react"
import {
         ActivityIndicator,
         FlatList,
         Platform,
         Pressable,
         ScrollView,
         StyleSheet,
         useWindowDimensions,
         View,
} from "react-native"

export default function HomeScreen() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [wishlistedItems, setWishlistedItems] = useState<Set<number>>(new Set())
  const { width } = useWindowDimensions()
  const { state, dispatch } = useCart()
  const cartCount = state.items.reduce((sum, item) => sum + item.quantity, 0)

  const getNumColumns = (w: number) => {
    if (Platform.OS === "web") {
      if (w > 1100) return 4
      if (w > 800) return 3
      return 2
    }
    return 2
  }

  const numColumns = useMemo(() => getNumColumns(width), [width])
  const isWeb = Platform.OS === "web"

  const fetchProducts = (pageNum: number) => {
    setLoading(true)
    setError(null)
    getProducts({ page: pageNum })
      .then((res) => {
        setProducts(res.data)
        setTotalPages(res.meta?.pagination?.total_pages || 1)
      })
      .catch((e) => setError(e.message || "Failed to load products"))
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    fetchProducts(page)
  }, [page])

  const handleWishlistPress = (productId: number) => {
    setWishlistedItems((prev) => {
      const newSet = new Set(prev)
      if (newSet.has(productId)) {
        newSet.delete(productId)
      } else {
        newSet.add(productId)
      }
      return newSet
    })
  }

  const handleQuickAdd = (product: Product) => {
    const variant = product.product_variants[0]
    if (variant) {
      dispatch({
        type: "ADD_ITEM",
        product,
        variant,
        quantity: 1,
      })
    }
  }

  if (loading) {
    return (
      <ThemedView style={styles.centered}>
        <ActivityIndicator size="large" color={Colors.light.primary400} />
        <ThemedText variant="text-lg-semibold" style={{ marginTop: 16, color: Colors.light.gray500 }}>
          Loading products…
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
          onPress={() => fetchProducts(page)}
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

  if (!products.length) {
    return (
      <ThemedView style={styles.centered}>
        <ThemedText variant="text-lg-bold" style={{ color: Colors.light.gray500 }}>
          No products found.
        </ThemedText>
      </ThemedView>
    )
  }

  const renderPagination = () => (
    <View style={styles.paginationContainer}>
      <View style={styles.paginationRow}>
        <Pressable
          onPress={() => setPage((p) => Math.max(1, p - 1))}
          disabled={page === 1}
          style={[styles.pageBtn, page === 1 && styles.pageBtnDisabled]}
          accessibilityRole="button"
          accessibilityLabel="Previous page"
        >
          <PaginationLeftIcon style={styles.pageIcon} />
          <ThemedText variant="text-sm-semibold" style={[styles.pageBtnText, page === 1 && styles.pageBtnTextDisabled]}>
            Prev
          </ThemedText>
        </Pressable>

        {/* Page Numbers */}
        {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
          const pageNum = i + 1
          return (
            <Pressable
              key={pageNum}
              onPress={() => setPage(pageNum)}
              style={[styles.pageNum, page === pageNum && styles.pageNumActive]}
              accessibilityRole="button"
              accessibilityLabel={`Go to page ${pageNum}`}
            >
              <ThemedText
                variant="text-sm-semibold"
                style={[styles.pageNumText, page === pageNum && styles.pageNumTextActive]}
              >
                {pageNum}
              </ThemedText>
            </Pressable>
          )
        })}

        {totalPages > 5 && <ThemedText style={styles.ellipsis}>...</ThemedText>}

        <Pressable
          onPress={() => setPage((p) => Math.min(totalPages, p + 1))}
          disabled={page === totalPages}
          style={[styles.pageBtn, page === totalPages && styles.pageBtnDisabled]}
          accessibilityRole="button"
          accessibilityLabel="Next page"
        >
          <ThemedText
            variant="text-sm-semibold"
            style={[styles.pageBtnText, page === totalPages && styles.pageBtnTextDisabled]}
          >
            Next
          </ThemedText>
          <PaginationRightIcon style={styles.pageIcon} />
        </Pressable>
      </View>
    </View>
  )

  if (Platform.OS === "web") {
    return (
      <ThemedView style={styles.container}>
        <Header />
        <ScrollView showsVerticalScrollIndicator={false} style={styles.scrollView}>
          <View style={styles.webContent}>
            <ThemedText variant="text-4xl-bold" style={styles.webHeading}>
              Rentals
            </ThemedText>

            <View style={styles.webGrid}>
              {products.map((item) => (
                <View key={item.id} style={[styles.webGridItem, { width: `${100 / numColumns}%` }]}>
                  <ProductCard
                    product={item}
                    onWishlistPress={() => handleWishlistPress(item.id)}
                    onQuickAdd={() => handleQuickAdd(item)}
                    isWishlisted={wishlistedItems.has(item.id)}
                  />
                </View>
              ))}
            </View>

            {/* Pagination Controls */}
            <View style={styles.paginationContainer}>
              <View style={styles.paginationRow}>
                <Pressable
                  onPress={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  style={[styles.pageBtn, page === 1 && styles.pageBtnDisabled]}
                >
                  <PaginationLeftIcon style={styles.pageIcon} />
                  <ThemedText variant="text-base-bold" style={styles.pageBtnText}>
                    Prev
                  </ThemedText>
                </Pressable>

                {(() => {
                  const pageButtons = []
                  const maxPagesToShow = 5
                  let start = Math.max(1, page - 1)
                  const end = Math.min(totalPages, start + maxPagesToShow - 1)
                  if (end - start < maxPagesToShow - 1) start = Math.max(1, end - maxPagesToShow + 1)

                  for (let p = start; p <= end; p++) {
                    pageButtons.push(
                      <Pressable
                        key={p}
                        onPress={() => setPage(p)}
                        style={[styles.pageNum, page === p && styles.pageNumActive]}
                        accessibilityRole="button"
                        accessibilityLabel={`Go to page ${p}`}
                      >
                        <ThemedText variant="text-base-bold" style={page === p ? styles.pageNumTextActive : undefined}>
                          {p}
                        </ThemedText>
                      </Pressable>,
                    )
                  }
                  return pageButtons
                })()}

                <Pressable
                  onPress={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  style={[styles.pageBtn, page === totalPages && styles.pageBtnDisabled]}
                >
                  <ThemedText variant="text-base-bold" style={styles.pageBtnText}>
                    Next
                  </ThemedText>
                  <PaginationRightIcon style={styles.pageIcon} />
                </Pressable>
              </View>
            </View>
          </View>
          <Footer/>
        </ScrollView>
       
      </ThemedView>
    )
  }

  return (
    <ThemedView style={styles.container}>
      <Header />
      <FlatList
        data={products}
        keyExtractor={(item) => String(item.id)}
        renderItem={({ item }) => (
          <ProductCard
            product={item}
            onWishlistPress={() => handleWishlistPress(item.id)}
            onQuickAdd={() => handleQuickAdd(item)}
            isWishlisted={wishlistedItems.has(item.id)}
          />
        )}
        numColumns={2}
        contentContainerStyle={styles.mobileGrid}
        columnWrapperStyle={styles.mobileRow}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          <ThemedText variant="text-3xl-bold" style={styles.mobileHeading}>
            Products
          </ThemedText>
        }
        ListFooterComponent={renderPagination()}
      />
    </ThemedView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.background,
   
  },
  centered: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 32,
     maxHeight:"10%"
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

  scrollView: {
    flex: 1,
  },
  webContent: {
    maxWidth: 1700,
    width: "100%",
    alignSelf: "center",
    justifyContent:"center",
    paddingHorizontal: 24,
     maxHeight:"100%",
    paddingTop: 20,
  },
  webHeading: {
    marginBottom: 32,
    textAlign: "center",
    color: Colors.light.text,
    fontSize: 32,
  },
  webGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 32,
    paddingHorizontal: 0,
  },
  webGridItem: {
    paddingHorizontal: 12,
    marginBottom: 24,
   
  },
  mobileGrid: {
    paddingHorizontal: 16,
    paddingBottom: 32,
  },
  mobileRow: {
    justifyContent: "space-between",
    paddingHorizontal: 4,
  },
  mobileHeading: {
    textAlign: "center",
    color: Colors.light.text,
    marginBottom: 32,
    marginTop: 16,
    fontSize: 28,
  },

  paginationContainer: {
    paddingVertical: 24,
    alignItems: "center",
  },
  paginationRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    flexWrap: "wrap",
  },
  pageBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 0,
    borderWidth: 0,
    backgroundColor: Colors.light.background,
    minWidth: 70,
    justifyContent: "center",
  },
  pageBtnDisabled: {
    opacity: 0.5,
  },
  pageBtnText: {
    color: Colors.light.text,
  },
  pageBtnTextDisabled: {
    color: Colors.light.gray400,
  },
  pageIcon: {
    width: 16,
    height: 16,
  },
  pageNum: {
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 0,
    borderWidth: 0,
    backgroundColor: Colors.light.background,
    minWidth: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  pageNumActive: {
    backgroundColor: Colors.light.text,
  },
  pageNumText: {
    color: Colors.light.text,
  },
  pageNumTextActive: {
    color: Colors.light.background,
  },
  ellipsis: {
    marginHorizontal: 8,
    color: Colors.light.gray400,
    fontSize: 16,
    alignSelf: "center",
  },
})
