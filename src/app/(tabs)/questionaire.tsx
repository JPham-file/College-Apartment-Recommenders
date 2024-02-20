import EditScreenInfo from '@/src/components/EditScreenInfo';
import { Text, View } from '@/src/components/Themed';
import React, {useCallback, useState} from 'react';
import {TextInput, Button, StyleSheet} from "react-native";

import Slider from '@react-native-community/slider';
import * as Haptics from 'expo-haptics';


const majors = [
  { key: 'computer_science', label: 'Computer Science', value: 'computer_science' },
  { key: 'business', label: 'Business', value: 'business' },
  { key: 'engineering', label: 'Engineering', value: 'engineering' }
]

const createValueChangeHandler = (
  step: number,
  feedbackStyle : Haptics.ImpactFeedbackStyle,
  setState: React.Dispatch<React.SetStateAction<number>>,
  lastStepIndexState: [number, React.Dispatch<React.SetStateAction<number>>]
) => {
  const [lastStepIndex, setLastStepIndex] = lastStepIndexState;

  return (value: number) => {
    const stepIndex = Math.round(value/step);
    if (stepIndex !== lastStepIndex) {
      Haptics.impactAsync(feedbackStyle);
      setLastStepIndex(stepIndex);
    }
    setState(value)
  };
};

const QuestionnaireScreen = () => {
  const [budget, setBudget] = useState<number>(0);
  const [lastStepIndex, setLastStepIndex] = useState<number | null>(null);
  const [selectedMajor, setSelectedMajor] = useState(null);
  const [roommates, setRoommates] = useState<number>(0);

  const handleSubmit = () => {

  };
  // TODO: Make sure to disable haptic feedback on web
  const handleValueChange = (value: number) => {
    const stepIndex = Math.round(value / 100); // Assuming step size is 100
    if (stepIndex !== lastStepIndex) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      setLastStepIndex(stepIndex);
    }
    setBudget(value);
  };

  const budgetChangeHandler = createValueChangeHandler(
    100,
    Haptics.ImpactFeedbackStyle.Light,
    setBudget,
    useState(-1)  // -1 will ensure first change to make haptic
  );

  const roommatesChangeHandler = createValueChangeHandler(
    1,
    Haptics.ImpactFeedbackStyle.Light,
    setRoommates,
    useState(-1)  // -1 will ensure first change to make haptic
  );

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
        onValueChange = {budgetChangeHandler}
      />


      <Text style={styles.label}>Major:</Text>
      <TextInput
        style={styles.input}
        value={selectedMajor}
        onChange={setSelectedMajor}
        placeholder="Enter your Major:"
      />


      <Text>Number of Roommates {roommates}</Text>
      <Slider
        style={styles.slider}
        minimumValue={0}
        maximumValue={5}
        step={1}
        value={roommates}
        minimumTrackTintColor="#1fb28a"
        maximumTrackTintColor="#d3d3d3"
        thumbTintColor="#b9e4c9"
        // onValueChange={value => setBudget(value)}
        onValueChange = {roommatesChangeHandler}
      />

      <Button title="Submit" onPress={handleSubmit} />

    </View>
  );
}

const styles= StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  slider: {
    width: '100%', // full width of container
    height: 40,
  },
  label: {
    alignSelf: 'flex-start',
  },
  input: {
    height: 40,
    width: '100%',
    marginVertical: 8,
    borderWidth: 1,
    padding: 10,
    borderRadius: 5,
    borderColor: '#cccccc',
    color: '#FFFFFF'
  },});

export default QuestionnaireScreen;