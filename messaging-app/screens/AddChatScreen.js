import { StyleSheet, Text, View } from "react-native";
import React, { useLayoutEffect, useState } from "react";
import { Button, Input } from "react-native-elements";
import Icon from "react-native-vector-icons/FontAwesome";
import { firebase } from "../firebaseConfig";
import { query } from "firebase/database";

const AddChatScreen = ({ navigation }) => {
  const [input, setInput] = useState("");

  useLayoutEffect(() => {
    navigation.setOptions({
      title: "Add a new chat",
      headerBackTitle: "Chats",
    });
  }, [navigation]);
  /*
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
          console.log("Point 1\n");
          console.log(querySnapshot.docs[0].ref.id + "\n");
          console.log(firebase.auth().currentUser.uid);

          chatRoomId = todoRef.add({
            person_1: firebase.auth().currentUser.uid,
            person_2: querySnapshot.docs[0].ref.id,
            messages: [],
          });
          console.log("Point 2");

          firebase
            .firestore()
            .collection("Users")
            .doc(firebase.auth().currentUser.uid)
            .get()
            .then((doc) => {
              if (doc.exists) {
                doc.update({
                  listOfRooms:
                    firebase.firestore.FieldValue.arrayUnion(chatRoomId),
                });
              } else {
                console.log("Could not update your chatRoom List!");
              }
            });
          console.log("Point 3");

          firebase
            .firestore()
            .collection("Users")
            .doc(querySnapshot.docs[0].ref.id)
            .update({
              listOfRooms:
                firebase.firestore.FieldValue.arrayUnion("new message data"),
            });
          console.log("Point 4");
        }
      })
      .then(() => navigation.goBack())
      /*
    todoRef
      .add({ person_1: firebase.auth().name, person_2: input, messages: [] })
      .then(() => {
        firebase
          .firestore()
          .collection("Users")
          .where("email", "==", firebase.auth().name)
          .get()
          .then((querySnapshot) => {
            if (querySnapshot.empty) {
              console.log("No matching documents");
              return;
            }

            // Update the messages field of the first matching document
            const userDocRef = querySnapshot.docs[0].ref;
            const roomId = userDocRef
              .update({
                listOfRooms: ["New message"],
              })
              .then(() => {
                console.log("Messages field updated");
              })
              .catch((error) => {
                console.error("Error updating messages field:", error);
              });
          })
          .catch((error) => {
            console.error("Error getting documents:", error);
          });
        navigation.goBack();
      })*/ /*
      .catch((error) => alert(error));
  };
  */
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
