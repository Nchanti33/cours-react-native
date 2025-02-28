import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { useEffect, useState } from "react";
import {
  Text,
  View,
  FlatList,
  StyleSheet,
  Modal,
  TouchableOpacity,
} from "react-native";
import { useNavigation } from "@react-navigation/native";

export default function Countries() {
  const navigation = useNavigation();
  const [countries, setCountries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState(null);

  const fetchCountries = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      const response = await axios.get(
        "https://api.clashroyale.com/v1/locations",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setCountries(response.data.items);
      setLoading(false);
    } catch (error) {
      setError(error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCountries();
  }, []);

  if (loading) {
    return <Text>Loading countries...</Text>;
  } else if (error) {
    return <Text>Error loading countries</Text>;
  }

  return (
    <View>
      <Text style={styles.title}>Countries List</Text>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            {selectedCountry && (
              <>
                <Text style={styles.modalTitle}>{selectedCountry.name}</Text>
                <View style={styles.countryInfo}>
                  <Text style={styles.infoText}>ID: {selectedCountry.id}</Text>
                  <Text style={styles.infoText}>
                    Is Country: {selectedCountry.isCountry ? "Yes" : "No"}
                  </Text>
                  {selectedCountry.countryCode && (
                    <Text style={styles.infoText}>
                      Country Code: {selectedCountry.countryCode}
                    </Text>
                  )}
                </View>
                <View style={styles.navigationButtons}>
                  <TouchableOpacity
                    style={styles.navButton}
                    onPress={() => {
                      setModalVisible(false);
                      navigation.navigate("Clans", {
                        locationId: selectedCountry.id,
                      });
                    }}
                  >
                    <Text style={styles.navButtonText}>View Top Clans</Text>
                  </TouchableOpacity>
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
        data={countries}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.countryItem}
            onPress={() => {
              setSelectedCountry(item);
              setModalVisible(true);
            }}
          >
            <Text style={styles.countryName}>
              {item.name} {item.isCountry ? "🌍" : "📍"}
            </Text>
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
    marginVertical: 10,
  },
  countryItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  countryName: {
    fontSize: 16,
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
  countryInfo: {
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
  navigationButtons: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
    marginVertical: 10,
  },
  navButton: {
    backgroundColor: "#4CAF50",
    padding: 10,
    borderRadius: 10,
    marginHorizontal: 5,
  },
  navButtonText: {
    color: "white",
    fontWeight: "bold",
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
