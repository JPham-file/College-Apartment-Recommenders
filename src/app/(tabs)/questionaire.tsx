import EditScreenInfo from '@/src/components/EditScreenInfo';
import { Text, View } from '@/src/components/Themed';
import React, {useCallback, useState} from 'react';
import {TextInput, Button, StyleSheet} from "react-native";

import Slider from '@react-native-community/slider';
import * as Haptics from 'expo-haptics';

const QuestionnaireScreen = () => {
  const [budget, setBudget] = useState<number>(0);
  const [lastStepIndex, setLastStepIndex] = useState<number | null>(null);
  const [major, setMajor] = useState('');
  const [roommates, setRoommates] = useState('');

  const handleSubmit = () => {

  };
  const handleValueChange = (value: number) => {
    const stepIndex = Math.round(value / 100); // Assuming step size is 100
    if (stepIndex !== lastStepIndex) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      setLastStepIndex(stepIndex);
    }
    setBudget(value);
  };



  return (
    <View className="flex-1 items-center justify-center" style={styles.container}>
      <Text className="font-bold">Questionaire screen</Text>
      <Text>Maximum budget: {budget}</Text>
      <Slider
        style={styles.slider}
        minimumValue={200}
        maximumValue={3000}
        step={100}
        value={budget}
        minimumTrackTintColor="#1fb28a"
        maximumTrackTintColor="#d3d3d3"
        thumbTintColor="#b9e4c9"
        // onValueChange={value => setBudget(value)}
        onValueChange = {handleValueChange}
      />
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
  slider: {
    width: '100%', // Take the full width of the container
    height: 40, // Set the height of the slider
    // Add additional styling if needed
  },
});

export default QuestionnaireScreen;