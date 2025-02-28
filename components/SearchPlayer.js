import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";

const getPlayerInfo = async (playerTag) => {
  const token = await AsyncStorage.getItem("token");
  return axios.get(
    `https://api.clashroyale.com/v1/players/%23${playerTag.replace("#", "")}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
};

export default function SearchPlayer({ navigation }) {
  const [playerTag, setPlayerTag] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSearch = async () => {
    setLoading(true);
    setError(null);
    try {
      if (!playerTag.trim()) {
        setError("Please enter a player tag");
        return;
      }
      const cleanTag = playerTag.replace("#", "");
      navigation.navigate("PlayerDetail", { playerTag: cleanTag });
    } catch (err) {
      setError("Player not found or invalid tag");
      console.error(err);
    }
    setLoading(false);
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Enter player tag (e.g. #2LLRP0JCV)"
        value={playerTag}
        onChangeText={setPlayerTag}
      />
      <TouchableOpacity
        style={styles.searchButton}
        onPress={handleSearch}
        disabled={loading}
      >
        <Text style={styles.buttonText}>
          {loading ? "Searching..." : "Search Player"}
        </Text>
      </TouchableOpacity>

      {error && <Text style={styles.error}>{error}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
  },
  searchButton: {
    backgroundColor: "#2196F3",
    padding: 15,
    borderRadius: 5,
    alignItems: "center",
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
  },
  error: {
    color: "red",
    marginTop: 10,
  },
});
