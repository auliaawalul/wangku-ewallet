import { router } from "expo-router";
import { createUserWithEmailAndPassword } from "firebase/auth"; // Import Firebase Auth
import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { auth } from "../firebase/firebaseConfig"; // Import konfigurasi auth kamu

export default function RegisterScreen() {
  const [nama, setNama] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [tanggalLahir, setTanggalLahir] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

const handleRegister = async () => {
    const cleanEmail = email.trim();
    const cleanPassword = password;

    if (!nama.trim() || !cleanEmail || !cleanPassword || !tanggalLahir.trim()) {
      Alert.alert("Peringatan", "Harap isi semua kolom wajib.");
      return;
    }

    // --- PERBAIKAN VALIDASI TANGGAL LAHIR (ANTI-EROR BROWSER) ---
    // Memastikan format yang dimasukkan menggunakan strip (-) bukan garis miring (/)
    const formattedDateString = tanggalLahir.trim().replace(/\//g, "-");
    const birthDate = new Date(formattedDateString);
    
    if (isNaN(birthDate.getTime())) {
      Alert.alert("Format Salah", "Gunakan format tanggal YYYY-MM-DD (Contoh: 2005-08-17)");
      return;
    }

    const tahunLahir = birthDate.getFullYear();
    // Validasi aturan kelayakan: Kelahiran sebelum 2011 (2010 ke bawah) yang boleh lolos
    if (tahunLahir >= 2011) {
      Alert.alert("Pendaftaran Gagal", "Maaf, pendaftaran hanya diperbolehkan untuk usia kelahiran di bawah tahun 2011.");
      return;
    }
    // -------------------------------------------------------------

    try {
      setLoading(true);
      
      // Proses mendaftarkan akun nyata ke server Firebase Auth
      await createUserWithEmailAndPassword(auth, cleanEmail, cleanPassword);
      
      Alert.alert("Sukses", "Pendaftaran akun WangKu berhasil! Silakan login.");
      router.replace("/login");
    } catch (error: any) {
      console.error("Detail Eror Firebase:", error); // Menampilkan pesan eror asli di terminal VS Code
      
      // Menangkap seluruh potensi kegagalan agar tidak terjadi crash 'Uncaught'
      if (error.code === "auth/email-already-in-use") {
        Alert.alert("Gagal", "Email ini sudah terdaftar. Gunakan email lain.");
      } else if (error.code === "auth/weak-password") {
        Alert.alert("Gagal", "Password minimal harus 6 karakter.");
      } else if (error.code === "auth/invalid-email") {
        Alert.alert("Gagal", "Format email tidak valid.");
      } else if (error.code === "auth/operation-not-allowed") {
        Alert.alert("Firebase Belum Aktif", "Silakan aktifkan metode Email/Password di Firebase Console Anda.");
      } else {
        Alert.alert("Gagal", `Terjadi kesalahan sistem: ${error.message}`);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1, backgroundColor: "#F8FAFC" }}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        <View style={styles.responsiveWrapper}>
          
          {/* HEADER AREA */}
          <View style={styles.headerArea}>
            <Image 
              source={require("../assets/images/logo.png")} 
              style={styles.logoImageRegister} 
              resizeMode="contain"
            />
            <Text style={styles.title}>Daftar Akun Baru</Text>
            <Text style={styles.subtitle}>Bergabunglah dengan WangKu untuk kemudahan transaksi</Text>
          </View>

          {/* FORM AREA */}
          <View style={styles.formArea}>
            <Text style={styles.label}>Nama Lengkap</Text>
            <TextInput 
              style={styles.input} 
              placeholder="Nama lengkap Anda" 
              placeholderTextColor="#94A3B8"
              value={nama}
              onChangeText={setNama}
            />

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

            <Text style={styles.label}>Nomor Ponsel</Text>
            <TextInput 
              style={styles.input} 
              placeholder="contoh: 08123456789" 
              placeholderTextColor="#94A3B8" 
              keyboardType="phone-pad"
              value={phone}
              onChangeText={setPhone}
            />

            <Text style={styles.label}>Tanggal Lahir</Text>
            <TextInput 
              style={styles.input} 
              placeholder="YYYY-MM-DD (contoh: 2005-08-17)" 
              placeholderTextColor="#94A3B8"
              value={tanggalLahir}
              onChangeText={setTanggalLahir}
            />
            <Text style={styles.hintText}>Hanya pengguna lahir sebelum tahun 2011 yang bisa register.</Text>

            {/* PASSWORD WITH EYE BUTTON */}
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

            {/* BUTTON SUBMIT */}
            <TouchableOpacity 
              style={[styles.button, loading && { opacity: 0.7 }]} 
              onPress={handleRegister}
              disabled={loading}
            >
              {loading ? <ActivityIndicator color="#FFFFFF" /> : <Text style={styles.buttonText}>Daftar</Text>}
            </TouchableOpacity>

            {/* FOOTER LINK */}
            <View style={styles.loginRow}>
              <Text style={styles.loginText}>Sudah punya akun? </Text>
              <TouchableOpacity onPress={() => router.push("/login")}>
                <Text style={styles.loginLink}>Login</Text>
              </TouchableOpacity>
            </View>
          </View>

        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 40,
  },
  responsiveWrapper: {
    width: "100%",
    maxWidth: 420,
    paddingHorizontal: 20,
  },
  headerArea: {
    alignItems: "center",
    marginBottom: 24,
  },
  logoImageRegister: {
    width: 130,
    height: 130,
    marginBottom: 8,
  },
  title: {
    fontSize: 26,
    fontWeight: "900",
    color: "#0F172A",
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 13,
    color: "#64748B",
    textAlign: "center",
    marginTop: 4,
    paddingHorizontal: 10,
  },
  formArea: {
    width: "100%",
  },
  label: {
    fontSize: 13,
    fontWeight: "700",
    color: "#475569",
    marginBottom: 6,
    marginLeft: 2,
  },
  input: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 15,
    color: "#0F172A",
    marginBottom: 16,
  },
  hintText: {
    fontSize: 11,
    color: "#94A3B8",
    marginTop: -10,
    marginBottom: 16,
    marginLeft: 2,
  },
  passwordContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    borderRadius: 12,
    marginBottom: 20,
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
    backgroundColor: "#10B981", 
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: "center",
    shadowColor: "#10B981",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 4,
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "800",
  },
  loginRow: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 20,
  },
  loginText: {
    color: "#64748B",
    fontSize: 13,
  },
  loginLink: {
    color: "#0EA5E9",
    fontWeight: "700",
    fontSize: 13,
  },
});