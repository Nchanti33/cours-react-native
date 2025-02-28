import React from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";

const CardsList = ({ cards, onCardPress, title, showEvolutions = false }) => {
  const getRarityBonus = (rarity) => {
    switch (rarity?.toLowerCase()) {
      case "common":
        return 0;
      case "rare":
        return 2;
      case "epic":
        return 5;
      case "legendary":
        return 8;
      case "champion":
        return 10;
      default:
        return 0;
    }
  };

  const renderCard = (card, index) => {
    const isEvolution = showEvolutions && index < 2;

    return (
      <TouchableOpacity
        key={index}
        style={styles.cardContainer}
        onPress={() => onCardPress(card)}
      >
        <View>
          {isEvolution && card.iconUrls?.evolutionMedium ? (
            <Image
              source={{ uri: card.iconUrls.evolutionMedium }}
              style={styles.cardImage}
            />
          ) : (
            card.iconUrls?.medium && (
              <Image
                source={{ uri: card.iconUrls.medium }}
                style={styles.cardImage}
              />
            )
          )}
          <Text style={styles.cardLevel}>
            Level {card.level + getRarityBonus(card.rarity)}
          </Text>
          {isEvolution && card.iconUrls?.evolutionMedium && (
            <Text style={styles.evolutionLabel}>Evolution</Text>
          )}
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.section}>
      {title && <Text style={styles.sectionTitle}>{title}</Text>}
      <View style={styles.cardsContainer}>
        {cards?.map((card, index) => renderCard(card, index))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
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
  cardsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "flex-start",
    padding: 5,
  },
  cardContainer: {
    alignItems: "center",
    backgroundColor: "#f0f0f0",
    borderRadius: 8,
    padding: 5,
    width: "23%",
    marginHorizontal: "1%",
    marginVertical: 5,
  },
  cardImage: {
    width: 70,
    height: 85,
    resizeMode: "contain",
  },
  cardLevel: {
    fontSize: 12,
    color: "#666",
    marginTop: 5,
  },
  evolutionLabel: {
    fontSize: 10,
    color: "#1976d2",
    fontWeight: "bold",
    marginTop: 2,
    textAlign: "center",
  },
});

export default CardsList;
