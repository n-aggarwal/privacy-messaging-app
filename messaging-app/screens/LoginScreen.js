import { KeyboardAvoidingView, StyleSheet, Text, View } from "react-native";
import React, { useState } from "react";
import { Button, Input, Image } from "react-native-elements";
import { StatusBar } from "expo-status-bar";

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const signIn = () =>
    function set_email(text) {
      setEmail((prevEmail) => text);
    };

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
          onChange={(text) => set_email(text)}
        />
        <Input
          placeholder="Password"
          secureTextEntry
          type="password"
          value={password}
          onChange={(text) => set_password(text)}
        />
        <Button containerStyle={styles.Button} onPress={signIn} title="Login" />
        <Button
          onPress={() => navigation.navigate("Register")}
          containerStyle={styles.Button}
          type="outline"
          title="Register"
        />
        <Button
          onPress={() => navigation.navigate("Chat")}
          containerStyle={styles.Button}
          type="outline"
          title="Chat"
        />
        <Button
          onPress={() => navigation.navigate("Add Chat")}
          containerStyle={styles.Button}
          type="outline"
          title="Add Chat"
        />
        <Button
          onPress={() => navigation.navigate("Home")}
          containerStyle={styles.Button}
          type="outline"
          title="Home"
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
