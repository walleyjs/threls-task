import { CartProvider, useCart } from '@/components/CartContext';
import { Product, ProductVariant } from '@/services/products';
import { describe, expect, it } from '@jest/globals';
import { act, renderHook } from '@testing-library/react-native';

const mockProduct: Product = {
  id: 1,
  name: 'Test Product',
  title: 'Test Product Title',
  slug: 'test-product',
  description: 'Test description',
  product_class: null,
  product_type: 'physical',
  created_at: '2024-01-01',
  updated_at: '2024-01-01',
  featured: false,
  brand: null,
  media: [],
  product_variants: [],
  meta_fields: [],
};

const mockVariant: ProductVariant = {
  id: 1,
  name: 'Test Variant',
  type: 'default',
  pricing_type: 'fixed',
  pricing_unit: { id: 1, name: 'piece' },
  price: { currency: 'USD', amount: 1000, formatted: '$10.00', scale: 2 },
  vat_rate: { id: 1, name: 'Standard', code: 'STD', value: 20 },
  variant_type_options: [],
  media: [],
  inventory_items: [],
  can_order_out_of_stock_items: true,
  created_at: '2024-01-01',
  updated_at: '2024-01-01',
};

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <CartProvider>{children}</CartProvider>
);

describe('Cart Context', () => {
  it('should initialize with empty cart', () => {
    const { result } = renderHook(() => useCart(), { wrapper });
    expect(result.current.state.items).toHaveLength(0);
  });

  it('should add item to cart', () => {
    const { result } = renderHook(() => useCart(), { wrapper });

    act(() => {
      result.current.dispatch({
        type: 'ADD_ITEM',
        product: mockProduct,
        variant: mockVariant,
        quantity: 1,
      });
    });

    expect(result.current.state.items).toHaveLength(1);
    expect(result.current.state.items[0]).toEqual({
      product: mockProduct,
      variant: mockVariant,
      quantity: 1,
    });
  });

  it('should update quantity when adding existing item', () => {
    const { result } = renderHook(() => useCart(), { wrapper });

    act(() => {
      result.current.dispatch({
        type: 'ADD_ITEM',
        product: mockProduct,
        variant: mockVariant,
        quantity: 1,
      });
    });

    act(() => {
      result.current.dispatch({
        type: 'ADD_ITEM',
        product: mockProduct,
        variant: mockVariant,
        quantity: 2,
      });
    });

    expect(result.current.state.items).toHaveLength(1);
    expect(result.current.state.items[0].quantity).toBe(3);
  });

  it('should remove item from cart', () => {
    const { result } = renderHook(() => useCart(), { wrapper });

    act(() => {
      result.current.dispatch({
        type: 'ADD_ITEM',
        product: mockProduct,
        variant: mockVariant,
        quantity: 1,
      });
    });

    act(() => {
      result.current.dispatch({
        type: 'REMOVE_ITEM',
        productId: mockProduct.id,
        variantId: mockVariant.id,
      });
    });

    expect(result.current.state.items).toHaveLength(0);
  });

  it('should update item quantity', () => {
    const { result } = renderHook(() => useCart(), { wrapper });

    act(() => {
      result.current.dispatch({
        type: 'ADD_ITEM',
        product: mockProduct,
        variant: mockVariant,
        quantity: 1,
      });
    });

    act(() => {
      result.current.dispatch({
        type: 'UPDATE_QUANTITY',
        productId: mockProduct.id,
        variantId: mockVariant.id,
        quantity: 5,
      });
    });

    expect(result.current.state.items[0].quantity).toBe(5);
  });

  it('should clear cart', () => {
    const { result } = renderHook(() => useCart(), { wrapper });

    act(() => {
      result.current.dispatch({
        type: 'ADD_ITEM',
        product: mockProduct,
        variant: mockVariant,
        quantity: 1,
      });
    });

    act(() => {
      result.current.dispatch({ type: 'CLEAR_CART' });
    });

    expect(result.current.state.items).toHaveLength(0);
  });

  it('should handle multiple items in cart', () => {
    const { result } = renderHook(() => useCart(), { wrapper });
    const mockProduct2 = { ...mockProduct, id: 2 };
    const mockVariant2 = { ...mockVariant, id: 2 };

    act(() => {
      result.current.dispatch({
        type: 'ADD_ITEM',
        product: mockProduct,
        variant: mockVariant,
        quantity: 1,
      });
      result.current.dispatch({
        type: 'ADD_ITEM',
        product: mockProduct2,
        variant: mockVariant2,
        quantity: 2,
      });
    });

    expect(result.current.state.items).toHaveLength(2);
    expect(result.current.state.items[0].quantity).toBe(1);
    expect(result.current.state.items[1].quantity).toBe(2);
  });
}); 