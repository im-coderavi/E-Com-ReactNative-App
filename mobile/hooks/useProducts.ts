import axios from "axios";
import { Product } from "@/types";
import { useQuery } from "@tanstack/react-query";

const API_URL = process.env.EXPO_PUBLIC_API_URL || "http://10.228.3.209:3000/api";

const useProducts = () => {
  const result = useQuery({
    queryKey: ["products"],
    queryFn: async () => {
      console.log("🔍 Fetching products from API...");
      const { data } = await axios.get<Product[]>(`${API_URL}/products`);
      console.log("✅ Products fetched successfully:", data.length, "products");
      return data;
    },
    retry: 3, // Retry failed requests up to 3 times
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000), // Exponential backoff
    staleTime: 5 * 60 * 1000, // Consider data fresh for 5 minutes
  });

  return result;
};

export default useProducts;
