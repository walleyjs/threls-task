import { Product, ProductVariant } from '@/services/products';
import React, { createContext, Dispatch, ReactNode, useContext, useReducer } from 'react';

// --- Types ---
export interface CartItem {
  product: Product;
  variant: ProductVariant;
  quantity: number;
}

export interface CartState {
  items: CartItem[];
}

export type CartAction =
  | { type: 'ADD_ITEM'; product: Product; variant: ProductVariant; quantity: number }
  | { type: 'REMOVE_ITEM'; productId: number; variantId: number }
  | { type: 'UPDATE_QUANTITY'; productId: number; variantId: number; quantity: number }
  | { type: 'CLEAR_CART' };

const initialState: CartState = {
  items: [],
};

function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case 'ADD_ITEM': {
      const existing = state.items.find(
        (item) => item.product.id === action.product.id && item.variant.id === action.variant.id
      );
      if (existing) {
        return {
          ...state,
          items: state.items.map((item) =>
            item.product.id === action.product.id && item.variant.id === action.variant.id
              ? { ...item, quantity: item.quantity + action.quantity }
              : item
          ),
        };
      }
      return {
        ...state,
        items: [...state.items, { product: action.product, variant: action.variant, quantity: action.quantity }],
      };
    }
    case 'REMOVE_ITEM':
      return {
        ...state,
        items: state.items.filter(
          (item) => !(item.product.id === action.productId && item.variant.id === action.variantId)
        ),
      };
    case 'UPDATE_QUANTITY':
      return {
        ...state,
        items: state.items.map((item) =>
          item.product.id === action.productId && item.variant.id === action.variantId
            ? { ...item, quantity: action.quantity }
            : item
        ),
      };
    case 'CLEAR_CART':
      return initialState;
    default:
      return state;
  }
}

const CartContext = createContext<{
  state: CartState;
  dispatch: Dispatch<CartAction>;
} | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, initialState);
  return <CartContext.Provider value={{ state, dispatch }}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within a CartProvider');
  return context;
} 