import {Platform, StyleSheet, Text, View} from "react-native";
import React, { useLayoutEffect, useState } from "react";
import { Button, Input } from "react-native-elements";
import Icon from "react-native-vector-icons/FontAwesome";
import { firebase } from "../firebaseConfig";
import * as Crypto from "expo-crypto";
var RSAKey = require("react-native-rsa");
import * as SecureStore from "expo-secure-store";
import AsyncStorage from "@react-native-async-storage/async-storage";


const AddChatScreen = ({ navigation }) => {
  const [input, setInput] = useState("");

  useLayoutEffect(() => {
    navigation.setOptions({
      title: "Add a new chat",
      headerBackTitle: "Chats",
    });
  }, [navigation]);

  async function save(key, value) {
    if (Platform.OS === "ios") {
      await SecureStore.setItemAsync(key, value);
    } else if (Platform.OS === "android") {
      await SecureStore.setItemAsync(key, value, SecureStore.WHEN_UNLOCKED);
    } else {
      await AsyncStorage.setItem(key, value);
    }

  }

  const generateRandomKey = async () => {
    const key = await Crypto.digestStringAsync(
      Crypto.CryptoDigestAlgorithm.SHA256,
      Math.random().toString()
    );
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

      // Use the other person's public key to encrypt the AES key
      const rsa = new RSAKey();
      rsa.setPublic(otherPersonKeyN, otherPersonKeyE);
      const key_encrypted = rsa.encrypt(key);

      // Update the database with the encrypted AES key
      await firebase.firestore().collection("ChatRooms").doc(room_id).update({
        AESkey: key_encrypted,
      });
    } catch (error) {
      console.error("Failed to create AES key", error);
      // Handle the error here, such as showing an error message to the user
    }
  }

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
          // Create a new chat room document and get its id
          const newChatRoom = {
            person_1: firebase.auth().currentUser.uid,
            person_2: querySnapshot.docs[0].ref.id,
            messages: [],
          };
          return todoRef.add(newChatRoom).then((docRef) => {
            const chatRoomId = docRef.id;

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
                console.log("Ok");
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
                console.log("ChatRoom Created!");
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
