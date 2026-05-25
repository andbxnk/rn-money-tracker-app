import {
  Kanit_400Regular,
  Kanit_700Bold,
  useFonts,
} from "@expo-google-fonts/kanit";
import { Stack, useRouter } from "expo-router";
import React, { useEffect, useRef } from "react";
import {
  ActivityIndicator,
  Animated,
  Easing,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from "react-native";

export default function Index() {
  const router = useRouter();

  const [fontsLoaded] = useFonts({
    Kanit_400Regular,
    Kanit_700Bold,
  });

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(-40)).current;
  const floatAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (fontsLoaded) {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 1000,
          easing: Easing.out(Easing.back(1.5)),
          useNativeDriver: true,
        }),
        Animated.loop(
          Animated.sequence([
            Animated.timing(floatAnim, {
              toValue: 1,
              duration: 3000,
              useNativeDriver: true,
            }),
            Animated.timing(floatAnim, {
              toValue: 0,
              duration: 3000,
              useNativeDriver: true,
            }),
          ]),
        ),
      ]).start();

      const timer = setTimeout(() => {
        router.replace("/welcome");
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [fontsLoaded, fadeAnim, slideAnim, floatAnim, router]);

  if (!fontsLoaded) {
    return null;
  }

  const translateY1 = floatAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -15],
  });
  const translateY2 = floatAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 15],
  });

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />

      <StatusBar barStyle="dark-content" backgroundColor="#F0F9FF" />

      <Animated.View
        style={[styles.circleBg1, { transform: [{ translateY: translateY1 }] }]}
      />
      <Animated.View
        style={[styles.circleBg2, { transform: [{ translateY: translateY2 }] }]}
      />

      <Animated.View
        style={[
          styles.mainContent,
          {
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }],
          },
        ]}
      >
        <View style={styles.iconWrapper}>
          <Text style={styles.mainIcon}>🐷</Text>
        </View>

        <Text style={styles.titleText}>Money Tracking</Text>
        <Text style={styles.subTitleText}>รายรับรายจ่ายของฉัน</Text>

        <View style={styles.badgeContainer}>
          <Text style={styles.badgeText}>Smart Saving ✨</Text>
        </View>

        <ActivityIndicator
          size="large"
          color="#1E3A8A"
          style={{ marginTop: 25 }}
        />
      </Animated.View>

      <Animated.View style={[styles.footerContent, { opacity: fadeAnim }]}>
        <Text style={styles.footerText}>Created by 6852D10012</Text>
        <Text style={styles.footerSubText}>- SAU -</Text>
      </Animated.View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F0F9FF",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 50,
    overflow: "hidden",
  },
  circleBg1: {
    position: "absolute",
    top: -80,
    right: -80,
    width: 320,
    height: 320,
    borderRadius: 160,
    backgroundColor: "#E0F2FE",
    opacity: 0.9,
  },
  circleBg2: {
    position: "absolute",
    bottom: -60,
    left: -60,
    width: 280,
    height: 280,
    borderRadius: 140,
    backgroundColor: "#FFF7ED",
    opacity: 0.8,
  },
  mainContent: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1,
  },
  iconWrapper: {
    backgroundColor: "#FFFFFF",
    width: 100,
    height: 100,
    borderRadius: 50,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
    shadowColor: "#1E3A8A",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.1,
    shadowRadius: 15,
    elevation: 5,
  },
  mainIcon: {
    fontSize: 55,
  },
  titleText: {
    fontFamily: "Kanit_700Bold",
    fontSize: 44,
    color: "#1E3A8A",
    marginBottom: 6,
    textAlign: "center",
    letterSpacing: -0.5,
  },
  subTitleText: {
    fontFamily: "Kanit_400Regular",
    fontSize: 20,
    color: "#64748B",
    textAlign: "center",
    marginBottom: 15,
  },
  badgeContainer: {
    backgroundColor: "#DBEAFE",
    paddingHorizontal: 15,
    paddingVertical: 6,
    borderRadius: 20,
    marginBottom: 5,
  },
  badgeText: {
    fontFamily: "Kanit_700Bold",
    color: "#2563EB",
    fontSize: 14,
  },
  footerContent: {
    alignItems: "center",
    zIndex: 1,
    marginBottom: 50,
  },
  footerText: {
    fontFamily: "Kanit_700Bold",
    fontSize: 18,
    color: "#FDBA74",
    textAlign: "center",
    letterSpacing: 0.5,
  },
  footerSubText: {
    fontFamily: "Kanit_400Regular",
    fontSize: 16,
    color: "#FDBA74",
    textAlign: "center",
    marginTop: 4,
  },
});
