import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
} from "react-native";
import { router } from "expo-router";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, serverTimestamp, setDoc } from "firebase/firestore";
import { auth, db } from "../firebase/firebaseConfig";
import { isBirthDateAllowed, normalizePhone } from "../utils/security";

export default function RegisterScreen() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const registerUser = async () => {
    try {
      if (!name || !email || !phoneNumber || !birthDate || !password) {
        Alert.alert("Peringatan", "Semua data wajib diisi");
        return;
      }

      if (!isBirthDateAllowed(birthDate)) {
        Alert.alert(
          "Registrasi ditolak",
          "Tanggal lahir harus sebelum 1 Januari 2010"
        );
        return;
      }

      if (password.length < 6) {
        Alert.alert("Peringatan", "Password minimal 6 karakter");
        return;
      }

      setLoading(true);

      const normalizedPhone = normalizePhone(phoneNumber);

      const credential = await createUserWithEmailAndPassword(
        auth,
        email.trim(),
        password
      );

      await setDoc(doc(db, "users", credential.user.uid), {
        uid: credential.user.uid,
        name: name.trim(),
        email: email.trim(),
        phoneNumber: normalizedPhone,
        birthDate,
        balance: 0,
        photoURL: "",
        transactionPinHash: "",
        settings: {
          notifications: true,
          language: "id",
          theme: "light",
        },
        createdAt: serverTimestamp(),
      });

      await setDoc(doc(db, "phoneLoginMap", normalizedPhone), {
        uid: credential.user.uid,
        email: email.trim(),
        createdAt: serverTimestamp(),
      });

      Alert.alert("Berhasil", "Akun berhasil dibuat");
      router.replace("/");
    } catch (error: any) {
      console.log("REGISTER ERROR CODE:", error.code);
      console.log("REGISTER ERROR MESSAGE:", error.message);
      Alert.alert(
        "Registrasi gagal",
        `Kode: ${error.code}\n${error.message}`
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.logo}>PayKu</Text>
      <Text style={styles.title}>Daftar Akun Baru</Text>

      <TextInput
        style={styles.input}
        placeholder="Nama lengkap"
        value={name}
        onChangeText={setName}
      />
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <TextInput
        style={styles.input}
        placeholder="Nomor ponsel, contoh: 08123456789"
        value={phoneNumber}
        onChangeText={setPhoneNumber}
        keyboardType="phone-pad"
      />
      <TextInput
        style={styles.input}
        placeholder="Tanggal lahir, contoh: 2005-08-17"
        value={birthDate}
        onChangeText={setBirthDate}
      />
      <Text style={styles.note}>Hanya pengguna lahir sebelum 1 Januari 2010 yang bisa register.</Text>
      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      <TouchableOpacity style={styles.button} onPress={registerUser} disabled={loading}>
        <Text style={styles.buttonText}>{loading ? "Memproses..." : "Daftar"}</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => router.push("/login")}>
        <Text style={styles.link}>Sudah punya akun? Login</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F6FAF8",
    padding: 20,
    paddingTop: 60,
  },
  logo: {
    fontSize: 34,
    fontWeight: "900",
    color: "#0B8F6A",
    textAlign: "center",
  },
  title: {
    fontSize: 22,
    fontWeight: "800",
    color: "#10231D",
    marginTop: 20,
    marginBottom: 18,
  },
  input: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#D7E3DD",
    borderRadius: 12,
    padding: 14,
    fontSize: 15,
    marginBottom: 12,
  },
  note: {
    fontSize: 12,
    color: "#5B6B65",
    marginBottom: 12,
  },
  button: {
    backgroundColor: "#0B8F6A",
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 8,
  },
  buttonText: {
    color: "#FFFFFF",
    fontWeight: "800",
    fontSize: 16,
  },
  link: {
    textAlign: "center",
    color: "#0B8F6A",
    fontWeight: "700",
    marginTop: 18,
    marginBottom: 30,
  },
});
