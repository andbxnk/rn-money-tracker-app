import {
  Kanit_400Regular,
  Kanit_700Bold,
  useFonts,
} from "@expo-google-fonts/kanit";
import { Ionicons } from "@expo/vector-icons";
import { Stack, useRouter } from "expo-router";
import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Animated,
  Image,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { transactionService } from "../services/supa";

export default function Expense() {
  const router = useRouter();
  const [detail, setDetail] = useState("");
  const [amount, setAmount] = useState("");
  const [currentDateText, setCurrentDateText] = useState("");
  const [loading, setLoading] = useState(false);
  const [summary, setSummary] = useState({ balance: 0, income: 0, expense: 0 });

  const [fontsLoaded] = useFonts({
    Kanit_400Regular,
    Kanit_700Bold,
  });

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;
  const floatCloud1 = useRef(new Animated.Value(0)).current;

  const fetchSummary = useCallback(async () => {
    try {
      const data = await transactionService.getSummary();
      if (data) setSummary(data);
    } catch (error) {
      console.error("Error fetching summary:", error);
    }
  }, []);

  useEffect(() => {
    const months = [
      "มกราคม",
      "กุมภาพันธ์",
      "มีนาคม",
      "เมษายน",
      "พฤษภาคม",
      "มิถุนายน",
      "กรกฎาคม",
      "สิงหาคม",
      "กันยายน",
      "ตุลาคม",
      "พฤศจิกายน",
      "ธันวาคม",
    ];
    const now = new Date();
    setCurrentDateText(
      `วันที่ ${now.getDate()} ${months[now.getMonth()]} ${now.getFullYear() + 543}`,
    );
    fetchSummary();
  }, [fetchSummary]);

  useEffect(() => {
    if (fontsLoaded) {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 600,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 600,
          useNativeDriver: true,
        }),
      ]).start();

      Animated.loop(
        Animated.sequence([
          Animated.timing(floatCloud1, {
            toValue: 15,
            duration: 3000,
            useNativeDriver: true,
          }),
          Animated.timing(floatCloud1, {
            toValue: 0,
            duration: 3000,
            useNativeDriver: true,
          }),
        ]),
      ).start();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) return null;

  const handleSave = async () => {
    Keyboard.dismiss();
    if (!detail || !detail.trim()) {
      Platform.OS === "web"
        ? window.alert("แจ้งเตือน: กรุณากรอกรายละเอียดรายการเงินออก")
        : Alert.alert("แจ้งเตือน", "กรุณากรอกรายละเอียดรายการเงินออก");
      return;
    }
    const numAmount = parseFloat(amount);
    if (!amount || !amount.trim() || isNaN(numAmount) || numAmount <= 0) {
      Platform.OS === "web"
        ? window.alert(
            "แจ้งเตือน: กรุณากรอกจำนวนเงินให้ถูกต้องและมากกว่า 0 บาท",
          )
        : Alert.alert(
            "แจ้งเตือน",
            "กรุณากรอกจำนวนเงินให้ถูกต้องและมากกว่า 0 บาท",
          );
      return;
    }

    setLoading(true);
    const { error } = await transactionService.addTransaction(
      detail.trim(),
      numAmount,
      "expense",
    );
    setLoading(false);

    if (error) {
      Platform.OS === "web"
        ? window.alert("ผิดพลาด: ไม่สามารถบันทึกข้อมูลได้ กรุณาลองใหม่อีกครั้ง")
        : Alert.alert(
            "ผิดพลาด",
            "ไม่สามารถบันทึกข้อมูลได้ กรุณาลองใหม่อีกครั้ง",
          );
      return;
    }

    const successMessage = "บันทึกข้อมูลรายจ่ายเรียบร้อยแล้ว ✨";
    if (Platform.OS === "web") {
      window.alert(`สำเร็จ: ${successMessage}`);
      setDetail("");
      setAmount("");
      fetchSummary();
    } else {
      Alert.alert("สำเร็จ", successMessage, [
        {
          text: "ตกลง",
          onPress: () => {
            setDetail("");
            setAmount("");
            fetchSummary();
          },
        },
      ]);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />
      <StatusBar barStyle="light-content" backgroundColor="#E57373" />

      <Animated.View
        style={[
          styles.cloudDeco,
          {
            top: "35%",
            left: "-10%",
            backgroundColor: "#FFEAEA",
            transform: [{ translateY: floatCloud1 }],
          },
        ]}
      />
      <Animated.View
        style={[
          styles.cloudDeco,
          {
            top: "65%",
            right: "-15%",
            width: 180,
            height: 70,
            borderRadius: 35,
            backgroundColor: "#FCE7F3",
            transform: [{ translateY: floatCloud1 }],
          },
        ]}
      />

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          bounces={false}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <Animated.View
            style={[styles.upperRedSection, { opacity: fadeAnim }]}
          >
            <View style={styles.profileRow}>
              <Text style={styles.profileName}>Tanabut Watayakone</Text>
              <View style={styles.avatarContainer}>
                <Image
                  source={require("../assets/images/profile.jpg")}
                  style={styles.avatarImage}
                  resizeMode="cover"
                />
              </View>
            </View>

            <View style={styles.dashboardCard}>
              <Text style={styles.cardMainLabel}>ยอดเงินคงเหลือ</Text>
              <Text style={styles.cardMainValue}>
                {summary.balance.toLocaleString("en-US", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </Text>
              <View style={styles.cardDivider} />
              <View style={styles.cardRow}>
                <View style={styles.cardColumn}>
                  <Text style={styles.cardSubLabel}>⬇️ ยอดเงินเข้ารวม</Text>
                  <Text style={styles.cardSubValue}>
                    {summary.income.toLocaleString("en-US", {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </Text>
                </View>
                <View style={styles.cardColumn}>
                  <Text style={styles.cardSubLabel}>⬆️ ยอดเงินออกรวม</Text>
                  <Text style={styles.cardSubValue}>
                    {summary.expense.toLocaleString("en-US", {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </Text>
                </View>
              </View>
            </View>
          </Animated.View>

          <Animated.View
            style={[
              styles.lowerFormSection,
              { opacity: fadeAnim, transform: [{ translateY: slideAnim }] },
            ]}
          >
            <Text style={styles.currentDateTitle}>{currentDateText}</Text>
            <Text style={styles.sectionFormTitle}>บันทึกรายจ่าย 💸</Text>

            <View style={styles.inputWrapper}>
              <View style={styles.labelBackground}>
                <Text style={styles.fieldLabelText}>รายละเอียด</Text>
              </View>
              <View style={styles.inputContainer}>
                <Ionicons
                  name="cart-outline"
                  size={20}
                  color="#E57373"
                  style={styles.inputIcon}
                />
                <TextInput
                  style={styles.textInputField}
                  placeholder="ค่าอาหาร, ค่าเดินทาง ฯลฯ"
                  placeholderTextColor="#A0AEC0"
                  value={detail}
                  onChangeText={setDetail}
                />
              </View>
            </View>

            <View style={styles.inputWrapper}>
              <View style={styles.labelBackground}>
                <Text style={styles.fieldLabelText}>จำนวนเงิน (บาท)</Text>
              </View>
              <View style={styles.inputContainer}>
                <Ionicons
                  name="cash-outline"
                  size={20}
                  color="#E57373"
                  style={styles.inputIcon}
                />
                <TextInput
                  style={styles.textInputField}
                  placeholder="0.00"
                  placeholderTextColor="#A0AEC0"
                  keyboardType="decimal-pad"
                  returnKeyType="done"
                  value={amount}
                  onChangeText={setAmount}
                />
              </View>
            </View>

            <TouchableOpacity
              style={styles.saveButton}
              onPress={handleSave}
              activeOpacity={0.85}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.saveButtonText}>บันทึกเงินออก</Text>
              )}
            </TouchableOpacity>
          </Animated.View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FAF9F6", overflow: "hidden" },
  scrollContent: { flexGrow: 1 },
  cloudDeco: {
    position: "absolute",
    width: 140,
    height: 60,
    borderRadius: 30,
    opacity: 0.4,
    zIndex: 1,
  },
  upperRedSection: {
    backgroundColor: "#E57373",
    borderBottomLeftRadius: 40,
    borderBottomRightRadius: 40,
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 38,
    zIndex: 2,
  },
  profileRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 10,
    marginBottom: 24,
  },
  profileName: { fontFamily: "Kanit_700Bold", fontSize: 22, color: "#FFFFFF" },
  avatarContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#FFF",
    overflow: "hidden",
    borderWidth: 2,
    borderColor: "#FFEAEA",
  },
  avatarImage: { width: "100%", height: "100%" },
  dashboardCard: {
    backgroundColor: "#451A1A",
    borderRadius: 24,
    padding: 22,
    width: "100%",
    shadowColor: "#451A1A",
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.35,
    shadowRadius: 16,
  },
  cardMainLabel: {
    fontFamily: "Kanit_400Regular",
    fontSize: 14,
    color: "#FFEAEA",
    textAlign: "center",
    opacity: 0.9,
  },
  cardMainValue: {
    fontFamily: "Kanit_700Bold",
    fontSize: 36,
    color: "#FFFFFF",
    textAlign: "center",
    marginTop: 4,
  },
  cardDivider: {
    height: 1,
    backgroundColor: "rgba(255, 255, 255, 0.15)",
    marginVertical: 16,
  },
  cardRow: { flexDirection: "row", justifyContent: "space-between" },
  cardColumn: { flex: 1, alignItems: "center", justifyContent: "center" },
  cardSubLabel: {
    fontFamily: "Kanit_400Regular",
    fontSize: 12,
    color: "#FFEAEA",
    opacity: 0.85,
    textAlign: "center",
  },
  cardSubValue: {
    fontFamily: "Kanit_700Bold",
    fontSize: 18,
    color: "#FFFFFF",
    marginTop: 4,
    textAlign: "center",
  },
  lowerFormSection: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 30,
    alignItems: "center",
    zIndex: 2,
  },
  currentDateTitle: {
    fontFamily: "Kanit_700Bold",
    fontSize: 28,
    color: "#2D3748",
    textAlign: "center",
  },
  sectionFormTitle: {
    fontFamily: "Kanit_700Bold",
    fontSize: 18,
    color: "#E57373",
    textAlign: "center",
    marginTop: 6,
    marginBottom: 26,
  },
  inputWrapper: { width: "100%", marginBottom: 24, position: "relative" },
  labelBackground: {
    position: "absolute",
    top: -10,
    left: 24,
    backgroundColor: "#FAF9F6",
    paddingHorizontal: 6,
    zIndex: 3,
  },
  fieldLabelText: {
    fontFamily: "Kanit_400Regular",
    fontSize: 12,
    color: "#E57373",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1.5,
    borderColor: "#F4B4B4",
    borderRadius: 20,
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 16,
  },
  inputIcon: { marginRight: 10 },
  textInputField: {
    flex: 1,
    paddingVertical: 14,
    fontFamily: "Kanit_400Regular",
    fontSize: 16,
    color: "#2D3748",
  },
  saveButton: {
    backgroundColor: "#E57373",
    width: "90%",
    paddingVertical: 16,
    borderRadius: 25,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 12,
    marginBottom: 35,
    borderBottomWidth: 5,
    borderBottomColor: "#451A1A",
    shadowColor: "#451A1A",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.35,
    shadowRadius: 10,
  },
  saveButtonText: {
    fontFamily: "Kanit_700Bold",
    fontSize: 18,
    color: "#FFFFFF",
    letterSpacing: 0.5,
  },
});
