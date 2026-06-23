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
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, serverTimestamp, setDoc } from "firebase/firestore";
import { auth, db } from "../firebase/firebaseConfig";

export default function RegisterScreen() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    if (!name.trim() || !email.trim() || !password || !confirmPassword) {
      Alert.alert("Peringatan", "Semua data wajib diisi");
      return;
    }

    if (password.length < 6) {
      Alert.alert("Peringatan", "Password minimal 6 karakter");
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert("Peringatan", "Konfirmasi password tidak sama");
      return;
    }

    try {
      setLoading(true);
      const credential = await createUserWithEmailAndPassword(
        auth,
        email.trim(),
        password
      );

      await setDoc(doc(db, "users", credential.user.uid), {
        uid: credential.user.uid,
        name: name.trim(),
        email: email.trim(),
        balance: 0,
        createdAt: serverTimestamp(),
      });

      Alert.alert("Berhasil", "Akun WangKu berhasil dibuat");
      router.replace("/");
} catch (error: any) {
  console.log("REGISTER ERROR CODE:", error.code);
  console.log("REGISTER ERROR MESSAGE:", error.message);

  Alert.alert(
    "Registrasi gagal",
    `Kode: ${error.code}\n\nPesan: ${error.message}`
  );
} finally {
  setLoading(false);
}
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Buat akun WangKu</Text>
      <Text style={styles.subtitle}>Isi data berikut untuk membuat dompet digital</Text>

      <TextInput
        style={styles.input}
        placeholder="Nama lengkap"
        value={name}
        onChangeText={setName}
      />
      <TextInput
        style={styles.input}
        placeholder="Email"
        keyboardType="email-address"
        autoCapitalize="none"
        value={email}
        onChangeText={setEmail}
      />
      <TextInput
        style={styles.input}
        placeholder="Password minimal 6 karakter"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />
      <TextInput
        style={styles.input}
        placeholder="Konfirmasi password"
        secureTextEntry
        value={confirmPassword}
        onChangeText={setConfirmPassword}
      />

      <TouchableOpacity
        style={[styles.button, loading && styles.buttonDisabled]}
        onPress={handleRegister}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#FFFFFF" />
        ) : (
          <Text style={styles.buttonText}>Daftar</Text>
        )}
      </TouchableOpacity>

      <TouchableOpacity onPress={() => router.back()}>
        <Text style={styles.back}>Sudah punya akun? Login</Text>
      </TouchableOpacity>
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
  title: {
    fontSize: 28,
    fontWeight: "800",
    color: "#10231D",
  },
  subtitle: {
    marginTop: 6,
    marginBottom: 26,
    color: "#60716B",
  },
  input: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#D7E3DD",
    borderRadius: 8,
    paddingHorizontal: 14,
    paddingVertical: 13,
    marginBottom: 14,
    fontSize: 16,
  },
  button: {
    marginTop: 4,
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
  back: {
    marginTop: 20,
    textAlign: "center",
    color: "#0B8F6A",
    fontWeight: "700",
  },
});