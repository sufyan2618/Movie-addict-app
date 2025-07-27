import { Link } from "expo-router";
import { Text, View } from "react-native";

export default function Index() {
  return (
    <View>
      <Text className="text-xl">Hello World</Text>
      <Link href="/(auth)" className="text-blue-500">
      <Text> login page</Text>
      </Link>
    </View>
  );
}
