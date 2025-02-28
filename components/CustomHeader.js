import React, { useState } from "react";
import {
  View,
  Image,
  Modal,
  TouchableOpacity,
  Text,
  StyleSheet,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import HeaderBackButton from "./HeaderBackButton";

export default function CustomHeader({ navigation }) {
  const [menuVisible, setMenuVisible] = useState(false);
  const canGoBack = navigation.canGoBack();
  const logo = require("../assets/logo.png");

  return (
    <View style={styles.header}>
      <View style={styles.leftContainer}>
        {canGoBack && (
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="arrow-back" size={24} color="#fff" />
          </TouchableOpacity>
        )}
        <TouchableOpacity
          style={styles.menuButton}
          onPress={() => setMenuVisible(true)}
        >
          <Ionicons name="menu" size={24} color="#fff" />
        </TouchableOpacity>
      </View>

      <Image source={logo} style={styles.logo} resizeMode="contain" />

      <Modal
        animationType="slide"
        transparent={true}
        visible={menuVisible}
        onRequestClose={() => setMenuVisible(false)}
      >
        <View style={styles.modalContainer}>
          <TouchableOpacity
            style={styles.closeButton}
            onPress={() => setMenuVisible(false)}
          >
            <Ionicons name="close" size={24} color="#fff" />
          </TouchableOpacity>

          {["Home", "Profile", "Countries", "Search Player", "Search Clan"].map(
            (item, index) => (
              <TouchableOpacity
                key={index}
                style={styles.menuItem}
                onPress={() => {
                  navigation.navigate(item.replace(" ", ""));
                  setMenuVisible(false);
                }}
              >
                <Text style={styles.menuItemText}>{item}</Text>
              </TouchableOpacity>
            )
          )}
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingTop: 40,
    paddingHorizontal: 20,
    backgroundColor: "#6200ee",
    height: 100,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  leftContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 15,
  },
  backButton: {
    padding: 5,
  },
  menuButton: {
    padding: 5,
  },
  logo: {
    width: 150,
    height: 50,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    width: 250,
    maxHeight: "400",
    margin: "auto",
    backgroundColor: "rgba(0,0,0,0.75)",
  },
  menuItem: {
    padding: 10,
    width: "100%",
    alignItems: "center",
  },
  menuItemText: {
    fontSize: 24,
    color: "#fff",
    marginVertical: 5,
  },
  closeButton: {
    alignSelf: "flex-end",
    padding: 10,
    marginRight: 10,
    marginBottom: 20,
  },
});
