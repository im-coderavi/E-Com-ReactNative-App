import { useQuery } from "@tanstack/react-query";
import { Order } from "@/types";
import AsyncStorage from "@react-native-async-storage/async-storage";

const ORDERS_STORAGE_KEY = "@orders";

export const useOrders = () => {
  return useQuery<Order[]>({
    queryKey: ["orders"],
    queryFn: async (): Promise<Order[]> => {
      try {
        const ordersData = await AsyncStorage.getItem(ORDERS_STORAGE_KEY);
        if (ordersData) {
          return JSON.parse(ordersData);
        }
        return [];
      } catch (error) {
        console.error("Error loading orders:", error);
        return [];
      }
    },
    staleTime: Infinity,
  });
};
