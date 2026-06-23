import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { getAuth, signOut } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { Alert, Platform, ScrollView, StyleSheet, Switch, Text, TouchableOpacity, View } from "react-native";
import { db } from "../../firebase/firebaseConfig";
import { useLanguage } from "../LanguageContext";

export default function SettingsScreen() {
  const auth = getAuth();
  const { language, changeLanguage, t } = useLanguage();
  const [notifications, setNotifications] = useState(true);
  const [theme, setTheme] = useState<"light" | "dark">("light");

  const loadSettings = async () => {
    const user = auth.currentUser;
    if (!user) return;
    try {
      const snap = await getDoc(doc(db, "users", user.uid));
      const settings = snap.data()?.settings;
      if (settings) {
        setNotifications(settings.notifications);
        setTheme(settings.theme ?? "light");
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => { loadSettings(); }, []);

  const handleLogout = () => {
    Alert.alert(t.logout, t.logoutDesc, [
      { text: t.cancel, style: "cancel" },
      { text: t.logout, style: "destructive", onPress: () => signOut(auth).then(() => router.replace("/login")) }
    ]);
  };

  const isDark = theme === "dark";

  return (
    <ScrollView style={[styles.container, isDark && styles.darkContainer]} contentContainerStyle={styles.contentContainer} showsVerticalScrollIndicator={false}>
      <Text style={[styles.title, isDark && styles.darkText]}>{t.settingsTitle}</Text>
      
      <Text style={styles.sectionTitle}>{t.sectionApp}</Text>
      
      <View style={[styles.card, isDark && styles.darkCard]}>
        {/* Row 1: Notifikasi */}
        <View style={styles.rowItem}>
          <View style={styles.leftRow}>
            <View style={[styles.iconBox, { backgroundColor: "#E0F2FE" }]}>
              <Ionicons name="notifications" size={20} color="#0284C7" />
            </View>
            <Text style={[styles.rowLabel, isDark && styles.darkText]}>{t.notif}</Text>
          </View>
          <Switch
            value={notifications}
            trackColor={{ false: "#CBD5E1", true: "#99E2E6" }}
            thumbColor={notifications ? "#0A9396" : "#F1F5F9"}
            onValueChange={(value) => setNotifications(value)}
          />
        </View>

        <View style={styles.divider} />

        {/* Row 2: Pilihan Bahasa */}
        <View style={styles.rowItem}>
          <View style={styles.leftRow}>
            <View style={[styles.iconBox, { backgroundColor: "#F3E8FF" }]}>
              <Ionicons name="language" size={20} color="#7E22CE" />
            </View>
            <Text style={[styles.rowLabel, isDark && styles.darkText]}>{t.lang}</Text>
          </View>
          <View style={styles.pillContainer}>
            <TouchableOpacity style={[styles.pillButton, language === "id" && styles.pillActive]} onPress={() => changeLanguage("id")}>
              <Text style={[styles.pillText, language === "id" && styles.pillTextActive]}>ID</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.pillButton, language === "en" && styles.pillActive]} onPress={() => changeLanguage("en")}>
              <Text style={[styles.pillText, language === "en" && styles.pillTextActive]}>EN</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.divider} />

        {/* Row 3: Pilihan Tema */}
        <View style={styles.rowItem}>
          <View style={styles.leftRow}>
            <View style={[styles.iconBox, { backgroundColor: "#FEF3C7" }]}>
              <Ionicons name={isDark ? "moon" : "sunny"} size={20} color="#D97706" />
            </View>
            <Text style={[styles.rowLabel, isDark && styles.darkText]}>{t.theme}</Text>
          </View>
          <Switch
            value={isDark}
            trackColor={{ false: "#CBD5E1", true: "#99E2E6" }}
            thumbColor={isDark ? "#0A9396" : "#F1F5F9"}
            onValueChange={(value) => setTheme(value ? "dark" : "light")}
          />
        </View>
      </View>

      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Ionicons name="log-out-outline" size={20} color="#EF4444" style={{ marginRight: 8 }} />
        <Text style={styles.logoutText}>{t.logout}</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F8FAFC" },
  darkContainer: { backgroundColor: "#0F172A" },
  contentContainer: { padding: 20, paddingTop: Platform.OS === "ios" ? 60 : 45, paddingBottom: 40 },
  title: { fontSize: 26, fontWeight: "bold", color: "#0F172A", marginBottom: 24 },
  darkText: { color: "#F8FAFC" },
  sectionTitle: { fontSize: 12, fontWeight: "700", color: "#64748B", marginBottom: 10, letterSpacing: 1, marginLeft: 4 },
  card: { backgroundColor: "#FFFFFF", borderRadius: 20, paddingVertical: 8, paddingHorizontal: 16, marginBottom: 24, borderWidth: 1, borderColor: "#E2E8F0", elevation: 2 },
  darkCard: { backgroundColor: "#1E293B", borderColor: "#334155" },
  rowItem: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingVertical: 12 },
  leftRow: { flexDirection: "row", alignItems: "center" },
  iconBox: { width: 38, height: 38, borderRadius: 10, justifyContent: "center", alignItems: "center", marginRight: 14 },
  rowLabel: { fontSize: 15, fontWeight: "600", color: "#334155" },
  divider: { height: 1, backgroundColor: "#F1F5F9", opacity: 0.8 },
  pillContainer: { flexDirection: "row", backgroundColor: "#F1F5F9", padding: 4, borderRadius: 10 },
  pillButton: { paddingHorizontal: 14, paddingVertical: 6, borderRadius: 8 },
  pillActive: { backgroundColor: "#0A9396" },
  pillText: { fontSize: 12, fontWeight: "700", color: "#64748B" },
  pillTextActive: { color: "#FFFFFF" },
  logoutButton: { flexDirection: "row", backgroundColor: "#FEF2F2", borderRadius: 16, paddingVertical: 14, justifyContent: "center", alignItems: "center", marginTop: 10, borderWidth: 1, borderColor: "#FEE2E2" },
  logoutText: { color: "#EF4444", fontSize: 15, fontWeight: "700" },
});