import { Slot, useRouter, useSegments } from "expo-router";
import {
  Platform,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function RootLayout() {
  const segments = useSegments();
  const router = useRouter();

  const currentScreen = (segments[0] as string) || "index";

  if (currentScreen === "index" || currentScreen === "welcome") {
    return <Slot />;
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FAF9F6" />

      <SafeAreaView style={styles.mainContentFrame}>
        <Slot />
      </SafeAreaView>

      <View style={styles.bottomNavigationBar}>
        <TouchableOpacity
          style={styles.navItem}
          onPress={() => router.push("/income")}
          activeOpacity={0.7}
        >
          <Text
            style={[
              styles.emojiIcon,
              currentScreen === "income"
                ? styles.activeEmoji
                : styles.inactiveEmoji,
            ]}
          >
            📥
          </Text>
          <Text
            style={[
              styles.navLabel,
              currentScreen === "income"
                ? styles.activeLabel
                : styles.inactiveLabel,
            ]}
          >
            รายรับ
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.navItem}
          onPress={() => router.push("/home")}
          activeOpacity={0.7}
        >
          <Text
            style={[
              styles.homeEmojiIcon,
              currentScreen === "home"
                ? styles.activeEmoji
                : styles.inactiveEmoji,
            ]}
          >
            🏡
          </Text>
          <Text
            style={[
              styles.navLabel,
              currentScreen === "home"
                ? styles.activeHomeLabel
                : styles.inactiveLabel,
            ]}
          >
            หน้าหลัก
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.navItem}
          onPress={() => router.push("/expense")}
          activeOpacity={0.7}
        >
          <Text
            style={[
              styles.emojiIcon,
              currentScreen === "expense"
                ? styles.activeEmoji
                : styles.inactiveEmoji,
            ]}
          >
            📤
          </Text>
          <Text
            style={[
              styles.navLabel,
              currentScreen === "expense"
                ? styles.activeExpenseLabel
                : styles.inactiveLabel,
            ]}
          >
            รายจ่าย
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FAF9F6",
    ...Platform.select({
      web: {
        height: "100vh" as any,
        overflow: "hidden",
      },
    }),
  },
  mainContentFrame: {
    flex: 1,
    backgroundColor: "#FAF9F6",
    marginBottom: 0,
  },
  bottomNavigationBar: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    backgroundColor: "#3A8477",
    height: Platform.OS === "ios" ? 95 : 80,
    paddingBottom: Platform.select({
      ios: 22,
      web: 0,
      default: 6,
    }),
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
  },
  navItem: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  emojiIcon: {
    fontSize: 28,
    marginBottom: 4,
    textAlign: "center",
  },
  homeEmojiIcon: {
    fontSize: 34,
    marginBottom: 1,
    textAlign: "center",
  },
  navLabel: {
    fontSize: 13,
    fontWeight: "bold",
    fontFamily: "Kanit_700Bold",
  },
  activeLabel: {
    color: "#FFFFFF",
  },
  activeHomeLabel: {
    color: "#2AC3DE",
  },
  activeExpenseLabel: {
    color: "#FFA2A2",
  },
  inactiveLabel: {
    color: "#FFFFFF",
    opacity: 0.65,
  },
  activeEmoji: {
    opacity: 1,
    transform: [{ scale: 1.1 }],
  },
  inactiveEmoji: {
    opacity: 0.7,
  },
});
