import { ProductCard } from '@/components/ProductCard';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { CartIcon } from '@/components/ui/CartIcon';
import { LogoImage } from '@/components/ui/LogoImage';
import { PaginationLeftIcon } from '@/components/ui/PaginationLeftIcon';
import { PaginationRightIcon } from '@/components/ui/PaginationRightIcon';
import { Colors } from '@/constants/Colors';
import { getProducts, Product } from '@/services/products';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, Pressable, StyleSheet, useWindowDimensions, View } from 'react-native';

export default function HomeScreen() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const { width } = useWindowDimensions();

  const numColumns = width > 900 ? 4 : width > 600 ? 3 : 2;

  const fetchProducts = (pageNum: number) => {
    setLoading(true);
    setError(null);
    getProducts({ page: pageNum })
      .then((res) => {
        setProducts(res.data);
        setTotalPages(res.meta?.pagination?.total_pages || 1);
      })
      .catch((e) => setError(e.message || 'Failed to load products'))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchProducts(page);
  }, [page]);

  if (loading) {
    return (
      <ThemedView style={styles.centered}>
        <ActivityIndicator size="large" color={Colors.light.primary500} />
        <ThemedText variant="text-lg-semibold" style={{ marginTop: 16 }}>
          Loading products…
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
            getProducts()
              .then((res) => setProducts(res.data))
              .catch((e) => setError(e.message || 'Failed to load products'))
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

  if (!products.length) {
    return (
      <ThemedView style={styles.centered}>
        <ThemedText variant="text-lg-bold">No products found.</ThemedText>
      </ThemedView>
    );
  }

  return (
    <ThemedView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <LogoImage />
        <Pressable style={styles.cartIcon} accessibilityRole="button" accessibilityLabel="View cart">
          <CartIcon />
        </Pressable>
      </View>
      <FlatList
        data={products}
        keyExtractor={(item) => String(item.id)}
        renderItem={({ item }) => <ProductCard product={item} />}
        numColumns={numColumns}
        contentContainerStyle={styles.grid}
        columnWrapperStyle={numColumns > 1 ? styles.row : undefined}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          <ThemedText variant="text-4xl-bold" style={styles.heading}>
            Products
          </ThemedText>
        }
      />
      {/* Pagination Controls */}
      <View style={styles.paginationRow}>
        <Pressable
          onPress={() => setPage((p) => Math.max(1, p - 1))}
          disabled={page === 1}
          style={[styles.pageBtn, page === 1 && styles.pageBtnDisabled]}
        >
          <PaginationLeftIcon style={styles.pageIcon} />
          <ThemedText variant="text-base-bold" style={styles.pageBtnText}>{'Prev'}</ThemedText>
        </Pressable>
        {/* Page Numbers with ellipsis */}
        {(() => {
          const pageButtons = [];
          const maxPagesToShow = 5;
          let start = Math.max(1, page - 1);
          let end = Math.min(totalPages, start + maxPagesToShow - 1);
          if (end - start < maxPagesToShow - 1) start = Math.max(1, end - maxPagesToShow + 1);
          if (start > 1) {
            pageButtons.push(
              <Pressable key={1} onPress={() => setPage(1)} style={[styles.pageNum, page === 1 && styles.pageNumActive]}>
                <ThemedText variant="text-base-bold" style={page === 1 ? styles.pageNumTextActive : undefined}>1</ThemedText>
              </Pressable>
            );
            if (start > 2) pageButtons.push(<ThemedText key="start-ellipsis" style={styles.ellipsis}>...</ThemedText>);
          }
          for (let p = start; p <= end; p++) {
            pageButtons.push(
              <Pressable
                key={p}
                onPress={() => setPage(p)}
                style={[styles.pageNum, page === p && styles.pageNumActive]}
                accessibilityRole="button"
                accessibilityLabel={`Go to page ${p}`}
              >
                <ThemedText variant="text-base-bold" style={page === p ? styles.pageNumTextActive : undefined}>{p}</ThemedText>
              </Pressable>
            );
          }
          if (end < totalPages) {
            if (end < totalPages - 1) pageButtons.push(<ThemedText key="end-ellipsis" style={styles.ellipsis}>...</ThemedText>);
            pageButtons.push(
              <Pressable key={totalPages} onPress={() => setPage(totalPages)} style={[styles.pageNum, page === totalPages && styles.pageNumActive]}>
                <ThemedText variant="text-base-bold" style={page === totalPages ? styles.pageNumTextActive : undefined}>{totalPages}</ThemedText>
              </Pressable>
            );
          }
          return pageButtons;
        })()}
        <Pressable
          onPress={() => setPage((p) => Math.min(totalPages, p + 1))}
          disabled={page === totalPages}
          style={[styles.pageBtn, page === totalPages && styles.pageBtnDisabled]}
        >
          <ThemedText variant="text-base-bold" style={styles.pageBtnText}>{'Next'}</ThemedText>
          <PaginationRightIcon style={styles.pageIcon} />
        </Pressable>
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 0,
    backgroundColor: Colors.light.background,
  },
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
  },
  grid: {
    paddingHorizontal: 16,
    paddingBottom: 32,
  },
  row: {
    flex: 1,
    justifyContent: 'space-between',
  },
  heading: {
    marginBottom: 24,
    textAlign: 'center',
    color: Colors.light.text,
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
  paginationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginTop: 16,
    marginBottom: 24,
  },
  pageBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
    borderWidth: 1.5,
    borderColor: Colors.light.gray200,
    backgroundColor: Colors.light.background,
    marginHorizontal: 4,
    minWidth: 60,
    justifyContent: 'center',
  },
  pageBtnDisabled: {
    backgroundColor: Colors.light.gray100,
    borderColor: Colors.light.gray100,
  },
  pageBtnText: {
    color: Colors.light.text,
    marginHorizontal: 2,
  },
  pageIcon: {
    marginHorizontal: 2,
  },
  pageNum: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
    borderWidth: 1.5,
    borderColor: Colors.light.gray200,
    backgroundColor: Colors.light.background,
    marginHorizontal: 2,
    minWidth: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pageNumActive: {
    backgroundColor: Colors.light.text,
    borderColor: Colors.light.text,
  },
  pageNumTextActive: {
    color: Colors.light.background,
  },
  ellipsis: {
    marginHorizontal: 6,
    color: Colors.light.gray400,
    fontSize: 18,
    alignSelf: 'center',
  },
});
