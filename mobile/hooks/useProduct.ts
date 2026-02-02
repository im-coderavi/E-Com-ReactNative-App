import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { Product } from "@/types";

const API_URL = process.env.EXPO_PUBLIC_API_URL || "http://10.228.3.209:3000/api";

export const useProduct = (productId: string) => {
  const result = useQuery<Product>({
    queryKey: ["product", productId],
    queryFn: async () => {
      const { data } = await axios.get(`${API_URL}/products/${productId}`);
      return data;
    },
    enabled: !!productId,
  });

  return result;
};
