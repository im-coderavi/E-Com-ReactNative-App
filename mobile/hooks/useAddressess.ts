import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Address } from "@/types";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useState, useCallback } from "react";

const ADDRESSES_STORAGE_KEY = "@addresses";

export const useAddresses = () => {
  const queryClient = useQueryClient();
  const [isAddingAddress, setIsAddingAddress] = useState(false);
  const [isUpdatingAddress, setIsUpdatingAddress] = useState(false);
  const [isDeletingAddress, setIsDeletingAddress] = useState(false);

  // Load addresses from AsyncStorage
  const {
    data: addresses,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["addresses"],
    queryFn: async (): Promise<Address[]> => {
      try {
        const addressesData = await AsyncStorage.getItem(ADDRESSES_STORAGE_KEY);
        if (addressesData) {
          return JSON.parse(addressesData);
        }
        return [];
      } catch (error) {
        console.error("Error loading addresses:", error);
        return [];
      }
    },
    staleTime: Infinity,
  });

  // Save addresses to AsyncStorage
  const saveAddresses = async (newAddresses: Address[]) => {
    try {
      await AsyncStorage.setItem(ADDRESSES_STORAGE_KEY, JSON.stringify(newAddresses));
      queryClient.setQueryData(["addresses"], newAddresses);
    } catch (error) {
      console.error("Error saving addresses:", error);
      throw error;
    }
  };

  // Add address
  const addAddress = useCallback(
    async (addressData: Omit<Address, "_id">) => {
      setIsAddingAddress(true);
      try {
        const currentAddresses = addresses || [];
        const newAddress: Address = {
          ...addressData,
          _id: Date.now().toString(), // Generate unique ID
        };
        const newAddresses = [...currentAddresses, newAddress];
        await saveAddresses(newAddresses);
        console.log("✅ Address added successfully");
      } catch (error) {
        console.error("❌ Error adding address:", error);
        throw error;
      } finally {
        setIsAddingAddress(false);
      }
    },
    [addresses, saveAddresses]
  );

  // Update address
  const updateAddress = useCallback(
    async ({ addressId, addressData }: { addressId: string; addressData: Partial<Address> }) => {
      setIsUpdatingAddress(true);
      try {
        const currentAddresses = addresses || [];
        const newAddresses = currentAddresses.map((addr) =>
          addr._id === addressId ? { ...addr, ...addressData } : addr
        );
        await saveAddresses(newAddresses);
        console.log("✅ Address updated successfully");
      } catch (error) {
        console.error("❌ Error updating address:", error);
        throw error;
      } finally {
        setIsUpdatingAddress(false);
      }
    },
    [addresses, saveAddresses]
  );

  // Delete address
  const deleteAddress = useCallback(
    async (addressId: string) => {
      setIsDeletingAddress(true);
      try {
        const currentAddresses = addresses || [];
        const newAddresses = currentAddresses.filter((addr) => addr._id !== addressId);
        await saveAddresses(newAddresses);
        console.log("✅ Address deleted successfully");
      } catch (error) {
        console.error("❌ Error deleting address:", error);
        throw error;
      } finally {
        setIsDeletingAddress(false);
      }
    },
    [addresses, saveAddresses]
  );

  return {
    addresses: addresses || [],
    isLoading,
    isError,
    addAddress,
    updateAddress,
    deleteAddress,
    isAddingAddress,
    isUpdatingAddress,
    isDeletingAddress,
  };
};
