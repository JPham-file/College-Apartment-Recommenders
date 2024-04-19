import { Text, View } from '@/src/components/Themed';
import { Image, TouchableOpacity, Pressable, ScrollView, TextInput, FlatList } from 'react-native';
import { useState, Fragment } from 'react';

interface ButtonProps {
	text: string,
	onPress: any,
	classNameStyle?: string,
}

const Button: React.FC<ButtonProps> = ({ text, onPress, classNameStyle = "bg-red-500 hover:bg-red-700 text-white font-bold py-1.5 px-2 rounded" }) => (
	<TouchableOpacity
		onPress={onPress}
		className={classNameStyle}
	>
		<Text>{text}</Text>
	</TouchableOpacity>
)

interface ClassItem {
	subject: string,
	course: string,
	section: string,
}

type ClassItemProps = ClassItem & {
	onPress: (arg0: ClassItem) => void,
};

const ClassItem: React.FC<ClassItemProps> = ({ subject, course, section, onPress }) => (
	<View className="mt-1 mb-1 bg-transparent flex-row justify-between items-center">
		<Text className="text-white">{`${subject} ${course} - ${section}`}</Text>
		<Button
			onPress={onPress}
			text={"Remove"}>
		</Button>
	</View>
);

interface FieldProps {
	setValue: (text: string) => void,
	value: string,
	label: string,
	placeholder: string
}

const Field: React.FC<FieldProps> = ({ setValue, value, label, placeholder }) => (
	<View className="bg-transparent flex-row justify-between my-2 ml-2 mr-2">
		<Text className="text-white">{label}</Text>
		<TextInput
			style={{ color: "gray" }}
			placeholder={placeholder}
			onChangeText={text => setValue(text)}
			value={value}
		/>
	</View>
)

interface NewClassFormProps {
	onPress: any
}

const NewClassForm: React.FC<NewClassFormProps> = ({ onPress }) => {
	const [subject, setSubject] = useState('');
	const [course, setCourse] = useState('');
	const [section, setSection] = useState('');

	return (
		<View className="bg-white/10 rounded-lg p-3 shadow-md">
			<Field
				value={subject}
				setValue={setSubject}
				label={'Subject'}
				placeholder={'Enter subject...'}
			/>

			<Field
				value={course}
				setValue={setCourse}
				label={'Course'}
				placeholder={'Enter course...'}
			/>

			<Field
				value={section}
				setValue={setSection}
				label={'Section'}
				placeholder={'Enter section...'}
			/>

			<Button // handle adding class to classes list
				onPress={() => {
					onPress({
						subject: subject,
						course: course,
						section: section,
					})
				}}
				text={"Add"}
				classNameStyle="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-3 rounded mt-3">
			</Button>
		</View>
	);
}

interface ClassListProps {
	initialClasses: ClassItem[],
	onClassesUpdated: any,
};

export function ClassList({ initialClasses, onClassesUpdated }: ClassListProps) {
	const [currentClasses, setCurrentClasses] = useState(initialClasses)

	return <View>
		<View className="flex-row justify-between items-center">
			<Text className="text-white text-lg font-bold">Classes</Text>
			<View className="flex-row">
				{initialClasses != currentClasses && (
					<Fragment>
						<Button
							text={"Save"}
							onPress={() => {
								onClassesUpdated(currentClasses)
							}}
						/>
						<Button
							text={"Cancel"}
							onPress={() => {
								setCurrentClasses(initialClasses)
							}}
							classNameStyle="bg-red-500 hover:bg-red-700 text-white font-bold py-1.5 px-2 ml-1 rounded"
						/>
					</Fragment>
				)}
			</View>
		</View>

		<View className="bg-white/10 pl-5 pr-3 py-2 rounded-lg mb-2 mt-2">
			{currentClasses.length > 0
				&& currentClasses.map(classItem => (
					<ClassItem
						key={`${classItem.subject} ${classItem.course}`}
						subject={classItem.subject}
						course={classItem.course}
						section={classItem.section}
						onPress={() => {
							setCurrentClasses(current =>
								current.filter(item =>
									item.subject !== classItem.subject || item.course !== classItem.course
								)
							);
						}}
					/>
				))
				|| (
					<View className="mt-1 mb-1 bg-transparent flex-row justify-between items-center">
						<Text className="text-white">{"No classes"}</Text>
					</View>
				)}
		</View>

		<NewClassForm
			onPress={(newClassItem: any) => {
				setCurrentClasses(data => {
					if (data.some(item => `${item.subject} ${item.course}` == `${newClassItem.subject} ${newClassItem.course}`)) {
						return data;
					}

					return [...data, newClassItem];
				});
			}}
		/>
	</View>
}