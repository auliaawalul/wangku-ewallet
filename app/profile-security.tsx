import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Image,
  ScrollView,
} from "react-native";
import { router } from "expo-router";
import * as ImagePicker from "expo-image-picker";
import { signOut } from "firebase/auth";
import { doc, getDoc, serverTimestamp, updateDoc } from "firebase/firestore";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { auth, db, storage } from "../firebase/firebaseConfig";
import { UserProfile } from "../types";
import { hashPin, isPinValid } from "../utils/security";

export default function ProfileSecurityScreen() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [pin, setPin] = useState("");
  const [confirmPin, setConfirmPin] = useState("");

  const loadProfile = async () => {
    const user = auth.currentUser;
    if (!user) return;

    const snap = await getDoc(doc(db, "users", user.uid));
    if (snap.exists()) {
      setProfile(snap.data() as UserProfile);
    }
  };

  const pickProfilePhoto = async () => {
    try {
      const user = auth.currentUser;
      if (!user) return;

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.7,
      });

      if (result.canceled) return;

      const uri = result.assets[0].uri;
      const response = await fetch(uri);
      const blob = await response.blob();
      const imageRef = ref(storage, `profiles/${user.uid}.jpg`);

      await uploadBytes(imageRef, blob);
      const photoURL = await getDownloadURL(imageRef);

      await updateDoc(doc(db, "users", user.uid), {
        photoURL,
        updatedAt: serverTimestamp(),
      });

      Alert.alert("Berhasil", "Foto profil berhasil diperbarui");
      loadProfile();
    } catch (error: any) {
      Alert.alert("Error", error.message || "Foto profil gagal diperbarui");
    }
  };

  const savePin = async () => {
    try {
      const user = auth.currentUser;
      if (!user) return;

      if (!isPinValid(pin)) {
        Alert.alert("Peringatan", "PIN harus terdiri dari 6 digit angka");
        return;
      }

      if (pin !== confirmPin) {
        Alert.alert("Peringatan", "Konfirmasi PIN tidak sama");
        return;
      }

      const pinHash = await hashPin(pin);

      await updateDoc(doc(db, "users", user.uid), {
        transactionPinHash: pinHash,
        updatedAt: serverTimestamp(),
      });

      setPin("");
      setConfirmPin("");
      Alert.alert("Berhasil", "PIN transaksi berhasil disimpan");
      loadProfile();
    } catch (error: any) {
      Alert.alert("Error", error.message || "PIN gagal disimpan");
    }
  };

  const logout = async () => {
    await signOut(auth);
    router.replace("/login");
  };

  useEffect(() => {
    loadProfile();
  }, []);

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Profil dan Keamanan</Text>

      <View style={styles.profileBox}>
        {profile?.photoURL ? (
          <Image source={{ uri: profile.photoURL }} style={styles.avatar} />
        ) : (
          <View style={styles.avatarPlaceholder}><Text style={styles.avatarText}>Foto</Text></View>
        )}
        <TouchableOpacity style={styles.secondaryButton} onPress={pickProfilePhoto}>
          <Text style={styles.secondaryButtonText}>Ubah Foto Profil</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.infoCard}>
        <Text style={styles.infoLabel}>Nama</Text>
        <Text style={styles.infoValue}>{profile?.name}</Text>
        <Text style={styles.infoLabel}>Email</Text>
        <Text style={styles.infoValue}>{profile?.email}</Text>
        <Text style={styles.infoLabel}>Nomor Ponsel</Text>
        <Text style={styles.infoValue}>{profile?.phoneNumber}</Text>
        <Text style={styles.infoLabel}>Tanggal Lahir</Text>
        <Text style={styles.infoValue}>{profile?.birthDate}</Text>
        <Text style={styles.infoLabel}>Status PIN</Text>
        <Text style={styles.infoValue}>{profile?.transactionPinHash ? "Sudah dibuat" : "Belum dibuat"}</Text>
      </View>

      <Text style={styles.sectionTitle}>Buat/Ubah PIN Transaksi</Text>
      <TextInput
        style={styles.input}
        placeholder="PIN 6 digit"
        value={pin}
        onChangeText={setPin}
        secureTextEntry
        keyboardType="numeric"
        maxLength={6}
      />
      <TextInput
        style={styles.input}
        placeholder="Konfirmasi PIN"
        value={confirmPin}
        onChangeText={setConfirmPin}
        secureTextEntry
        keyboardType="numeric"
        maxLength={6}
      />

      <TouchableOpacity style={styles.button} onPress={savePin}>
        <Text style={styles.buttonText}>Simpan PIN</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.logoutButton} onPress={logout}>
        <Text style={styles.logoutText}>Log Out</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F6FAF8", padding: 20, paddingTop: 55 },
  title: { fontSize: 26, fontWeight: "900", color: "#10231D", marginBottom: 16 },
  profileBox: { alignItems: "center", marginBottom: 18 },
  avatar: { width: 110, height: 110, borderRadius: 55, backgroundColor: "#E8F7F1" },
  avatarPlaceholder: { width: 110, height: 110, borderRadius: 55, backgroundColor: "#D7E3DD", alignItems: "center", justifyContent: "center" },
  avatarText: { color: "#5B6B65", fontWeight: "800" },
  secondaryButton: { marginTop: 10, backgroundColor: "#E8F7F1", paddingHorizontal: 16, paddingVertical: 10, borderRadius: 10 },
  secondaryButtonText: { color: "#0B8F6A", fontWeight: "800" },
  infoCard: { backgroundColor: "#FFFFFF", borderRadius: 16, padding: 16, borderWidth: 1, borderColor: "#D7E3DD" },
  infoLabel: { color: "#5B6B65", marginTop: 8 },
  infoValue: { color: "#10231D", fontWeight: "800", marginTop: 2 },
  sectionTitle: { marginTop: 20, marginBottom: 10, fontSize: 18, fontWeight: "900", color: "#10231D" },
  input: { backgroundColor: "#FFFFFF", borderWidth: 1, borderColor: "#D7E3DD", borderRadius: 12, padding: 14, marginBottom: 12 },
  button: { backgroundColor: "#0B8F6A", paddingVertical: 14, borderRadius: 12, alignItems: "center" },
  buttonText: { color: "#FFFFFF", fontWeight: "900" },
  logoutButton: { backgroundColor: "#FDECEC", paddingVertical: 14, borderRadius: 12, alignItems: "center", marginTop: 12, marginBottom: 40 },
  logoutText: { color: "#C23B3B", fontWeight: "900" },
});
