import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
  FlatList,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";

export default function ClanDetail({ route, navigation }) {
  const [clanInfo, setClanInfo] = useState(null);
  const [warLog, setWarLog] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { clanTag } = route.params;

  useEffect(() => {
    const fetchClanData = async () => {
      try {
        const token = await AsyncStorage.getItem("token");
        const formattedTag = clanTag.startsWith("#") ? clanTag : `#${clanTag}`;
        console.log("Fetching clan data for tag:", formattedTag);

        const response = await axios.get(
          `https://api.clashroyale.com/v1/clans/%23${formattedTag.replace(
            "#",
            ""
          )}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        console.log("Clan API Response:", {
          status: response.status,
          data: response.data,
        });

        setClanInfo(response.data);
        setLoading(false);
      } catch (err) {
        console.error("Error details:", {
          message: err.message,
          status: err.response?.status,
          data: err.response?.data,
          tag: clanTag,
        });
        setError(err);
        setLoading(false);
      }
    };

    if (clanTag) {
      fetchClanData();
    }
  }, [clanTag]);

  if (loading) return <ActivityIndicator size="large" />;
  if (error) return <Text style={styles.error}>Error loading clan data</Text>;
  if (!clanInfo) return <Text>No clan data found</Text>;

  return (
    <ScrollView style={styles.container}>
      {/* Main Info Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Clan Information</Text>
        <View style={styles.clanInfo}>
          <Text style={styles.clanName}>{clanInfo.name}</Text>
          <Text style={styles.clanTag}>{clanInfo.tag}</Text>
          <Text style={styles.description}>{clanInfo.description}</Text>
        </View>
      </View>

      {/* Stats Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Statistics</Text>
        <View style={styles.statsGrid}>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{clanInfo.members}/50</Text>
            <Text style={styles.statLabel}>Members</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{clanInfo.clanScore}</Text>
            <Text style={styles.statLabel}>Trophies 🏆</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{clanInfo.clanWarTrophies}</Text>
            <Text style={styles.statLabel}>War Trophies ⚔️</Text>
          </View>
        </View>
      </View>

      {/* Requirements Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Requirements</Text>
        <View style={styles.requirementsContainer}>
          <View style={styles.requirementItem}>
            <Text style={styles.requirementLabel}>Required Trophies:</Text>
            <Text style={styles.requirementValue}>
              {clanInfo.requiredTrophies} 🏆
            </Text>
          </View>
          <View style={styles.requirementItem}>
            <Text style={styles.requirementLabel}>Type:</Text>
            <Text style={styles.requirementValue}>{clanInfo.type}</Text>
          </View>
          <View style={styles.requirementItem}>
            <Text style={styles.requirementLabel}>Location:</Text>
            <Text style={styles.requirementValue}>
              {clanInfo.location?.name || "International"}
            </Text>
          </View>
        </View>
      </View>

      {/* Donations Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Weekly Activity</Text>
        <View style={styles.activityContainer}>
          <View style={styles.activityItem}>
            <Text style={styles.activityValue}>
              {clanInfo.donationsPerWeek || 0}
            </Text>
            <Text style={styles.activityLabel}>Donations/Week</Text>
          </View>
        </View>
      </View>

      {/* Members Button */}
      <TouchableOpacity
        style={styles.membersButton}
        onPress={() =>
          navigation.navigate("MemberList", {
            clanTag: clanInfo.tag,
            clanName: clanInfo.name,
          })
        }
      >
        <Text style={styles.buttonText}>View Members</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 15,
  },
  section: {
    backgroundColor: "white",
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },
  clanInfo: {
    alignItems: "center",
  },
  clanName: {
    fontSize: 24,
    fontWeight: "bold",
  },
  clanTag: {
    color: "#666",
    marginBottom: 10,
  },
  description: {
    textAlign: "center",
    marginBottom: 15,
    color: "#444",
  },
  statsGrid: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
    marginTop: 10,
  },
  statItem: {
    alignItems: "center",
  },
  statValue: {
    fontSize: 18,
    fontWeight: "bold",
  },
  statLabel: {
    color: "#666",
    marginTop: 5,
  },
  warItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  warStanding: {
    fontWeight: "bold",
  },
  warTrophies: {
    color: "#666",
  },
  membersButton: {
    backgroundColor: "#4CAF50",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    marginBottom: 20,
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },
  error: {
    color: "red",
    textAlign: "center",
    margin: 20,
  },
  requirementsContainer: {
    backgroundColor: "#f8f8f8",
    borderRadius: 8,
    padding: 12,
    marginTop: 10,
  },
  requirementItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  requirementLabel: {
    fontSize: 16,
    color: "#666",
  },
  requirementValue: {
    fontSize: 16,
    fontWeight: "bold",
  },
  activityContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingVertical: 10,
  },
  activityItem: {
    alignItems: "center",
  },
  activityValue: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#4CAF50",
  },
  activityLabel: {
    fontSize: 14,
    color: "#666",
    marginTop: 5,
  },
});
