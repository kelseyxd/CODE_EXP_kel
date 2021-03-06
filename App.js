import React, { useState, useEffect } from "react";
import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View, TextInput, Button, Alert } from "react-native";
import CalendarPicker from "react-native-calendar-picker";
import * as Calendar from "expo-calendar";

//creates a new calendar and returns the calendar ID
async function getDefaultCalendarSource() {
  const calendars = await Calendar.getCalendarsAsync(
    Calendar.EntityTypes.EVENT
  );
  const defaultCalendars = calendars.filter(
    (each) => each.source.name === "Default"
  );
  return defaultCalendars.length
    ? defaultCalendars[0].source
    : calendars[0].source;
}

async function createCalendar() {
  const defaultCalendarSource =
    Platform.OS === "ios"
      ? await getDefaultCalendarSource()
      : { isLocalAccount: true, name: "Expo Calendar" };
  const newCalendarID = await Calendar.createCalendarAsync({
    title: "Expo Calendar",
    color: "blue",
    entityType: Calendar.EntityTypes.EVENT,
    sourceId: defaultCalendarSource.id,
    source: defaultCalendarSource,
    name: "internalCalendarName",
    ownerAccount: "personal",
    accessLevel: Calendar.CalendarAccessLevel.OWNER,
  });
  console.log(`Your new calendar ID is: ${newCalendarID}`);
  return newCalendarID;
}

export default function App() {
  //record the date value our users select with the calendar picker
  const [selectedStartDate, setSelectedStartDate] = useState(null);
  const startDate = selectedStartDate
    ? selectedStartDate.format("YYYY-MM-DD").toString()
    : ""; //If the user has not made a selection, it will return an empty string.
  //allow users to enter the name of a friend. Subsequently, the name will be added to the event title.
  const [event, setEvent] = useState("");

  //Method that saves a new event to the calendar.
  const addNewEvent = async () => {
    try {
      const calendarId = await createCalendar();

      const res = await Calendar.createEventAsync(calendarId, {
        endDate: getAppointementDate(startDate),
        startDate: getAppointementDate(startDate),
        title: "Happy Birthday buddy " + friendNameText,
      });
      console.log("add event");
      Alert.alert("Event Created!");
    } catch (e) {
      console.log(e);
    }
  };

  //checks if your app has the required permissions to access the user???s calendar, and requests permission if it does not have it already.
  useEffect(() => {
    (async () => {
      const { status } = await Calendar.requestCalendarPermissionsAsync();
      if (status === "granted") {
        const calendars = await Calendar.getCalendarsAsync(
          Calendar.EntityTypes.EVENT
        );
        console.log("Here are all your calendars:");
        console.log({ calendars });
      }
    })();
  }, []);

  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
      <TextInput
        onChangeText={setEvent}
        value={event}
        placeholder="Enter the event title"
        style={styles.input}
      />
      <CalendarPicker onDateChange={setSelectedStartDate} />
      <Text style={styles.dateText}>Date: {startDate}</Text>
      <Button title={"Add to calendar"} onPress={addNewEvent} />
    </View>
  );
} //display the calendar picker

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  input: {
    height: 40,
    margin: 12,
    borderWidth: 1,
  },
  dateText: {
    margin: 16,
  },
});
