import { StatusBar } from "expo-status-bar";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Home from "./components/Home";
import Profile from "./components/Profile";
import Countries from "./components/Countries";
import Clans from "./components/Clans";
import SearchPlayer from "./components/SearchPlayer";
import SearchClan from "./components/SearchClan";
import MemberList from "./components/MemberList";
import PlayerDetail from "./components/PlayerDetail";
import CustomHeader from "./components/CustomHeader";
import ClanDetail from "./components/ClanDetail";

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={({ navigation }) => ({
          header: (props) => <CustomHeader {...props} />,
        })}
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
        <Stack.Screen
          name="Countries"
          component={Countries}
          options={{ title: "Countries" }}
        />
        <Stack.Screen
          name="Clans"
          component={Clans}
          options={{ title: "Top Clans" }}
        />
        <Stack.Screen
          name="SearchPlayer"
          component={SearchPlayer}
          options={{ title: "Search Player" }}
        />
        <Stack.Screen
          name="SearchClan"
          component={SearchClan}
          options={{ title: "Search Clan" }}
        />
        <Stack.Screen
          name="MemberList"
          component={MemberList}
          options={{ title: "Clan Members" }}
        />
        <Stack.Screen
          name="PlayerDetail"
          component={PlayerDetail}
          options={{ title: "Player Details" }}
        />
        <Stack.Screen
          name="ClanDetail"
          component={ClanDetail}
          options={{ title: "Clan Details" }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
