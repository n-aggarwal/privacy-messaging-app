import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import React, { useLayoutEffect, useState, useEffect } from "react";
import CustomListItem from "../components/CustomListItem";
import { Avatar } from "react-native-elements";
import { firebase } from "../firebaseConfig";
import "firebase/database";
import { AntDesign, SimpleLineIcons } from "@expo/vector-icons";

const HomeScreen = ({ navigation }) => {
  const [chats, setChats] = useState([]);

  const signOutUser = () => {
    firebase
      .auth()
      .signOut()
      .then(() => {
        navigation.replace("Login");
      });
  };

  async function getName(userId) {
    try {
      const doc = await firebase
        .firestore()
        .collection("Users")
        .doc(userId)
        .get();
      if (doc.exists) {
        const userName = doc.data().email;
        return doc.data().name;
        // do something with userName
      } else {
        console.log("No such document!");
        return "Error";
      }
    } catch (error) {
      console.log("Error getting document:", error);
      return "Error";
    }
  }

  useEffect(() => {
    const unsubscribe = firebase
      .firestore()
      .collection("Users")
      .doc(firebase.auth().currentUser.uid)
      .onSnapshot(
        (doc) => {
          if (doc.exists) {
            const rooms = doc.data().listOfRooms;
            const chatsRef = firebase.firestore().collection("ChatRooms");
            const promises = rooms.map(async (roomId) => {
              const docRef = chatsRef.doc(roomId);
              const doc = await docRef.get();
              if (doc.exists) {
                const data = doc.data();
                const otherPersonId =
                  firebase.auth().currentUser.uid === data.person_1
                    ? data.person_2
                    : data.person_1;
                const otherPersonName = await getName(otherPersonId);
                return {
                  id: roomId,
                  data: { chatName: String(otherPersonName) },
                };
              } else {
                console.log("Fatal Error");
                return {
                  id: "NULL",
                  data: { chatName: "NULL", otherPersonId: "NULL" },
                };
              }
            });
            Promise.all(promises)
              .then((chats) => {
                setChats(chats);
              })
              .catch((error) => {
                console.log("Fatal Error getting documents:", error);
              });
          } else {
            console.log("No such document!");
          }
        },
        (error) => {
          console.log("Error getting document:", error);
        }
      );

    return () => {
      unsubscribe();
    };
  }, []);

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

  const enterChat = (id, chatname) => {
    navigation.navigate("Chat", { id, chatname });
  };

  return (
    <SafeAreaView>
      <ScrollView style={styles.container}>
        {chats.map(({ id, data: { chatName } }) => (
          <CustomListItem
            key={id}
            id={id}
            chatName={chatName}
            enterChat={enterChat}
          />
        ))}
      </ScrollView>
    </SafeAreaView>
  );
};
export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    height: "100%",
  },
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
