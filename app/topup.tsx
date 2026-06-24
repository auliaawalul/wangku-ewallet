import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { addDoc, collection, doc, getDoc, serverTimestamp, setDoc } from "firebase/firestore";
import React, { useState } from "react";
import { Alert, Platform, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { auth, db } from "../firebase/firebaseConfig";
import { useLanguage } from "./LanguageContext";

export default function TopUpScreen() {
  const { t } = useLanguage(); 
  const [amount, setAmount] = useState("");

  const quickAmounts = ["50000", "100000", "200000", "500000"];

  const topUpBalance = async () => {
    try {
      const user = auth.currentUser;
      const nominal = Number(amount);

      if (!user) {
        Alert.alert(
          t.cancel === "Cancel" ? "Failed" : "Gagal", 
          t.cancel === "Cancel" ? "Please login first" : "Silakan login terlebih dahulu"
        );
        return;
      }

      if (!nominal || nominal < 10000) {
        Alert.alert(
          t.cancel === "Cancel" ? "Warning" : "Peringatan", 
          t.topupMin
        );
        return;
      }

const userRef = doc(db, "users", user.uid);
const userSnap = await getDoc(userRef);
const currentBalance = userSnap.exists() ? userSnap.data().balance || 0 : 0;

      // Update saldo di Firestore
      await setDoc(userRef, {
        balance: currentBalance + nominal,
      });

      // Rekam jejak transaksi ke Firestore
      await addDoc(collection(db, "transactions"), {
        uid: user.uid,
        type: "topup",
        title: t.cancel === "Cancel" ? "Balance Top Up" : "Top Up Saldo",
        amount: nominal,
        status: "success",
        createdAt: serverTimestamp(),
      });

      setAmount("");
      Alert.alert(t.cancel === "Cancel" ? "Success" : "Berhasil", t.topupSuccess);
      router.back();
    } catch (err: any) {
      console.log("TOPUP ERROR:", err.message);
      Alert.alert("Error", t.cancel === "Cancel" ? "Failed to process top up" : "Top up gagal diproses");
    }
  };

  const formatRupiah = (val: string) => {
    if (!val) return "";
    return val.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  };

  return (
    <View style={styles.container}>
      {/* Header navigasi */}
      <View style={styles.headerRow}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#0F172A" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{t.topupTitle}</Text>
        <View style={{ width: 40 }} /> 
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Desain Kartu Input Utama */}
        <View style={styles.cardInput}>
          <Text style={styles.cardLabel}>{t.cancel === "Cancel" ? "Enter Amount" : "Masukkan Nominal"}</Text>
          <View style={styles.inputWrapper}>
            <Text style={styles.currencyPrefix}>Rp</Text>
            <TextInput
              style={styles.input}
              placeholder="0"
              placeholderTextColor="#94A3B8"
              keyboardType="numeric"
              value={amount}
              onChangeText={(val) => setAmount(val.replace(/[^0-9]/g, ""))} // 👈 PERBAIKAN: Sekarang bisa ketik angka 9
            />
          </View>
          {amount ? (
            <Text style={styles.helperText}>
              Total: Rp {formatRupiah(amount)}
            </Text>
          ) : null}
        </View>

        {/* Pilihan Nominal Cepat */}
        <Text style={styles.sectionTitle}>{t.cancel === "Cancel" ? "Quick Top Up" : "Nominal Instan"}</Text>
        <View style={styles.gridQuick}>
          {quickAmounts.map((item) => (
            <TouchableOpacity 
              key={item} 
              style={[styles.quickCard, amount === item && styles.quickCardActive]} 
              onPress={() => setAmount(item)}
            >
              <Text style={[styles.quickText, amount === item && styles.quickTextActive]}>
                Rp {formatRupiah(item)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Info Box Aturan */}
        <View style={styles.infoBox}>
          <Ionicons name="information-circle-outline" size={18} color="#0A9396" style={{ marginTop: 2 }} />
          <Text style={styles.infoText}>{t.topupMin}</Text>
        </View>
      </ScrollView>

      {/* Tombol Eksekusi */}
      <TouchableOpacity style={styles.button} onPress={topUpBalance}>
        <Text style={styles.buttonText}>{t.topupTitle}</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8FAFC",
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingTop: Platform.OS === "ios" ? 60 : 45,
    paddingBottom: 16,
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderColor: "#E2E8F0",
  },
  backButton: {
    padding: 8,
    backgroundColor: "#F1F5F9",
    borderRadius: 12,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#0F172A",
  },
  scrollContent: {
    padding: 24,
  },
  cardInput: {
    backgroundColor: "#FFFFFF",
    borderRadius: 24,
    padding: 24,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    elevation: 2,
    shadowColor: "#0F172A",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    marginBottom: 24,
  },
  cardLabel: {
    fontSize: 13,
    fontWeight: "700",
    color: "#64748B",
    textTransform: "uppercase",
    letterSpacing: 0.5,
    marginBottom: 12,
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    borderBottomWidth: 2,
    borderColor: "#E2E8F0",
    paddingBottom: 8,
  },
  currencyPrefix: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#0F172A",
    marginRight: 8,
  },
  input: {
    flex: 1,
    fontSize: 32,
    fontWeight: "bold",
    color: "#0A9396",
    padding: 0,
  },
  helperText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#64748B",
    marginTop: 10,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: "#475569",
    marginBottom: 12,
    marginLeft: 4,
  },
  gridQuick: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  quickCard: {
    width: "47%",
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    borderRadius: 16,
    paddingVertical: 14,
    alignItems: "center",
    marginBottom: 14,
  },
  quickCardActive: {
    backgroundColor: "#E6F4F4",
    borderColor: "#0A9396",
  },
  quickText: {
    fontSize: 14,
    fontWeight: "700",
    color: "#475569",
  },
  quickTextActive: {
    color: "#0A9396",
  },
  infoBox: {
    flexDirection: "row",
    backgroundColor: "#EFF6FF",
    borderRadius: 12,
    padding: 12,
    alignItems: "flex-start",
  },
  infoText: {
    flex: 1,
    fontSize: 12,
    fontWeight: "600",
    color: "#1E40AF",
    marginLeft: 8,
    lineHeight: 16,
  },
  button: {
    margin: 24,
    backgroundColor: "#0A9396",
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: "center",
    elevation: 3,
    shadowColor: "#0A9396",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
  },
  buttonText: {
    color: "#FFFFFF",
    fontWeight: "700",
    fontSize: 16,
  },
});