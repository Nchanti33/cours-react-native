import CardsList from "../components/CardsList";
// ...existing imports...

export default function Home() {
  // ...existing code...

  return (
    <View style={styles.container}>
      {/* ...other components... */}
      {cards && (
        <CardsList
          title="Available Cards"
          cards={cards}
          onCardPress={(card) => {}}
        />
      )}
    </View>
  );
}
