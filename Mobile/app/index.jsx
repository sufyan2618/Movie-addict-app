import { Link } from "expo-router";
import { Text, View } from "react-native";

export default function Index() {
  return (
    <View className="flex-1 items-center justify-center bg-[#d896ff]">
      <Text className="text-xl">Hello World</Text>
      <Link href="/(auth)" className="text-blue-500">
      <Text> login page</Text>
      </Link>
      <Link href="/(auth)/Signup" className="text-blue-500">
      <Text> Signup page</Text>
      </Link>
    </View>
  );
}
