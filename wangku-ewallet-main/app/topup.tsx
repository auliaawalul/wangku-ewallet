import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from "react-native";
import { router } from "expo-router";
import { doc, getDoc, updateDoc, addDoc, collection, serverTimestamp } from "firebase/firestore";
import { auth, db } from "../firebase/firebaseConfig";

export default function TopUpScreen() {
  const [amount, setAmount] = useState("");

  const topUpBalance = async () => {
    try {
      const user = auth.currentUser;
      const nominal = Number(amount);

      if (!user) {
        Alert.alert("Gagal", "Silakan login terlebih dahulu");
        return;
      }

      if (!nominal || nominal < 10000) {
        Alert.alert("Peringatan", "Minimal top up Rp10.000");
        return;
      }

      const userRef = doc(db, "users", user.uid);
      const userSnap = await getDoc(userRef);
      const currentBalance = userSnap.exists() ? userSnap.data().balance || 0 : 0;

      await updateDoc(userRef, {
        balance: currentBalance + nominal,
      });

      await addDoc(collection(db, "transactions"), {
        uid: user.uid,
        type: "topup",
        title: "Top Up Saldo",
        amount: nominal,
        status: "success",
        createdAt: serverTimestamp(),
      });

      setAmount("");
      Alert.alert("Berhasil", "Saldo berhasil ditambahkan");
      router.back();
    } catch (err) {
      Alert.alert("Error", "Top up gagal diproses");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Top Up Saldo</Text>
      <TextInput
        style={styles.input}
        placeholder="Masukkan nominal"
        keyboardType="numeric"
        value={amount}
        onChangeText={setAmount}
      />

      <TouchableOpacity style={styles.button} onPress={topUpBalance}>
        <Text style={styles.buttonText}>Top Up Sekarang</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F6FAF8",
    padding: 20,
    paddingTop: 52,
  },
  title: {
    fontSize: 26,
    fontWeight: "800",
    color: "#10231D",
    marginBottom: 20,
  },
  input: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#D7E3DD",
    borderRadius: 8,
    padding: 14,
    fontSize: 16,
  },
  button: {
    marginTop: 16,
    backgroundColor: "#0B8F6A",
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: "center",
  },
  buttonText: {
    color: "#FFFFFF",
    fontWeight: "700",
    fontSize: 16,
  },
});