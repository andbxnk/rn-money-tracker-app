import {
  Kanit_400Regular,
  Kanit_700Bold,
  useFonts,
} from "@expo-google-fonts/kanit";
import { Ionicons } from "@expo/vector-icons";
import { Stack, useRouter } from "expo-router";
import React, { useEffect, useRef } from "react";
import {
  Animated,
  Image,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function Welcome() {
  const router = useRouter();

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;

  const floatCoinAnim = useRef(new Animated.Value(0)).current;
  const floatCardAnim = useRef(new Animated.Value(0)).current;

  const [fontsLoaded] = useFonts({
    Kanit_400Regular,
    Kanit_700Bold,
  });

  useEffect(() => {
    if (fontsLoaded) {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 800,
          useNativeDriver: true,
        }),
      ]).start();

      const startFloating = (
        animValue: Animated.Value,
        delay: number,
        distance: number,
      ) => {
        Animated.loop(
          Animated.sequence([
            Animated.timing(animValue, {
              toValue: distance,
              duration: 2000,
              delay: delay,
              useNativeDriver: true,
            }),
            Animated.timing(animValue, {
              toValue: 0,
              duration: 2000,
              useNativeDriver: true,
            }),
          ]),
        ).start();
      };

      startFloating(floatCoinAnim, 0, -15);
      startFloating(floatCardAnim, 500, 15);
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return null;
  }

  const handleStart = () => {
    router.push("/home");
  };

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />
      <StatusBar barStyle="dark-content" backgroundColor="#F4F9FF" />

      <Animated.View
        style={[
          styles.floatingCoin,
          {
            top: "15%",
            right: "10%",
            transform: [{ translateY: floatCoinAnim }, { rotate: "15deg" }],
          },
        ]}
      />
      <Animated.View
        style={[
          styles.floatingCard,
          {
            top: "35%",
            left: "-5%",
            transform: [{ translateY: floatCardAnim }, { rotate: "-20deg" }],
          },
        ]}
      />
      <View style={[styles.floatingDot, { top: "10%", left: "15%" }]} />
      <View
        style={[
          styles.floatingDot,
          {
            bottom: "40%",
            right: "8%",
            backgroundColor: "#C4B5FD",
            width: 20,
            height: 20,
          },
        ]}
      />

      <Animated.View
        style={[
          styles.imageSection,
          { opacity: fadeAnim, transform: [{ translateY: slideAnim }] },
        ]}
      >
        <View style={styles.imageGlow}>
          <Image
            source={require("../assets/images/welcome.png")}
            style={styles.image}
            resizeMode="contain"
          />
        </View>
      </Animated.View>

      <Animated.View
        style={[
          styles.bottomSection,
          { opacity: fadeAnim, transform: [{ translateY: slideAnim }] },
        ]}
      >
        <View style={styles.textContainer}>
          <Text style={styles.titleText}>บันทึก</Text>
          <Text style={styles.subtitleText}>รายรับรายจ่าย</Text>

          <Text style={styles.taglineText}>
            จัดการเงินของคุณให้เป็นเรื่องสนุกและง่ายดาย{"\n"}
            พร้อมตั้งเป้าหมายไปด้วยกัน
          </Text>
        </View>

        <View style={styles.buttonWrapper}>
          <TouchableOpacity
            style={styles.button}
            onPress={handleStart}
            activeOpacity={0.85}
          >
            <Text style={styles.buttonText}>เริ่มต้นใช้งาน</Text>
            <Ionicons
              name="arrow-forward-circle"
              size={24}
              color="#FFFFFF"
              style={styles.buttonIcon}
            />
          </TouchableOpacity>
        </View>

        <View style={{ height: 32, marginTop: 20 }} />
      </Animated.View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F4F9FF",
    justifyContent: "space-between",
    paddingHorizontal: 28,
    overflow: "hidden",
  },
  floatingCoin: {
    position: "absolute",
    width: 45,
    height: 45,
    borderRadius: 22.5,
    backgroundColor: "#FDE047",
    borderWidth: 3,
    borderColor: "#FEF08A",
    shadowColor: "#FDE047",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 5,
  },
  floatingCard: {
    position: "absolute",
    width: 70,
    height: 45,
    borderRadius: 10,
    backgroundColor: "#86EFAC",
    borderWidth: 2,
    borderColor: "#FFFFFF",
    shadowColor: "#86EFAC",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  floatingDot: {
    position: "absolute",
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: "#F9A8D4",
  },
  imageSection: {
    flex: 1.2,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 30,
    zIndex: 1,
  },
  imageGlow: {
    width: "85%",
    height: "85%",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.4)",
    borderRadius: 150,
  },
  image: {
    width: "90%",
    height: "90%",
  },
  bottomSection: {
    flex: 1,
    justifyContent: "space-between",
    alignItems: "center",
    paddingBottom: 25,
    zIndex: 1,
    width: "100%",
  },
  textContainer: {
    alignItems: "center",
    marginTop: 10,
  },
  titleText: {
    fontFamily: "Kanit_700Bold",
    fontSize: 38,
    color: "#1E293B",
    textAlign: "center",
  },
  subtitleText: {
    fontFamily: "Kanit_700Bold",
    fontSize: 38,
    color: "#3B82F6",
    textAlign: "center",
    marginTop: -5,
  },
  taglineText: {
    fontFamily: "Kanit_400Regular",
    fontSize: 15,
    color: "#64748B",
    textAlign: "center",
    marginTop: 12,
    lineHeight: 22,
  },
  buttonWrapper: {
    width: "100%",
    alignItems: "center",
    marginTop: 20,
  },
  button: {
    flexDirection: "row",
    backgroundColor: "#3B82F6",
    width: "90%",
    paddingVertical: 16,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    borderBottomWidth: 5,
    borderBottomColor: "#2563EB",
    shadowColor: "#3B82F6",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  buttonText: {
    fontFamily: "Kanit_700Bold",
    fontSize: 18,
    color: "#FFFFFF",
    marginRight: 8,
  },
  buttonIcon: {
    marginTop: 2,
  },
});
