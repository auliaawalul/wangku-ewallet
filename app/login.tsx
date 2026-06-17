import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from "react-native";
import { router } from "expo-router";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase/firebaseConfig";

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email.trim() || !password) {
      Alert.alert("Peringatan", "Email dan password wajib diisi");
      return;
    }

    try {
      setLoading(true);
      await signInWithEmailAndPassword(auth, email.trim(), password);
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
      <View style={styles.logoBox}>
        <Text style={styles.logo}>P</Text>
      </View>
      <Text style={styles.title}>Masuk ke PayKu</Text>
      <Text style={styles.subtitle}>Kelola saldo dan transaksi dalam satu aplikasi</Text>

      <Text style={styles.label}>Email</Text>
      <TextInput
        style={styles.input}
        placeholder="nama@email.com"
        keyboardType="email-address"
        autoCapitalize="none"
        value={email}
        onChangeText={setEmail}
      />

      <Text style={styles.label}>Password</Text>
      <TextInput
        style={styles.input}
        placeholder="Masukkan password"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />

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
        <TouchableOpacity onPress={() => router.push("/register")}>
          <Text style={styles.registerLink}>Daftar sekarang</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "#F6FAF8",
    padding: 24,
  },
  logoBox: {
    width: 58,
    height: 58,
    borderRadius: 8,
    backgroundColor: "#0B8F6A",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 18,
  },
  logo: {
    color: "#FFFFFF",
    fontSize: 30,
    fontWeight: "800",
  },
  title: {
    fontSize: 28,
    fontWeight: "800",
    color: "#10231D",
  },
  subtitle: {
    marginTop: 6,
    marginBottom: 28,
    color: "#60716B",
    fontSize: 14,
  },
  label: {
    marginBottom: 7,
    color: "#243B33",
    fontWeight: "700",
  },
  input: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#D7E3DD",
    borderRadius: 8,
    paddingHorizontal: 14,
    paddingVertical: 13,
    marginBottom: 16,
    fontSize: 16,
  },
  button: {
    marginTop: 6,
    backgroundColor: "#0B8F6A",
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: "center",
  },
  buttonDisabled: {
    opacity: 0.65,
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
  },
  registerRow: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 22,
  },
  registerText: {
    color: "#60716B",
  },
  registerLink: {
    color: "#0B8F6A",
    fontWeight: "700",
  },
});