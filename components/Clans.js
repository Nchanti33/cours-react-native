import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { useEffect, useState } from "react";
import {
  Text,
  View,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Modal,
} from "react-native";

export default function Clans({ route, navigation }) {
  const [clans, setClans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { locationId } = route.params;

  const query = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      const response = await axios.get(
        `https://api.clashroyale.com/v1/locations/${locationId}/rankings/clans?limit=20`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setClans(response.data.items);
      setLoading(false);
    } catch (error) {
      setError(error);
      console.warn(error);
      setLoading(false);
    }
  };

  useEffect(() => {
    query();
  }, []);

  if (loading) return <Text>Loading clans...</Text>;
  if (error) return <Text>Server error</Text>;

  return (
    <View>
      <Text style={styles.title}>Top 20 Clans</Text>

      <FlatList
        data={clans}
        keyExtractor={(item) => item.tag}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.clanItem}
            onPress={() => {
              navigation.navigate("ClanDetail", {
                clanTag: item.tag.replace("#", ""),
              });
            }}
          >
            <View style={styles.clanItemContent}>
              <View>
                <Text style={styles.clanName}>{item.name}</Text>
                <Text style={styles.clanMembers}>
                  Members: {item.members}/50
                </Text>
              </View>
              <View style={styles.clanStats}>
                <Text style={styles.clanTrophies}>{item.clanScore} 🏆</Text>
                <Text>#{item.rank}</Text>
              </View>
            </View>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
  },
  list: {
    alignItems: "center",
    margin: 20,
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalView: {
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    width: "80%",
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 15,
  },
  clanInfo: {
    backgroundColor: "#f5f5f5",
    padding: 15,
    borderRadius: 10,
    width: "100%",
  },
  infoText: {
    fontSize: 16,
    marginVertical: 3,
  },
  closeButton: {
    backgroundColor: "#2196F3",
    borderRadius: 20,
    padding: 10,
    elevation: 2,
    marginTop: 15,
  },
  closeButtonText: {
    color: "white",
    fontWeight: "bold",
  },
  clanItem: {
    backgroundColor: "#f5f5f5",
    marginHorizontal: 10,
    marginVertical: 5,
    padding: 15,
    borderRadius: 10,
    elevation: 1,
  },
  clanItemContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  clanName: {
    fontSize: 18,
    fontWeight: "bold",
  },
  clanMembers: {
    color: "#666",
    marginTop: 5,
  },
  clanStats: {
    alignItems: "flex-end",
  },
  clanTrophies: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 5,
  },
  viewMembersButton: {
    backgroundColor: "#4CAF50",
    borderRadius: 20,
    padding: 10,
    elevation: 2,
    marginTop: 15,
    width: "100%",
  },
});
