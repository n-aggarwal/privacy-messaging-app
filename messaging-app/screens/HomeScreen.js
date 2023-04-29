import { StyleSheet, Text, View, SafeAreaView, ScrollView } from "react-native";
import React, { useLayoutEffect } from "react";
import CustomListItem from "../components/CustomListItem";
import { Avatar } from "react-native-elements";

const HomeScreen = ({ navigation }) => {

  useLayoutEffect(() => {
    navigation.setOptions({
      title: "PrivChat", 
      headerStyle: { backgroundColor: "#fff" }, 
      headerTitleStyle: { color: "black" },
      headerTintColor: "black",  
      headerLeft: () => <View style={{marginLeft : 20}}>
      </View>
    });  
  }, []); 

  return (
    <SafeAreaView>
      <ScrollView>
         <CustomListItem /> 
      </ScrollView>
    </SafeAreaView>
   );
};

export default HomeScreen;

const styles = StyleSheet.create({});
