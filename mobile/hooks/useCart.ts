import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Product } from "@/types";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useState, useCallback } from "react";

const CART_STORAGE_KEY = "@cart";

interface CartItem {
  product: Product;
  quantity: number;
}

interface Cart {
  items: CartItem[];
}

const useCart = () => {
  const queryClient = useQueryClient();
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isRemoving, setIsRemoving] = useState(false);
  const [isClearing, setIsClearing] = useState(false);

  // Load cart from AsyncStorage
  const {
    data: cart,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["cart"],
    queryFn: async (): Promise<Cart> => {
      try {
        const cartData = await AsyncStorage.getItem(CART_STORAGE_KEY);
        if (cartData) {
          return JSON.parse(cartData);
        }
        return { items: [] };
      } catch (error) {
        console.error("Error loading cart:", error);
        return { items: [] };
      }
    },
    staleTime: Infinity, // Cart data doesn't go stale
  });

  // Save cart to AsyncStorage
  const saveCart = async (newCart: Cart) => {
    try {
      await AsyncStorage.setItem(CART_STORAGE_KEY, JSON.stringify(newCart));
      queryClient.setQueryData(["cart"], newCart);
    } catch (error) {
      console.error("Error saving cart:", error);
      throw error;
    }
  };

  // Add to cart
  const addToCart = useCallback(
    async (
      { productId, quantity = 1, product }: { productId: string; quantity?: number; product?: Product },
      options?: { onSuccess?: () => void; onError?: (error: any) => void }
    ) => {
      setIsAddingToCart(true);
      try {
        const currentCart = cart || { items: [] };
        const existingItemIndex = currentCart.items.findIndex(
          (item) => item.product._id === productId
        );

        let newCart: Cart;
        if (existingItemIndex >= 0) {
          // Update quantity if item exists
          newCart = {
            ...currentCart,
            items: currentCart.items.map((item, index) =>
              index === existingItemIndex
                ? { ...item, quantity: item.quantity + quantity }
                : item
            ),
          };
        } else {
          // Add new item
          if (!product) {
            throw new Error("Product data required for new cart items");
          }
          newCart = {
            ...currentCart,
            items: [...currentCart.items, { product, quantity }],
          };
        }

        await saveCart(newCart);
        console.log("✅ Added to cart successfully");
        options?.onSuccess?.();
      } catch (error) {
        console.error("❌ Error adding to cart:", error);
        options?.onError?.(error);
      } finally {
        setIsAddingToCart(false);
      }
    },
    [cart, saveCart]
  );

  // Update quantity
  const updateQuantity = useCallback(
    async (
      { productId, quantity }: { productId: string; quantity: number },
      options?: { onSuccess?: () => void; onError?: (error: any) => void }
    ) => {
      setIsUpdating(true);
      try {
        const currentCart = cart || { items: [] };
        const newCart: Cart = {
          ...currentCart,
          items: currentCart.items.map((item) =>
            item.product._id === productId ? { ...item, quantity } : item
          ),
        };

        await saveCart(newCart);
        options?.onSuccess?.();
      } catch (error) {
        console.error("❌ Error updating quantity:", error);
        options?.onError?.(error);
      } finally {
        setIsUpdating(false);
      }
    },
    [cart, saveCart]
  );

  // Remove from cart
  const removeFromCart = useCallback(
    async (productId: string, options?: { onSuccess?: () => void; onError?: (error: any) => void }) => {
      setIsRemoving(true);
      try {
        const currentCart = cart || { items: [] };
        const newCart: Cart = {
          ...currentCart,
          items: currentCart.items.filter((item) => item.product._id !== productId),
        };

        await saveCart(newCart);
        options?.onSuccess?.();
      } catch (error) {
        console.error("❌ Error removing from cart:", error);
        options?.onError?.(error);
      } finally {
        setIsRemoving(false);
      }
    },
    [cart, saveCart]
  );

  // Clear cart
  const clearCart = useCallback(
    async (options?: { onSuccess?: () => void; onError?: (error: any) => void }) => {
      setIsClearing(true);
      try {
        const newCart: Cart = { items: [] };
        await saveCart(newCart);
        options?.onSuccess?.();
      } catch (error) {
        console.error("❌ Error clearing cart:", error);
        options?.onError?.(error);
      } finally {
        setIsClearing(false);
      }
    },
    [saveCart]
  );

  const cartTotal =
    cart?.items.reduce((sum, item) => sum + item.product.price * item.quantity, 0) ?? 0;

  const cartItemCount = cart?.items.reduce((sum, item) => sum + item.quantity, 0) ?? 0;

  return {
    cart,
    isLoading,
    isError,
    cartTotal,
    cartItemCount,
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart,
    isAddingToCart,
    isUpdating,
    isRemoving,
    isClearing,
  };
};

export default useCart;

