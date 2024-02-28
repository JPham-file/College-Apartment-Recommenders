import {Text, View} from '@/src/components/Themed';
import React, {useState} from 'react';
import {useRouter} from 'expo-router';
import {TextInput, Button, StyleSheet} from "react-native";
import {useAuth} from '@clerk/clerk-expo';

import Slider from '@react-native-community/slider';
import * as Haptics from 'expo-haptics';

import {addStudent} from '@/src/components/addStudent';
import RNPickerSelect from 'react-native-picker-select';

const majors = [
  { label: 'Computer Science', value: 'Computer Science'},
  { label: 'Business', value: 'Business'},
  { label: 'Electrical Engineering', value: 'Electrical Engineering'}
]

const campuses = [
  { label: 'Texas A&M University', value: 'Texas A&M University' }
];

// used for setting haptic, changing set Values
const createValueChangeHandler = (
  step: number,
  feedbackStyle: Haptics.ImpactFeedbackStyle,
  setState: React.Dispatch<React.SetStateAction<number>>,
  lastStepIndexState: [number, React.Dispatch<React.SetStateAction<number>>]
) => {
  const [lastStepIndex, setLastStepIndex] = lastStepIndexState;

  return (value: number) => {
    const stepIndex = Math.round(value / step);
    if (stepIndex !== lastStepIndex) {
      Haptics.impactAsync(feedbackStyle);
      setLastStepIndex(stepIndex);
    }
    setState(value)
  };
};


export const UserPrompt = () => {
  const {userId} = useAuth();
  const router = useRouter();

  const [budget, setBudget] = useState<number>(0);
  const [campus, setCampus] = useState<string>('');
  const [selectedMajor, setSelectedMajor] = useState<string>('');
  const [roommates, setRoommates] = useState<number>(0);
  const [college, setCollege] = useState<string>('');

  const [error, setError] = useState<string | null>(null);


  const handleSubmit = async () => {
    const preferences = {
      budget,
      roommates,
    };

    const newStudentData = {
      campus,
      major: selectedMajor,
      schedule: null,
      preferences,
    };

    const result = await addStudent({ userId, newStudentData });
    if (result.status !== 200 && result.status !== 204) {
      console.log('student added to DB', result);
      setError(result.statusText);
      return;
    }

    setError(null);
    router.replace('/(tabs)');
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

  const campusChangeHandler = (value: string) => setCampus(value);

  return (
    <View className="flex-1 p-4 justify-center">



      <View className="flex-row justify-between my-2">
        <Text className="text-white self-center">Campus:</Text>
        <RNPickerSelect 
          onValueChange={campusChangeHandler} 
          value={campus}
          items={campuses} 
          darkTheme={true}
          //placeholder={{}} // LEAVE THIS;  disables the default "select item" option
          style={pickerSelectStyles}
          />
      </View>


      <View className="flex-row justify-between my-2">
        <Text className="text-white self-center">Major:</Text>
        <RNPickerSelect 
          onValueChange={setSelectedMajor} 
          value={selectedMajor}
          items={majors} 
          darkTheme={true}
          //placeholder={{}} // LEAVE THIS;  disables the default "select item" option
          style={pickerSelectStyles}
          />
      </View>



      <Text>Maximum budget: {budget}</Text>
      <Slider
        style={styles.slider}
        minimumValue={300}
        maximumValue={4000}
        step={100}
        value={budget}
        minimumTrackTintColor="#1fb28a"
        maximumTrackTintColor="#d3d3d3"
        thumbTintColor="#b9e4c9"
        onValueChange={budgetChangeHandler}
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
        onValueChange={roommatesChangeHandler}
      />

      <Button title="Submit" onPress={handleSubmit}/>

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
  },
});


const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
    fontSize: 16,
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: 'white',
    borderRadius: 4,
    color: '#FFF',
    paddingRight: 30, // to ensure the text is never behind the icon
  },
  inputAndroid: {
    fontSize: 16,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderWidth: 0.5,
    borderColor: 'purple',
    borderRadius: 8,
    color: '#FFF',
    paddingRight: 30, // to ensure the text is never behind the icon
  },
});



