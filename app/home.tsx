import {
  Kanit_400Regular,
  Kanit_700Bold,
  useFonts,
} from "@expo-google-fonts/kanit";
import { useFocusEffect } from "expo-router";
import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Animated,
  Image,
  Platform,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { transactionService } from "../services/supa";

const thaiDateFormatter = new Intl.DateTimeFormat("th-TH", {
  day: "numeric",
  month: "long",
  year: "numeric",
});

const FluffyCloud = ({
  color,
  scale = 1,
  opacity = 1,
}: {
  color: string;
  scale?: number;
  opacity?: number;
}) => (
  <View style={{ transform: [{ scale }], opacity }}>
    <View
      style={{
        width: 100,
        height: 35,
        backgroundColor: color,
        borderRadius: 20,
      }}
    />
    <View
      style={{
        position: "absolute",
        top: -15,
        left: 15,
        width: 45,
        height: 45,
        backgroundColor: color,
        borderRadius: 25,
      }}
    />
    <View
      style={{
        position: "absolute",
        top: -25,
        left: 45,
        width: 55,
        height: 55,
        backgroundColor: color,
        borderRadius: 30,
      }}
    />
  </View>
);

export default function Home() {
  const [fontsLoaded] = useFonts({
    Kanit_400Regular,
    Kanit_700Bold,
  });

  const [transactions, setTransactions] = useState<any[]>([]);
  const [summary, setSummary] = useState({ income: 0, expense: 0, balance: 0 });
  const [loading, setLoading] = useState(true);
  const [limit, setLimit] = useState<number>(15);
  const [page, setPage] = useState<number>(1);
  const [totalCount, setTotalCount] = useState<number>(0);

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const springAnim = useRef(new Animated.Value(0.8)).current;

  const floatCloud1 = useRef(new Animated.Value(0)).current;
  const floatCloud2 = useRef(new Animated.Value(0)).current;
  const floatCloud3 = useRef(new Animated.Value(0)).current;

  const loadData = useCallback(
    async (showFullLoader = false) => {
      if (showFullLoader) setLoading(true);
      try {
        const [transResponse, summaryData] = await Promise.all([
          transactionService.getTransactions(limit, page),
          transactionService.getSummary(),
        ]);
        if (transResponse && transResponse.data) {
          setTransactions(transResponse.data);
          if (
            transResponse.count !== null &&
            transResponse.count !== undefined
          ) {
            setTotalCount(transResponse.count);
          }
        }
        if (summaryData) setSummary(summaryData);
      } catch (error) {
        console.error("Error loading home data:", error);
      } finally {
        setLoading(false);
      }
    },
    [limit, page],
  );

  useFocusEffect(
    useCallback(() => {
      const isFirstLoad = transactions.length === 0;
      loadData(isFirstLoad);
    }, [loadData, transactions.length]),
  );

  useEffect(() => {
    if (fontsLoaded) {
      Animated.sequence([
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
        ]),
        Animated.spring(springAnim, {
          toValue: 1,
          friction: 4,
          tension: 40,
          useNativeDriver: true,
        }),
      ]).start();

      const startFloating = (
        anim: Animated.Value,
        duration: number,
        distance: number,
      ) => {
        Animated.loop(
          Animated.sequence([
            Animated.timing(anim, {
              toValue: distance,
              duration: duration,
              useNativeDriver: true,
            }),
            Animated.timing(anim, {
              toValue: 0,
              duration: duration,
              useNativeDriver: true,
            }),
          ]),
        ).start();
      };

      startFloating(floatCloud1, 3000, -15);
      startFloating(floatCloud2, 4000, 20);
      startFloating(floatCloud3, 3500, -12);
    }
  }, [fontsLoaded]);

  const formatDateThai = (dateString: string) => {
    const date = new Date(dateString);
    const formattedDate = thaiDateFormatter.format(date);
    const hours = date.getHours().toString().padStart(2, "0");
    const minutes = date.getMinutes().toString().padStart(2, "0");
    return `${formattedDate} เวลา ${hours}.${minutes} น.`;
  };

  if (!fontsLoaded || (loading && transactions.length === 0)) {
    return (
      <View style={[styles.container, styles.centerAll]}>
        <ActivityIndicator size="large" color="#4AA397" />
        <Text
          style={{
            marginTop: 10,
            color: "#4AA397",
            fontFamily: "Kanit_400Regular",
          }}
        >
          กำลังเตรียมข้อมูล...
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#4AA397" />

      <Animated.View
        style={[
          styles.cloudWrapper,
          { top: "8%", left: "-10%", transform: [{ translateY: floatCloud1 }] },
        ]}
      >
        <FluffyCloud color="#E0F2FE" scale={1.2} opacity={0.6} />
      </Animated.View>

      <Animated.View
        style={[
          styles.cloudWrapper,
          { top: "28%", right: "5%", transform: [{ translateY: floatCloud2 }] },
        ]}
      >
        <FluffyCloud color="#FCE7F3" scale={0.9} opacity={0.5} />
      </Animated.View>

      <Animated.View
        style={[
          styles.cloudWrapper,
          { top: "60%", left: "-5%", transform: [{ translateY: floatCloud3 }] },
        ]}
      >
        <FluffyCloud color="#FEF3C7" scale={1.5} opacity={0.3} />
      </Animated.View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Animated.View
          style={[
            styles.upperGreenSection,
            { opacity: fadeAnim, transform: [{ translateY: slideAnim }] },
          ]}
        >
          <View style={styles.profileRow}>
            <View>
              <Text style={styles.helloText}>สวัสดีค่ะคุณ ✨</Text>
              <Text style={styles.profileName}>Tanabut Watayakone</Text>
            </View>
            <View style={styles.avatarContainer}>
              <Image
                source={require("../assets/images/profile.jpg")}
                style={styles.avatarImage}
              />
            </View>
          </View>

          <Animated.View
            style={[
              styles.dashboardCard,
              { transform: [{ scale: springAnim }] },
            ]}
          >
            <Text style={styles.cardMainLabel}>ยอดเงินคงเหลือ</Text>
            <Text style={styles.cardMainValue}>
              {summary.balance.toLocaleString("en-US", {
                minimumFractionDigits: 2,
              })}
            </Text>
            <View style={styles.cardDivider} />
            <View style={styles.cardRow}>
              <View style={styles.cardColumn}>
                <Text style={styles.cardSubLabel}>⬇️ เงินเข้า</Text>
                <Text style={styles.cardSubValue}>
                  {summary.income.toLocaleString("en-US", {
                    minimumFractionDigits: 2,
                  })}
                </Text>
              </View>
              <View style={styles.cardColumn}>
                <Text style={styles.cardSubLabel}>⬆️ เงินออก</Text>
                <Text style={styles.cardSubValue}>
                  {summary.expense.toLocaleString("en-US", {
                    minimumFractionDigits: 2,
                  })}
                </Text>
              </View>
            </View>
          </Animated.View>
        </Animated.View>

        <Animated.View
          style={[
            styles.historySection,
            { opacity: fadeAnim, transform: [{ translateY: slideAnim }] },
          ]}
        >
          <Text style={styles.sectionTitle}>✨ บันทึกรายการล่าสุด</Text>

          <View style={styles.limitContainer}>
            <Text style={styles.limitLabel}>แสดง:</Text>
            {[15, 25, 50].map((val) => (
              <TouchableOpacity
                key={val}
                onPress={() => {
                  setLimit(val);
                  setPage(1);
                }}
                activeOpacity={0.7}
                style={[
                  styles.limitBtn,
                  limit === val && styles.limitBtnActive,
                ]}
              >
                <Text
                  style={[
                    styles.limitBtnText,
                    limit === val && styles.limitBtnTextActive,
                  ]}
                >
                  {val}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {transactions.length > 0 ? (
            <>
              {transactions.slice(0, limit).map((item) => (
                <TouchableOpacity
                  key={item.id}
                  activeOpacity={0.7}
                  style={styles.transactionItem}
                >
                  <View
                    style={[
                      styles.iconCircle,
                      {
                        backgroundColor:
                          item.type === "income" ? "#E6FFFA" : "#FFEAEA",
                      },
                    ]}
                  >
                    <Text style={styles.arrowIcon}>
                      {item.type === "income" ? "💖" : "💸"}
                    </Text>
                  </View>
                  <View style={styles.transactionInfo}>
                    <Text style={styles.transactionTitle}>{item.detail}</Text>
                    <Text style={styles.transactionDate}>
                      {formatDateThai(item.created_at)}
                    </Text>
                  </View>
                  <Text
                    style={[
                      styles.transactionAmount,
                      { color: item.type === "income" ? "#3A8477" : "#E57373" },
                    ]}
                  >
                    {item.type === "income" ? "+" : "-"}
                    {item.amount.toLocaleString("en-US", {
                      minimumFractionDigits: 2,
                    })}
                  </Text>
                </TouchableOpacity>
              ))}

              <View style={styles.paginationContainer}>
                <TouchableOpacity
                  activeOpacity={0.7}
                  disabled={page === 1 || loading}
                  style={[
                    styles.pageBtn,
                    (page === 1 || loading) && styles.pageBtnDisabled,
                  ]}
                  onPress={() => setPage((prev) => Math.max(prev - 1, 1))}
                >
                  <Text
                    style={[
                      styles.pageBtnText,
                      (page === 1 || loading) && styles.pageBtnTextDisabled,
                    ]}
                  >
                    ◀ ย้อนกลับ
                  </Text>
                </TouchableOpacity>
                <View style={styles.pageInfo}>
                  <Text style={styles.pageInfoText}>หน้า {page}</Text>
                </View>
                <TouchableOpacity
                  activeOpacity={0.7}
                  disabled={page * limit >= totalCount || loading}
                  style={[
                    styles.pageBtn,
                    (page * limit >= totalCount || loading) &&
                      styles.pageBtnDisabled,
                  ]}
                  onPress={() => setPage((prev) => prev + 1)}
                >
                  <Text
                    style={[
                      styles.pageBtnText,
                      (page * limit >= totalCount || loading) &&
                        styles.pageBtnTextDisabled,
                    ]}
                  >
                    ถัดไป ▶
                  </Text>
                </TouchableOpacity>
              </View>
            </>
          ) : (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>
                ยังไม่มีรายการทางการเงินในขณะนี้ ☁️
              </Text>
              <Text style={styles.emptySubText}>
                เริ่มต้นบันทึกข้อมูลของคุณได้เลยค่ะ
              </Text>
            </View>
          )}
        </Animated.View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FAF9F6" },
  centerAll: { justifyContent: "center", alignItems: "center" },
  scrollContent: { paddingBottom: 30 },
  cloudWrapper: {
    position: "absolute",
    zIndex: 0,
  },
  upperGreenSection: {
    backgroundColor: "#4AA397",
    borderBottomLeftRadius: 45,
    borderBottomRightRadius: 45,
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 45,
    zIndex: 1,
  },
  profileRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 28,
  },
  helloText: {
    fontFamily: "Kanit_400Regular",
    fontSize: 15,
    color: "#E6FFFA",
    opacity: 0.9,
  },
  profileName: { fontFamily: "Kanit_700Bold", fontSize: 24, color: "#FFFFFF" },
  avatarContainer: {
    width: 54,
    height: 54,
    borderRadius: 27,
    backgroundColor: "#FFF",
    overflow: "hidden",
    borderWidth: 2,
    borderColor: "#E6FFFA",
  },
  avatarImage: { width: "100%", height: "100%" },
  dashboardCard: {
    backgroundColor: "#2C4A47",
    borderRadius: 28,
    padding: 24,
    ...Platform.select({
      ios: {
        shadowColor: "#1A3230",
        shadowOffset: { width: 0, height: 15 },
        shadowOpacity: 0.4,
        shadowRadius: 18,
      },
      android: { elevation: 12 },
    }),
  },
  cardMainLabel: {
    fontFamily: "Kanit_400Regular",
    fontSize: 15,
    color: "#E6FFFA",
    textAlign: "center",
    opacity: 0.9,
  },
  cardMainValue: {
    fontFamily: "Kanit_700Bold",
    fontSize: 40,
    color: "#FFFFFF",
    textAlign: "center",
    marginTop: 4,
  },
  cardDivider: {
    height: 1,
    backgroundColor: "rgba(255, 255, 255, 0.15)",
    marginVertical: 18,
  },
  cardRow: { flexDirection: "row", justifyContent: "space-between" },
  cardColumn: { flex: 1, alignItems: "center" },
  cardSubLabel: {
    fontFamily: "Kanit_400Regular",
    fontSize: 13,
    color: "#E6FFFA",
    opacity: 0.85,
    textAlign: "center",
  },
  cardSubValue: {
    fontFamily: "Kanit_700Bold",
    fontSize: 20,
    color: "#FFFFFF",
    marginTop: 4,
    textAlign: "center",
  },
  historySection: { paddingHorizontal: 24, paddingTop: 30 },
  sectionTitle: {
    fontFamily: "Kanit_700Bold",
    fontSize: 22,
    color: "#2D3748",
    textAlign: "center",
    marginBottom: 12,
  },
  limitContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  limitLabel: {
    fontFamily: "Kanit_400Regular",
    fontSize: 15,
    color: "#A0AEC0",
    marginRight: 8,
  },
  limitBtn: {
    backgroundColor: "#F0F4F8",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginHorizontal: 4,
  },
  limitBtnActive: {
    backgroundColor: "#4AA397",
    shadowColor: "#4AA397",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
  },
  limitBtnText: { fontFamily: "Kanit_700Bold", fontSize: 14, color: "#A0AEC0" },
  limitBtnTextActive: { color: "#FFFFFF" },
  transactionItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    padding: 16,
    borderRadius: 22,
    marginBottom: 14,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.04,
    shadowRadius: 10,
    elevation: 3,
  },
  iconCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 14,
  },
  arrowIcon: { fontSize: 22 },
  transactionInfo: { flex: 1 },
  transactionTitle: {
    fontFamily: "Kanit_700Bold",
    fontSize: 16,
    color: "#2D3748",
  },
  transactionDate: {
    fontFamily: "Kanit_400Regular",
    fontSize: 13,
    color: "#A0AEC0",
    marginTop: 2,
  },
  transactionAmount: { fontFamily: "Kanit_700Bold", fontSize: 18 },
  emptyContainer: {
    alignItems: "center",
    marginTop: 20,
    padding: 35,
    backgroundColor: "rgba(255, 255, 255, 0.8)",
    borderRadius: 28,
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  emptyText: { fontFamily: "Kanit_700Bold", fontSize: 17, color: "#4AA397" },
  emptySubText: {
    fontFamily: "Kanit_400Regular",
    fontSize: 14,
    color: "#A0AEC0",
    marginTop: 6,
  },
  paginationContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 20,
    marginBottom: 20,
    paddingHorizontal: 4,
  },
  pageBtn: {
    backgroundColor: "#E6FFFA",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: "#4AA397",
    minWidth: 110,
    alignItems: "center",
  },
  pageBtnDisabled: { backgroundColor: "#F0F4F8", borderColor: "#E2E8F0" },
  pageBtnText: { fontFamily: "Kanit_700Bold", fontSize: 15, color: "#3A8477" },
  pageBtnTextDisabled: { color: "#A0AEC0" },
  pageInfo: { justifyContent: "center", alignItems: "center" },
  pageInfoText: { fontFamily: "Kanit_700Bold", fontSize: 16, color: "#2D3748" },
});