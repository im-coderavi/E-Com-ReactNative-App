import { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Image, Alert, KeyboardAvoidingView, Platform, ScrollView } from "react-native";
import { useAuth } from "../../lib/auth-context";

const AuthScreen = () => {
  const { login, signup } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!email || !password || (!isLogin && !name)) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }

    setLoading(true);
    let res;
    if (isLogin) {
      res = await login(email, password);
    } else {
      res = await signup(email, password, name);
    }
    setLoading(false);

    if (!res.success) {
      Alert.alert("Error", res.message);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      className="flex-1 bg-white"
    >
      <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: 'center', padding: 20 }}>
        <View className="items-center mb-8">
          <Image
            source={require("../../assets/images/auth-image.png")}
            className="w-64 h-64"
            resizeMode="contain"
          />
          <Text className="text-2xl font-bold mt-4">{isLogin ? "Welcome Back!" : "Create Account"}</Text>
        </View>

        <View className="space-y-4">
          {!isLogin && (
            <View>
              <Text className="text-gray-600 mb-1">Name</Text>
              <TextInput
                value={name}
                onChangeText={setName}
                placeholder="Your Name"
                className="w-full border border-gray-300 rounded-lg px-4 py-3 bg-gray-50 text-base"
              />
            </View>
          )}

          <View>
            <Text className="text-gray-600 mb-1">Email</Text>
            <TextInput
              value={email}
              onChangeText={setEmail}
              placeholder="email@example.com"
              autoCapitalize="none"
              keyboardType="email-address"
              className="w-full border border-gray-300 rounded-lg px-4 py-3 bg-gray-50 text-base"
            />
          </View>

          <View>
            <Text className="text-gray-600 mb-1">Password</Text>
            <TextInput
              value={password}
              onChangeText={setPassword}
              placeholder="••••••••"
              secureTextEntry
              className="w-full border border-gray-300 rounded-lg px-4 py-3 bg-gray-50 text-base"
            />
          </View>

          <TouchableOpacity
            onPress={handleSubmit}
            disabled={loading}
            className={`w-full bg-blue-600 rounded-lg py-4 mt-6 ${loading ? 'opacity-70' : ''}`}
          >
            <Text className="text-white text-center font-bold text-lg">
              {loading ? "Please wait..." : (isLogin ? "Login" : "Sign Up")}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => setIsLogin(!isLogin)}
            className="mt-4"
          >
            <Text className="text-center text-gray-600">
              {isLogin ? "Don't have an account? " : "Already have an account? "}
              <Text className="text-blue-600 font-bold">{isLogin ? "Sign Up" : "Login"}</Text>
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default AuthScreen;
