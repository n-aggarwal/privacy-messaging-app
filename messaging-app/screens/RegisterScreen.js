import { KeyboardAvoidingView, StyleSheet, Text, View } from "react-native";
import React, { useLayoutEffect, useState } from "react";
import { Button, Input, Image } from "react-native-elements";
import { StatusBar } from "expo-status-bar";
import { v4 as uuidv4 } from "uuid";

const RegisterScreen = ({ navigation }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const register = () => {};

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
