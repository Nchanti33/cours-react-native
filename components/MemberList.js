import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { ApiService } from "../services/api";

export default function MemberList({ route, navigation }) {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { clanTag, clanName } = route.params;

  useEffect(() => {
    const fetchMembers = async () => {
      try {
        const response = await ApiService.getClanMembers(clanTag);
        setMembers(response.data.items);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching members:", err);
        setError(err);
        setLoading(false);
      }
    };

    fetchMembers();
  }, [clanTag]);

  if (loading) return <ActivityIndicator size="large" />;
  if (error) return <Text style={styles.error}>Error loading members</Text>;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{clanName} Members</Text>
      <FlatList
        data={members}
        keyExtractor={(item) => item.tag}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.memberItem}
            onPress={() => {
              navigation.navigate("PlayerDetail", {
                playerTag: item.tag.replace("#", ""),
              });
            }}
          >
            <View>
              <Text style={styles.memberName}>{item.name}</Text>
              <Text style={styles.memberRole}>Role: {item.role}</Text>
            </View>
            <View style={styles.memberStats}>
              <Text style={styles.trophies}>🏆 {item.trophies}</Text>
              <Text style={styles.donations}>Donations: {item.donations}</Text>
            </View>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginVertical: 10,
  },
  memberItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 15,
    backgroundColor: "#f5f5f5",
    borderRadius: 10,
    marginVertical: 5,
  },
  memberName: {
    fontSize: 16,
    fontWeight: "bold",
  },
  memberRole: {
    color: "#666",
    marginTop: 5,
  },
  memberStats: {
    alignItems: "flex-end",
  },
  trophies: {
    fontSize: 16,
    fontWeight: "bold",
  },
  donations: {
    color: "#666",
    marginTop: 5,
  },
  error: {
    color: "red",
    textAlign: "center",
    marginTop: 20,
  },
});
