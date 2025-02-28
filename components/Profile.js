import AsyncStorage from "@react-native-async-storage/async-storage";
import { useState } from "react";
import { Alert, Text, TouchableOpacity, View, TextInput } from "react-native";

export default function Profile() {
  const [token, setToken] = useState("");
  const handleSubmit = async () => {
    try {
      await AsyncStorage.setItem("token", token);
      Alert.alert("Clé API enregistrée");
    } catch (error) {
      console.error(error);
    }
  };
  return (
    <View>
      <Text>Bienvenue sur la page de profil</Text>
      <Text>
        Vous devez fournir une clé API que vous allez récupérer sur le site
        officiel
      </Text>
      <TouchableOpacity>
        <Text>https://developer.clashroyale.com/</Text>
      </TouchableOpacity>
      <Text>
        Vous pourrez alors entrer votre clé, ainsi créée dans le formulaire
        ci-dessous
      </Text>
      <View>
        <TextInput
          placeholder="Votre clé API"
          value={token}
          onChangeText={setToken}
        />
        <TouchableOpacity onPress={handleSubmit}>
          <Text>Enregistrer</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
