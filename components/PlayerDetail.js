import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Image,
  TouchableOpacity,
  Modal,
} from "react-native";
import { ApiService } from "../services/api";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import CardsList from "./CardsList";

const fetchPlayerData = async (playerTag) => {
  const token = await AsyncStorage.getItem("token");
  const headers = {
    Authorization: `Bearer ${token}`,
  };

  const [playerInfo, upcomingChests, battleLog] = await Promise.all([
    axios.get(`https://api.clashroyale.com/v1/players/%23${playerTag}`, {
      headers,
    }),
    axios.get(
      `https://api.clashroyale.com/v1/players/%23${playerTag}/upcomingchests`,
      { headers }
    ),
    axios.get(
      `https://api.clashroyale.com/v1/players/%23${playerTag}/battlelog`,
      { headers }
    ),
  ]);

  return {
    playerInfo: playerInfo.data,
    upcomingChests: upcomingChests.data.items,
    battleLog: battleLog.data,
  };
};

export default function PlayerDetail({ route, navigation }) {
  const [playerInfo, setPlayerInfo] = useState(null);
  const [upcomingChests, setUpcomingChests] = useState([]);
  const [battleLog, setBattleLog] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [chestsModalVisible, setChestsModalVisible] = useState(false);
  const [selectedCard, setSelectedCard] = useState(null);
  const [cardModalVisible, setCardModalVisible] = useState(false);
  const tag = route.params?.playerTag || route.params?.tag?.replace("#", "");

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!tag) {
          setError(new Error("No player tag provided"));
          setLoading(false);
          return;
        }

        const { playerInfo, upcomingChests, battleLog } = await fetchPlayerData(
          tag
        );

        setPlayerInfo(playerInfo);
        setUpcomingChests(upcomingChests);
        setBattleLog(battleLog);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching player data:", err);
        setError(err);
        setLoading(false);
      }
    };

    fetchData();
  }, [tag]);

  if (loading) return <ActivityIndicator size="large" />;
  if (error) return <Text style={styles.error}>Error loading player data</Text>;
  if (!playerInfo) return <Text>No player data found</Text>;

  return (
    <ScrollView style={styles.container}>
      {/* Card Detail Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={cardModalVisible}
        onRequestClose={() => setCardModalVisible(false)}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            {selectedCard && (
              <>
                <Text style={styles.modalTitle}>{selectedCard.name}</Text>
                {selectedCard.iconUrls?.medium && (
                  <Image
                    source={{ uri: selectedCard.iconUrls.medium }}
                    style={styles.modalCardImage}
                  />
                )}
                <View style={styles.cardDetailInfo}>
                  <Text style={styles.infoText}>
                    Level: {selectedCard.level}
                  </Text>
                  <Text style={styles.infoText}>
                    Max Level: {selectedCard.maxLevel}
                  </Text>
                  <Text style={styles.infoText}>
                    Elixir Cost: {selectedCard.elixirCost}
                  </Text>
                  <Text style={styles.infoText}>
                    Rarity: {selectedCard.rarity}
                  </Text>
                </View>
                <TouchableOpacity
                  style={styles.closeButton}
                  onPress={() => setCardModalVisible(false)}
                >
                  <Text style={styles.closeButtonText}>Close</Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        </View>
      </Modal>

      {/* Player Info Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Player Info</Text>
        <View style={styles.playerInfo}>
          <Text style={styles.playerName}>{playerInfo.name}</Text>
          <Text style={styles.playerTag}>{playerInfo.tag}</Text>
          <Text style={styles.statsText}>Level: {playerInfo.expLevel}</Text>
          <Text style={styles.statsText}>
            Trophies: {playerInfo.trophies} 🏆
          </Text>
          <Text style={styles.statsText}>
            Best Trophies: {playerInfo.bestTrophies} 👑
          </Text>
          <Text style={styles.statsText}>Wins: {playerInfo.wins}</Text>
          <Text style={styles.statsText}>Losses: {playerInfo.losses}</Text>
        </View>
      </View>

      {/* Current Deck Section */}
      <CardsList
        title="Current Deck"
        cards={playerInfo.currentDeck}
        onCardPress={(card) => {
          setSelectedCard(card);
          setCardModalVisible(true);
        }}
        showEvolutions={true}
      />

      {/* Last Battle Deck Section */}
      {battleLog.length > 0 && (
        <CardsList
          title="Last Battle Deck"
          cards={battleLog[0].team[0].cards}
          onCardPress={(card) => {
            setSelectedCard(card);
            setCardModalVisible(true);
          }}
          showEvolutions={true}
        />
      )}

      {/* Chests Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={chestsModalVisible}
        onRequestClose={() => setChestsModalVisible(false)}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={styles.modalTitle}>Upcoming Chests</Text>
            <ScrollView style={styles.chestsContainer}>
              {upcomingChests.map((chest, index) => (
                <View key={index} style={styles.modalChestItem}>
                  <Text style={styles.chestIndex}>+{chest.index} battles</Text>
                  <Text style={styles.chestName}>{chest.name}</Text>
                </View>
              ))}
            </ScrollView>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setChestsModalVisible(false)}
            >
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* View Chests Button */}
      <TouchableOpacity
        style={styles.viewChestsButton}
        onPress={() => setChestsModalVisible(true)}
      >
        <Text style={styles.buttonText}>View Upcoming Chests</Text>
      </TouchableOpacity>

      {/* Recent Battles Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Recent Battles</Text>
        {battleLog.slice(0, 5).map((battle, index) => (
          <View key={index} style={styles.battleItem}>
            <Text style={styles.battleType}>{battle.type}</Text>
            <View style={styles.battleResult}>
              <Text style={styles.crowns}>
                {battle.team[0].crowns} - {battle.opponent[0].crowns}
              </Text>
              <Text
                style={[
                  styles.outcome,
                  {
                    color:
                      battle.team[0].crowns > battle.opponent[0].crowns
                        ? "green"
                        : "red",
                  },
                ]}
              >
                {battle.team[0].crowns > battle.opponent[0].crowns
                  ? "Victory"
                  : "Defeat"}
              </Text>
            </View>
          </View>
        ))}
      </View>

      {/* Owned Cards Section */}
      <CardsList
        title={`Owned Cards (${playerInfo.cards?.length || 0})`}
        cards={playerInfo.cards?.sort((a, b) => b.level - a.level)}
        onCardPress={(card) => {
          setSelectedCard(card);
          setCardModalVisible(true);
        }}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 15,
  },
  section: {
    marginBottom: 20,
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 15,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },
  playerInfo: {
    alignItems: "center",
  },
  playerName: {
    fontSize: 24,
    fontWeight: "bold",
  },
  playerTag: {
    color: "#666",
    marginBottom: 10,
  },
  statsText: {
    fontSize: 16,
    marginVertical: 2,
  },
  battleItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  battleType: {
    flex: 1,
  },
  battleResult: {
    alignItems: "flex-end",
  },
  crowns: {
    fontWeight: "bold",
  },
  outcome: {
    fontWeight: "bold",
  },
  error: {
    color: "red",
    textAlign: "center",
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
    maxHeight: "80%",
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 15,
  },
  chestsContainer: {
    width: "100%",
    marginBottom: 15,
  },
  modalChestItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  viewChestsButton: {
    backgroundColor: "#4CAF50",
    padding: 15,
    borderRadius: 10,
    marginVertical: 10,
    alignItems: "center",
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },
  closeButton: {
    backgroundColor: "#2196F3",
    padding: 10,
    borderRadius: 20,
    marginTop: 10,
  },
  closeButtonText: {
    color: "white",
    fontWeight: "bold",
  },
});
