import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { useEffect, useState } from "react";
import {
  Text,
  View,
  FlatList,
  Image,
  StyleSheet,
  Modal,
  TouchableOpacity,
} from "react-native";

export default function Home() {
  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedCard, setSelectedCard] = useState(null);

  const query = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      axios
        .get("https://api.clashroyale.com/v1/cards", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((response) => {
          console.log(
            "Response data structure:",
            JSON.stringify(response.data.items[0], null, 2)
          );
          setCards(response.data.items);
          setLoading(false);
        })
        .catch((error) => {
          setError(error);
          console.warn(error);
          setLoading(false);
        });
    } catch (error) {
      setError(error);
      setLoading(false);
    }
  };

  useEffect(() => {
    query();
  }, []);

  if (loading) {
    return <Text>Encours de chargement...</Text>;
  } else if (error) {
    return <Text>Server error</Text>;
  } else {
    return (
      <View>
        <Text style={styles.title}>Bienvenue sur la page d'accueil</Text>
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => setModalVisible(false)}
        >
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              {selectedCard && (
                <>
                  <Text style={styles.modalTitle}>{selectedCard.name}</Text>
                  {selectedCard.iconUrls?.medium && (
                    <Image
                      source={{ uri: selectedCard.iconUrls.medium }}
                      style={styles.modalImage}
                    />
                  )}
                  {selectedCard.imageUrls?.medium && (
                    <Image
                      source={{ uri: selectedCard.imageUrls.medium }}
                      style={styles.modalImage}
                    />
                  )}
                  <View style={styles.cardInfo}>
                    <Text style={styles.infoText}>
                      Elixir cost: {selectedCard.elixirCost}
                    </Text>
                    <Text style={styles.infoText}>
                      Rarity: {selectedCard.rarity}
                    </Text>
                    <Text style={styles.infoText}>
                      Max level: {selectedCard.maxLevel}
                    </Text>
                    {selectedCard.iconUrls?.evolutionMedium && (
                      <View>
                        <Text style={styles.infoText}>Evolution:</Text>
                        <Image
                          source={{
                            uri: selectedCard.iconUrls.evolutionMedium,
                          }}
                          style={styles.evolutionImage}
                        />
                      </View>
                    )}
                  </View>
                  <TouchableOpacity
                    style={styles.closeButton}
                    onPress={() => setModalVisible(false)}
                  >
                    <Text style={styles.closeButtonText}>Close</Text>
                  </TouchableOpacity>
                </>
              )}
            </View>
          </View>
        </Modal>

        <FlatList
          data={cards}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() => {
                console.log("Selected card:", item);
                setSelectedCard(item);
                setModalVisible(true);
              }}
            >
              <View>
                {item.iconUrls?.medium && (
                  <Image
                    source={{ uri: item.iconUrls.medium }}
                    style={{ width: 100, height: 150 }}
                  />
                )}
              </View>
            </TouchableOpacity>
          )}
          numColumns={4}
          columnWrapperStyle={{
            flexDirection: "row",
            justifyContent: "space-between",
          }}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  title: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
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
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 15,
  },
  cardInfo: {
    backgroundColor: "#f5f5f5",
    padding: 10,
    borderRadius: 10,
    marginVertical: 10,
    width: "100%",
  },
  infoText: {
    fontSize: 16,
    marginVertical: 2,
    color: "#333",
  },
  modalImage: {
    width: 200,
    height: 300,
    marginVertical: 10,
  },
  evolutionImage: {
    width: 100,
    height: 150,
    marginTop: 5,
    alignSelf: "center",
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
    textAlign: "center",
  },
});
