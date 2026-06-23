import { router } from "expo-router";
import { signInWithEmailAndPassword } from "firebase/auth";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Dimensions,
  Image,
  KeyboardAvoidingView,
  Modal,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { auth } from "../firebase/firebaseConfig";

const { width } = Dimensions.get("window");

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [isSheetVisible, setIsSheetVisible] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async () => {
    if (!email.trim() || !password) {
      Alert.alert("Peringatan", "Email dan password wajib diisi");
      return;
    }

    try {
      setLoading(true);
      await signInWithEmailAndPassword(auth, email.trim(), password);
      setIsSheetVisible(false);
      router.replace("/");
    } catch (error: any) {
      Alert.alert(
        "Login gagal",
        error.code === "auth/invalid-credential"
          ? "Email atau password tidak benar"
          : "Tidak dapat masuk ke aplikasi"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.responsiveWrapper}>
        
        {/* 1. BANNER WARNING */}
        <View style={styles.warningBanner}>
          <Text style={styles.warningTitle}>⚠️ Waspada Penipuan</Text>
          <Text style={styles.warningText}>
            Jangan berikan data pribadi seperti OTP, PIN, dan Password kepada siapapun termasuk pihak WangKu.
          </Text>
        </View>

        {/* 2. AREA UTAMA LOGO & BRANDING */}
        <View style={styles.centerContent}>
          <Image 
            source={require("../assets/images/logo.png")} 
            style={styles.logoImageReal} 
            resizeMode="contain"
          />
          <Text style={styles.title}>
            Wang<Text style={styles.titleAccent}>ku</Text>
          </Text>
          <Text style={styles.subtitle}>Kelola Uang, Raih Masa Depan.</Text>
        </View>

        {/* 3. TOMBOL UTAMA (PRODUK DIGITAL SUDAH DIHAPUS) */}
        <View style={styles.actionArea}>
          <TouchableOpacity 
            style={styles.openSheetButton} 
            onPress={() => setIsSheetVisible(true)}
          >
            <Text style={styles.openSheetButtonText}>Login</Text>
          </TouchableOpacity>
        </View>

        {/* FOOTER */}
        <Text style={styles.versionText}>Versi 2.1.0</Text>
      </View>

      {/* ================= MODAL BOTTOM SHEET ================= */}
      <Modal
        visible={isSheetVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setIsSheetVisible(false)}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={styles.modalOverlay}
        >
          <TouchableOpacity style={styles.dismissArea} onPress={() => setIsSheetVisible(false)} />

          <View style={styles.bottomSheetContainer}>
            <View style={styles.bottomSheet}>
              <View style={styles.sheetHandle} />

              <Text style={styles.sheetTitle}>Masuk ke WangKu</Text>
              <Text style={styles.sheetSubtitle}>Gunakan akun terdaftar Anda untuk mengelola saldo</Text>

              {/* INPUT EMAIL */}
              <Text style={styles.label}>Email</Text>
              <TextInput
                style={styles.input}
                placeholder="nama@email.com"
                placeholderTextColor="#94A3B8"
                keyboardType="email-address"
                autoCapitalize="none"
                value={email}
                onChangeText={setEmail}
              />

              {/* INPUT PASSWORD */}
              <Text style={styles.label}>Password</Text>
              <View style={styles.passwordContainer}>
                <TextInput
                  style={styles.passwordInput}
                  placeholder="Masukkan password"
                  placeholderTextColor="#94A3B8"
                  secureTextEntry={!showPassword}
                  value={password}
                  onChangeText={setPassword}
                />
                <TouchableOpacity 
                  style={styles.eyeButton} 
                  onPress={() => setShowPassword(!showPassword)}
                >
                  <Text style={styles.eyeIcon}>{showPassword ? "👁️" : "🙈"}</Text>
                </TouchableOpacity>
              </View>

              {/* TOMBOL SUBMIT */}
              <TouchableOpacity
                style={[styles.button, loading && styles.buttonDisabled]}
                onPress={handleLogin}
                disabled={loading}
              >
                {loading ? (
                  <ActivityIndicator color="#FFFFFF" />
                ) : (
                  <Text style={styles.buttonText}>Login</Text>
                )}
              </TouchableOpacity>

              <View style={styles.registerRow}>
                <Text style={styles.registerText}>Belum memiliki akun? </Text>
                <TouchableOpacity onPress={() => { setIsSheetVisible(false); router.push("/register"); }}>
                  <Text style={styles.registerLink}>Daftar sekarang</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8FAFC",
    alignItems: "center",
    justifyContent: "center",
  },
  responsiveWrapper: {
    width: "100%",
    maxWidth: 420,
    height: "100%",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 30,
    paddingHorizontal: 20,
  },
  warningBanner: {
    width: "100%",
    backgroundColor: "#074E5B",
    borderRadius: 16,
    padding: 16,
  },
  warningTitle: {
    color: "#F59E0B",
    fontWeight: "800",
    fontSize: 13,
    marginBottom: 4,
  },
  warningText: {
    color: "#E2E8F0",
    fontSize: 11,
    lineHeight: 16,
  },
  centerContent: {
    alignItems: "center",
    width: "100%",
  },
  logoImageReal: {
    width: 160, // Diperbesar biar penuh & pas
    height: 160,
    marginBottom: 8,
  },
  title: {
    fontSize: 34,
    fontWeight: "900",
    color: "#1E293B",
    letterSpacing: -0.5,
  },
  titleAccent: {
    color: "#10B981", // Disesuaikan dengan warna hijau toska logo asli
  },
  subtitle: {
    marginTop: 8,
    color: "#64748B",
    fontSize: 14,
    textAlign: "center",
    paddingHorizontal: 20,
  },
  actionArea: {
    width: "100%",
    alignItems: "center",
    marginBottom: 20,
  },
  openSheetButton: {
    width: "100%",
    backgroundColor: "#0EA5E9", // Warna biru toska cerah sesuai logo
    borderRadius: 25,
    paddingVertical: 14,
    alignItems: "center",
    shadowColor: "#0EA5E9",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 4,
  },
  openSheetButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "800",
  },
  versionText: {
    color: "#94A3B8",
    fontSize: 11,
    fontWeight: "600",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(15, 23, 42, 0.4)",
    justifyContent: "flex-end",
    alignItems: "center",
  },
  dismissArea: {
    flex: 1,
    width: "100%",
  },
  bottomSheetContainer: {
    width: "100%",
    maxWidth: 420,
    backgroundColor: "transparent",
  },
  bottomSheet: {
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: Platform.OS === "ios" ? 40 : 24,
  },
  sheetHandle: {
    width: 36,
    height: 5,
    backgroundColor: "#E2E8F0",
    borderRadius: 3,
    alignSelf: "center",
    marginBottom: 20,
  },
  sheetTitle: {
    fontSize: 22,
    fontWeight: "900",
    color: "#0F172A",
  },
  sheetSubtitle: {
    fontSize: 13,
    color: "#64748B",
    marginTop: 4,
    marginBottom: 24,
  },
  label: {
    marginBottom: 6,
    color: "#475569",
    fontWeight: "700",
    fontSize: 13,
    marginLeft: 2,
  },
  input: {
    backgroundColor: "#F8FAFC",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginBottom: 16,
    fontSize: 15,
    color: "#0F172A",
  },
  passwordContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F8FAFC",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    borderRadius: 12,
    marginBottom: 16,
  },
  passwordInput: {
    flex: 1,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 15,
    color: "#0F172A",
  },
  eyeButton: {
    paddingHorizontal: 14,
  },
  eyeIcon: {
    fontSize: 18,
  },
  button: {
    marginTop: 10,
    backgroundColor: "#10B981",
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: "center",
  },
  buttonDisabled: {
    opacity: 0.65,
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "800",
  },
  registerRow: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 20,
  },
  registerText: {
    color: "#64748B",
    fontSize: 13,
  },
  registerLink: {
    color: "#0EA5E9",
    fontWeight: "700",
    fontSize: 13,
  },
});