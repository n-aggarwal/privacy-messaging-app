import React, { useState, useLayoutEffect, useEffect } from "react";
import { TouchableOpacity, TouchableWithoutFeedback } from "react-native";
import { KeyboardAvoidingView, StyleSheet, Text, View } from "react-native";
import { Avatar } from "react-native-elements";
import { FontAwesome, Ionicons } from "@expo/vector-icons";
import { StatusBar } from "expo-status-bar";
import { SafeAreaView } from "react-native";
import { Platform } from "react-native";
import { TextInput } from "react-native";
import { ScrollView } from "react-native";
import { firebase } from "../firebaseConfig";
import { Keyboard } from "react-native";
import moment from "moment";
import * as Crypto from "expo-crypto";
import * as SecureStore from "expo-secure-store";
var RSAKey = require("react-native-rsa");
import { Alert } from "react-native";
import CryptoES from "crypto-es";
import { AES } from "crypto-js";

//url needed for profile pic  "https://cencup.com/wp-content/uploads/2019/07/avatar-placeholder.png",

const ChatScreen = ({ navigation, route }) => {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);

  async function save(key, value) {
    await SecureStore.setItemAsync(key, value, SecureStore.WHEN_UNLOCKED);
  }

  async function getValueFor(key) {
    let result = await SecureStore.getItemAsync(key);
    return result;
  }

  async function get_aes_key(room_id) {
    const aes_key = await getValueFor(room_id);

    if (aes_key) {
      return aes_key;
    } else {
      //get it from the database and decrypt it
      try {
        const doc = await firebase
          .firestore()
          .collection("ChatRooms")
          .doc(room_id)
          .get();

        const encrypted_key = doc.data().AESkey;

        if (!encrypted_key) {
          throw new Error("No AES key found for room " + room_id);
        }

        const private_key_json = await getValueFor(
          firebase.auth().currentUser.uid
        );

        if (!private_key_json) {
          throw new Error(
            "No RSA private key found for user " +
              firebase.auth().currentUser.uid
          );
        }

        const private_key = JSON.parse(private_key_json);
        const rsa = new RSAKey();
        rsa.setPrivateEx(
          private_key.n,
          private_key.e,
          private_key.d,
          private_key.p,
          private_key.q,
          private_key.dmp1,
          private_key.dmq1,
          private_key.coeff
        );

        console;
        const aes_key = rsa.decrypt(encrypted_key);

        if (!aes_key) {
          throw new Error("Failed to decrypt AES key for room " + room_id);
        }

        await save(room_id, aes_key);

        return aes_key;
      } catch (error) {
        console.error("Failed to decrypt AES key", error);
        // Handle the error here, such as showing an error message to the user
      }
    }
  }

  async function encrypt_message(message, room_id) {
    CryptoES.enc.Utf8 = {
      stringify: CryptoES.enc.Utf8.stringify,
      parse: CryptoES.enc.Utf8.parse,
    };

    const aes_key = await get_aes_key(room_id);

    const aes_key_wordarray = CryptoES.enc.Utf8.parse(aes_key);

    try {
      const encrypted_message = CryptoES.AES.encrypt(message, aes_key);

      return encrypted_message;
    } catch (error) {
      console.error("Failed to encrypt message:", error);
      const ciphertext = AES.encrypt(message, aes_key).toString();
      return ciphertext;
    }
  }

  async function decrypt_message(str_message, room_id) {
    const aes_key = await get_aes_key(room_id);

    const aes_key_wordarray = CryptoES.enc.Utf8.parse(aes_key);

    const message = JSON.parse(str_message);

    const decrypted_message = CryptoES.AES.decrypt(message, aes_key);
    return decrypted_message.toString(CryptoES.enc.Utf8);
  }

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
        return "Fuck";
      }
    } catch (error) {
      return "Fuck";
    }
  }

  useLayoutEffect(() => {
    navigation.setOptions({
      title: "Chat",
      headerBackfitVisible: false,
      headerTitleAlign: "left",
      headerTitle: () => (
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          <Avatar
            rounded
            source={{
              uri: "https://cencup.com/wp-content/uploads/2019/07/avatar-placeholder.png",
            }}
          />
          <Text>{route.params.chatName}</Text>
        </View>
      ),
      headerRight: () => (
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            width: 80,
            marginRight: 20,
          }}
        >
          <TouchableOpacity>
            <FontAwesome name="video-camera" size={24} color="white" />
          </TouchableOpacity>
          <TouchableOpacity>
            <Ionicons name="call" size={24} color="white" />
          </TouchableOpacity>
        </View>
      ),
    });
  }, [navigation, messages]);

  const sendMessage = async () => {
    Keyboard.dismiss();

    const currentChatRoom = firebase
      .firestore()
      .collection("ChatRooms")
      .doc(route.params.id);
    const now = moment();
    const encrypted_message = await encrypt_message(input, route.params.id);
    const userName = await getName(firebase.auth().currentUser.uid);
    const newMessage = {
      timestamp: now.format("YYYY-MM-DD HH:mm:ss"),
      message: JSON.stringify(encrypted_message),
      displayName: userName,
      email: firebase.auth().currentUser.email,
    };

    currentChatRoom.update({
      messages: firebase.firestore.FieldValue.arrayUnion(newMessage),
    });

    setInput("");
  };

  useEffect(() => {
    const unsubscribe = firebase
      .firestore()
      .collection("ChatRooms")
      .doc(route.params.id)
      .onSnapshot((doc) => {
        const messages = doc.data().messages.map(async (one_message) => {
          const decrypted_message = await decrypt_message(
            one_message.message,
            route.params.id
          );
          return {
            id: one_message.timestamp,
            message: decrypted_message,
            displayName: one_message.displayName,
          };
        });

        Promise.all(messages).then((messages) => {
          setMessages(messages);
        });
      });

    return unsubscribe;
  }, [route]);

  useLayoutEffect(() => {
    const fetchMessages = async () => {
      try {
        const doc = await firebase
          .firestore()
          .collection("ChatRooms")
          .doc(route.params.id)
          .get();
        const messages = doc.data().messages;
        const decryptedMessages = await Promise.all(
          messages.map(async (one_message) => {
            const decrypted_message = await decrypt_message(
              one_message.message,
              route.params.id
            );
            return {
              id: one_message.timestamp.toString(),
              message: decrypted_message,
              displayName: one_message.displayName,
            };
          })
        );
        setMessages(decryptedMessages);
      } catch (error) {
        console.log("Error getting messages:", error);
      }
    };
    fetchMessages();
  }, [route]);

  const deleteMessages = (id, message, displayName) => {
    Alert.alert(
      "Delete Messages",
      'If you press "Yes", all messages after the selected message, will be deleted!',
      [
        {
          text: "Yes",
          onPress: () => {
            const docRef = firebase
              .firestore()
              .collection("ChatRooms")
              .doc(route.params.id);

            docRef.get().then((doc) => {
              if (doc.exists) {
                const data = doc.data();
                const timestampToDelete = id; // The timestamp you want to delete from

                const index = data.messages.findIndex((element) => {
                  return element.timestamp === timestampToDelete;
                });

                if (index === -1) {
                  return; // Exit if the timestamp is not found
                }

                const newArray = data.messages.slice(0, index);
                docRef.update({ messages: newArray });
              }
            });
          },
        },
        {
          text: "No",
          onPress: () => console.log("don't delete"),
        },
      ],
      { cancelable: true }
    );
  };

  return (
    <SafeAreaView style={{ flex: 1, background: "white" }}>
      <StatusBar style="light" />
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.container}
        keyboardVerticalOffset={90}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <>
            <ScrollView contentContainerStyle={{ paddingTop: 15 }}>
              {messages.map(({ id, message, displayName }) =>
                displayName == firebase.auth().currentUser.name ? (
                  <View style={styles.receiver}>
                    <Avatar
                      position="absolute"
                      rounded
                      containerStyle={{
                        position: "absolute",
                        bottom: -15,
                        right: -5,
                      }}
                      bottom={-15}
                      right={-5}
                      size={30}
                      source={{
                        uri: "https://cencup.com/wp-content/uploads/2019/07/avatar-placeholder.png",
                      }}
                    />
                    <Text style={styles.receiverText}>{message}</Text>
                  </View>
                ) : (
                  <View key={id} style={styles.sender}>
                    <Avatar
                      position="absolute"
                      containerStyle={{
                        position: "absolute",
                        bottom: -15,
                        right: -5,
                      }}
                      bottom={-15}
                      left={-5}
                      size={30}
                      source={{
                        uri: "https://cencup.com/wp-content/uploads/2019/07/avatar-placeholder.png",
                      }}
                    />
                    <TouchableOpacity
                      key={id}
                      onPress={() => deleteMessages(id, message, displayName)}
                    >
                      <Text style={styles.senderText}>{message}</Text>
                      <Text style={styles.senderName}>{displayName}</Text>
                    </TouchableOpacity>
                  </View>
                )
              )}
            </ScrollView>
            <View style={styles.footer}>
              <TextInput
                value={input}
                onChangeText={(text) => setInput(text)}
                onSubmitEditing={sendMessage}
                placeholder="signal"
                style={styles.textInput}
              />
              <TouchableOpacity onPress={sendMessage} activeOpacity={0.5}>
                <Ionicons name="send" size={24} color="#2B68E6" />
              </TouchableOpacity>
            </View>
          </>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default ChatScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  receiver: {
    padding: 15,
    backgroundColor: "#ECECEC",
    alignSelf: "flex-end",
    borderRadius: 20,
    marginRight: 15,
    marginBottom: 20,
    maxWidth: "80%",
    position: "relative",
  },
  sender: {
    padding: 15,
    backgroundColor: "#2B68E6",
    alignSelf: "flex-start",
    borderRadius: 20,
    margin: 20,
    maxWidth: "80%",
    position: "relative",
  },
  senderText: {
    color: "white",
    fontWeight: "500",
    marginLeft: 10,
    marginBottom: 15,
  },
  receiverText: {
    color: "black",
    fontWeight: "500",
    marginLeft: 10,
  },
  senderName: {
    left: 10,
    paddingRight: 10,
    fontSize: 10,
    color: "white",
  },
  footer: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    padding: 15,
  },
  textInput: {
    bottom: 0,
    height: 40,
    flex: 1,
    marginRight: 15,
    backgroundColor: "#ECECEC",
    padding: 10,
    color: "grey",
    borderRadius: 30,
  },
});
