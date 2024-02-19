import { useUser } from "@clerk/clerk-expo";
import { Text } from "react-native";
 
export default function UseUser() {
  const { isLoaded, isSignedIn, user } = useUser();
 
  if (!isLoaded || !isSignedIn) {
    return null;
  }
 
  return <Text>Hello {user.primaryEmailAddress?.emailAddress}, welcome to Clerk</Text>;
}