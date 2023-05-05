import { KeyboardAvoidingView, StyleSheet, Text, View } from "react-native";
import React, { useLayoutEffect, useState } from "react";
import { Button, Input, Image } from "react-native-elements";
import { StatusBar } from "expo-status-bar";
import { v4 as uuidv4 } from "uuid";
import { firebase } from "../firebaseConfig";
var RSAKey = require("react-native-rsa");
import * as SecureStore from "expo-secure-store";
import { Alert } from "react-native";

const RegisterScreen = ({ navigation }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  async function save(key, value) {
    await SecureStore.setItemAsync(key, value, SecureStore.WHEN_UNLOCKED);
  }

  function isValidPassword(password, password2) {
    const passwordRegex =
      /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?])(?=.*[^\da-zA-Z]).{10,}$/;
    return passwordRegex.test(password) && password === password2;
  }

  const register = () => {
    if (isValidPassword(password, confirmPassword)) {
      firebase
        .auth()
        .createUserWithEmailAndPassword(email, password)
        .then((authUser) => {
          authUser.user.updateProfile({
            name: name,
          });
          //Generating Public/Private Key
          const bits = 1024;
          const exponent = "10001"; // must be a string. This is hex string. decimal = 65537
          var rsa = new RSAKey();
          rsa.generate(bits, exponent);
          const publicKey = rsa.getPublicString(); // return json encoded string
          const privateKey = rsa.getPrivateString(); // return json encoded string
          //Storing the info in DB
          const todoRef = firebase.firestore().collection("Users");
          todoRef.doc(firebase.auth().currentUser.uid).set({
            name: name,
            email: email,
            publicKey: publicKey,
            listOfRooms: [],
          });
          save(firebase.auth().currentUser.uid, privateKey);
        })
        .catch((error) => alert(error.message));
    } else {
      Alert.alert(
        "Password Not Secure",
        "Please make sure your password has at least 10 characters, 1 lowercase, 1 uppercase, 1 number, and 1 special character.\n\nAlso be sure that your passwords match!",
        [
          {
            text: "Ok",
          },
        ],
        { cancelable: true }
      );
    }
  };

  function set_name(text) {
    setName((prevName) => text);
  }

  function set_email(text) {
    setEmail((prevEmail) => text);
  }

  function set_password(text) {
    setPassword((prevPassword) => text);
  }

  function set_confirm_assword(text) {
    setConfirmPassword((prevPassword) => text);
  }

  return (
    <KeyboardAvoidingView behavior="padding" style={styles.container}>
      <StatusBar style="light" />
      <View style={styles.inputContainer}>
        <Input
          placeholder="Name"
          autoFocus
          type="text"
          value={name}
          onChangeText={(text) => set_name(text)}
        />
        <Input
          placeholder="Email"
          type="email"
          value={email}
          onChangeText={(text) => set_email(text)}
        />
        <Input
          placeholder="Password"
          secureTextEntry
          type="password"
          value={password}
          onChangeText={(text) => set_password(text)}
        />
        <Input
          placeholder="Confirm Password"
          secureTextEntry
          type="password"
          value={confirmPassword}
          onChangeText={(text) => setConfirmPassword(text)}
        />
        <Button
          onPress={register}
          containerStyle={styles.Button}
          type="outline"
          title="Register"
        />
        <View style={{ height: 5 }} />
      </View>
    </KeyboardAvoidingView>
  );
};

export default RegisterScreen;

const styles = StyleSheet.create({
  container: {
    marginTop: 100,
    flex: 1,
    alignItems: "center",
    justifyContent: "flex-start",
    padding: 10,
  },
  inputContainer: {
    width: 300,
    justifyContent: "center",
    alignItems: "center",
  },
  Button: {
    width: 200,
    marginTop: 10,
  },
});
