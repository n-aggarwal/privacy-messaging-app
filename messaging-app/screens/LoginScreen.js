import { KeyboardAvoidingView, StyleSheet, Text, View } from "react-native";
import React, { useEffect, useState } from "react";
import { Button, Input, Image } from "react-native-elements";
import { StatusBar } from "expo-status-bar";
import { firebase } from "../firebaseConfig";

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    const unsubscribe = firebase.auth().onAuthStateChanged((authUser) => {
      if (authUser) {
        navigation.replace("Home");
      }
    });
    return unsubscribe;
  }, []);

  const signIn = () => {
    firebase
      .auth()
      .signInWithEmailAndPassword(email, password)
      .catch((error) => alert("Invalid Credentials"));
  };
  function set_email(text) {
    setEmail((prevEmail) => text);
  }

  function set_password(text) {
    setPassword((prevPassword) => text);
  }

  return (
    <KeyboardAvoidingView behavior="padding" style={styles.container}>
      <StatusBar style="light" />
      <View style={styles.inputContainer}>
        <Input
          placeholder="Email"
          autoFocus
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
        <Button containerStyle={styles.Button} onPress={signIn} title="Login" />
        <Button
          onPress={() => navigation.navigate("Register")}
          containerStyle={styles.Button}
          type="outline"
          title="Register"
        />
        <View style={{ height: 5 }} />
      </View>
    </KeyboardAvoidingView>
  );
};

export default LoginScreen;

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
