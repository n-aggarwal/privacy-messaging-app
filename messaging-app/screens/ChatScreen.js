import { StyleSheet, Text, View } from "react-native";
import React, { useLayoutEffect } from "react";
import { TouchhableOpacity, TouchableWithoutFeedback  } from "react-native";
import { Avatar } from "react-native-elements";
import { AntDesign, FontAwesome, Ionicons } from "@expo/vector-icons";
import { StatusBar } from "expo-status-bar";
import { SafeAreaView } from "react-native";
import { Platform } from "react-native";
import { KeyboardAvoidingView } from "react-native";
import { TextInput } from "react-native";
import { ScrollView } from "react-native"
import { keyboard } from "react-native"
import * as firebase from "firebase";
import {db, auth} from "../firebase";



//url needed for profile pic  "https://cencup.com/wp-content/uploads/2019/07/avatar-placeholder.png",


const ChatScreen = ({ navigation, route}) => {
   const [input, setInput] = useState("")
   const [messages, setMessages] = useState([])

  useLayoutEffect(() =>{
    navigation.setOptions({
      title: "Chat",
      headerBackfitVisible: false,
      headerTitleAlign:"left",
      headerTitle: () =>(
      <View
        style = {{
          flexDirection: "row",
          alignItems: "center",
        }}
        >
        <Avatar 
          rounded 
          source = {{
            uri: messages[0]?.data.photoURL,
         }}

        />
        <Text>{route.params.chatName}</Text>
      </View>
    ),
    headerLeft: () => (
      <TouchhableOpacity
       style = {{marginLeft: 10}}
       onPress={navigation.goBack}
       >
        <AntDesign name ="arrowleft" size={24} color="white"/>
      </TouchhableOpacity>
    ),
    headerRight: () =>(
      <View
       style ={{
        flexDirection: "row",
        justifyContent: "space-between",
        width: 80,
        marginRight: 20,
       }}
      >

      <TouchhableOpacity>
        <FontAwesome name="video-camera" size = {24} color="white"/>
      </TouchhableOpacity>
      <TouchhableOpacity>
        <IonIcons name="call" size={24} color="white"/>
        </TouchhableOpacity>
      </View>
    ),
   });
  }, [navigation, messages]);

  const sendMessage = () => {
    keyboard.dismiss();

    db.collection('chats').doc(route.params.id).collection('messages').add({
      timestamp: firebase.firestore.FieldValue.serverTimestamp(),
      message: input,
      displayName: auth.currentUser.displayName,
      email: auth.currentUser,
      photoURL: auth.currentUser.photoURL,
    });

    setInput("");
  };

  UseLayoutEffect(() => {
    const unsubscribe = db
      .collection('chats')
      .doc(route.params.id)
      .collection('messages')
      .orderBy('timestamp', 'desc')
      .onSnapshot(snapshot => 
        setMessages(
         snapshot.docs.map(doc => ({
            id: doc.id,
            data: doc.data()
         }))
      ));

    return unsubscribe; 
  }, [route])


  return (
    <SafeAreaView style={{ flex: 1, background:"white"}}>
      <StatusBar style="light"/>
      <KeyboardAvoidingdView
        behavior = {Platform.OS === "ios" ? "padding": "height"}
        style = {styles.container}
        keyboardVerticalOffset = {90}
        >
          <TouchableWithoutFeedback onPress = {keyboard.dismiss}>
            <>
              <ScrollView contentContainerStyle = {{ paddingTop: 15 }}>
                {messages.map(({id, data}) =>
                    data.email === auth.currentUser.email ? (
                        <View key={id} style={styles.receiver}>
                          <Avatar 
                            position = "absolute"
                            rounded
                          //web
                          containerStyle = {{
                            position: "absolute",
                            bottom: -15,
                            right: -5
                          }}
                            bottom = {-15}
                            right = {-5}
                            size={30}
                            source ={{
                              uri: data.photoURL,
                            }}
                            />
                          <Text style = {styles.receiverText}>{data.message}</Text>
                        </View>
                    ) : (
                      <View key ={id} style= {styles.sender}>
                         <Avatar 
                            position = "absolute"
                          containerStyle = {{
                            position: "absolute",
                            bottom: -15,
                            right: -5
                          }}
                            bottom = {-15}
                            left = {-5}
                            size={30}
                            source ={{
                              uri: data.photoURL,
                            }}
                         />
                       <Text style = {styles.senderText}>{data.message}</Text>
                       <Text style = {styles.senderName}>{data.displayName}</Text>
                      </View>
                    )
                )}

              </ScrollView>
              <View style={styles.footer}>
               <TextInput 
                value = {input} 
                onChangeText ={(text) => setInput(text)}
                onSubmitEditing = {sendMessage}
                placeholder = "signal" 
                style = {styles.textInput}
               />
             <TouchhableOpacity onPress = {sendMessage} activeOpacity ={0.5} >
               <Ionicons name="send" size={24} color="#2B68E6"/>
             </TouchhableOpacity>
           </View>
           </>
          </TouchableWithoutFeedback>
      </KeyboardAvoidingdView>
    </SafeAreaView>
  );
};

export default ChatScreen;

const styles = StyleSheet.create({
  container: {
    flex:1,
  },
  receiver: {
    padding: 15,
    backgroundColor: "ECECEC",
    alignSelf: "flex-end",
    borderRadius: 20,
    marginRight: 15,
    marginBottom: 20,
    maxWidth: "80%",
    position: "relative",
  },
  sender:{
    padding: 15,
    backgroundColor: "2B68E6",
    alignSelf: "flex-start",
    borderRadius: 20,
    margin: 20,
    maxWidth: "80%",
    position: "relative",
  },
  SenderText:{
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
    color:"white",
  },
  footer:{
    flexDirection: "row",
    alignItems:"center",
    width:"100%",
    padding: 15,
  },
  textInput: {
    bottom: 0,
    haight: 40,
    flex:1,
    marginRight:15,
    backgroundColor: "#ECECEC",
    padding: 10,
    color: "grey",
    borderRadius:30,
  },
});
