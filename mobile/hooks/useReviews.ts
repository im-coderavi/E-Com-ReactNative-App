import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";

interface CreateReviewData {
  productId: string;
  orderId: string;
  rating: number;
}

export const useReviews = () => {
  const queryClient = useQueryClient();
  const [isCreatingReview, setIsCreatingReview] = useState(false);

  const createReviewAsync = async (data: CreateReviewData) => {
    setIsCreatingReview(true);
    try {
      // For local storage, we'll just log the review
      // In a real app, you might want to store this in AsyncStorage
      console.log("✅ Review created locally:", data);

      // Invalidate queries to refresh data
      queryClient.invalidateQueries({ queryKey: ["products"] });
      queryClient.invalidateQueries({ queryKey: ["orders"] });

      return { success: true };
    } catch (error) {
      console.error("❌ Error creating review:", error);
      throw error;
    } finally {
      setIsCreatingReview(false);
    }
  };

  return {
    isCreatingReview,
    createReviewAsync,
  };
};
