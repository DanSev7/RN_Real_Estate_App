import { Link } from "expo-router";
import { Text, View } from "react-native";

export default function Index() {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Link href="/sign-in">Go to sign-in page</Link>
      <Link href="/explore">Go to explore page</Link>
      <Link href="/profile">Go to profile page</Link>
      <Link href="/properties/1">Go to property page</Link>
      
    </View>
  );
}
