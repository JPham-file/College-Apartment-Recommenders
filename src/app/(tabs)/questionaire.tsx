import EditScreenInfo from '@/src/components/EditScreenInfo';
import { Text, View } from '@/src/components/Themed';
import React, {useCallback, useState} from 'react';
import {TextInput, Button, StyleSheet} from "react-native";

import Slider from '@react-native-community/slider';
import * as Haptics from 'expo-haptics';

import {UserPrompt} from '@/src/components/UserPrompt';

const majors = [
  { key: 'computer_science', label: 'Computer Science', value: 'computer_science' },
  { key: 'business', label: 'Business', value: 'business' },
  { key: 'engineering', label: 'Engineering', value: 'engineering' }
]

// used for setting haptic, changing set Values
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
  return (
    <UserPrompt/>
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