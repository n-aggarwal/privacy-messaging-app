import React, { useState, useLayoutEffect, useEffect } from "react";
import { TouchableOpacity, TouchableWithoutFeedback } from "react-native";
import { KeyboardAvoidingView, StyleSheet, Text, View } from "react-native";
import { Avatar } from "react-native-elements";
import { AntDesign, FontAwesome, Ionicons } from "@expo/vector-icons";
import { StatusBar } from "expo-status-bar";
import { SafeAreaView } from "react-native";
import { Platform } from "react-native";
import { TextInput } from "react-native";
import { ScrollView } from "react-native";
import { firebase } from "../firebaseConfig";
import { Keyboard } from "react-native";
import moment from "moment";
import { get } from "firebase/database";
import { Alert } from "react-native";

//url needed for profile pic  "https://cencup.com/wp-content/uploads/2019/07/avatar-placeholder.png",

const ChatScreen = ({ navigation, route }) => {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);

  async function getName(userId) {
    try {
      const doc = await firebase
        .firestore()
        .collection("Users")
        .doc(userId)
        .get();
      if (doc.exists) {
        const userName = doc.data().email;
        console.log(doc.data());
        console.log("1." + doc.data().name);
        return doc.data().name;
        // do something with userName
      } else {
        console.log("No such document!");
        return "Fuck";
      }
    } catch (error) {
      console.log("Error getting document:", error);
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
      // headerLeft: () => (
      //   <TouchableOpacity
      //     style={{ marginLeft: 10 }}
      //     onPress={navigation.goBack}
      //   >
      //     <AntDesign name="arrowleft" size={24} color="white" />
      //   </TouchableOpacity>
      // ),
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
    console.log(route.params.id);

    const currentChatRoom = firebase
      .firestore()
      .collection("ChatRooms")
      .doc(route.params.id);
    const now = moment();
    const userName = await getName(firebase.auth().currentUser.uid);
    const newMessage = {
      timestamp: now.format("YYYY-MM-DD HH:mm:ss"),
      message: input,
      displayName: userName,
      email: firebase.auth().currentUser.email,
    };

    currentChatRoom.update({
      messages: firebase.firestore.FieldValue.arrayUnion(newMessage),
    });

    setInput("");
  };
  /*
  useLayoutEffect(() => {
    const unsubscribe = firebase
      .firestore()
      .collection("chats")
      .doc(route.params.id)
      .collection("messages")
      .orderBy("timestamp", "desc")
      .onSnapshot((snapshot) =>
        setMessages(
          snapshot.docs.map((doc) => ({
            id: doc.id,
            data: doc.data(),
          }))
        )
      );

    return unsubscribe;
  }, [route]);
  */

  useEffect(() => {
    const unsubscribe = firebase
      .firestore()
      .collection("ChatRooms")
      .doc(route.params.id)
      .onSnapshot((doc) => {
        const messages = doc.data().messages.map((one_message) => ({
          id: one_message.timestamp,
          message: one_message.message,
          displayName: one_message.displayName,
        }));
        setMessages(messages);
      });

    return unsubscribe;
  }, [route]);

  /*
  useLayoutEffect(() => {
    const unsubscribe = firebase
      .firestore()
      .collection("ChatRooms")
      .doc(route.params.id)
      .get()
      .then((doc) =>
        setMessages(
          doc.data().messages.map((one_message) => ({
            id: one_message.timestamp,
            message: one_message.message,
            displayName: one_message.displayName,
          }))
        )
      );

    return unsubscribe;
  }, [route]);
*/
  useLayoutEffect(() => {
    const fetchMessages = async () => {
      try {
        const doc = await firebase
          .firestore()
          .collection("ChatRooms")
          .doc(route.params.id)
          .get();
        const messages = doc.data().messages.map((one_message) => ({
          id: one_message.timestamp,
          message: one_message.message,
          displayName: one_message.displayName,
        }));
        setMessages(messages);
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

            console.log("Point 1");

            docRef.get().then((doc) => {
              if (doc.exists) {
                const data = doc.data();
                const timestampToDelete = id; // The timestamp you want to delete from

                console.log("Point 2");

                const index = data.messages.findIndex((element) => {
                  return element.timestamp === timestampToDelete;
                });

                console.log("Point 3");

                if (index === -1) {
                  return; // Exit if the timestamp is not found
                }

                console.log("Point 4- Index: " + index);

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
