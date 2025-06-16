import { Product, ProductVariant } from '@/services/products';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createContext, Dispatch, ReactNode, useContext, useEffect, useReducer } from 'react';

const CART_STORAGE_KEY = '@threls_cart';

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
  | { type: 'CLEAR_CART' }
  | { type: 'LOAD_CART'; items: CartItem[] };

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
    case 'LOAD_CART':
      return {
        ...state,
        items: action.items,
      };
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

  useEffect(() => {
    const loadCart = async () => {
      try {
        const savedCart = await AsyncStorage.getItem(CART_STORAGE_KEY);
        if (savedCart) {
          const parsedCart = JSON.parse(savedCart);
          dispatch({ type: 'LOAD_CART', items: parsedCart });
        }
      } catch (error) {
        console.error('Error loading cart from storage:', error);
      }
    };

    loadCart();
  }, []);

  useEffect(() => {
    const saveCart = async () => {
      try {
        await AsyncStorage.setItem(CART_STORAGE_KEY, JSON.stringify(state.items));
      } catch (error) {
        console.error('Error saving cart to storage:', error);
      }
    };

    saveCart();
  }, [state.items]);

  return <CartContext.Provider value={{ state, dispatch }}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within a CartProvider');
  return context;
} 