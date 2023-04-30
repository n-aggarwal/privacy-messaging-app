import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import React, { useLayoutEffect } from "react";
import CustomListItem from "../components/CustomListItem";
import { Avatar } from "react-native-elements";
import { firebase } from "../firebaseConfig";
import { AntDesign, SimpleLineIcons } from "@expo/vector-icons";

const HomeScreen = ({ navigation }) => {
  const signOutUser = () => {
    firebase
      .auth()
      .signOut()
      .then(() => {
        navigation.replace("Login");
      });
  };

  useLayoutEffect(() => {
    navigation.setOptions({
      title: "PrivChat",
      headerStyle: { backgroundColor: "#fff" },
      headerTitleStyle: { color: "black" },
      headerTintColor: "black",
      headerRight: () => (
        <View
          style={{
            flexDirection: "row-reverse",
            justifyContent: "space-between",
            width: 110,
            marginRight: 20,
          }}
        >
          <TouchableOpacity style={styles.button} onPress={signOutUser}>
            <Text style={styles.buttonText}>Log Out</Text>
          </TouchableOpacity>
          <TouchableOpacity
            activeOpacity={0.5}
            onPress={() => navigation.navigate("Add Chat")}
          >
            <SimpleLineIcons name="pencil" size={24} color="black" />
          </TouchableOpacity>
        </View>
      ),
    });
  }, [navigation]);

  return (
    <SafeAreaView>
      <ScrollView>
        <CustomListItem />
      </ScrollView>
    </SafeAreaView>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  button: {
    height: 35,
    borderRadius: 5,
    backgroundColor: "#788eec",
    width: 70,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonText: {
    color: "white",
    fontSize: 14,
  },
});
