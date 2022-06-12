import React from "react";
import { Text, View } from "react-native";

export default function eventDisplay(props) {
  return (
    <View>
      <Text>Event: {props.title}</Text>
      <Text>notes: {props.notes}</Text>
    </View>
  );
}
