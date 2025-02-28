import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  FlatList,
} from "react-native";
import { ApiService } from "../services/api";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";

const searchClans = async (params) => {
  const token = await AsyncStorage.getItem("token");
  return axios.get("https://api.clashroyale.com/v1/clans", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    params,
  });
};

const getClanInfo = async (clanTag) => {
  const token = await AsyncStorage.getItem("token");
  const encodedTag = encodeURIComponent(clanTag.replace("#", ""));
  return axios.get(`https://api.clashroyale.com/v1/clans/%23${encodedTag}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export default function SearchClan({ navigation }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchType, setSearchType] = useState("name"); // 'name' or 'tag'
  const [clans, setClans] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSearch = async () => {
    setLoading(true);
    setError(null);
    try {
      if (searchType === "tag") {
        const cleanTag = searchTerm.replace("#", "");
        const response = await getClanInfo(cleanTag);
        setClans([response.data]);
      } else {
        const response = await searchClans({
          name: searchTerm,
          limit: 20,
        });
        setClans(response.data.items);
      }
    } catch (err) {
      setError("Error searching clans");
      console.error(err);
    }
    setLoading(false);
  };

  return (
    <View style={styles.container}>
      <View style={styles.searchTypeContainer}>
        <TouchableOpacity
          style={[
            styles.searchTypeButton,
            searchType === "name" && styles.activeSearchType,
          ]}
          onPress={() => setSearchType("name")}
        >
          <Text style={styles.searchTypeText}>Search by Name</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.searchTypeButton,
            searchType === "tag" && styles.activeSearchType,
          ]}
          onPress={() => setSearchType("tag")}
        >
          <Text style={styles.searchTypeText}>Search by Tag</Text>
        </TouchableOpacity>
      </View>

      <TextInput
        style={styles.input}
        placeholder={
          searchType === "tag"
            ? "Enter clan tag (e.g. #2LLRP0JC)"
            : "Enter clan name"
        }
        value={searchTerm}
        onChangeText={setSearchTerm}
      />

      <TouchableOpacity
        style={styles.searchButton}
        onPress={handleSearch}
        disabled={loading}
      >
        <Text style={styles.buttonText}>
          {loading ? "Searching..." : "Search Clan"}
        </Text>
      </TouchableOpacity>

      {error && <Text style={styles.error}>{error}</Text>}

      <FlatList
        data={clans}
        keyExtractor={(item) => item.tag}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.clanItem}
            onPress={() =>
              navigation.navigate("ClanDetail", {
                clanTag: item.tag.replace("#", ""),
              })
            }
          >
            <View style={styles.clanItemContent}>
              <View>
                <Text style={styles.clanName}>{item.name}</Text>
                <Text style={styles.clanTag}>Tag: {item.tag}</Text>
                <Text>Members: {item.members}/50</Text>
              </View>
              <View style={styles.clanStats}>
                <Text style={styles.trophies}>{item.clanScore} 🏆</Text>
                <Text>Required: {item.requiredTrophies}</Text>
              </View>
            </View>
          </TouchableOpacity>
        )}
      />
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
    marginBottom: 20,
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
  },
  error: {
    color: "red",
    marginBottom: 10,
  },
  clanItem: {
    padding: 15,
    backgroundColor: "#f5f5f5",
    borderRadius: 10,
    marginBottom: 10,
  },
  clanName: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 5,
  },
  searchTypeContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 15,
  },
  searchTypeButton: {
    flex: 1,
    padding: 10,
    marginHorizontal: 5,
    backgroundColor: "#f0f0f0",
    borderRadius: 5,
    alignItems: "center",
  },
  activeSearchType: {
    backgroundColor: "#2196F3",
  },
  searchTypeText: {
    color: "#333",
    fontWeight: "bold",
  },
  clanItemContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  clanTag: {
    color: "#666",
    marginVertical: 2,
  },
  clanStats: {
    alignItems: "flex-end",
  },
  trophies: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 5,
  },
});
