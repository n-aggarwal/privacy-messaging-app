import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";

// Imports for multiple pages
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { firebaseConfig } from "./firebaseConfig";

//import screens
import LoginScreen from "./screens/LoginScreen";

// Google Auth

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

const Stack = createNativeStackNavigator();
const GlobalScreenOptions = {
  headerStyle: { backgroundColor: "#2C6BED" },
  headerTitleStyle: { color: "white" },
  headerTintColor: "white",
};

export default function App() {
  // Initialize Firebase
  const app = initializeApp(firebaseConfig);
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={GlobalScreenOptions}>
        <Stack.Screen name="Login" component={LoginScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
