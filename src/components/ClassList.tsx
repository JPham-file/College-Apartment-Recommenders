import { Text, View } from '@/src/components/Themed';
import { Image, TouchableOpacity, Pressable, ScrollView, TextInput, FlatList } from 'react-native';
import { useState, useEffect } from 'react';
import RNPickerSelect from 'react-native-picker-select';
import { useUser, useClerk, useAuth } from "@clerk/clerk-expo";
import { useRouter } from 'expo-router';
import {SupabaseClient} from '@supabase/supabase-js';
import { useLocalSearchParams } from "expo-router";
import { useDatabaseUser } from '@/src/hooks/useDatabaseUser';

export type ClassItemProps = {
	id: number, 
	subject: string, 
	course: string, 
	section: string,
};

export type ClassListProps = {
	classes: ClassItemProps[],
	add: any
};

const ClassItem = ({subject, course, section}: ClassItemProps) => (
  <View className="mt-1 mb-1 bg-transparent flex-row justify-between items-center">
    <Text className="text-white">{`${subject} ${course} - ${section}`}</Text>
    <TouchableOpacity
      onPress={() => {/* handle remove action here */}}
      className="bg-red-500 hover:bg-red-700 text-white font-bold py-1.5 px-2 rounded"
    >
      <Text>Remove</Text>
    </TouchableOpacity>
  </View>
);

const NewClassForm: React.FC<{add: any}> = (props) => (
	<View className="bg-white/10 rounded-lg p-3 shadow-md">
	  <View className="bg-transparent flex-row justify-between my-2 ml-2 mr-2">
		<Text className="text-white">Subject</Text>
		<TextInput
		  style={{ color: "gray" }} // Adjust styling as needed
		  placeholder="Enter subject" // Optional placeholder text
		/>
	  </View>
  
	  <View className="bg-transparent flex-row justify-between my-2 ml-2 mr-2">
		<Text className="text-white">Course</Text>
		<TextInput
		  style={{ color: "gray" }} // Adjust styling as needed
		  placeholder="Enter course" // Optional placeholder text
		/>
	  </View>
	  
	  <View className="bg-transparent flex-row justify-between my-2 ml-2 mr-2">
		<Text className="text-white">Section</Text>
		<TextInput
		  style={{ color: "gray" }} // Adjust styling as needed
		  placeholder="Enter section" // Optional placeholder text
		/>
	  </View>
  
	  <TouchableOpacity 
		onPress={() => {
			props.add({
				subject: 'CSCE',
				course: '121',
				section: '533',
			})
		}} 
	  	className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-3">
		<Text>Add</Text>
	  </TouchableOpacity>
	</View>
  )

export function ClassList(props: ClassListProps) {
	return <View>
		<View className="flex-row justify-between items-center">
			<Text className="text-white text-lg font-bold">Classes</Text>
		</View>

		<View className="bg-white/10 pl-5 pr-3 py-2 rounded-lg mb-2 mt-2">
			{props.classes.map(classItem => (
				<ClassItem 
					id={classItem.id}
					subject={classItem.subject} 
					course={classItem.course} 
					section={classItem.section}
				/>
			))}
		</View>

		<NewClassForm add={props.add}/>

  </View>
}