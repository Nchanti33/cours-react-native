import { StatusBar } from "expo-status-bar";
import {
  Image,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { NavigationContainer, useNavigation } from "@react-navigation/native";
import Home from "./components/Home";
import Profile from "./components/Profile";

const Stack = createNativeStackNavigator();
const logo = require("./assets/logo.png");

const CustomHeader = () => {
  const [menuVisible, setMenuVisible] = useState(false);
  const navigation = useNavigation();
  return (
    <View style={styles.header}>
      <TouchableOpacity onPress={() => setMenuVisible(true)}>
        <Text style={styles.headerTitle}>Menu</Text>
      </TouchableOpacity>
      <Image
        source={logo}
        style={{ width: 150, height: 50 }}
        resizeMode="contain"
      />
      <Modal animationType="slide" transparent={true} visible={menuVisible}>
        <View style={styles.modalContainer}>
          <TouchableOpacity
            style={styles.closeButton}
            onPress={() => setMenuVisible(false)}
          >
            <Ionicons name="close" size={24} color="#000000" />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              navigation.navigate("Home");
            }}
          >
            <Text style={styles.menuItem}>Home</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              navigation.navigate("Profile");
            }}
          >
            <Text style={styles.menuItem}>Profile</Text>
          </TouchableOpacity>
          <Text style={styles.menuItem}>Search Player</Text>
          <Text style={styles.menuItem}>Search Clan</Text>
        </View>
      </Modal>
    </View>
  );
};

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          header: (props) => <CustomHeader {...props} />,
        }}
      >
        <Stack.Screen
          name="Home"
          component={Home}
          options={{ title: "Home" }}
        />
        <Stack.Screen
          name="Profile"
          component={Profile}
          options={{ title: "Profile" }}
        />
      </Stack.Navigator>
    </NavigationContainer>
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
  headerTitle: {
    color: "#fff",
    fontSize: 32,
    fontWeight: "bold",
    fontFamily: "futura",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    width: 250,
    maxHeight: 180,
    margin: "auto",
    backgroundColor: "rgba(0,0,0,0.25)",
  },
  menuItem: {
    fontSize: 24,
  },
  closeButton: {
    alignSelf: "flex-end",
    marginRight: 10,
  },
});
