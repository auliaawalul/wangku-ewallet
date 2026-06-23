import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Switch } from "react-native";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { auth, db } from "../firebase/firebaseConfig";

export default function SettingsScreen() {
  const [notifications, setNotifications] = useState(true);
  const [language, setLanguage] = useState<"id" | "en">("id");
  const [theme, setTheme] = useState<"light" | "dark">("light");

  const loadSettings = async () => {
    const user = auth.currentUser;
    if (!user) return;

    const snap = await getDoc(doc(db, "users", user.uid));
    const settings = snap.data()?.settings;

    if (settings) {
      setNotifications(settings.notifications);
      setLanguage(settings.language);
      setTheme(settings.theme);
    }
  };

  const saveSettings = async (newSettings: {
    notifications?: boolean;
    language?: "id" | "en";
    theme?: "light" | "dark";
  }) => {
    const user = auth.currentUser;
    if (!user) return;

    const updated = {
      notifications,
      language,
      theme,
      ...newSettings,
    };

    setNotifications(updated.notifications);
    setLanguage(updated.language);
    setTheme(updated.theme);

    await updateDoc(doc(db, "users", user.uid), {
      settings: updated,
    });
  };

  useEffect(() => {
    loadSettings();
  }, []);

  return (
    <View style={[styles.container, theme === "dark" && styles.darkContainer]}>
      <Text style={[styles.title, theme === "dark" && styles.darkText]}>Pengaturan Sistem</Text>

      <View style={[styles.card, theme === "dark" && styles.darkCard]}>
        <Text style={[styles.cardTitle, theme === "dark" && styles.darkText]}>Notifikasi</Text>
        <Switch
          value={notifications}
          onValueChange={(value) => saveSettings({ notifications: value })}
        />
      </View>

      <View style={[styles.card, theme === "dark" && styles.darkCard]}>
        <Text style={[styles.cardTitle, theme === "dark" && styles.darkText]}>Bahasa</Text>
        <View style={styles.optionRow}>
          <TouchableOpacity style={language === "id" ? styles.activeOption : styles.option} onPress={() => saveSettings({ language: "id" })}>
            <Text style={language === "id" ? styles.activeOptionText : styles.optionText}>Indonesia</Text>
          </TouchableOpacity>
          <TouchableOpacity style={language === "en" ? styles.activeOption : styles.option} onPress={() => saveSettings({ language: "en" })}>
            <Text style={language === "en" ? styles.activeOptionText : styles.optionText}>English</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={[styles.card, theme === "dark" && styles.darkCard]}>
        <Text style={[styles.cardTitle, theme === "dark" && styles.darkText]}>Mode Aplikasi</Text>
        <View style={styles.optionRow}>
          <TouchableOpacity style={theme === "light" ? styles.activeOption : styles.option} onPress={() => saveSettings({ theme: "light" })}>
            <Text style={theme === "light" ? styles.activeOptionText : styles.optionText}>Terang</Text>
          </TouchableOpacity>
          <TouchableOpacity style={theme === "dark" ? styles.activeOption : styles.option} onPress={() => saveSettings({ theme: "dark" })}>
            <Text style={theme === "dark" ? styles.activeOptionText : styles.optionText}>Gelap</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F6FAF8", padding: 20, paddingTop: 55 },
  darkContainer: { backgroundColor: "#10231D" },
  title: { fontSize: 26, fontWeight: "900", color: "#10231D", marginBottom: 18 },
  darkText: { color: "#FFFFFF" },
  card: { backgroundColor: "#FFFFFF", borderRadius: 16, padding: 16, marginBottom: 12, borderWidth: 1, borderColor: "#D7E3DD" },
  darkCard: { backgroundColor: "#18362D", borderColor: "#265445" },
  cardTitle: { fontSize: 16, fontWeight: "900", color: "#10231D", marginBottom: 12 },
  optionRow: { flexDirection: "row", gap: 10 },
  option: { paddingHorizontal: 14, paddingVertical: 10, borderRadius: 10, borderWidth: 1, borderColor: "#D7E3DD", backgroundColor: "#FFFFFF" },
  activeOption: { paddingHorizontal: 14, paddingVertical: 10, borderRadius: 10, backgroundColor: "#0B8F6A" },
  optionText: { color: "#0B8F6A", fontWeight: "800" },
  activeOptionText: { color: "#FFFFFF", fontWeight: "800" },
});
