import { Redirect, Stack } from "expo-router";
import { useAuth } from "../../lib/auth-context";

export default function AuthRoutesLayout() {
  const { isSignedIn, isLoaded } = useAuth();

  if (!isLoaded) return null; // for a better ux

  // Always redirect to tabs, disabling auth screens
  return <Redirect href={"/(tabs)"} />;
}
