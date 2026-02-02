import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Product } from "@/types";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useState, useCallback } from "react";

const WISHLIST_STORAGE_KEY = "@wishlist";

const useWishlist = () => {
  const queryClient = useQueryClient();
  const [isAddingToWishlist, setIsAddingToWishlist] = useState(false);
  const [isRemovingFromWishlist, setIsRemovingFromWishlist] = useState(false);

  // Load wishlist from AsyncStorage
  const {
    data: wishlist,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["wishlist"],
    queryFn: async (): Promise<Product[]> => {
      try {
        const wishlistData = await AsyncStorage.getItem(WISHLIST_STORAGE_KEY);
        if (wishlistData) {
          return JSON.parse(wishlistData);
        }
        return [];
      } catch (error) {
        console.error("Error loading wishlist:", error);
        return [];
      }
    },
    staleTime: Infinity, // Wishlist data doesn't go stale
  });

  // Save wishlist to AsyncStorage
  const saveWishlist = async (newWishlist: Product[]) => {
    try {
      await AsyncStorage.setItem(WISHLIST_STORAGE_KEY, JSON.stringify(newWishlist));
      queryClient.setQueryData(["wishlist"], newWishlist);
    } catch (error) {
      console.error("Error saving wishlist:", error);
      throw error;
    }
  };

  // Add to wishlist
  const addToWishlist = useCallback(
    async (product: Product) => {
      setIsAddingToWishlist(true);
      try {
        const currentWishlist = wishlist || [];
        // Check if product already exists
        if (!currentWishlist.some((p) => p._id === product._id)) {
          const newWishlist = [...currentWishlist, product];
          await saveWishlist(newWishlist);
          console.log("✅ Added to wishlist successfully");
        }
      } catch (error) {
        console.error("❌ Error adding to wishlist:", error);
      } finally {
        setIsAddingToWishlist(false);
      }
    },
    [wishlist, saveWishlist]
  );

  // Remove from wishlist
  const removeFromWishlist = useCallback(
    async (productId: string) => {
      setIsRemovingFromWishlist(true);
      try {
        const currentWishlist = wishlist || [];
        const newWishlist = currentWishlist.filter((p) => p._id !== productId);
        await saveWishlist(newWishlist);
        console.log("✅ Removed from wishlist successfully");
      } catch (error) {
        console.error("❌ Error removing from wishlist:", error);
      } finally {
        setIsRemovingFromWishlist(false);
      }
    },
    [wishlist, saveWishlist]
  );

  const isInWishlist = (productId: string) => {
    return wishlist?.some((product) => product._id === productId) ?? false;
  };

  const toggleWishlist = (productId: string, product?: Product) => {
    if (isInWishlist(productId)) {
      removeFromWishlist(productId);
    } else {
      if (product) {
        addToWishlist(product);
      } else {
        console.error("Product data required to add to wishlist");
      }
    }
  };

  return {
    wishlist: wishlist || [],
    isLoading,
    isError,
    wishlistCount: wishlist?.length || 0,
    isInWishlist,
    toggleWishlist,
    addToWishlist,
    removeFromWishlist,
    isAddingToWishlist,
    isRemovingFromWishlist,
  };
};

export default useWishlist;
