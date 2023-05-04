import { StyleSheet, Text, View } from "react-native";
import React, { useLayoutEffect, useState } from "react";
import { Button, Input } from "react-native-elements";
import Icon from "react-native-vector-icons/FontAwesome";
import { firebase } from "../firebaseConfig";
import * as Crypto from "expo-crypto";
var RSAKey = require("react-native-rsa");
import * as SecureStore from "expo-secure-store";

const AddChatScreen = ({ navigation }) => {
  const [input, setInput] = useState("");

  useLayoutEffect(() => {
    navigation.setOptions({
      title: "Add a new chat",
      headerBackTitle: "Chats",
    });
  }, [navigation]);

  async function save(key, value) {
    await SecureStore.setItemAsync(key, value, SecureStore.WHEN_UNLOCKED);
  }

  const generateRandomKey = async () => {
    const key = await Crypto.digestStringAsync(
      Crypto.CryptoDigestAlgorithm.SHA256,
      Math.random().toString()
    );
    console.log(key);
    return key;
  };

  // Import the necessary libraries

  async function create_AES_key(room_id, otherPersonId) {
    try {
      // Generate a random AES key
      const key = await generateRandomKey();

      if (!key) {
        console.log("Failed to generate a random key");
        return;
      }

      await save(room_id, key);

      // Get the other person's public key from the database
      const otherPersonSnapshot = await firebase
        .firestore()
        .collection("Users")
        .doc(otherPersonId)
        .get();

      if (!otherPersonSnapshot.exists) {
        throw new Error("Other person's public key not found");
      }

      const otherPersonKey = JSON.parse(otherPersonSnapshot.data().publicKey);
      const otherPersonKeyN = otherPersonKey.n;
      const otherPersonKeyE = otherPersonKey.e;

      console.log(otherPersonKey + "\n");
      console.log(otherPersonKeyN + "\n");
      console.log(otherPersonKeyE + "\n");

      // Use the other person's public key to encrypt the AES key
      const rsa = new RSAKey();
      rsa.setPublic(otherPersonKeyN, otherPersonKeyE);
      const key_encrypted = rsa.encrypt(key);

      console.log(
        "Other person's public key is: (n): " +
          otherPersonKeyN +
          ", (e): " +
          otherPersonKeyE
      );
      console.log("The AESKey is: " + key);

      // Update the database with the encrypted AES key
      await firebase.firestore().collection("ChatRooms").doc(room_id).update({
        AESkey: key_encrypted,
      });
    } catch (error) {
      console.error("Failed to create AES key", error);
      // Handle the error here, such as showing an error message to the user
    }
  }

  //make it so that there cannot be duplicate rooms
  const checkRoomExists = async (person1, person2) => {
    const querySnapshot = await firebase
      .firestore()
      .collection("ChatRooms")
      .where("person_1", "in", [person1, person2])
      .where("person_2", "in", [person1, person2])
      .get();

    return !querySnapshot.empty;
  };

  const createChat = async () => {
    const todoRef = firebase.firestore().collection("ChatRooms");

    firebase
      .firestore()
      .collection("Users")
      .where("email", "==", input)
      .get()
      .then((querySnapshot) => {
        if (querySnapshot.empty) {
          alert("User not found");
        } else {
          //do that here
          console.log("Point 1\n");
          console.log(querySnapshot.docs[0].ref.id + "\n");
          console.log(firebase.auth().currentUser.uid);

          // Create a new chat room document and get its id
          const newChatRoom = {
            person_1: firebase.auth().currentUser.uid,
            person_2: querySnapshot.docs[0].ref.id,
            messages: [],
          };
          return todoRef.add(newChatRoom).then((docRef) => {
            const chatRoomId = docRef.id;

            console.log("New chat room created with id:", chatRoomId);

            create_AES_key(chatRoomId, querySnapshot.docs[0].ref.id);

            // Update the user document for the current user
            firebase
              .firestore()
              .collection("Users")
              .doc(firebase.auth().currentUser.uid)
              .update({
                listOfRooms:
                  firebase.firestore.FieldValue.arrayUnion(chatRoomId),
              })
              .then(() => {
                console.log(
                  "Current user document updated with chatRoomId:",
                  chatRoomId
                );
              })
              .catch((error) => {
                console.error("Error updating current user document:", error);
              });

            // Update the user document for the other person
            firebase
              .firestore()
              .collection("Users")
              .doc(querySnapshot.docs[0].ref.id)
              .update({
                listOfRooms:
                  firebase.firestore.FieldValue.arrayUnion(chatRoomId),
              })
              .then(() => {
                console.log(
                  "Other user document updated with chatRoomId:",
                  chatRoomId
                );
              })
              .catch((error) => {
                console.error("Error updating other user document:", error);
              });
          });
        }
      })
      .then(() => navigation.goBack())
      .catch((error) => alert(error));
  };

  return (
    <View style={styles.container}>
      <Input
        placeholder="Enter a chat name"
        value={input}
        onChangeText={(text) => setInput(text)}
        onSubmitEditing={createChat}
        leftIcon={
          <Icon name="wechat" type="antdesign" size={24} color="black" />
        }
      />
      <Button onPress={createChat} title="Create New Chat" />
    </View>
  );
};

export default AddChatScreen;

const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
    padding: 30,
    height: "100%",
  },
});
