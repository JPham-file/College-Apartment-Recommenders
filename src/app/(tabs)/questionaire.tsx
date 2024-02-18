import EditScreenInfo from '@/src/components/EditScreenInfo';
import { Text, View } from '@/src/components/Themed';
import React, {useState} from 'react';
import {TextInput, Button, StyleSheet} from "react-native";

const QuestionnaireScreen = () => {
  const [budget, setBudget] = useState('');
  const [major, setMajor] = useState('');
  const [roommates, setRoommates] = useState('');

  const handleSubmit = () => {

  };

  return (
    <View className="flex-1 items-center justify-center" style={styles.container}>
      <Text className="font-bold">Questionaire screen</Text>
      <Button title="Submit" onPress={handleSubmit} />
    </View>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
});

export default QuestionnaireScreen;